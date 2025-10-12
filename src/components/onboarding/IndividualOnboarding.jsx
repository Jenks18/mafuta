import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { INDIVIDUAL_ROLES } from '../../config/userTypes';
import { useAuthenticatedSupabase } from '../../lib/supabaseAuth';

/**
 * Individual Onboarding - For personal consumers
 */
export default function IndividualOnboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // User preferences
  const [subscriptionTier, setSubscriptionTier] = useState(INDIVIDUAL_ROLES.CONSUMER);
  const [primaryVehicle, setPrimaryVehicle] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: 'gasoline'
  });
  const [averageMonthlySpend, setAverageMonthlySpend] = useState('');
  const [interests, setInterests] = useState([]);

  const interestOptions = [
    { id: 'rewards', label: '💰 Cashback Rewards', icon: '💰' },
    { id: 'savings', label: '💵 Lowest Prices', icon: '💵' },
    { id: 'convenience', label: '📍 Nearby Stations', icon: '📍' },
    { id: 'analytics', label: '📊 Fuel Analytics', icon: '📊' },
    { id: 'alerts', label: '🔔 Price Alerts', icon: '🔔' },
  ];

  const toggleInterest = (id) => {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = useAuthenticatedSupabase();

      // 1. Create user record in Supabase
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          clerk_id: user.id,
          email: user.primaryEmailAddress.emailAddress,
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          account_type: 'individual',
          subscription_tier: subscriptionTier,
          onboarded: true,
          metadata: {
            primaryVehicle,
            averageMonthlySpend,
            interests,
            onboardingCompletedAt: new Date().toISOString()
          }
        }]);

      if (userError) throw userError;

      // 2. Create initial digital card
      const { error: cardError } = await supabase
        .from('individual_cards')
        .insert([{
          user_id: user.id,
          card_name: 'My Mafuta Card',
          card_number: `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          card_type: 'virtual',
          network: 'shell',
          balance: 0,
          spending_limit_daily: subscriptionTier === INDIVIDUAL_ROLES.PREMIUM ? 500 : 200,
          spending_limit_monthly: subscriptionTier === INDIVIDUAL_ROLES.PREMIUM ? 2000 : 1000,
        }]);

      if (cardError) console.warn('Card creation warning:', cardError);

      // 3. Update Clerk metadata
      await user.update({
        publicMetadata: {
          accountType: 'individual',
          subscriptionTier: subscriptionTier,
          onboarded: true,
        }
      });

      // 4. Navigate to individual dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Individual onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#7c3aed',
            marginBottom: '8px'
          }}>
            Welcome to Mafuta!
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            Let's personalize your fuel savings experience
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Subscription Tier */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#7c3aed', fontWeight: '600', fontSize: '14px' }}>
              Choose Your Plan
            </label>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { value: INDIVIDUAL_ROLES.CONSUMER, name: 'Free', features: ['Digital cards', 'Basic rewards', 'Station finder'] },
                { value: INDIVIDUAL_ROLES.PREMIUM, name: 'Premium ($9.99/mo)', features: ['Higher rewards', 'Price alerts', 'Advanced analytics', 'Priority support'] },
              ].map(tier => (
                <div
                  key={tier.value}
                  onClick={() => setSubscriptionTier(tier.value)}
                  style={{
                    border: subscriptionTier === tier.value ? '3px solid #7c3aed' : '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    background: subscriptionTier === tier.value ? '#faf5ff' : 'white',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#7c3aed', marginBottom: '8px' }}>
                    {tier.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    {tier.features.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Vehicle */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#7c3aed', fontWeight: '600', fontSize: '14px' }}>
              Primary Vehicle (Optional)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '8px' }}>
              <input
                type="text"
                placeholder="Make (e.g., Toyota)"
                value={primaryVehicle.make}
                onChange={(e) => setPrimaryVehicle({ ...primaryVehicle, make: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <input
                type="text"
                placeholder="Model (e.g., Camry)"
                value={primaryVehicle.model}
                onChange={(e) => setPrimaryVehicle({ ...primaryVehicle, model: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <input
                type="number"
                placeholder="Year"
                value={primaryVehicle.year}
                onChange={(e) => setPrimaryVehicle({ ...primaryVehicle, year: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <select
              value={primaryVehicle.fuelType}
              onChange={(e) => setPrimaryVehicle({ ...primaryVehicle, fuelType: e.target.value })}
              style={{
                width: '100%',
                marginTop: '8px',
                padding: '10px 12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="gasoline">⛽ Gasoline</option>
              <option value="diesel">🚛 Diesel</option>
              <option value="electric">⚡ Electric</option>
              <option value="hybrid">🔋 Hybrid</option>
            </select>
          </div>

          {/* What interests you? */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#7c3aed', fontWeight: '600', fontSize: '14px' }}>
              What matters most to you?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {interestOptions.map(option => (
                <div
                  key={option.id}
                  onClick={() => toggleInterest(option.id)}
                  style={{
                    padding: '12px',
                    border: interests.includes(option.id) ? '2px solid #7c3aed' : '2px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: interests.includes(option.id) ? '#faf5ff' : 'white',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: interests.includes(option.id) ? '#7c3aed' : '#64748b',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {option.icon} {option.label.split(' ')[1]}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/onboarding/account-type')}
              style={{
                flex: 1,
                padding: '14px',
                background: 'white',
                color: '#7c3aed',
                border: '2px solid #7c3aed',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '14px',
                background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Setting Up...' : '🚀 Get Started'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
