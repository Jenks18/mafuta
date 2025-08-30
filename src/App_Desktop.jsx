import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('rewards')
  const [referralCode] = useState('IAN27625')
  const [earnings] = useState('$247.50')
  const [referrals] = useState(12)

  // Find Fuel Page
  const FindFuelPage = () => (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Find Fuel Stations</h1>
            <p className="text-gray-600">Locate nearby fuel stations and check availability</p>
          </div>
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
  <div className="relative w-full">
          <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search for gas stations..."
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="p-6">
        {/* Map placeholder */}
        <div className="h-96 bg-gradient-to-b from-emerald-50 to-green-100 relative rounded-xl mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mb-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-600 font-medium">Finding nearby fuel stations...</p>
            </div>
          </div>
        </div>

        {/* Station list */}
        <div className="grid gap-4">
          {[
            { name: "Shell Westlands", distance: "0.8 km", price: "KES 165/L", status: "Open 24/7" },
            { name: "Total Kilimani", distance: "1.2 km", price: "KES 163/L", status: "Open until 10 PM" },
            { name: "Kenol Ngong Road", distance: "1.5 km", price: "KES 164/L", status: "Open 24/7" },
            { name: "Mobil Karen", distance: "2.1 km", price: "KES 166/L", status: "Open until 9 PM" }
          ].map((station, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{station.name}</h3>
                  <p className="text-sm text-gray-600">{station.distance} away</p>
                  <p className="text-sm text-emerald-600 font-medium">{station.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">{station.price}</p>
                  <button className="btn-modern text-sm px-4 py-2 mt-2">Navigate</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Cards Page
  const CardsPage = () => (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Fuel Cards</h1>
            <p className="text-gray-600">Manage your fuel cards and track usage</p>
          </div>
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex gap-4">
          <button className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-lg font-medium">Order Cards</button>
          <div className="relative flex-1 w-full">
            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search by last 4 digits"
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex gap-8">
              <button className="pb-2 border-b-2 border-emerald-500 text-emerald-600 font-medium">All Cards</button>
              <button className="pb-2 text-gray-500">Active</button>
              <button className="pb-2 text-gray-500">Inactive</button>
            </div>
          </div>

          {/* Cards list */}
          <div className="px-6 py-3 border-b border-gray-100 flex justify-between text-sm text-gray-600 font-medium">
            <span>Card Number</span>
            <span>Status</span>
            <span>Assigned To</span>
            <span>Actions</span>
          </div>
          
          {[
            { number: "0403", status: "ACTIVE", assigned: "Ian Jenkins", active: true },
            { number: "4081", status: "ACTIVE", assigned: "Lucy Wanjiku", active: true },
            { number: "4737", status: "INACTIVE", assigned: "Anthony Murage", active: false },
            { number: "2447", status: "INACTIVE", assigned: "Ian Jenkins", active: false },
            { number: "5366", status: "INACTIVE", assigned: "Charles Mwangi", active: false },
            { number: "0333", status: "INACTIVE", assigned: "Lucy Wanjiku", active: false },
            { number: "2045", status: "INACTIVE", assigned: "Anthony Murage", active: false }
          ].map((card, i) => (
            <div key={i} className="px-6 py-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-gray-800 font-medium">****{card.number}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                card.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {card.status}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-emerald-600 font-medium">{card.assigned.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <span className="text-sm text-gray-600">{card.assigned}</span>
              </div>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Manage</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Rewards Page (Enhanced for Desktop)
  const RewardsPage = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-green-200/15 rounded-full blur-3xl floating-card"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-200/15 to-emerald-200/10 rounded-full blur-3xl floating-card" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-gray-200 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rewards & Referrals</h1>
            <p className="text-gray-600">Share MafutaPass and earn rewards together</p>
          </div>
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
          </svg>
        </div>
      </div>

      {/* Rewards Content */}
      <div className="warm-gradient-bg min-h-full">
        <div className="px-6 pt-8 pb-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4 leading-tight">
              Refer and Earn
            </h2>
            <p className="text-gray-700 text-lg font-medium leading-relaxed">
              Share the love, earn rewards together. Invite friends to MafutaPass and both of you get rewarded!
            </p>
          </div>

          <div className="w-full grid lg:grid-cols-2 gap-8">
            {/* Earnings Overview */}
            <div className="glass-card rounded-2xl p-8 warm-shadow glow-effect">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Your Earnings</h3>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Earnings</span>
                  <span className="text-3xl font-bold gradient-text">{earnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Referrals</span>
                  <span className="text-2xl font-bold text-emerald-600">{referrals}</span>
                </div>
                <div className="pt-4 border-t border-emerald-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">This Month</span>
                    <span className="text-lg font-bold text-emerald-600">+$47.50</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="glass-card rounded-2xl p-8 warm-shadow glow-effect">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Your Referral Code</h3>
                
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 mb-6">
                  <div className="text-3xl font-mono font-bold gradient-text mb-2">{referralCode}</div>
                  <p className="text-sm text-gray-600">Share this code with friends</p>
                </div>

                <div className="space-y-3">
                  <button className="btn-modern w-full">
                    Copy Code
                  </button>
                  <button className="w-full px-6 py-3 bg-white border-2 border-emerald-200 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all">
                    Share Link
                  </button>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-8 warm-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">How It Works</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Share Your Code</h4>
                  <p className="text-gray-600 text-sm">Send your unique referral code to friends and family</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">They Sign Up</h4>
                  <p className="text-gray-600 text-sm">Your friends join MafutaPass using your code</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Earn Together</h4>
                  <p className="text-gray-600 text-sm">Both you and your friend receive rewards!</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-8 warm-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Referral Activity</h3>
              
              <div className="space-y-4">
                {[
                  { name: "Lucy Wanjiku", date: "2 days ago", reward: "$15.00" },
                  { name: "Anthony Murage", date: "1 week ago", reward: "$15.00" },
                  { name: "Charles Mwangi", date: "2 weeks ago", reward: "$15.00" },
                  { name: "Grace Njeri", date: "3 weeks ago", reward: "$15.00" }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {activity.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.name}</p>
                        <p className="text-sm text-gray-600">Joined {activity.date}</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">{activity.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/90 backdrop-blur-xl border-r border-emerald-100 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">MafutaPass</h1>
              <p className="text-sm text-emerald-600">Fuel Management Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('fuel')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'fuel' 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.84 0 1.58-.41 2.03-1.03L19.77 7.23zM9.5 11.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM18 13.5H6V6h12v7.5z"/>
              </svg>
              <span className="font-medium">Find Fuel Stations</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('card')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'card' 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              <span className="font-medium">Fuel Cards</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('rewards')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                activeTab === 'rewards' 
                  ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="font-medium">Rewards & Referrals</span>
              {activeTab === 'rewards' && (
                <div className="absolute right-4 w-2 h-2 bg-emerald-500 rounded-full"></div>
              )}
            </button>
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Earnings</span>
                <span className="font-semibold text-emerald-600">{earnings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Referrals</span>
                <span className="font-semibold text-emerald-600">{referrals}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Referral Code</span>
                <span className="font-mono font-semibold text-emerald-600">{referralCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">IJ</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Ian Jenkins</p>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content based on active tab */}
        {activeTab === 'fuel' && <FindFuelPage />}
        {activeTab === 'card' && <CardsPage />}
        {activeTab === 'rewards' && <RewardsPage />}
      </div>
    </div>
  )
}

export default App
