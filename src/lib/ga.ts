// src/lib/ga.ts
/**
* GA4 tiny helper with a queue so events are not lost if gtag isn't ready yet.
*/
type GaParams = Record<string, any>;

declare global {
interface Window {
__gaq?: Array<{ name: string; params: GaParams }>;
gtag?: (...args: any[]) => void;
}
}

if (typeof window !== 'undefined' && !window.__gaq) {
window.__gaq = [];
}

/** Fire a GA4 event safely; will queue if gtag isn't ready yet. */
export function gaEvent(name: string, params: GaParams = {}) {
if (typeof window === 'undefined') return;
if (typeof window.gtag === 'function') {
try { window.gtag('event', name, params); } catch {}
return;
}
window.__gaq!.push({ name, params });
}

/** Flush queued events once GA is ready. Call after gtag loads. */
export function flushGaQueue() {
if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !window.__gaq?.length) return;
try {
for (const ev of window.__gaq) window.gtag('event', ev.name, ev.params);
window.__gaq.length = 0;
} catch {}
}
