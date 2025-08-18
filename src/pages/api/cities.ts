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

export const GET: APIRoute = async ({ url }) => {
const q = (url.searchParams.get('q') || '').trim();
if (q.length < 1) {
    return new Response(JSON.stringify({ ok: true, items: [] }), { headers: { 'content-type': 'application/json' } });
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
  return new Response(JSON.stringify({ ok: true, items }), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=30' },
  });
};
