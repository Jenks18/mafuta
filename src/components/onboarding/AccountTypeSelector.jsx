import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPES } from '../../config/userTypes';

/**
 * Account Type Selection - First step after signup
 */
export default function AccountTypeSelector() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');

  const handleSelect = async (accountType) => {
    // Save account type to Clerk metadata
    await user.update({
      publicMetadata: {
        accountType,
        onboarded: false, // Will be set to true after completing onboarding
      }
    });

    // Route to appropriate onboarding
    if (accountType === ACCOUNT_TYPES.FLEET) {
      navigate('/onboarding/fleet');
    } else {
      navigate('/onboarding/individual');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        maxWidth: '900px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '12px'
          }}>
            Welcome to Mafuta! 👋
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b' }}>
            Let's set up your account. What best describes you?
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Fleet Option */}
          <div
            onClick={() => handleSelect(ACCOUNT_TYPES.FLEET)}
            style={{
              border: selectedType === ACCOUNT_TYPES.FLEET ? '3px solid #3b82f6' : '2px solid #e2e8f0',
              borderRadius: '16px',
              padding: '32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: selectedType === ACCOUNT_TYPES.FLEET ? '#f0f9ff' : 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              🚛
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e40af',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              Fleet Management
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              For businesses managing multiple vehicles
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: '#475569'
            }}>
              <li style={{ marginBottom: '8px' }}>✅ Manage 10-500+ vehicles</li>
              <li style={{ marginBottom: '8px' }}>✅ Driver & manager accounts</li>
              <li style={{ marginBottom: '8px' }}>✅ Fuel transaction approval</li>
              <li style={{ marginBottom: '8px' }}>✅ Fleet analytics & reports</li>
              <li style={{ marginBottom: '8px' }}>✅ Spending limits & controls</li>
            </ul>
            <div style={{
              marginTop: '24px',
              padding: '8px 12px',
              background: '#dbeafe',
              color: '#1e40af',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Perfect for: Logistics, Delivery, Trucking
            </div>
          </div>

          {/* Individual Option */}
          <div
            onClick={() => handleSelect(ACCOUNT_TYPES.INDIVIDUAL)}
            style={{
              border: selectedType === ACCOUNT_TYPES.INDIVIDUAL ? '3px solid #8b5cf6' : '2px solid #e2e8f0',
              borderRadius: '16px',
              padding: '32px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: selectedType === ACCOUNT_TYPES.INDIVIDUAL ? '#faf5ff' : 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              🚗
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#7c3aed',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              Personal Account
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '16px',
              lineHeight: '1.6'
            }}>
              For individual drivers and personal use
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '14px',
              color: '#475569'
            }}>
              <li style={{ marginBottom: '8px' }}>✅ Digital fuel cards</li>
              <li style={{ marginBottom: '8px' }}>✅ Find cheapest fuel nearby</li>
              <li style={{ marginBottom: '8px' }}>✅ Track spending & MPG</li>
              <li style={{ marginBottom: '8px' }}>✅ Earn cashback rewards</li>
              <li style={{ marginBottom: '8px' }}>✅ Price alerts & notifications</li>
            </ul>
            <div style={{
              marginTop: '24px',
              padding: '8px 12px',
              background: '#ede9fe',
              color: '#7c3aed',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Perfect for: Commuters, Rideshare Drivers
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            💡 <strong>Not sure?</strong> Start with a personal account. You can always upgrade to fleet management later.
          </p>
        </div>
      </div>
    </div>
  );
}
