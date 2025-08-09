import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// UPPERCASE in Astro v5:
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Basic sanity (avoid empty spam)
    const required = ['from_city','to_city','date','time','pax','name','whatsapp'];
    for (const k of required) {
      if (!body?.[k]) {
        return new Response(JSON.stringify({ ok:false, error:`Missing ${k}` }), { status: 400 });
      }
    }

    // Simple spam guard
    if (typeof body.notes === 'string' && /https?:\/\//i.test(body.notes)) {
      return new Response(JSON.stringify({ ok: true, lead: body }), { status: 200 });
    }

    const { error } = await supabase.from('leads').insert({
      source: 'web',
      from_city: body.from_city,
      to_city: body.to_city,
      date: body.date,
      time: body.time,
      pax: String(body.pax),
      bags: String(body.bags ?? '0'),
      name: body.name,
      whatsapp: body.whatsapp,
      notes: body.notes ?? '',
      utm_source: body.utm_source ?? '',
      utm_campaign: body.utm_campaign ?? ''
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, lead: body }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message || 'Server error' }), { status: 500 });
  }
};
