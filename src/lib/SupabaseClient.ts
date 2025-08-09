// src/lib/SupabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// MUST be PUBLIC_* so they are available in the browser in Astro
const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
* Safe singleton accessor. Throws a clear error if env vars are missing.
* Works in both browser and server contexts in Astro v5.
*/
export function getSupabaseClient(): SupabaseClient {
if (client) return client;
if (!URL || !KEY) {
// Make the error obvious in the console without crashing the whole app early
    throw new Error(
'Supabase env vars missing. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in Netlify and redeploy.'
);
}
client = createClient(URL, KEY, { auth: { persistSession: false } });
return client;
}
