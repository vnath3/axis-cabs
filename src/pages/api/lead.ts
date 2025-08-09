import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { LeadSchema } from '@/lib/validators';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid input' }), { status: 400 });
    }
    const lead = parsed.data;
    // Honeypot example: if notes contains suspicious URL spam
    if (/https?:\/\//i.test(lead.notes || '')) {
      return new Response(JSON.stringify({ ok: true, lead }), { status: 200 });
    }

    const { error } = await supabase.from('leads').insert({
      source: 'web',
      from_city: lead.from_city,
      to_city: lead.to_city,
      date: lead.date,
      time: lead.time,
      pax: lead.pax,
      bags: lead.bags,
      name: lead.name,
      whatsapp: lead.whatsapp,
      notes: lead.notes,
      utm_source: lead.utm_source,
      utm_campaign: lead.utm_campaign
    });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, lead }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message || 'Server error' }), { status: 500 });
  }
};