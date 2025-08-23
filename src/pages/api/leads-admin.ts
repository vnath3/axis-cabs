import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = (import.meta.env.SUPABASE_URL ||
  import.meta.env.PUBLIC_SUPABASE_URL) as string;
const SERVICE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;
const ADMIN_TOKEN = import.meta.env.ADMIN_TOKEN as string;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

export const prerender = false;

function unauthorized() {
  return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

export const GET: APIRoute = async ({ request }) => {
  const token = request.headers.get("x-admin-token");
  if (!token || token !== ADMIN_TOKEN) return unauthorized();

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "new";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("limit") || "50", 10);
  const offset = (page - 1) * pageSize;

  let { data, error, count } = await supabase
    .from("leads")
    .select(
      "id,created_at,name,whatsapp,from_city,to_city,date,time,status,notes",
      { count: "exact" },
    )
    .eq("status", status)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      items: data || [],
      total: count || 0,
      page,
      pageSize,
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
};

export const POST: APIRoute = async ({ request }) => {
  const token = request.headers.get("x-admin-token");
  if (!token || token !== ADMIN_TOKEN) return unauthorized();

  try {
    const { id, status } = await request.json();
    if (!id || typeof status !== "string") {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid id or status" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }
    if (!["new", "contacted", "closed"].includes(status)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid status" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || "Server error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
};
