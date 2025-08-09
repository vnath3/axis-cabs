// src/lib/SupabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const RAW_URL = (import.meta.env.PUBLIC_SUPABASE_URL || '').trim();
const RAW_KEY = (import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '').trim();

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
if (client) return client;

// Log once (masked) so we can see what reached the bundle at runtime
  if (typeof window !== 'undefined') {
// runs in browser too
    console.log(
'[Supa env]',
'URL:', RAW_URL ? RAW_URL.replace(/^https?:\/\//,'').split('.')[0] : '(missing)',
      'KEY:', RAW_KEY ? 'present' : '(missing)'
);
}

// Basic validation to prevent "Invalid URL"
  const validUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(RAW_URL);
if (!validUrl || !RAW_KEY) {
throw new Error('Supabase env missing/invalid. Check PUBLIC_SUPABASE_URL & PUBLIC_SUPABASE_ANON_KEY on Netlify.');
}

client = createClient(RAW_URL, RAW_KEY, { auth: { persistSession: false } });
return client;
}
