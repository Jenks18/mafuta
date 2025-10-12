import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserProfile } from '../../lib/supabaseAuth';

/**
 * Protected Route - Ensures user is authenticated and onboarded
 * Redirects based on account type
 */
export default function ProtectedRoute({ children, accountType = null, requireAuth = true }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!isLoaded) return;
      
      if (!isSignedIn && requireAuth) {
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [isSignedIn, isLoaded, requireAuth]);

  // Still loading
  if (!isLoaded || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn && requireAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  // Not onboarded
  if (!profile?.onboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  // Wrong account type
  if (accountType && profile.account_type !== accountType) {
    // Redirect to correct dashboard
    if (profile.account_type === 'fleet') {
      return <Navigate to="/fleet/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
