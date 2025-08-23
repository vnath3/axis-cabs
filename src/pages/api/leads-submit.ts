import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

// Prefer runtime env (Netlify), fallback to Vite env (dev)
const SUPABASE_URL = (process.env.SUPABASE_URL ||
  process.env.PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  import.meta.env.PUBLIC_SUPABASE_URL) as string;

const SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY) as string;

const WEBHOOK = (process.env.N8N_LEADS_WEBHOOK_URL ||
  import.meta.env.N8N_LEADS_WEBHOOK_URL ||
  "") as string;

const digits = (s: any) => String(s ?? "").replace(/\D/g, "");
const emptyToNull = (v: any) => (v === "" ? null : v);

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function postWebhook(url: string, payload: Record<string, any>) {
  if (!url) return { ok: true, status: 0 };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 3000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    let b: any = null;
    try {
      b = await res.json();
    } catch {}
    return { ok: res.ok, status: res.status, body: b };
  } catch {
    return { ok: false, status: 0 };
  } finally {
    clearTimeout(t);
  }
}

// Debug/ping helpers
export const GET: APIRoute = async ({ url }) => {
  if (url.searchParams.get("debug") === "1") {
    return json(200, { ok: true, hasWebhook: !!WEBHOOK });
  }
  if (url.searchParams.get("ping") === "1") {
    const res = await postWebhook(WEBHOOK, { ping: true, ts: Date.now() });
    return json(200, { ok: res.ok, status: res.status });
  }
  return json(200, { ok: true, msg: "POST a lead to this endpoint." });
};

export const POST: APIRoute = async ({ request }) => {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return json(500, { ok: false, error: "Server env missing" });
  }
  if (
    !(request.headers.get("content-type") || "").includes("application/json")
  ) {
    return json(400, { ok: false, error: "Use application/json" });
  }

  let body: Record<string, any>;
  try {
    body = (await request.json()) as Record<string, any>;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  // honeypot: "company" (if filled, accept silently)
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return json(200, { ok: true, queued: true });
  }

  const name = String(body.name || "").trim();
  const whatsapp = digits(body.whatsapp || body.phone || "");
  if (!name || whatsapp.length < 8) {
    return json(400, { ok: false, error: "Name and valid phone required" });
  }

  const row: Record<string, any> = {
    source: "web",
    status: "new",
    name,
    whatsapp,
    from_city: emptyToNull(body.from_city || body.from || ""),
    to_city: emptyToNull(body.to_city || body.to || ""),
    date: emptyToNull(body.date || ""),
    time: emptyToNull(body.time || ""),
    vehicle: emptyToNull(body.vehicle || ""),
    pax: emptyToNull(digits(body.pax || "")),
    bags: emptyToNull(digits(body.bags || "")),
    notes: emptyToNull(body.notes || ""),
    page: emptyToNull(body.page_path || body.page || ""),
    referrer: emptyToNull(body.referrer || ""),
    utm_source: body.utm_source || "",
    utm_medium: body.utm_medium || "",
    utm_campaign: body.utm_campaign || "",
    utm_term: body.utm_term || "",
    utm_content: body.utm_content || "",
    gclid: body.gclid || "",
  };

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // insert with pruning loop for unknown columns
  let payload = { ...row };
  for (let i = 0; i < 10; i++) {
    const { data, error } = await supabase
      .from("leads")
      .insert(payload)
      .select("id")
      .single();

    if (!error) {
      await postWebhook(WEBHOOK, { id: data!.id, ...row });
      return json(200, { ok: true, id: data!.id });
    }

    const msg = String(error.message || "");
    const m1 = msg.match(/Could not find the '([^']+)' column/i);
    const m2 = msg.match(
      /column "([^"]+)" of relation "leads" does not exist/i,
    );
    const unknown = (m1 && m1[1]) || (m2 && m2[1]) || null;

    if (
      unknown &&
      unknown in payload &&
      !["name", "whatsapp"].includes(unknown)
    ) {
      delete payload[unknown];
      continue;
    }
    return json(500, { ok: false, error: msg });
  }

  return json(500, { ok: false, error: "Insert failed" });
};
