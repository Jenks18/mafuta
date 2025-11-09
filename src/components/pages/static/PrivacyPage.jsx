import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/home" className="flex items-center gap-3">
              <img src="/logos/mafutapass-icon-only.svg" alt="MafutaPass" className="h-10 w-10" />
              <span className="text-2xl font-bold text-emerald-600">MafutaPass</span>
            </a>
            <div className="flex items-center gap-4">
              <a href="/home" className="text-gray-600 hover:text-emerald-600 transition">Back to Home</a>
              <a href="#/sign-in" className="text-emerald-600 hover:text-emerald-700 font-medium transition">Sign In</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: November 9, 2025</p>

          {/* PDF Embed */}
          <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">View Full Privacy Policy</h2>
              <a 
                href="/privacy-policy.pdf" 
                download 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Download PDF
              </a>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden" style={{ height: '800px' }}>
              <iframe 
                src="/privacy-policy.pdf" 
                className="w-full h-full"
                title="Privacy Policy"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy Summary</h2>
            
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 mb-6">
              <h3 className="font-bold text-emerald-900 mb-2">What We Collect</h3>
              <p className="text-gray-700">
                We collect information you provide when you create an account, make transactions, and use our services. 
                This includes your name, email, phone number, and fuel purchase history.
              </p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 mb-6">
              <h3 className="font-bold text-emerald-900 mb-2">How We Use Your Data</h3>
              <p className="text-gray-700">
                We use your information to provide our services, track your fuel spending, find you the best prices, 
                and improve your experience with MafutaPass.
              </p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 mb-6">
              <h3 className="font-bold text-emerald-900 mb-2">Your Rights</h3>
              <p className="text-gray-700">
                You have the right to access, correct, or delete your personal information at any time. 
                You can also opt out of marketing communications.
              </p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 mb-6">
              <h3 className="font-bold text-emerald-900 mb-2">Data Security</h3>
              <p className="text-gray-700">
                We use industry-standard security measures to protect your data. All transactions are encrypted 
                and we never share your personal information without your consent.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Questions About Privacy?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about our privacy practices, please contact us at:
            </p>
            <a href="mailto:privacy@mafutapass.com" className="text-emerald-600 hover:text-emerald-700 font-medium">
              privacy@mafutapass.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logos/mafutapass-icon-only.svg" alt="MafutaPass" className="h-8 w-8" />
            <span className="text-xl font-bold">MafutaPass</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">© 2025 MafutaPass. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/home" className="text-gray-400 hover:text-white transition">Home</a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-white transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;