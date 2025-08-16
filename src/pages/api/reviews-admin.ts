import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL) as string;

const SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;
const ADMIN_TOKEN = import.meta.env.ADMIN_TOKEN as string;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

export const prerender = false;

function unauthorized() {
  return new Response(JSON.stringify({ ok:false, error:'Unauthorized' }), {
    status: 401, headers: { 'content-type': 'application/json' }
  });
}

export const GET: APIRoute = async ({ request }) => {
  const token = request.headers.get('x-admin-token');
  if (!token || token !== ADMIN_TOKEN) return unauthorized();

  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'pending';

  // Try selecting with comment first
  let { data, error } = await supabase
    .from('reviews')
    .select('id,created_at,rating,comment,review_text,name,city,thumb_up,status')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return new Response(JSON.stringify({ ok:false, error: error.message }), {
      status: 500, headers: { 'content-type': 'application/json' }
    });
  }

  // Normalize text to a single "comment" field for the UI
  const items = (data || []).map((r: any) => ({
    ...r,
    comment: r.comment ?? r.review_text ?? null
  }));

  return new Response(JSON.stringify({ ok:true, items }), {
    status: 200, headers: { 'content-type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get('x-admin-token');
  if (!token || token !== ADMIN_TOKEN) return unauthorized();

  try {
    const { action, id } = await request.json();
    if (!id || !['approve','reject','delete'].includes(action))
      return new Response(JSON.stringify({ ok:false, error:'Invalid action or id' }), {
        status: 400, headers: { 'content-type': 'application/json' }
      });

    if (action === 'delete') {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
    } else {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      const { error } = await supabase.from('reviews').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok:true }), {
      status: 200, headers: { 'content-type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok:false, error: err?.message || 'Server error' }), {
      status: 500, headers: { 'content-type': 'application/json' }
    });
  }
};
