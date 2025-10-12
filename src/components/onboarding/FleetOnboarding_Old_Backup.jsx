import { useState } from 'react';
import { useUser } from '@clerk/clerk-reac      // 1. Mark onboarding complete in Clerk
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboarded: true,
          role: selectedRole,
        }
      }); { useNavigate } from 'react-router-dom';
import { FLEET_ROLES } from '../../config/userTypes';
import { useAuthenticatedSupabase } from '../../lib/supabaseAuth';

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
  const [taxId, setTaxId] = useState('');
  const [phone, setPhone] = useState('');
  
  // Step 2: Your Role
  const [role, setRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  
  // Step 3: Billing (optional for now)
  const [billingEmail, setBillingEmail] = useState(user?.primaryEmailAddress?.emailAddress || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = useAuthenticatedSupabase();

      // 1. Create fleet company
      const { data: company, error: companyError } = await supabase
        .from('fleet_companies')
        .insert([{
          name: companyName,
          business_type: businessType,
          fleet_size_range: fleetSize,
          tax_id: taxId || null,
          phone: phone || null,
          billing_email: billingEmail,
          created_by: user.id,
          plan: 'starter', // Default plan
          settings: {
            require_transaction_approval: true,
            require_odometer_reading: true,
            allow_driver_self_assign: false,
          }
        }])
        .select()
        .single();

      if (companyError) throw companyError;

      // 2. Create user record in Supabase
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          clerk_id: user.id,
          email: user.primaryEmailAddress.emailAddress,
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          account_type: 'fleet',
          role: role,
          company_id: company.id,
          employee_id: employeeId || null,
          onboarded: true,
        }]);

      if (userError) throw userError;

      // 3. Update Clerk metadata
      await user.update({
        unsafeMetadata: {
          accountType: 'fleet',
          role: role,
          companyId: company.id,
          companyName: companyName,
          onboarded: true,
        }
      });

      // 4. Navigate to fleet dashboard
      navigate('/fleet/dashboard');
      
    } catch (error) {
      console.error('Fleet onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
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
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  width: '30%',
                  height: '4px',
                  background: s <= step ? '#3b82f6' : '#e2e8f0',
                  borderRadius: '2px',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
            Step {step} of 3
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

        <form onSubmit={handleSubmit}>
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
                    outline: 'none',
                    transition: 'border 0.3s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
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
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="">Select business type</option>
                  <option value="logistics">📦 Logistics & Distribution</option>
                  <option value="delivery">🍕 Delivery Service</option>
                  <option value="trucking">🚚 Trucking & Freight</option>
                  <option value="rideshare">🚖 Rideshare/Taxi</option>
                  <option value="service">🔧 Service Vehicles (Plumbing, Electric, etc.)</option>
                  <option value="other">🏢 Other</option>
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
                  <option value="">How many vehicles?</option>
                  <option value="1-10">1-10 vehicles</option>
                  <option value="11-50">11-50 vehicles</option>
                  <option value="51-200">51-200 vehicles</option>
                  <option value="201-500">201-500 vehicles</option>
                  <option value="501+">501+ vehicles</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
                  Tax ID / EIN (Optional)
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="12-3456789"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
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
                type="button"
                onClick={() => setStep(2)}
                disabled={!companyName || !businessType || !fleetSize}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: !companyName || !businessType || !fleetSize ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: !companyName || !businessType || !fleetSize ? 'not-allowed' : 'pointer'
                }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2: Your Role */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '24px' }}>
                Your Role in the Company
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#1e40af', fontWeight: '600', fontSize: '14px' }}>
                  Select Your Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Choose your role</option>
                  <option value={FLEET_ROLES.FLEET_ADMIN}>👑 Fleet Administrator (Company Owner)</option>
                  <option value={FLEET_ROLES.FLEET_MANAGER}>📊 Fleet Manager (Operations)</option>
                  <option value={FLEET_ROLES.ACCOUNTANT}>💰 Accountant (Finance)</option>
                  <option value={FLEET_ROLES.DISPATCHER}>📍 Dispatcher (Route Planning)</option>
                  <option value={FLEET_ROLES.DRIVER}>🚗 Driver (Vehicle Operator)</option>
                </select>

                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#1e40af'
                }}>
                  {role === FLEET_ROLES.FLEET_ADMIN && '👑 Full access to manage company, vehicles, and users'}
                  {role === FLEET_ROLES.FLEET_MANAGER && '📊 Manage vehicles, approve transactions, view reports'}
                  {role === FLEET_ROLES.ACCOUNTANT && '💰 View financial data, export reports'}
                  {role === FLEET_ROLES.DISPATCHER && '📍 Plan routes, assign vehicles'}
                  {role === FLEET_ROLES.DRIVER && '🚗 Record fuel purchases, view assigned vehicle'}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
                  Employee ID (Optional)
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="EMP-12345"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'white',
                    color: '#3b82f6',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!role}
                  style={{
                    flex: 2,
                    padding: '14px',
                    background: !role ? '#cbd5e1' : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: !role ? 'not-allowed' : 'pointer'
                  }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '24px' }}>
                Review & Confirm
              </h2>

              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Company Name</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>{companyName}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Business Type</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>{businessType}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Fleet Size</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>{fleetSize} vehicles</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Your Role</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>
                    {role === FLEET_ROLES.FLEET_ADMIN && 'Fleet Administrator'}
                    {role === FLEET_ROLES.FLEET_MANAGER && 'Fleet Manager'}
                    {role === FLEET_ROLES.ACCOUNTANT && 'Accountant'}
                    {role === FLEET_ROLES.DISPATCHER && 'Dispatcher'}
                    {role === FLEET_ROLES.DRIVER && 'Driver'}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#64748b', fontWeight: '600', fontSize: '14px' }}>
                  Billing Email
                </label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="billing@company.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'white',
                    color: '#3b82f6',
                    border: '2px solid #3b82f6',
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
                  {loading ? 'Creating Company...' : '✓ Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div style={{
          marginTop: '32px',
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          display: 'flex',
          gap: '12px'
        }}>
          <div style={{ fontSize: '20px' }}>💡</div>
          <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
            <strong>Next steps:</strong> After setup, you'll be able to add vehicles, invite drivers and managers, and start tracking fuel expenses.
          </div>
        </div>
      </div>
    </div>
  );
}
