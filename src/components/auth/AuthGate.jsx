import React, { useEffect } from 'react';
import { useStore } from '../../store';
import AuthScreen from './AuthScreen';

const AuthGate = ({ children }) => {
  const user = useStore((s) => s.user);
  const authInitialized = useStore((s) => s.authInitialized);
  const initAuth = useStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!authInitialized) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return children;
};

export default AuthGate;
