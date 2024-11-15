import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://${import.meta.env.VITE_SUPABASE_URL}`;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);