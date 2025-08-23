import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

const SUPABASE_URL =
  import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

function sb() {
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      24,
      Math.max(1, parseInt(url.searchParams.get("pageSize") || "6", 10)),
    );
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const client = sb();
    if (!client)
      return json(
        { ok: false, error: "Server not configured (Supabase)" },
        500,
      );

    // Try with "comment" column first
    let selectCols = "id, created_at, rating, comment, name, city";
    let query = client
      .from("reviews")
      .select(selectCols, { count: "exact" })
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range(from, to);

    let { data: items, error, count } = await query;

    // If "comment" doesn't exist, alias review_text as comment
    if (error && /column "comment"|does not exist/i.test(error.message)) {
      selectCols = "id, created_at, rating, comment:review_text, name, city";
      const retry = await client
        .from("reviews")
        .select(selectCols, { count: "exact" })
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .range(from, to);
      items = retry.data || [];
      error = retry.error || null;
      count = retry.count;
    }

    if (error) return json({ ok: false, error: error.message }, 500);

    // Aggregate average rating and row count in a single query
    const {
      data: aggregate,
      error: aggErr,
      count: total,
    } = await client
      .from("reviews")
      .select("avg(rating)", { count: "exact" })
      .eq("status", "approved")
      .maybeSingle();

    if (aggErr) return json({ ok: false, error: aggErr.message }, 500);

    const totalCount = total || 0;
    const average =
      totalCount && aggregate?.avg != null
        ? Number(Number(aggregate.avg).toFixed(2))
        : 0;


    const hasMore =
      count != null
        ? to + 1 < (count as number)
        : (items?.length || 0) === pageSize;

    return json({
      ok: true,
      items: items || [],
      hasMore,
      aggregate: { count: totalCount, average },
    });
  } catch (err: any) {
    return json({ ok: false, error: err?.message || "Server error" }, 500);
  }
};
