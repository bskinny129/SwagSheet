import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase environment variables are missing or incorrect. Supabase client will not be created.');
  // Optionally, you can set supabase to a mock or a no-op object if needed
  supabase = null;
}

export { supabase };