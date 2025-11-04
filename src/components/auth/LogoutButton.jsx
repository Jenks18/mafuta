import { useClerk, useUser } from '@clerk/clerk-react';
import { useState } from 'react';

/**
 * Logout Button Component
 * Shows user info and provides logout functionality
 */
export default function LogoutButton({ variant = 'desktop', isCollapsed = false }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;
    
    const confirmLogout = window.confirm('Are you sure you want to sign out?');
    if (!confirmLogout) return;

    setIsLoading(true);
    try {
      await signOut();
      // Clerk will redirect to sign-in page automatically
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out. Please try again.');
      setIsLoading(false);
    }
  };

  // Get user initials
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const userName = user?.fullName || user?.firstName || 'User';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

  // Desktop Sidebar Version
  if (variant === 'desktop') {
    return (
      <div className="relative z-10 p-4 border-t border-emerald-200/50 bg-white/30 backdrop-blur-sm">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-xs">{getInitials()}</span>
            )}
          </div>

          {/* Expanded View */}
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-emerald-800 text-sm truncate">{userName}</p>
                <p className="text-xs text-emerald-600 truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="p-1.5 rounded-md hover:bg-red-50 text-emerald-600 hover:text-red-600 transition-colors disabled:opacity-50"
                title="Sign Out"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
              </button>
            </>
          )}

          {/* Collapsed View - Show logout on click */}
          {isCollapsed && (
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity bg-red-50/90 flex items-center justify-center group"
              title="Sign Out"
            >
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Mobile Version
  if (variant === 'mobile') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="relative flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-200 text-emerald-600 hover:text-red-600 hover:bg-red-50/50 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[11px] font-medium mt-0.5">...</span>
          </>
        ) : (
          <>
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={userName}
                className="w-6 h-6 rounded-full object-cover border border-emerald-200"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-[10px]">{getInitials()}</span>
              </div>
            )}
            <span className="text-[11px] font-medium mt-0.5">Logout</span>
          </>
        )}
      </button>
    );
  }

  // Mobile Full Width Version (for More page)
  if (variant === 'mobile-full') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium">Signing out...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Sign Out</span>
          </>
        )}
      </button>
    );
  }

  return null;
}
