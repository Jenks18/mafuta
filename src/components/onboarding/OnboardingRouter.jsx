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
      if (!isLoaded || !user) return;

      try {
        // Check Clerk metadata first (faster)
        const clerkOnboarded = user.publicMetadata?.onboarded;
        const clerkAccountType = user.publicMetadata?.accountType;

        // If not onboarded in Clerk, go to account type selection
        if (!clerkOnboarded && !clerkAccountType) {
          navigate('/onboarding/account-type');
          return;
        }

        // If account type selected but not fully onboarded
        if (clerkAccountType && !clerkOnboarded) {
          if (clerkAccountType === 'fleet') {
            navigate('/onboarding/fleet');
          } else {
            navigate('/onboarding/individual');
          }
          return;
        }

        // Double-check with Supabase
        const profile = await getCurrentUserProfile();
        
        if (!profile || !profile.onboarded) {
          // User exists in Clerk but not Supabase, restart onboarding
          navigate('/onboarding/account-type');
          return;
        }

        // Fully onboarded, go to appropriate dashboard
        if (profile.account_type === 'fleet') {
          navigate('/fleet/dashboard');
        } else {
          navigate('/dashboard');
        }

      } catch (error) {
        console.error('Error checking onboarding status:', error);
        navigate('/onboarding/account-type');
      } finally {
        setChecking(false);
      }
    }

    checkOnboardingStatus();
  }, [user, isLoaded, navigate]);

  if (!isLoaded || checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>
            Loading your account...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
