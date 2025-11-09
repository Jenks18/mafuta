import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const DeleteAccountPage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirmed) {
      alert('Please confirm that you want to delete your account');
      return;
    }

    setDeleting(true);
    
    try {
      // Delete user from Clerk
      await user.delete();
      
      // Sign out and redirect
      await signOut();
      window.location.href = '/home';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please contact support at support@mafutapass.com');
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">You must be signed in to delete your account.</p>
          <a href="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-4">
      {/* Navigation */}
      <nav className="max-w-4xl mx-auto mb-8 pt-4">
        <a href="/" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to App
        </a>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delete Account</h1>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8 rounded">
            <h3 className="font-bold text-red-900 mb-2">⚠️ Warning: Permanent Deletion</h3>
            <p className="text-red-800 mb-4">
              Deleting your account will permanently remove:
            </p>
            <ul className="list-disc list-inside text-red-800 space-y-2 mb-4">
              <li>Your profile and account information</li>
              <li>All transaction history</li>
              <li>Fuel cards and payment methods</li>
              <li>Rewards and referral credits</li>
              <li>Vehicle and driver data (if applicable)</li>
            </ul>
            <p className="text-red-800 font-semibold">
              This action is irreversible. Your data cannot be recovered once deleted.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">Current Account Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-sm text-gray-900">{user.id}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
            <h3 className="font-bold text-blue-900 mb-2">💡 Alternative Options</h3>
            <p className="text-blue-800 mb-4">
              Before deleting your account, consider these alternatives:
            </p>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li><strong>Export your data:</strong> Contact support@mafutapass.com to request a copy of your data</li>
              <li><strong>Deactivate temporarily:</strong> Sign out and don't use the app for a while</li>
              <li><strong>Remove payment methods:</strong> Delete cards while keeping your account</li>
              <li><strong>Contact support:</strong> Reach out if you're experiencing issues</li>
            </ul>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="confirm-delete"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <label htmlFor="confirm-delete" className="text-gray-900 select-none cursor-pointer">
                I understand that deleting my account is permanent and cannot be undone. 
                All my data will be permanently deleted from MafutaPass.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDeleteAccount}
                disabled={!confirmed || deleting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                  confirmed && !deleting
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {deleting ? 'Deleting Account...' : 'Delete My Account Permanently'}
              </button>
              
              <a
                href="/"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition text-center"
              >
                Cancel & Go Back
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Need help? Contact us at <a href="mailto:support@mafutapass.com" className="text-emerald-600 hover:text-emerald-700 font-medium">support@mafutapass.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
