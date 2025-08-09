import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL!;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!;

// Browser-safe: uses public anon key; RLS protects the table.
export const supabase = createClient(url, key, { auth: { persistSession: false } });
