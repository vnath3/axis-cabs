/* src/pages/api/cities.ts
* Returns a unique list of city names for typeahead, from distance_matrix.
* Query: ?q=pu (min 1 char, case-insensitive)
* Response: { ok: true, items: [{city:"pune"}, ...] }
*/
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = import.meta.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } });

/* ---- tiny in-file cache & rate-limit (per instance) ---- */
type Stamp = number;
const cache = new Map<string, { v: { city: string }[]; exp: number }>();
const hits: Map<string, Stamp[]> = new Map();

function getIP(req: Request) {
  const h = req.headers;
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || h.get('x-nf-client-connection-ip') || '';
}
function rlTry(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now(), start = now - windowMs;
  let q = hits.get(key) || [];
  while (q.length && q[0] < start) q.shift();
  const ok = q.length < limit;
  if (ok) { q.push(now); hits.set(key, q); }
  return { ok, retryAfter: ok ? 0 : Math.ceil(((q[0] ?? now) + windowMs - now) / 1000) };
}

export const GET: APIRoute = async ({ request, url }) => {
  const q = (url.searchParams.get('q') || '').trim();
  if (q.length < 1) {
    return new Response(JSON.stringify({ ok: true, items: [] }), {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=5' },
    });
  }

  // Rate limit per IP
  const ip = getIP(request) || 'anon';
  const rl = rlTry(`cities:${ip}`, 60, 60_000);
  if (!rl.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'rate-limited', retry_after: rl.retryAfter }), {
      status: 429,
      headers: { 'content-type': 'application/json', 'Retry-After': String(rl.retryAfter) },
    });
  }

  const key = `cities:${q.toLowerCase()}`;
  const hit = cache.get(key);
  if (hit && Date.now() < hit.exp) {
    return new Response(JSON.stringify({ ok: true, items: hit.v }), {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=30' },
    });
  }

  const like = `%${q}%`;
  const [fromRes, toRes] = await Promise.all([
    supabase.from('distance_matrix').select('from_city').ilike('from_city', like).limit(50),
    supabase.from('distance_matrix').select('to_city').ilike('to_city', like).limit(50),
  ]);

  if (fromRes.error || toRes.error) {
    return new Response(JSON.stringify({ ok: false, error: 'db-error' }), { status: 500 });
  }

  const set = new Set<string>();
  (fromRes.data || []).forEach((r: any) => r?.from_city && set.add(String(r.from_city).toLowerCase()));
  (toRes.data || []).forEach((r: any) => r?.to_city && set.add(String(r.to_city).toLowerCase()));

  const items = Array.from(set).sort().slice(0, 20).map((city) => ({ city }));

  cache.set(key, { v: items, exp: Date.now() + 5 * 60_000 }); // 5 min
  return new Response(JSON.stringify({ ok: true, items }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=30' },
  });
};
