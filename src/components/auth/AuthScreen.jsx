import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useStore } from '../../store';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const loginMock = useStore((s) => s.loginMock);

  const sendMagicLink = async (e) => {
    e.preventDefault();
    if (!supabase) {
      loginMock({ id: 'mock-user', email });
      return;
    }
    setStatus('Sending…');
    const { error } = await supabase.auth.signInWithOtp({ email });
    setStatus(error ? error.message : 'Check your email for the login link.');
  };

  const loginWithGoogle = async () => {
    if (!supabase) {
      loginMock({ id: 'mock-user', email: 'mock@demo.app' });
      return;
    }
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Welcome to MafutaPass</h1>
        <p className="text-sm text-gray-600 mb-4">Sign in to continue</p>

        <form onSubmit={sendMagicLink} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">Send magic link</button>
        </form>

        <div className="my-4 text-center text-xs text-gray-500">or</div>
        <button onClick={loginWithGoogle} className="w-full py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium">Continue with Google</button>

        {status && <div className="mt-4 text-xs text-gray-600">{status}</div>}
      </div>
    </div>
  );
};

export default AuthScreen;
