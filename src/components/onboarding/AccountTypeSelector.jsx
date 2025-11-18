import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_TYPES } from '../../config/userTypes';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

/**
 * Account Type Selection - First step after signup
 */
export default function AccountTypeSelector() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelect = async (accountType) => {
    // Check if user is loaded
    if (!isLoaded || !user) {
      console.error('User not loaded yet');
      alert('Please wait a moment and try again.');
      return;
    }

    // For now, only support Fleet Management
    if (accountType !== ACCOUNT_TYPES.FLEET) {
      alert('Personal account coming soon! Please select Fleet Management for now.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('📝 Saving account type...', { accountType });
      
      // 1. Save to Clerk metadata (primary source of truth)
      await user.update({
        unsafeMetadata: {
          accountType,
          onboarded: false, // Will be set to true after completing onboarding
        }
      });

      console.log('✅ Clerk metadata updated');

      // 2. Save to Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from('users')
            .update({
              account_type: accountType,
              updated_at: new Date().toISOString()
            })
            .eq('clerk_id', user.id);

          if (error) {
            console.warn('⚠️ Supabase update failed:', error);
          } else {
            console.log('✅ Supabase updated');
          }
        } catch (supabaseError) {
          console.warn('⚠️ Supabase not available:', supabaseError);
        }
      }
      
      // Route to fleet onboarding
      navigate('/onboarding/fleet');
    } catch (error) {
      console.error('❌ Error selecting account type:', error);
      alert('Something went wrong: ' + (error.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
      <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-200/25 to-green-200/15 rounded-full blur-2xl"></div>

      <div className="relative z-10 bg-white rounded-3xl p-8 md:p-12 max-w-4xl w-full shadow-2xl border border-emerald-100">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-3">
            Welcome to Mafuta! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's set up your account. What best describes you?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Fleet Option */}
          <div
            onClick={() => !loading && handleSelect(ACCOUNT_TYPES.FLEET)}
            className={`group border-2 border-emerald-200 hover:border-emerald-500 rounded-2xl p-8 transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/50 hover:shadow-xl hover:-translate-y-1 ${
              loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'
            }`}
          >
            <div className="text-5xl mb-4 text-center">
              🚛
            </div>
            <h2 className="text-2xl font-bold text-emerald-700 mb-3 text-center">
              Fleet Management
            </h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-center">
              For businesses managing multiple vehicles
            </p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Manage 10-500+ vehicles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Driver & manager accounts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Fuel transaction approval</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Fleet analytics & reports</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Spending limits & controls</span>
              </li>
            </ul>
            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-xs font-semibold text-center">
              {loading ? 'Setting up...' : 'Perfect for: Logistics, Delivery, Trucking'}
            </div>
          </div>

          {/* Personal Option - Coming Soon */}
          <div className="relative border-2 border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-white to-gray-50/50 opacity-60 cursor-not-allowed">
            {/* Coming Soon Badge */}
            <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              COMING SOON
            </div>
            
            <div className="text-5xl mb-4 text-center grayscale">
              🚗
            </div>
            <h2 className="text-2xl font-bold text-gray-600 mb-3 text-center">
              Personal Account
            </h2>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed text-center">
              For individual drivers and personal use
            </p>
            <ul className="space-y-2 text-sm text-gray-500 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">✓</span>
                <span>Digital fuel cards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">✓</span>
                <span>Find cheapest fuel nearby</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">✓</span>
                <span>Track spending & MPG</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">✓</span>
                <span>Earn cashback rewards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 font-bold">✓</span>
                <span>Price alerts & notifications</span>
              </li>
            </ul>
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-semibold text-center">
              Perfect for: Commuters, Rideshare Drivers
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
          <p className="text-sm text-emerald-800">
            💡 <strong>Not sure?</strong> Start with Fleet Management to access all features now!
          </p>
        </div>
      </div>
    </div>
  );
}
