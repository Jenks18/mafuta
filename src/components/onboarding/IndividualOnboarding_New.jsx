import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { updateUserOnboarding } from '../../lib/supabaseAuth';

/**
 * Individual Onboarding - For personal consumers
 */
export default function IndividualOnboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // User info
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting individual onboarding...');

      // 1. Update Clerk metadata (primary source)
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboarded: true,
        }
      });

      console.log('✅ Clerk metadata updated');

      // 2. Update Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const success = await updateUserOnboarding(
            user.id,
            'individual',
            null // No company data for individuals
          );

          if (success) {
            console.log('✅ Supabase data saved');
          } else {
            console.warn('⚠️ Supabase save failed, but continuing...');
          }
        } catch (supabaseError) {
          console.warn('⚠️ Supabase error:', supabaseError);
          // Continue anyway - Clerk metadata is the source of truth
        }
      } else {
        console.log('ℹ️ Supabase not configured, using Clerk only');
      }

      console.log('✅ Onboarding complete!');

      // 3. Navigate to individual dashboard
      navigate('/app/dashboard');
      
    } catch (error) {
      console.error('❌ Individual onboarding error:', error);
      alert('Failed to complete onboarding: ' + (error.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#059669',
            marginBottom: '8px'
          }}>
            Personal Account Setup
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            Complete your profile to get started
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#059669', fontWeight: '600', fontSize: '14px' }}>
              First Name *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#059669', fontWeight: '600', fontSize: '14px' }}>
              Last Name *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#059669', fontWeight: '600', fontSize: '14px' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254 712 345 678"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#cbd5e1' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #bbf7d0'
        }}>
          <p style={{ fontSize: '13px', color: '#166534', marginBottom: '8px', fontWeight: '600' }}>
            ✨ What's next?
          </p>
          <ul style={{ fontSize: '13px', color: '#166534', paddingLeft: '20px' }}>
            <li>Set up your digital fuel card</li>
            <li>Find Shell stations nearby</li>
            <li>Track your fuel spending</li>
            <li>Earn rewards on every purchase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
