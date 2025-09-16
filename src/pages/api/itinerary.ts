/* src/pages/api/itinerary.ts
* Builds a simple multi-stop itinerary + fare estimate (MVP using DB only)
* Request: POST { origin: string, date?: string, stops: string[], pax?: number, vehicle?: 'sedan'|'suv'|'traveller' }
* Response: { ok:true, meta, legs:[{from,to,km,toll_low,toll_high}], totals:{ km, toll_low, toll_high }, fare:{ low, high, breakdown }, plan: Day[] }
*/
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { rateLimitTry } from '../../lib/rateLimit';

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
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function getIP(req: Request) {
  const h = req.headers; const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || h.get('x-nf-client-connection-ip') || '';
}

function norm(s: string) { return (s || '').trim().toLowerCase(); }
function titleCase(s: string) { return (s || '').replace(/\b\w/g, m => m.toUpperCase()); }

async function legLookup(a: string, b: string) {
  if (!supabase) return null;
  const sel = 'from_city,to_city,km,toll_low,toll_high,highway_note';

  async function lookupIn(table: string, x: string, y: string) {
    let q: any = supabase.from(table).select(sel).limit(1);
    if (q.eq) {
      const r = await q.eq('from_city_norm', x).eq('to_city_norm', y);
      if (r.data && r.data.length) return r;
    }
    return await supabase.from(table).select(sel).ilike('from_city', x).ilike('to_city', y).limit(1);
  }

  async function try1(x: string, y: string) {
    // primary table
    const r1 = await lookupIn('distance_matrix', x, y);
    if (r1.data && r1.data.length) return r1;
    // optional symmetric table fallback if present
    try {
      const r2 = await lookupIn('distance_matrix_sym', x, y);
      if (r2.data && r2.data.length) return r2;
    } catch {}
    return { data: [] } as any;
  }

  const [ab, ba] = await Promise.all([try1(a,b), try1(b,a)]);
  const route = [...(ab.data ?? []), ...(ba.data ?? [])][0];
  if (!route) return null;
  const km = Number(route.km || 0);
  const toll_low = Math.max(0, Number(route.toll_low ?? 0));
  const toll_high = Math.max(toll_low, Number(route.toll_high ?? toll_low));
  return { from: a, to: b, km, toll_low, toll_high, highway_note: route.highway_note || null };
}

type Poi = {
  id: string;
  city: string;
  name: string;
  time_hint: string | null;
  why: string | null;
  priority?: number | null;
};

async function fetchPoisForCity(city: string): Promise<Poi[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('pois')
    .select('id,city,name,time_hint,why,priority,is_active')
    .ilike('city', city)
    .eq('is_active', true)
    .order('priority', { ascending: true })
    .limit(12);
  if (error) return [];
  return (data as any[]).map(r => ({
    id: String(r.id),
    city: String(r.city || city),
    name: String(r.name || ''),
    time_hint: r.time_hint ? String(r.time_hint) : null,
    why: r.why ? String(r.why) : null,
    priority: r.priority ?? null,
  }));
}

function pickActivities(pois: Poi[]) {
  const buckets: Record<string, Poi[]> = { morning: [], afternoon: [], evening: [] };
  for (const p of pois) {
    const th = (p.time_hint || '').toLowerCase();
    if (th.includes('morn')) buckets.morning.push(p);
    else if (th.includes('noon') || th.includes('after')) buckets.afternoon.push(p);
    else if (th.includes('eve') || th.includes('sunset') || th.includes('night')) buckets.evening.push(p);
  }
  const used = new Set<string>();
  const grab = (list: Poi[]) => list.find(p => { if (used.has(p.id)) return false; used.add(p.id); return true; });
  const any = (arr: Poi[]) => arr.find(p => { if (used.has(p.id)) return false; used.add(p.id); return true; });
  const ordered = [
    grab(buckets.morning) || any(pois),
    grab(buckets.afternoon) || any(pois),
    grab(buckets.evening) || any(pois),
  ].filter(Boolean) as Poi[];
  return ordered.map((p, i) => ({
    time_hint: i === 0 ? 'Morning' : i === 1 ? 'Afternoon' : 'Evening',
    name: p.name,
    why: p.why || 'Recommended stop.',
  }));
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getIP(request) || 'anon';
  const { ok, retryAfterSec } = rateLimitTry(`itinerary:${ip}`, 30, 60_000);
  if (!ok) return json(429, { ok: false, error: 'rate-limited', retry_after: retryAfterSec });

  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return json(400, { ok: false, error: 'Use application/json' });
  }
  let body: any = null;
  try { body = await request.json(); } catch { return json(400, { ok: false, error: 'Invalid JSON' }); }

  const origin = norm(String(body?.origin || ''));
  const date = String(body?.date || '').trim() || null;
  const stops = Array.isArray(body?.stops) ? body.stops.map((s: any) => norm(String(s || ''))).filter(Boolean) : [];
  const pax = Math.max(1, Number(body?.pax || 1));
  const vehicle = (String(body?.vehicle || 'sedan').toLowerCase()) as 'sedan'|'suv'|'traveller';

  if (!origin || !stops.length) {
    return json(400, { ok: false, error: 'origin-and-stops-required' });
  }
  if (!supabase) return json(503, { ok: false, error: 'db-unavailable' });

  // Build legs: origin -> stop1 -> stop2 ... [-> origin? not in MVP]
  const points = [origin, ...stops];
  const legs = [] as any[];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i], b = points[i+1];
    const leg = await legLookup(a, b);
    if (!leg) return json(404, { ok: false, error: `route-not-found:${a}->${b}` });
    legs.push(leg);
  }

  const totals = legs.reduce((acc, l) => {
    acc.km += l.km; acc.toll_low += l.toll_low; acc.toll_high += l.toll_high; return acc;
  }, { km: 0, toll_low: 0, toll_high: 0 });

  // Fare rules for vehicle
  const { data: fr } = await supabase
    .from('fare_rules')
    .select('vehicle_type,per_km,da_per_day,night_surcharge_pct,min_km')
    .eq('vehicle_type', vehicle)
    .maybeSingle();
  const rule = {
    vehicle_type: vehicle,
    per_km: fr?.per_km ?? (vehicle==='sedan'?12:vehicle==='suv'?16:20),
    da_per_day: fr?.da_per_day ?? 300,
    night_surcharge_pct: fr?.night_surcharge_pct ?? 0,
    min_km: fr?.min_km ?? 250, // slightly higher for multi-stop
  };

  const billKm = Math.max(totals.km, rule.min_km);
  const base = Math.round(billKm * rule.per_km);
  const da = Math.round(Math.max(1, Math.ceil(billKm / 300)) * rule.da_per_day);
  const night_fee = Math.round(base * (rule.night_surcharge_pct / 100));
  const low = base + da + night_fee + totals.toll_low;
  const high = base + da + night_fee + Math.max(totals.toll_low, totals.toll_high);

  // Build plan: per stop, pick POIs (morning/afternoon/evening) from DB, fallback to placeholders
  const plan = [] as any[];
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    const pois = await fetchPoisForCity(stop);
    const activities = pois.length ? pickActivities(pois) : [
      { time_hint: 'Morning', name: 'Local sightseeing', why: 'Cover top 2-3 attractions at an easy pace.' },
      { time_hint: 'Afternoon', name: 'Lunch + commute', why: 'Try a popular local spot; flexible timing.' },
      { time_hint: 'Evening', name: 'Sunset point or market', why: 'Light walking; optional add-on stops.' },
    ];
    plan.push({ day: i + 1, title: `${titleCase(stop)} Day`, activities });
  }

  return json(200, {
    ok: true,
    meta: { origin: titleCase(origin), date, pax, vehicle },
    legs,
    totals,
    fare: { low, high, breakdown: { base, per_km: rule.per_km, km_billable: billKm, da, night_fee, toll_low: totals.toll_low, toll_high: totals.toll_high } },
    plan,
  });
};
