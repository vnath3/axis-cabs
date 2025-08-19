/**
* Shared HTTP helpers for Astro API routes.
*/

export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

/**
 * Get client IP from headers (works on Netlify, Vercel, Node).
 * Fallback to empty string if unavailable.
 */
export function getClientIP(req: Request): string {
  const h = new Headers(req.headers);
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xReal = h.get("x-real-ip");
  if (xReal) return xReal.trim();
  const nf = h.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  return "";
}

/** Standard error shapes */
export const badReq   = (msg = "bad-request")     => json({ ok: false, error: msg }, { status: 400 });
export const notFound = (msg = "not-found")       => json({ ok: false, error: msg }, { status: 404 });
export const tooMany  = (sec = 60)                =>
  json({ ok: false, error: "rate-limited", retry_after: sec }, { status: 429, headers: { "Retry-After": String(sec) } });
export const ok       = (payload: any)            => json({ ok: true, ...payload }, { status: 200 });
