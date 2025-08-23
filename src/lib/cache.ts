/**
* Very small in-memory TTL cache (per server instance).
* Useful for hot endpoints to reduce Supabase reads.
*
* NOTE: in serverless, cache is best-effort and may be evicted between invocations.
*/

type Entry<V> = { v: V; exp: number };

const store = new Map<string, Entry<any>>();

export function cacheGet<T = unknown>(key: string): T | undefined {
const hit = store.get(key);
if (!hit) return undefined;

  if (Date.now() >= hit.exp) {
    store.delete(key);
    return undefined;
  }
  return hit.v as T;
}

export function cacheSet<T = unknown>(key: string, value: T, ttlMs = 60_000): void {
  store.set(key, { v: value, exp: Date.now() + ttlMs });
}

/** Optional: delete / clear */
export const cacheDel = (key: string) => { store.delete(key); };
export const cacheClear = () => { store.clear(); };

