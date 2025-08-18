/* src/pages/api/fare-quote.ts
* Returns fare estimate using DB-only data (no Google APIs).
* Query params:
*   from, to, vehicle, roundtrip (0/1)
*
* Response:
*   { ok, distance:{km, highway_note, toll_low, toll_high}, fare:{low, high, breakdown}, meta:{...} }
*/

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });

function norm(s: string = '') {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

async function getDistance(from: string, to: string) {
  // 1) try exact direction
  let q = await supabase
    .from('distance_matrix')
    .select('km, toll_low, toll_high, highway_note')
    .eq('from_city', from)
    .eq('to_city', to)
    .maybeSingle();

  if (q.data) return q.data;

  // 2) try reverse direction (treat as symmetric for now)
  q = await supabase
    .from('distance_matrix')
    .select('km, toll_low, toll_high, highway_note')
    .eq('from_city', to)
    .eq('to_city', from)
    .maybeSingle();

  return q.data ?? null;
}

export const GET: APIRoute = async ({ url }) => {
  const from = norm(url.searchParams.get('from') || '');
  const to = norm(url.searchParams.get('to') || '');
  const vehicle = (url.searchParams.get('vehicle') || 'sedan').toLowerCase();
  const roundtrip = (url.searchParams.get('roundtrip') || '0') === '1';

  if (!from || !to) {
    return new Response(JSON.stringify({ ok: false, error: 'from/to required' }), { status: 400 });
  }

  // 1) distance & tolls (direction-agnostic)
  const dist = await getDistance(from, to);
  if (!dist) {
    return new Response(JSON.stringify({ ok: false, error: 'route-not-found' }), { status: 404 });
  }

  // 2) fare rule
  const { data: rule, error: ruleErr } = await supabase
    .from('fare_rules')
    .select('vehicle_type, per_km, da_per_day, night_surcharge_pct, min_km')
    .eq('vehicle_type', vehicle)
    .maybeSingle();

  if (ruleErr || !rule) {
    return new Response(JSON.stringify({ ok: false, error: 'vehicle-rule-not-found' }), { status: 404 });
  }

  // 3) billable km (min slab + roundtrip)
  const kmOneWay = Number(dist.km);
  const kmBillable = Math.max(kmOneWay, Number(rule.min_km || 0));
  const kmFinal = roundtrip ? kmBillable * 2 : kmBillable;

  // 4) base fare
  const base = Math.round(kmFinal * Number(rule.per_km));

  // 5) driver allowance heuristic
  const needsDA = kmFinal > 250;
  const da = needsDA ? Number(rule.da_per_day || 0) : 0;

  // 6) night surcharge
  const nightPct = Number(rule.night_surcharge_pct || 0);
  const nightFee = Math.round((base * nightPct) / 100);

  // 7) tolls band (scale for roundtrip)
  const tollLow = Math.round(Number(dist.toll_low || 0) * (roundtrip ? 2 : 1));
  const tollHigh = Math.round(Number(dist.toll_high || 0) * (roundtrip ? 2 : 1));

  // 8) totals
  const low = base + tollLow + da + nightFee;
  const high = base + tollHigh + da + nightFee;

  const payload = {
    ok: true,
    distance: {
      km: kmOneWay,
      highway_note: dist.highway_note || '',
      toll_low: tollLow,
      toll_high: tollHigh,
    },
    fare: {
      low,
      high,
      breakdown: {
        base,
        per_km: Number(rule.per_km),
        km_billable: kmFinal,
        da,
        night_fee: nightFee,
        toll_low: tollLow,
        toll_high: tollHigh,
      },
    },
    meta: { from, to, vehicle, roundtrip },
  };

  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
};
