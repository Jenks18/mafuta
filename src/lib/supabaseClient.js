import { createClient } from '@supabase/supabase-js';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client (will be null if not configured)
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // We use Clerk for session management
        detectSessionInUrl: false
      }
    })
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;
