/**
 * Supabase Authentication Integration with Clerk
 * This module handles syncing Clerk users with Supabase
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Sync Clerk user to Supabase
 * Creates or updates user profile in Supabase
 */
export async function syncClerkUserToSupabase(clerkUser) {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase not configured, skipping user sync');
    return null;
  }

  if (!clerkUser) {
    console.error('❌ No Clerk user provided');
    return null;
  }

  try {
    const userId = clerkUser.id;
    const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
    const fullName = clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
    const imageUrl = clerkUser.imageUrl;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({
          email,
          full_name: fullName,
          avatar_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating user:', error);
        return null;
      }

      console.log('✅ User updated in Supabase');
      return data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          clerk_user_id: userId,
          email,
          full_name: fullName,
          avatar_url: imageUrl,
          onboarded: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user:', error);
        return null;
      }

      console.log('✅ User created in Supabase');
      return data;
    }
  } catch (error) {
    console.error('❌ Error syncing user to Supabase:', error);
    return null;
  }
}

/**
 * Get user profile from Supabase by Clerk user ID
 */
export async function getUserProfile(clerkUserId) {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase not configured');
    return null;
  }

  if (!clerkUserId) {
    console.error('❌ No Clerk user ID provided');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      console.error('❌ Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user onboarding status
 */
export async function updateUserOnboarding(clerkUserId, accountType, companyData = null) {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase not configured');
    return false;
  }

  try {
    // First, update or create the user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({
        account_type: accountType,
        onboarded: true,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();

    if (userError) {
      console.error('❌ Error updating user onboarding:', userError);
      return false;
    }

    // If fleet account and company data provided, create company
    if (accountType === 'fleet' && companyData) {
      const { data: companyResult, error: companyError } = await supabase
        .from('fleet_companies')
        .insert({
          name: companyData.name,
          owner_id: userData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (companyError) {
        console.error('❌ Error creating company:', companyError);
        return false;
      }

      // Update user with company_id
      await supabase
        .from('users')
        .update({ company_id: companyResult.id })
        .eq('id', userData.id);
    }

    console.log('✅ User onboarding updated');
    return true;
  } catch (error) {
    console.error('❌ Error updating onboarding:', error);
    return false;
  }
}

/**
 * Get company data for fleet user
 */
export async function getCompanyData(companyId) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('fleet_companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('❌ Error fetching company:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Error getting company data:', error);
    return null;
  }
}
