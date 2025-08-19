/**
* GA4 tiny helper with a queue so events are not lost if gtag isn't ready yet.
* - Backward compatible with previous exports: gaEvent, flushGaQueue
* - Adds helpers: gaPageview, gaSet, gaConsent, gaException, gaTiming, onGtagReady
* - Auto-flushes when gtag appears (lightweight polling, stops after success/timeout)
*/

export type GaParams = Record<string, any>;

declare global {
    interface Window {
        __gaq?: Array<{ name: string; params: GaParams }>;
__gaReadyQ?: Array<() => void>;
gtag?: (...args: any[]) => void;
  }
}

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  window.__gaq ??= [];
  window.__gaReadyQ ??= [];
}

/** Internal: is gtag available? */
function hasGtag(): boolean {
  return isBrowser && typeof window.gtag === "function";
}

/** Queue a callback to run once gtag is ready. Runs immediately if already ready. */
export function onGtagReady(fn: () => void): void {
  if (!isBrowser) return;
  if (hasGtag()) {
    try { fn(); } catch {}
  } else {
    window.__gaReadyQ!.push(fn);
  }
}

/** Fire a GA4 event safely; will queue if gtag isn't ready yet. */
export function gaEvent(name: string, params: GaParams = {}): void {
  if (!isBrowser) return;
  if (hasGtag()) {
    try { window.gtag!("event", name, params); } catch {}
    return;
  }
  window.__gaq!.push({ name, params });
}

/** Flush queued events once GA is ready. Call after gtag loads (kept for backward compatibility). */
export function flushGaQueue(): void {
  if (!isBrowser || !hasGtag()) return;
  try {
    const q = window.__gaq!;
    for (const ev of q) window.gtag!("event", ev.name, ev.params);
    q.length = 0;

    const r = window.__gaReadyQ!;
    for (const cb of r) { try { cb(); } catch {} }
    r.length = 0;
  } catch {}
}

/** Pageview helper (works even if GA auto pageview is enabled; GA will de-dupe). */
export function gaPageview(path: string, title?: string): void {
  gaEvent("page_view", { page_path: path, page_title: title });
}

/** Set GA parameters (e.g., user properties or global fields). */
export function gaSet(params: GaParams): void {
  onGtagReady(() => {
    try { window.gtag!("set", params); } catch {}
  });
}

/** Update consent (e.g., { ad_storage: 'denied', analytics_storage: 'granted' }). */
export function gaConsent(update: GaParams): void {
  onGtagReady(() => {
    try { window.gtag!("consent", "update", update); } catch {}
  });
}

/** Report an exception/error. */
export function gaException(description: string, fatal = false): void {
  gaEvent("exception", { description, fatal });
}

/** Report a timing (in ms). */
export function gaTiming(name: string, ms: number, params: GaParams = {}): void {
  gaEvent("timing_complete", { name, value: Math.round(ms), ...params });
}

/* ---------------------------------------------------------
   Auto-flush: try briefly after load so queued events fire
   without requiring explicit flush in your Analytics component.
---------------------------------------------------------- */
if (isBrowser) {
  let tries = 0;
  const iv = window.setInterval(() => {
    if (hasGtag()) {
      flushGaQueue();
      window.clearInterval(iv);
    } else if (++tries > 40) { // ~10s max (40 * 250ms)
      window.clearInterval(iv);
    }
  }, 250);
}
