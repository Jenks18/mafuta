/**
 * Custom hook to manage user data from Clerk and Supabase
 * Provides a unified interface for user profile and onboarding status
 */

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { syncClerkUserToSupabase, getUserProfile } from '../lib/supabaseAuth';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export function useUserData() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [supabaseProfile, setSupabaseProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      if (!clerkLoaded) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // If Supabase is not configured, use Clerk metadata only
        if (!isSupabaseConfigured()) {
          console.log('📝 Using Clerk metadata (Supabase not configured)');
          setSupabaseProfile({
            account_type: user.unsafeMetadata?.accountType || null,
            onboarded: user.unsafeMetadata?.onboarded || false,
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: user.fullName,
            avatar_url: user.imageUrl
          });
          setLoading(false);
          return;
        }

        // Sync Clerk user to Supabase
        console.log('🔄 Syncing user to Supabase...');
        await syncClerkUserToSupabase(user);

        // Get user profile from Supabase
        const profile = await getUserProfile(user.id);
        
        if (profile) {
          setSupabaseProfile(profile);
        } else {
          // Fallback to Clerk metadata
          setSupabaseProfile({
            account_type: user.unsafeMetadata?.accountType || null,
            onboarded: user.unsafeMetadata?.onboarded || false,
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: user.fullName,
            avatar_url: user.imageUrl
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading user data:', err);
        setError(err);
        
        // Fallback to Clerk metadata on error
        if (user) {
          setSupabaseProfile({
            account_type: user.unsafeMetadata?.accountType || null,
            onboarded: user.unsafeMetadata?.onboarded || false,
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: user.fullName,
            avatar_url: user.imageUrl
          });
        }
        
        setLoading(false);
      }
    }

    loadUserData();
  }, [user, clerkLoaded]);

  return {
    user, // Clerk user object
    profile: supabaseProfile, // Supabase profile or Clerk metadata fallback
    loading,
    error,
    isLoaded: clerkLoaded && !loading,
    isOnboarded: supabaseProfile?.onboarded || false,
    accountType: supabaseProfile?.account_type || null
  };
}
