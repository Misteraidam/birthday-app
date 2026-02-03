import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// These need to be prefixed with VITE_ to be exposed to the frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase Environment Variables! Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
