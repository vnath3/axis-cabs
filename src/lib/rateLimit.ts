/**
* Tiny in-memory (per-instance) sliding window rate limiter.
* Use in API routes to throttle abusive traffic.
*
* Example:
*   const { ok, retryAfterSec } = rateLimitTry(`cities:${ip}`, 60, 60_000);
*   if (!ok) return tooMany(retryAfterSec);
*/

type Stamp = number; // ms epoch
const buckets = new Map<string, Stamp[]>();

/**
* Try to consume 1 token.
* @param key unique key per visitor & route (e.g., `cities:${ip}`)
* @param limit max requests in the window
* @param windowMs time window in ms (default: 60s)
*/
export function rateLimitTry(key: string, limit: number, windowMs = 60_000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  let q = buckets.get(key);
  if (!q) q = [];
  // drop old stamps
  while (q.length && q[0] < windowStart) q.shift();

  const ok = q.length < limit;
  if (ok) {
    q.push(now);
    buckets.set(key, q);
    return { ok: true, remaining: limit - q.length, retryAfterSec: 0 };
  } else {
    const retryAfterMs = (q[0] ?? now) + windowMs - now;
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }
}
