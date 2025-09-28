import React from 'react';
import { useStore } from '../../store';

const RewardsPage = () => {
  const {
    referralCode, earnings, referrals, pending, joined,
    contactQuery, setContactQuery,
    qrUrl, shareMessage,
    referUser, generateQr, shareReferral, inviteContact, formatCurrency
  } = useStore();

  const handleRefer = () => {
    referUser();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
        <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
        <div className="max-w-md mx-auto md:max-w-none md:mx-0 px-4 md:px-8 py-6 pb-24 md:pb-8">
        
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">Refer and Earn</h1>
          </div>

          {/* Single column layout for all screen sizes */}
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Main reward card */}
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">You and a friend both get rewards</h2>
                
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    You and a friend both get an extra{" "}
                    <span className="font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">15¢/gal cash back</span>{" "}
                    on gas and an extra{" "}
                    <span className="font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">10% cash back</span>{" "}
                    on restaurants or grocery.
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm mb-6">
                  Plus, you'll get 10¢ every time they use Upside.
                </p>
              </div>
              
              <button 
                onClick={handleRefer} 
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg"
              >
                Refer and earn
              </button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                *One-time use for each bonus, per referral.{" "}
                <button className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                  Details.
                </button>
              </p>
            </div>

            {/* Share tools */}
            <div className="grid grid-cols-2 gap-4">
              {/* QR Code */}
              <div className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-sm font-semibold text-emerald-700 mb-3">Share QR</p>
                  <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center shadow-md">
                    <div className="grid grid-cols-4 gap-0.5">
                      {Array.from({length: 16}).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 ${i % 3 === 0 ? 'bg-emerald-800' : i % 2 === 0 ? 'bg-emerald-600' : 'bg-emerald-300'}`}></div>
                      ))}
                    </div>
                  </div>
                  <button onClick={generateQr} className="text-sm text-emerald-700 font-medium hover:text-emerald-800 transition-colors">
                    GENERATE QR
                  </button>
                  {qrUrl && <p className="text-xs text-gray-500 mt-1 break-all">{qrUrl}</p>}
                </div>
              </div>

              {/* Invite code */}
              <div className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
                <div className="text-center">
                  <p className="text-sm font-semibold text-emerald-700 mb-1">Invite code</p>
                  <p className="text-xl font-bold text-gray-900 mb-3">{referralCode}</p>
                  <button onClick={shareReferral} className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all shadow-md">
                    Share
                  </button>
                  {shareMessage && <p className="text-xs text-emerald-600 mt-2">{shareMessage}</p>}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
                <div className="text-sm font-bold text-emerald-700 mb-1">Referral earnings</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(earnings)}</div>
                <div className="text-xs text-emerald-500">▶</div>
              </div>
              
              <div className="text-center bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
                <div className="text-sm font-bold text-emerald-700 mb-1">Pending</div>
                <div className="text-2xl font-bold text-gray-900">{pending}</div>
                <div className="text-xs text-emerald-500">▶</div>
              </div>
              
              <div className="text-center bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
                <div className="text-sm font-bold text-emerald-700 mb-1">Joined</div>
                <div className="text-2xl font-bold text-gray-900">{joined}</div>
                <div className="text-xs text-emerald-500">▶</div>
              </div>
            </div>

            {/* Contact search */}
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
              <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  value={contactQuery}
                  onChange={(e) => setContactQuery(e.target.value)}
                  placeholder="Search your contacts."
                  className="w-full pl-11 pr-4 py-3 bg-white/60 border border-emerald-200/50 rounded-xl text-gray-700 placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Contact sections - simplified for now */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">411 & More</h4>
                    <p className="text-emerald-600">411</p>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors">
                    Get bonus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
