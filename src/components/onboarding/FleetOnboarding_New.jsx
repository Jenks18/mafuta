import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { FLEET_ROLES } from '../../config/userTypes';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { updateUserOnboarding } from '../../lib/supabaseAuth';

/**
 * Fleet Onboarding - For business customers
 */
export default function FleetOnboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step onboarding

  // Step 1: Company Info
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [fleetSize, setFleetSize] = useState('');
  const [phone, setPhone] = useState('');
  
  // Step 2: Your Role
  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!companyName || !businessType || !fleetSize || !selectedRole) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting fleet onboarding...');

      // 1. Update Clerk metadata (primary source)
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboarded: true,
          role: selectedRole,
          companyName: companyName,
        }
      });

      console.log('✅ Clerk metadata updated');

      // 2. Update Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const success = await updateUserOnboarding(
            user.id,
            'fleet',
            {
              name: companyName,
              business_type: businessType,
              fleet_size: fleetSize,
              phone: phone || null,
            }
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

      // 3. Navigate to fleet dashboard
      navigate('/fleet/dashboard');
      
    } catch (error) {
      console.error('❌ Fleet onboarding error:', error);
      alert('Failed to complete onboarding: ' + (error.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!companyName || !businessType || !fleetSize) {
        alert('Please fill in all company information');
        return;
      }
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
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
        {/* Progress Indicator */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            {[1, 2].map(s => (
              <div
                key={s}
                style={{
                  width: '48%',
                  height: '4px',
                  background: s <= step ? '#3b82f6' : '#e2e8f0',
                  borderRadius: '2px',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
            Step {step} of 2
          </p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚛</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '8px'
          }}>
            Fleet Management Setup
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            Let's get your fleet up and running
          </p>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* STEP 1: Company Information */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '24px' }}>
                Company Information
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ABC Logistics Inc."
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
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                  Business Type *
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select business type</option>
                  <option value="logistics">Logistics & Delivery</option>
                  <option value="trucking">Trucking & Freight</option>
                  <option value="public_transport">Public Transport</option>
                  <option value="taxi">Taxi & Ride-sharing</option>
                  <option value="construction">Construction</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                  Fleet Size *
                </label>
                <select
                  value={fleetSize}
                  onChange={(e) => setFleetSize(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Select fleet size</option>
                  <option value="1-10">1-10 vehicles</option>
                  <option value="11-50">11-50 vehicles</option>
                  <option value="51-100">51-100 vehicles</option>
                  <option value="101-500">101-500 vehicles</option>
                  <option value="500+">500+ vehicles</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
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
                    fontSize: '16px'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Next: Select Your Role
              </button>
            </div>
          )}

          {/* STEP 2: Your Role */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '24px' }}>
                What's Your Role?
              </h2>

              <div style={{ marginBottom: '24px' }}>
                {Object.values(FLEET_ROLES).map((role) => (
                  <div
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    style={{
                      padding: '16px',
                      border: selectedRole === role.value ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                      borderRadius: '12px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      background: selectedRole === role.value ? '#eff6ff' : 'white',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>{role.icon}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>
                          {role.label}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>
                          {role.description}
                        </p>
                      </div>
                      {selectedRole === role.value && (
                        <div style={{ color: '#3b82f6', fontSize: '20px' }}>✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: '#e2e8f0',
                    color: '#1e40af',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!selectedRole || loading}
                  style={{
                    flex: 2,
                    padding: '14px',
                    background: selectedRole && !loading ? '#3b82f6' : '#cbd5e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: selectedRole && !loading ? 'pointer' : 'not-allowed'
                  }}
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
