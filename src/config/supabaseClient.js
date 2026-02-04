import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// These need to be prefixed with VITE_ to be exposed to the frontend (Vite requirement)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase Environment Variables!', {
        url: !!supabaseUrl,
        key: !!supabaseKey,
        help: 'Ensure you have VITE_SUPABASE_URL and VITE_SUPABASE_KEY set in your Vercel Dashboard.'
    });
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
