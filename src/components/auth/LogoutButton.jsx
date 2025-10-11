import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useStore } from '../../store';

const LogoutButton = ({ className = '' }) => {
  const logoutMock = useStore((s) => s.logoutMock);

  const handleLogout = async () => {
    if (!supabase) {
      logoutMock();
      return;
    }
    await supabase.auth.signOut();
    logoutMock();
  };

  return (
    <button onClick={handleLogout} className={`px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm ${className}`}>
      Log out
    </button>
  );
};

export default LogoutButton;
