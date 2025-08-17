import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const SUPABASE_URL =
(process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL) as string;
const SERVICE_KEY =
(process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY) as string;

const N8N_WEBHOOK =
(process.env.N8N_LEADS_WEBHOOK_URL || import.meta.env.N8N_LEADS_WEBHOOK_URL || '') as string;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// ---- webhook helper (now parses JSON "ok" if present) ----
async function callWebhook(url: string, payload: Record<string, any>) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Source': 'axiscabs' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    let body: any = null;
    try { body = await res.json(); } catch { /* ignore */ }
    const okJson = body && typeof body === 'object' && body.ok === true;
    return { status: res.status, ok: res.ok && (body ? okJson : true), body };
  } catch (err: any) {
    return { status: 0, ok: false, body: { error: String(err?.message || err) } };
  } finally {
    clearTimeout(timer);
  }
}

// --- NEW: quick server-side ping ---
// GET /api/leads-submit?ping=1  → will POST a tiny payload to your webhook
export const GET: APIRoute = async ({ url }) => {
  if (url.searchParams.get('debug') === '1') {
    const host = N8N_WEBHOOK ? new URL(N8N_WEBHOOK).host : null;
    return json(200, { ok: true, hasWebhook: Boolean(N8N_WEBHOOK), webhookHost: host });
  }
  if (url.searchParams.get('ping') === '1') {
    if (!N8N_WEBHOOK) return json(400, { ok: false, error: 'No webhook configured' });
    const probe = await callWebhook(N8N_WEBHOOK, { ping: true, ts: new Date().toISOString() });
    return json(200, { ok: probe.ok, status: probe.status, body: probe.body || null });
  }
  return json(200, { ok: true, msg: 'Use POST to submit leads.' });
};

// … keep your existing POST handler exactly as you have it, but
//   replace the webhook call with:
//     if (N8N_WEBHOOK) { await callWebhook(N8N_WEBHOOK, { id: ins.data.id, ...payload }); }
