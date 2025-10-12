import { Navigate } from 'react-router-dom';
import { useUserData } from '../../hooks/useUserData';

/**
 * Protected Route - Ensures user is authenticated and onboarded
 * Redirects based on account type
 */
export default function ProtectedRoute({ children, accountType = null }) {
  const { user, isLoaded, isOnboarded, accountType: userAccountType } = useUserData();

  // Still loading
  if (!isLoaded) {
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
  if (!user) {
    console.log('🔒 Not authenticated, redirecting to sign-in');
    return <Navigate to="/sign-in" replace />;
  }

  // Not onboarded
  if (!isOnboarded) {
    console.log('📝 Not onboarded, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // Wrong account type - redirect to correct dashboard
  if (accountType && userAccountType !== accountType) {
    console.log(`🔀 Wrong account type (expected: ${accountType}, got: ${userAccountType})`);
    if (userAccountType === 'fleet') {
      return <Navigate to="/fleet/dashboard" replace />;
    } else {
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  // All checks passed
  return children;
}
