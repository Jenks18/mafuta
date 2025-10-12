import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks/useUserData';

/**
 * Onboarding Router - Detects onboarding state and routes accordingly
 */
export default function OnboardingRouter() {
  const navigate = useNavigate();
  const { user, profile, isLoaded, isOnboarded, accountType } = useUserData();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      console.log('→ No user, redirecting to sign-in');
      navigate('/sign-in');
      setChecking(false);
      return;
    }

    console.log('🔍 Onboarding Check:', { 
      isOnboarded, 
      accountType,
      profile: profile ? 'loaded' : 'null' 
    });

    // Not onboarded at all - go to account type selection
    if (!accountType) {
      console.log('→ No account type, redirecting to selection');
      navigate('/onboarding/account-type');
      setChecking(false);
      return;
    }

    // Account type selected but not fully onboarded
    if (accountType && !isOnboarded) {
      console.log('→ Account type selected, completing onboarding:', accountType);
      if (accountType === 'fleet') {
        navigate('/onboarding/fleet');
      } else {
        navigate('/onboarding/individual');
      }
      setChecking(false);
      return;
    }

    // Fully onboarded - redirect to dashboard
    if (isOnboarded) {
      console.log('→ Fully onboarded, redirecting to dashboard');
      if (accountType === 'fleet') {
        navigate('/fleet/dashboard');
      } else {
        navigate('/app/dashboard');
      }
      setChecking(false);
      return;
    }

    // Default fallback
    navigate('/onboarding/account-type');
    setChecking(false);
  }, [isLoaded, user, profile, isOnboarded, accountType, navigate]);

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
