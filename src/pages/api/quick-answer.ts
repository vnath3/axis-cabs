/* src/pages/api/quick-answer.ts
* Lightweight Q&A bot answering fares, packages, airport, hidden gems.
* Request: POST { query: string }
* Response: { ok: true, type, text, data? }
*/
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { rateLimitTry } from '../../lib/rateLimit';
import { gems } from '../../data/gems';
import { packages } from '../../data/packages';

const SUPABASE_URL = (process.env.SUPABASE_URL ||
  process.env.PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.PUBLIC_SUPABASE_URL) as string;
const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY) as string;

const supabase = (SUPABASE_URL && SERVICE_KEY)
  ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
  : null as any;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function getIP(req: Request) {
  const h = req.headers;
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || h.get('x-nf-client-connection-ip') || '';
}

function norm(s: string) { return (s || '').trim().toLowerCase(); }
function titleCase(s: string) { return (s || '').replace(/\b\w/g, m => m.toUpperCase()); }

const ABUSE = [
  'get lost','shut up','idiot','stupid','nonsense','fool','fuck','shit','bitch','moron'
];

function looksAbusive(q: string) {
  const s = norm(q);
  return ABUSE.some(w => s.includes(w));
}

function extractRouteTokens(q: string): string[] | null {
  const s = norm(q).replace(/[^a-z\s\-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  // common separators
  const sepMatch = s.match(/([a-z]+)\s*(?:to|\-|\u2192|\u2014|>)\s*([a-z]+)/i);
  if (sepMatch) return [sepMatch[1], sepMatch[2]].map(norm);
  const words = s.split(' ').filter(Boolean);
  if (words.length >= 2) return [words[0], words[1]].map(norm);
  return null;
}

function intentOf(q: string): 'fare'|'packages'|'airport'|'gems'|'unknown' {
  const s = norm(q);
  if (/(fare|price|cost|estimate|how much)/i.test(s)) return 'fare';
  if (/(package|tour|itinerary|trip plan)/i.test(s)) return 'packages';
  if (/(airport|pickup|drop|terminal|flight)/i.test(s)) return 'airport';
  if (/(hidden gem|offbeat|secret|lesser known)/i.test(s)) return 'gems';
  // fallback: if it looks like a route, bias to fare
  if (extractRouteTokens(s)) return 'fare';
  return 'unknown';
}

async function fareAnswer(q: string) {
  const tokens = extractRouteTokens(q);
  if (!tokens) {
    return { ok: true, type: 'fare', text: 'Tell me the cities like "pune to mumbai" and I will estimate the fare for Sedan/SUV/Tempo.' };
  }
  const [a, b] = tokens;

  if (!supabase) {
    return { ok: true, type: 'fare', text: 'Fare lookup is unavailable right now. Please try again later or use the Fare Calculator card.' };
  }

  const [ab, ba] = await Promise.all([
    supabase.from('distance_matrix').select('from_city,to_city,km,toll_low,toll_high,highway_note').ilike('from_city', a).ilike('to_city', b).limit(1),
    supabase.from('distance_matrix').select('from_city,to_city,km,toll_low,toll_high,highway_note').ilike('from_city', b).ilike('to_city', a).limit(1),
  ]);
  const route = [...(ab.data ?? []), ...(ba.data ?? [])][0];
  if (!route) {
    return { ok: true, type: 'fare', text: `I couldn't find a route for ${titleCase(a)} <-> ${titleCase(b)}. Try nearby major cities or use the Fare Calculator.` };
  }

  // get 3 vehicle rules quickly
  const vehs = ['sedan','suv','traveller'];
  const ruleResults = await Promise.all(
    vehs.map(v => supabase.from('fare_rules').select('vehicle_type,per_km,da_per_day,night_surcharge_pct,min_km').eq('vehicle_type', v).maybeSingle())
  );
  const rules = vehs.map((v, i) => ({
    vehicle_type: v,
    per_km: ruleResults[i].data?.per_km ?? (v==='sedan'?12:v==='suv'?16:20),
    da_per_day: ruleResults[i].data?.da_per_day ?? 300,
    night_surcharge_pct: ruleResults[i].data?.night_surcharge_pct ?? 0,
    min_km: ruleResults[i].data?.min_km ?? 150,
  }));

  const km = Number(route.km || 0);
  const tollLow = Math.max(0, Number(route.toll_low ?? 0));
  const tollHigh = Math.max(tollLow, Number(route.toll_high ?? tollLow));

  const quotes = rules.map(r => {
    const billKm = Math.max(km, r.min_km);
    const base = Math.round(billKm * r.per_km);
    const da = Math.round(Math.max(1, Math.ceil(billKm / 300)) * r.da_per_day);
    const night = Math.round(base * (r.night_surcharge_pct / 100));
    return { vehicle: r.vehicle_type, low: base + da + night + tollLow, high: base + da + night + tollHigh };
  });

  const lines = [
    `${titleCase(a)} -> ${titleCase(b)} • ~${km} km`,
    ...quotes.map(q => `${q.vehicle.toUpperCase()}: ₹${q.low.toLocaleString('en-IN')} - ₹${q.high.toLocaleString('en-IN')}`)
  ];

  return { ok: true, type: 'fare', text: lines.join('\n'), data: { route: { from: a, to: b, km }, quotes } };
}

function packagesAnswer(q: string) {
  const s = norm(q);
  // crude filter by city/region keywords
  const cityHint = (s.match(/[a-z]+/g) || []).slice(0, 2);
  const picks = packages.filter(p => {
    const blob = `${p.title} ${p.region} ${p.subtitle} ${p.summary}`.toLowerCase();
    return cityHint.every(w => blob.includes(w));
  }).slice(0, 3);

  if (!picks.length) {
    const top = packages.slice(0, 3);
    return {
      ok: true,
      type: 'packages',
      text: 'Here are some popular packages you can explore:',
      data: top.map(p => ({ slug: p.slug, title: p.title, summary: p.summary }))
    };
  }
  return {
    ok: true,
    type: 'packages',
    text: 'These seem relevant. Want details or pricing?',
    data: picks.map(p => ({ slug: p.slug, title: p.title, summary: p.summary }))
  };
}

function gemsAnswer(q: string) {
  const s = norm(q);
  const hint = (s.match(/[a-z]+/g) || []).slice(0, 2);
  const picks = gems.filter(g => {
    const blob = `${g.title} ${g.region} ${g.summary}`.toLowerCase();
    return hint.every(w => blob.includes(w));
  }).slice(0, 3);
  const list = (picks.length ? picks : gems.slice(0, 3)).map(g => ({ slug: g.slug, title: g.title, region: g.region, summary: g.summary }));
  return { ok: true, type: 'gems', text: 'A few offbeat spots you might like:', data: list };
}

function airportAnswer(q: string) {
  // For MVP: generic guidance
  return {
    ok: true,
    type: 'airport',
    text: 'We do airport pickups and drops. Share "from -> to", flight time, and passengers to get a quote. Example: "Pune airport to Viman Nagar 2 pax at 7pm".'
  };
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getIP(request) || 'anon';
  const { ok, retryAfterSec } = rateLimitTry(`qabot:${ip}`, 40, 60_000);
  if (!ok) return json(429, { ok: false, error: 'rate-limited', retry_after: retryAfterSec });

  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return json(400, { ok: false, error: 'Use application/json' });
  }
  let body: any = null;
  try { body = await request.json(); } catch {}
  const q = String(body?.query || '').trim();
  if (!q) return json(400, { ok: false, error: 'missing-query' });

  if (looksAbusive(q)) {
    return json(200, { ok: true, type: 'fallback', text: 'Happy to help with fares, packages and trip planning. Try "pune to mumbai fare" or "hidden gems near Aurangabad".' });
  }

  const intent = intentOf(q);
  try {
    if (intent === 'fare') return json(200, await fareAnswer(q));
    if (intent === 'packages') return json(200, packagesAnswer(q));
    if (intent === 'gems') return json(200, gemsAnswer(q));
    if (intent === 'airport') return json(200, airportAnswer(q));
  } catch (e: any) {
    console.error('quick-answer error', e);
    return json(200, { ok: true, type: 'fallback', text: 'I had trouble looking that up. You can try the Fare Calculator or ask about packages/gems.' });
  }

  return json(200, { ok: true, type: 'help', text: 'Try:\n• "pune to mumbai fare"\n• "ajanta ellora package"\n• "airport transfer pune"\n• "hidden gems near ellora"' });
};
