import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserProfile } from '../../lib/supabaseAuth';

/**
 * Onboarding Router - Detects onboarding state and routes accordingly
 */
export default function OnboardingRouter() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!isLoaded || !user) {
        setChecking(false);
        return;
      }

      try {
        // Check Clerk metadata first (faster)
        const clerkOnboarded = user.publicMetadata?.onboarded;
        const clerkAccountType = user.publicMetadata?.accountType;

        console.log('🔍 Onboarding Check:', { clerkOnboarded, clerkAccountType });

        // If not onboarded in Clerk, go to account type selection
        if (!clerkOnboarded && !clerkAccountType) {
          console.log('→ Redirecting to account type selection');
          navigate('/onboarding/account-type');
          setChecking(false);
          return;
        }

        // If account type selected but not fully onboarded
        if (clerkAccountType && !clerkOnboarded) {
          console.log('→ Redirecting to complete onboarding:', clerkAccountType);
          if (clerkAccountType === 'fleet') {
            navigate('/onboarding/fleet');
          } else {
            navigate('/onboarding/individual');
          }
          setChecking(false);
          return;
        }

        // Try to check Supabase (but don't fail if it's not set up yet)
        try {
          const profile = await getCurrentUserProfile();
          
          if (!profile || !profile.onboarded) {
            // User exists in Clerk but not Supabase, restart onboarding
            console.log('→ Profile incomplete, restarting onboarding');
            navigate('/onboarding/account-type');
            setChecking(false);
            return;
          }

          // Fully onboarded, go to appropriate dashboard
          console.log('→ Fully onboarded, redirecting to dashboard');
          if (profile.account_type === 'fleet') {
            navigate('/fleet/dashboard');
          } else {
            navigate('/app/dashboard');
          }
        } catch (supabaseError) {
          console.warn('⚠️ Supabase not configured yet:', supabaseError.message);
          // If Supabase fails but user is onboarded in Clerk, still proceed
          if (clerkOnboarded && clerkAccountType) {
            if (clerkAccountType === 'fleet') {
              navigate('/fleet/dashboard');
            } else {
              navigate('/app/dashboard');
            }
          } else {
            navigate('/onboarding/account-type');
          }
        }
      } catch (error) {
        console.error('❌ Onboarding check error:', error);
        navigate('/onboarding/account-type');
      } finally {
        setChecking(false);
      }
    }

    checkOnboardingStatus();
  }, [isLoaded, user, navigate]);

  if (!isLoaded || checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Mafuta</h2>
          <p style={{ opacity: 0.9 }}>Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/sign-in');
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
        <p style={{ opacity: 0.9 }}>Setting up your account...</p>
      </div>
    </div>
  );
}
