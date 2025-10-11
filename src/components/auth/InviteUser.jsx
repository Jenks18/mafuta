import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const InviteUser = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const sendInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    if (!supabase) {
      setStatus('Mock invite sent.');
      setEmail('');
      return;
    }
    setStatus('Sending…');
    const { error } = await supabase.auth.signInWithOtp({ email });
    setStatus(error ? error.message : 'Invite sent. Check inbox.');
    if (!error) setEmail('');
  };

  return (
    <form onSubmit={sendInvite} className="flex flex-wrap items-end gap-3">
      <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="user@example.com" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      <button type="submit" className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm">Send invite</button>
      {status && <div className="text-xs text-gray-600">{status}</div>}
    </form>
  );
};

export default InviteUser;
