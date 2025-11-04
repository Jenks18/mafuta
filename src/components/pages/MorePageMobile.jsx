import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { morePageMenuItems } from '../../config/navigation.jsx';

const MorePageMobile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigate = (key) => {
    window.dispatchEvent(new CustomEvent('app:navigate', { detail: key }));
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to sign out?');
    if (!confirmLogout) {
      setShowProfileMenu(false);
      return;
    }

    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out. Please try again.');
      setIsLoggingOut(false);
    }
  };

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

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      {/* Header with Circular Profile Button */}
      <div className="bg-white border-b border-emerald-200/50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">More</h1>
              <p className="text-sm text-gray-500 mt-0.5">Quick access to all features</p>
            </div>

            {/* Circular Profile Button */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg active:scale-95 transition-transform"
              >
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user?.fullName || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-semibold shadow-lg text-lg">
                          {user?.imageUrl ? (
                            <img 
                              src={user.imageUrl} 
                              alt={user?.fullName || 'User'}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{user?.fullName || user?.firstName || 'User'}</p>
                          <p className="text-sm text-gray-600 truncate">{user?.primaryEmailAddress?.emailAddress || ''}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleNavigate('profile');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium text-gray-700">View Profile</span>
                      </button>

                      <hr className="my-2 border-gray-100" />

                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-left transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <>
                            <svg className="w-5 h-5 text-red-600 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-medium text-red-600">Signing out...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-medium text-red-600">Sign Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-4 space-y-6 pb-20">
        {morePageMenuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Section Header */}
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">{section.section}</h2>
              <div className="h-0.5 w-12 bg-gradient-to-r from-emerald-500 to-green-500 mt-1.5 rounded-full"></div>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-2 gap-3">
              {section.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigate(item.key)}
                  className="bg-white rounded-xl p-4 border border-emerald-100 hover:border-emerald-300 hover:shadow-md active:scale-95 transition-all duration-200 text-left shadow-sm"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center text-emerald-600 mb-3">
                    {item.icon}
                  </div>

                  {/* Label */}
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {item.label}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="text-center py-4 space-y-1">
          <p className="text-xs text-gray-400">Mafuta Fleet Management</p>
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default MorePageMobile;
