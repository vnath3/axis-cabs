/* src/pages/api/fare-quote.ts
* Returns a fare estimate for a route and vehicle.
* Query: ?from=&to=&vehicle=sedan|suv|luxury|traveller&roundtrip=0|1
* Response: { ok:true, meta, distance:{km,highway_note}, fare:{low,high,breakdown:{...}} }
*/
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });

/* ---- tiny in-file cache & rate-limit (per instance) ---- */
type Stamp = number;
const cache = new Map<string, { v: any; exp: number }>();
const hits: Map<string, Stamp[]> = new Map();

function getIP(req: Request) {
  const h = req.headers;
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || h.get('x-nf-client-connection-ip') || '';
}
function rlTry(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now(), start = now - windowMs;
  let q = hits.get(key) || [];
  while (q.length && q[0] < start) q.shift();
  const ok = q.length < limit;
  if (ok) { q.push(now); hits.set(key, q); }
  return { ok, retryAfter: ok ? 0 : Math.ceil(((q[0] ?? now) + windowMs - now) / 1000) };
}

function norm(s: string) { return (s || '').trim().toLowerCase(); }
function title(s: string) { return s.replace(/\b\w/g, (m) => m.toUpperCase()); }

export const GET: APIRoute = async ({ request, url }) => {
  const ip = getIP(request) || 'anon';
  const rl = rlTry(`fare:${ip}`, 20, 60_000);
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'rate-limited', retry_after: rl.retryAfter }), {
      status: 429,
      headers: { 'content-type': 'application/json', 'Retry-After': String(rl.retryAfter) },
    });
  }

  const from = norm(url.searchParams.get('from') || '');
  const to = norm(url.searchParams.get('to') || '');
  const vehicle = norm(url.searchParams.get('vehicle') || 'sedan');
  const roundtrip = (url.searchParams.get('roundtrip') || '0') === '1';

  if (!from || !to) {
    return new Response(JSON.stringify({ ok: false, error: 'missing-from-or-to' }), {
      status: 400, headers: { 'content-type': 'application/json' },
    });
  }

  const ckey = `fare:${from}|${to}|${vehicle}|${roundtrip ? 1 : 0}`;
  const hit = cache.get(ckey);
  if (hit && Date.now() < hit.exp) {
    return new Response(JSON.stringify({ ok: true, ...hit.v }), {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=30' },
    });
  }

  // 1) Load route distance from distance_matrix (try A->B then B->A)
  const { data: r1, error: e1 } = await supabase
    .from('distance_matrix')
    .select('from_city,to_city,km,toll_low,toll_high,highway_note')
    .eq('from_city', from)
    .eq('to_city', to)
    .limit(1);

  let route = r1?.[0];
  if (!route) {
    const { data: r2 } = await supabase
      .from('distance_matrix')
      .select('from_city,to_city,km,toll_low,toll_high,highway_note')
      .eq('from_city', to)
      .eq('to_city', from)
      .limit(1);
    route = r2?.[0];
  }

  if (!route) {
    return new Response(JSON.stringify({ ok: false, error: 'route-not-found' }), {
      status: 404, headers: { 'content-type': 'application/json' },
    });
  }

  const kmOneWay = Number(route.km || 0);
  const kmBillable = Math.max(kmOneWay * (roundtrip ? 2 : 1), 0);

  // 2) Load fare rule for vehicle (defaults if missing)
  const { data: fr } = await supabase
    .from('fare_rules')
    .select('vehicle_type,per_km,da_per_day,night_surcharge_pct,min_km')
    .eq('vehicle_type', vehicle)
    .maybeSingle();

  const rule = {
    vehicle_type: vehicle,
    per_km: fr?.per_km ?? 12,
    da_per_day: fr?.da_per_day ?? 300,
    night_surcharge_pct: fr?.night_surcharge_pct ?? 0,
    min_km: fr?.min_km ?? 150,
  };

  const kmBillableWithMin = Math.max(kmBillable, rule.min_km);

  const base = Math.round(kmBillableWithMin * rule.per_km);
  // DA heuristic: 1 day per ~300km
  const daDays = Math.max(1, Math.ceil(kmBillableWithMin / 300));
  const da = Math.round(daDays * rule.da_per_day);
  const night_fee = Math.round(base * (rule.night_surcharge_pct / 100));

  const toll_low = Math.max(0, Number(route.toll_low ?? 0));
  const toll_high = Math.max(toll_low, Number(route.toll_high ?? toll_low));

  const low = base + da + night_fee + toll_low;
  const high = base + da + night_fee + toll_high;

  const payload = {
    meta: {
      from: title(from),
      to: title(to),
      vehicle,
      roundtrip,
    },
    distance: {
      km: kmOneWay,
      highway_note: route.highway_note || null,
    },
    fare: {
      low,
      high,
      breakdown: {
        base,
        per_km: rule.per_km,
        km_billable: kmBillableWithMin,
        da,
        night_fee,
        toll_low,
        toll_high,
      },
    },
  };

  cache.set(ckey, { v: payload, exp: Date.now() + 10 * 60_000 }); // 10 min
  return new Response(JSON.stringify({ ok: true, ...payload }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=30' },
  });
};
