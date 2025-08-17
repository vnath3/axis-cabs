import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

// Prefer runtime env on Netlify
const SUPABASE_URL =
(process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL) as string;
const SERVICE_KEY =
(process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY) as string;

// Generic downstream webhook (Apps Script today, n8n later)
const N8N_WEBHOOK =
(process.env.N8N_LEADS_WEBHOOK_URL || import.meta.env.N8N_LEADS_WEBHOOK_URL || '') as string;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// Simple debug endpoint: /api/leads-submit?debug=1
export const GET: APIRoute = async ({ url }) => {
  if (url.searchParams.get('debug') === '1') {
    const host = N8N_WEBHOOK ? new URL(N8N_WEBHOOK).host : null;
    return json(200, {
      ok: true,
      hasWebhook: Boolean(N8N_WEBHOOK),
      webhookHost: host,
      // redact the path for safety
    });
  }
  return json(200, { ok: true, msg: 'Use POST to submit leads.' });
};

// ---- helpers ----
const REQUIRED_KEYS = new Set(['name', 'whatsapp']);
const digits = (s: any) => String(s ?? '').replace(/\D/g, '');
const emptyToNull = (v: any) => (v === '' ? null : v);

async function postWebhook(url: string, payload: Record<string, any>) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3000); // up to ~3s for Apps Script
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return json(500, {
        ok: false,
        error: 'Server misconfig: set SUPABASE_URL (or PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY',
      });
    }
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    if (!(request.headers.get('content-type') || '').includes('application/json')) {
      return json(400, { ok: false, error: 'Use application/json' });
    }
    const body = (await request.json()) as Record<string, any>;

    // Honeypot (company)
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      return json(200, { ok: true, queued: true });
    }

    const name = String(body.name || '').trim();
    const phoneDigits = digits(body.phone || body.whatsapp || '');
    if (!name || phoneDigits.length < 8) {
      return json(400, { ok: false, error: 'Name and valid phone required' });
    }

    const base: Record<string, any> = {
      source: 'web',
      status: 'new',
      ua: (request.headers.get('user-agent') || '').slice(0, 255),
      name,
      phone: phoneDigits,
      whatsapp: digits(body.whatsapp || phoneDigits),
      from_city: emptyToNull(String(body.from_city || body.from || '').trim()),
      to_city: emptyToNull(String(body.to_city || body.to || '').trim()),
      date: emptyToNull(String(body.date || '').trim()),
      time: emptyToNull(String(body.time || '').trim()),
      pax: emptyToNull(digits(body.pax || '')),
      bags: emptyToNull(digits(body.bags || '')),
      notes: emptyToNull(String(body.notes ?? '').trim()),
      page_path: emptyToNull(String(body.page_path || body.page || '').trim()),
      referrer: emptyToNull(String(body.referrer || '').trim()),
      utm_source: String(body.utm_source || ''),
      utm_medium: String(body.utm_medium || ''),
      utm_campaign: String(body.utm_campaign || ''),
      utm_term: String(body.utm_term || ''),
      utm_content: String(body.utm_content || ''),
      gclid: String(body.gclid || ''),
    };
    if (base.page_path && !('page' in base)) base.page = base.page_path;

    let payload: Record<string, any> = { ...base };
    let lastError: any = null;

    for (let i = 0; i < 12; i++) {
      const ins = await supabase.from('leads').insert(payload).select('id').single();
      if (!ins.error) {
        // ✅ await the webhook so Netlify doesn't drop it
        if (N8N_WEBHOOK) {
          await postWebhook(N8N_WEBHOOK, { id: ins.data.id, ...payload });
        }
        return json(200, { ok: true, id: ins.data.id });
      }

      lastError = ins.error;
      const msg = String(ins.error?.message || '');
      const m1 = msg.match(/Could not find the '([^']+)' column/i);
      const m2 = msg.match(/column "([^"]+)" of relation "leads" does not exist/i);
      const unknown = (m1 && m1[1]) || (m2 && m2[1]) || null;

      if (unknown && unknown in payload && !REQUIRED_KEYS.has(unknown)) {
        delete payload[unknown];
        continue;
      }

      const lower = msg.toLowerCase();
      if (
        lower.includes('violates') ||
        lower.includes('not-null') ||
        lower.includes('invalid input') ||
        lower.includes('value too long') ||
        lower.includes('type')
      ) {
        break;
      }

      if ('phone' in payload && lower.includes("'phone'")) {
        delete payload.phone;
        continue;
      }

      break;
    }

    return json(500, { ok: false, error: lastError?.message || 'Insert failed' });
  } catch (err: any) {
    console.error('[leads-submit] fatal:', err);
    return json(500, { ok: false, error: err?.message || 'Server error' });
  }
};
