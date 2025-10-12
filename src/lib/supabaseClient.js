import { createClient } from '@supabase/supabase-js';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
}

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

// Log configuration status
console.log('🗄️ Supabase Client:', {
  configured: isSupabaseConfigured(),
  url: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'not set'
});
