import { useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Create authenticated Supabase client with Clerk JWT
 */
export function useAuthenticatedSupabase() {
  const { user, session } = useUser();

  // Get Supabase JWT from Clerk session
  const supabaseToken = session?.getToken({ template: 'supabase' });

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: async () => {
        const token = await supabaseToken;
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    },
  });

  return supabase;
}

/**
 * Get current user's profile from Supabase
 */
export async function getCurrentUserProfile() {
  const supabase = useAuthenticatedSupabase();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Check if current user has completed onboarding
 */
export async function isUserOnboarded() {
  const profile = await getCurrentUserProfile();
  return profile?.onboarded || false;
}

/**
 * Get user's account type (fleet or individual)
 */
export async function getUserAccountType() {
  const profile = await getCurrentUserProfile();
  return profile?.account_type || null;
}

/**
 * Get user's company (for fleet users)
 */
export async function getUserCompany() {
  const profile = await getCurrentUserProfile();
  
  if (!profile || profile.account_type !== 'fleet') {
    return null;
  }
  
  const supabase = useAuthenticatedSupabase();
  const { data } = await supabase
    .from('fleet_companies')
    .select('*')
    .eq('id', profile.company_id)
    .single();
  
  return data;
}
