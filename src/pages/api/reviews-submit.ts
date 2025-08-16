import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false; // POST requires server runtime

/** -------- helpers -------- */
async function readJsonSafe(req: Request) {
  const text = await req.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
function tinyProfanityCheck(s: string): boolean {
  if (!s) return false;
  const bad = ['shit','fuck','bitch','bastard','asshole','dick','cunt','bollocks'];
  const hay = s.toLowerCase();
  return bad.some(w => hay.includes(w));
}
function getIpFromHeaders(request: Request) {
  const xfwd = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const xreal = request.headers.get('x-real-ip')?.trim();
  return xfwd || xreal || '';
}

/** -------- Supabase -------- */
const SUPABASE_URL = import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
function sb() {
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

/** -------- API -------- */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await readJsonSafe(request);
    if (!body) return json({ ok: false, error: 'Invalid JSON body' }, 400);

    const rating = Number(body.rating);
    const commentText = (body.comment || '').trim();
    const name = (body.name || '').trim();
    const city = (body.city || '').trim();
    const consent = !!body.consent;
    const thumbUp = !!body.thumbUp;
    const source = (body.source || 'web').slice(0, 32);

    if (!Number.isFinite(rating) || rating < 1 || rating > 5)
      return json({ ok: false, error: 'Rating must be between 1 and 5' }, 400);
    if (!commentText || commentText.length < 20)
      return json({ ok: false, error: 'Comment must be at least 20 characters' }, 400);
    if (!consent)
      return json({ ok: false, error: 'Consent is required to publish' }, 400);

    const flagged = tinyProfanityCheck(commentText);
    const client = sb();
    if (!client) return json({ ok: false, error: 'Server not configured (Supabase)' }, 500);

    const ip = getIpFromHeaders(request);
    const ua = request.headers.get('user-agent') || '';

    const base: Record<string, any> = {
      rating,
      name: name || null,
      city: city || null,
      consent,
      thumb_up: thumbUp,
      source,
      status: 'pending',
      flagged,
      ip,
      ua,
    };

    // Attempt 1: insert using "comment"
    let { data, error } = await client
      .from('reviews')
      .insert({ ...base, comment: commentText })
      .select('id')
      .single();

    if (error) {
      const msg = (error.message || '').toLowerCase();

      // Case: table requires review_text (NOT NULL error) or references review_text
      if (msg.includes('null value in column "review_text"') || (msg.includes('review_text') && msg.includes('not-null'))) {
        // Attempt 2a: insert both fields (handles schema where both exist and both are NOT NULL)
        const both = await client
          .from('reviews')
          .insert({ ...base, comment: commentText, review_text: commentText })
          .select('id')
          .single();

        if (!both.error) {
          return json({ ok: true, id: both.data?.id, status: 'pending', flagged });
        }

        // If "both" failed because one column doesn't exist, fall back accordingly
        const m2 = (both.error.message || '').toLowerCase();
        if (m2.includes('column "review_text"') && m2.includes('does not exist')) {
          const onlyComment = await client
            .from('reviews')
            .insert({ ...base, comment: commentText })
            .select('id')
            .single();
          if (!onlyComment.error) return json({ ok: true, id: onlyComment.data?.id, status: 'pending', flagged });
          return json({ ok: false, error: onlyComment.error.message }, 500);
        }
        if (m2.includes('column "comment"') && m2.includes('does not exist')) {
          const onlyReviewText = await client
            .from('reviews')
            .insert({ ...base, review_text: commentText })
            .select('id')
            .single();
          if (!onlyReviewText.error) return json({ ok: true, id: onlyReviewText.data?.id, status: 'pending', flagged });
          return json({ ok: false, error: onlyReviewText.error.message }, 500);
        }

        // Unknown error from "both"
        return json({ ok: false, error: both.error.message }, 500);
      }

      // Case: "comment" column doesn't exist in this schema
      if (msg.includes('column "comment"') && msg.includes('does not exist')) {
        const retry = await client
          .from('reviews')
          .insert({ ...base, review_text: commentText })
          .select('id')
          .single();
        if (!retry.error) return json({ ok: true, id: retry.data?.id, status: 'pending', flagged });

        // If retry failed because comment is also required (NOT NULL), try both
        const mr = (retry.error.message || '').toLowerCase();
        if (mr.includes('null value in column "comment"')) {
          const both2 = await client
            .from('reviews')
            .insert({ ...base, comment: commentText, review_text: commentText })
            .select('id')
            .single();
          if (!both2.error) return json({ ok: true, id: both2.data?.id, status: 'pending', flagged });
          return json({ ok: false, error: both2.error.message }, 500);
        }
        return json({ ok: false, error: retry.error.message }, 500);
      }

      // Case: DB says "null value in column 'comment'" (likely both columns exist & are NOT NULL, and an earlier attempt omitted it)
      if (msg.includes('null value in column "comment"')) {
        const both = await client
          .from('reviews')
          .insert({ ...base, comment: commentText, review_text: commentText })
          .select('id')
          .single();
        if (!both.error) return json({ ok: true, id: both.data?.id, status: 'pending', flagged });
        return json({ ok: false, error: both.error.message }, 500);
      }

      // Unknown insert error
      return json({ ok: false, error: error.message }, 500);
    }

    // Success on first try
    return json({ ok: true, id: data?.id, status: 'pending', flagged });
  } catch (err: any) {
    return json({ ok: false, error: err?.message || 'Server error' }, 500);
  }
};
