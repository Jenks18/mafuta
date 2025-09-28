
import { useState, useEffect } from 'react'
import './App.css'
import { useStore } from './store'
import ConfirmDialog from './components/ConfirmDialog'
import MapView from './components/MapView'
import TransactionsList from './components/TransactionsList'
import CardDetail from './components/CardDetail'
import DriversPage from './components/DriversPage'
import VehiclesPage from './components/VehiclesPage'
import PayrollPage from './components/PayrollPage'

// Import the new modular components
import Layout from './components/layout/Layout'
import HomePage from './components/pages/HomePage'
import FindFuelPage from './components/pages/FindFuelPage'
import TransactionsPage from './components/pages/TransactionsPage'
import CardsPage from './components/pages/CardsPage'
import MorePage from './components/pages/MorePage'
import RewardsPage from './components/pages/RewardsPage'
import MapPage from './components/pages/MapPage'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  // get shared state/actions from the store
  const {
    referralCode, earnings, referrals, pending, joined,
    cards, transactions, contacts, fuelStations,
    contactQuery, setContactQuery,
    qrUrl, shareMessage,
    referUser, generateQr, shareReferral, inviteContact, toggleCardActive,
    addTransaction, removeTransaction, addCard, removeCard, formatCurrency
  } = useStore()

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  const handleConfirm = () => {
    if (!pendingDelete) return setConfirmOpen(false)
    if (pendingDelete.type === 'card') removeCard(pendingDelete.id)
    if (pendingDelete.type === 'tx') removeTransaction(pendingDelete.id)
    setPendingDelete(null)
    setConfirmOpen(false)
  }

  const handleCancel = () => { setPendingDelete(null); setConfirmOpen(false) }

  // Full sidebar nav for desktop (multi-section)
  const sidebarNav = [
    { section: null, items: [
      { key: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-2-2h-3.5" /></svg> },
      { key: 'fuel', label: 'Find Fuel', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.553-1.947l5.447-1.362a2 2 0 01.894 0l5.447 1.362A2 2 0 0121 5.618v9.764a2 2 0 01-1.553 1.947L15 20m-6 0v-8m6 8v-8" /></svg> },
      { key: 'card', label: 'Cards', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H3m18 0a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2v-6a2 2 0 012-2m18 0V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3" /></svg> },
      { key: 'transactions', label: 'Transactions', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" /></svg> },
      { key: 'drivers', label: 'Drivers', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
      { key: 'vehicles', label: 'Vehicles', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13l2-2m0 0l7-7 7 7m-9 2v8m4-8v8" /></svg> },
    ]},
    { section: 'Payroll', items: [
      { key: 'payroll-overview', label: 'Payroll Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h2a2 2 0 004 0h2c0 2.21-1.79 4-4 4z" /></svg> },
      { key: 'payroll-history', label: 'Payroll History', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h2a2 2 0 004 0h2c0 2.21-1.79 4-4 4z" /></svg> },
    ]},
    { section: 'Billing', items: [
      { key: 'statements', label: 'Statements', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
      { key: 'payment-history', label: 'Payment History', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h2a2 2 0 004 0h2c0 2.21-1.79 4-4 4z" /></svg> },
      { key: 'payment-methods', label: 'Payment Methods', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" /></svg> },
      { key: 'manage-api', label: 'Manage API Tokens', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h2a2 2 0 004 0h2c0 2.21-1.79 4-4 4z" /></svg> },
    ]},
    { section: 'Telematics', items: [
      { key: 'connect', label: 'Connect', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1v-4h-1m4 0h-1v-4h-1" /></svg> },
      { key: 'vehicles-cards', label: 'Vehicles / Cards', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13l2-2m0 0l7-7 7 7m-9 2v8m4-8v8" /></svg> },
      { key: 'trucks-map', label: 'Trucks Map', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.553-1.947l5.447-1.362a2 2 0 01.894 0l5.447 1.362A2 2 0 0121 5.618v9.764a2 2 0 01-1.553 1.947L15 20m-6 0v-8m6 8v-8" /></svg> },
    ]},
    { section: 'User', items: [
      { key: 'refer', label: 'Refer & Earn', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> },
      { key: 'support', label: 'Support', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9" /></svg> },
      { key: 'logout', label: 'Log Out', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg> },
    ]},
  ];

  // 5-tab nav for mobile
  const mobileNav = [
    { key: 'home', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-2-2h-3.5" /></svg>
    ), label: 'Home' },
    { key: 'fuel', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.553-1.947l5.447-1.362a2 2 0 01.894 0l5.447 1.362A2 2 0 0121 5.618v9.764a2 2 0 01-1.553 1.947L15 20m-6 0v-8m6 8v-8" /></svg>
    ), label: 'Find Fuel' },
    { key: 'transactions', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z" /></svg>
    ), label: 'Transactions' },
    { key: 'card', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H3m18 0a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2v-6a2 2 0 012-2m18 0V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3" /></svg>
    ), label: 'Cards' },
    { key: 'more', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
    ), label: 'More' },
  ];
  // Find Fuel Page (Map with price markers, styled after screenshots)
  // fuelStations are provided by the shared store
  const FindFuelPage = () => (
    <div className="flex-1 flex flex-col relative">
      <div className="relative flex-1 bg-gray-100">
        {/* Simulated roads/paths */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-300 opacity-60"></div>
          <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-300 opacity-60"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"></div>
        </div>

        {/* Price markers positioned */}
        {fuelStations.map((station, i) => (
          <div key={station.id}
               className="absolute"
               style={{
                 left: ['25%', '45%', '65%', '35%', '55%', '75%'][i] || '50%',
                 top: ['20%', '35%', '25%', '50%', '65%', '45%'][i] || '40%'
               }}>
            <div className="flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white border border-gray-300 rounded-lg px-2 py-1 shadow-lg flex items-center gap-1 text-xs">
                <span className="font-bold text-emerald-700">${station.price.toFixed(2)}</span>
              </div>
              <div className="w-1 h-3 bg-emerald-600 rounded-b-full"></div>
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            </div>
          </div>
        ))}

        {/* Current location marker */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
        </div>

        {/* Search bar overlay */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Salt Lake City, UT"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-md text-sm font-medium"
                defaultValue="Salt Lake City, UT"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button className="px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:bg-emerald-700 transition-colors">
              Route
            </button>
          </div>
        </div>
      </div>

      {/* Bottom sheet with station details */}
      <div className="bg-white rounded-t-3xl shadow-lg border-t border-gray-200 p-4" style={{ marginTop: 'auto' }}>
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        {/* Featured station */}
        <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-800">EVgo</h3>
              <p className="text-sm text-gray-600">0.6 mi away</p>
              <p className="text-xs text-green-600 font-medium">OFFER AVAILABLE</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-700">$0.25/kWh</p>
              <p className="text-xs text-gray-500">CHARGING</p>
            </div>
          </div>
          <button className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            Charge at this station
          </button>
          <button className="w-full text-gray-600 font-medium py-2 text-sm hover:text-gray-800 transition-colors">
            See other options
          </button>
        </div>
      </div>
    </div>
  )

  // Home Page (placeholder)
  const HomePage = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-3xl">M</span>
        </div>
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">Welcome to MafutaPass</h1>
        <p className="text-gray-600 mb-4">Your all-in-one fuel management platform</p>
      </div>
    </div>
  )

  // Transactions Page - list + add
  const TransactionsPage = () => (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-emerald-700">Transactions</h1>
        <div className="bg-white p-4 rounded-xl shadow">
          <TransactionForm onAdd={(tx) => addTransaction(tx)} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <th></th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td><button className="btn btn-xs btn-ghost" onClick={() => { setPendingDelete({ type: 'tx', id: t.id }); setConfirmOpen(true) }}>Delete</button></td>
                  <td>{t.date}</td>
                  <td>{t.desc}</td>
                  <td>{formatCurrency(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  // Map Page (placeholder)
  const MapPage = () => (
    <MapView stations={fuelStations} />
  )

  // More Page (placeholder)
  const MorePage = () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-emerald-700">More</h1>
        <DriversPage drivers={contacts} />
        <VehiclesPage vehicles={[{ vin: '1HGCM82633A004352', make: 'Toyota', model: 'Hiace' }]} />
        <PayrollPage />
      </div>
    </div>
  )

  // Cards Page - properly aligned and responsive
  const CardsPage = () => {
    return (
      <div className="flex-1 overflow-y-auto">
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
          <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
        </div>

        {/* Content Container - full width */}
        <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
          <div className="w-full px-4 md:px-6 lg:px-8 py-6">
            
            {/* Header with Order Cards button and search - Mobile responsive */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg w-full sm:w-auto">
                  Order Cards
                </button>
                
                <div className="relative w-full sm:max-w-sm">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Last 4 digits"
                    className="w-full pl-11 pr-4 py-3 bg-white/80 border border-emerald-200/50 rounded-xl text-gray-700 placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-1 w-full sm:w-fit">
                <button className="flex-1 sm:flex-initial px-4 py-2 text-emerald-700 font-medium bg-white rounded-lg shadow-sm">
                  All Cards
                </button>
                <button className="flex-1 sm:flex-initial px-4 py-2 text-emerald-600 font-medium hover:bg-white/50 rounded-lg transition-colors">
                  Active
                </button>
                <button className="flex-1 sm:flex-initial px-4 py-2 text-emerald-600 font-medium hover:bg-white/50 rounded-lg transition-colors">
                  Inactive
                </button>
              </div>
            </div>

            {/* Cards Table - Responsive */}
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl shadow-lg overflow-hidden w-full">
              
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-emerald-100/50">
                  {cards.map((card) => (
                  <div key={card.id} className="p-4 hover:bg-emerald-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500" />
                        <span className="font-mono font-semibold text-gray-900">{card.id}</span>
                      </div>
                      <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                        card.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {card.status}
                      </span>
                    </div>
                      <div className="flex items-center gap-2 ml-7 justify-between">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        card.avatar === 'loading' ? 'bg-gray-400' : 'bg-emerald-500'
                      }`}>
                        {card.avatar === 'loading' ? (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
            <span className="text-gray-700 text-sm">{card.assignedTo}</span>
                    </div>
          </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                {/* Table Header */}
                <div className="bg-emerald-50/80 border-b border-emerald-200/50 px-6 py-4">
                  <div className="grid grid-cols-4 gap-6 text-sm font-semibold text-emerald-700">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500" />
                      <span>Card Number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                    <div>Assigned To</div>
                    <div></div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-emerald-100/50">
                  {cards.map((card) => (
                    <div key={card.id} className="px-6 py-4 hover:bg-emerald-50/50 transition-colors">
                      <div className="grid grid-cols-4 gap-6 items-center">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500" />
                          <span className="font-mono text-gray-900 font-medium">{card.id}</span>
                        </div>
                        <div>
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                            card.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {card.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            card.avatar === 'loading' ? 'bg-gray-400' : 'bg-emerald-500'
                          }`}>
                            {card.avatar === 'loading' ? (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className="text-gray-700 font-medium">{card.assignedTo}</span>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // small card detail at right side for mobile/desktop
  const CardDetailPanel = ({ selectedId }) => {
    const card = cards.find(c => c.id === selectedId) || cards[0]
    return <CardDetail card={card} onToggle={toggleCardActive} onRemove={(id) => { setPendingDelete({type:'card', id}); setConfirmOpen(true) }} />
  }

  // Rewards Page (Our Referral Page) - with green gradient theme
  const RewardsPage = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
        <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
      </div>

      {/* Content Container - full width for desktop, centered mobile layout */}
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
            
            <button onClick={handleRefer} className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg">
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

          {/* Contact sections */}
          <div className="space-y-6">
            {/* Section 4 */}
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">4</h3>
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">411 & More</h4>
                    <p className="text-emerald-600">411</p>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors">Get bonus</button>
                </div>
              </div>
            </div>

            {/* Section A */}
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">A</h3>
              <div className="space-y-2">
                {/* Additional contacts would go here */}
                <div className="space-y-2">
                  {contacts.filter(c => c.name.toLowerCase().includes(contactQuery.toLowerCase())).map(c => (
                    <div key={c.id} className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-3 shadow-md flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.phone}</div>
                      </div>
                      <button onClick={() => { setContactQuery(''); inviteContact(c); }} className="text-emerald-600 hover:text-emerald-700 font-bold text-sm transition-colors">Invite</button>
                    </div>
                  ))}
                  {contacts.filter(c => c.name.toLowerCase().includes(contactQuery.toLowerCase())).length === 0 && (
                    <div className="bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-3 shadow-md">
                      <p className="text-gray-500 text-center text-sm">No contacts match your search</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )

  // Responsive layout: full sidebar for md+, 5-tab nav for mobile
  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">MafutaPass</h1>
              <p className="text-sm text-gray-600">Fuel Management Platform</p>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          {sidebarNav.map((section, idx) => (
            <div key={idx} className="mb-2">
              {section.section && <div className="text-xs text-gray-700 font-semibold mb-1 ml-2 mt-4">{section.section}</div>}
              {section.items.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.key ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.key && (item.key === 'rewards' || item.key === 'refer') && (
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          ))}
          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Earnings</span>
                <span className="font-semibold text-emerald-600">{formatCurrency(earnings)}</span>
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
        <div className="p-4 border-t border-gray-200">
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Render the correct page */}
  {activeTab === 'home' && <HomePage />}
  {activeTab === 'fuel' && <FindFuelPage />}
  {activeTab === 'transactions' && <TransactionsPage />}
  {activeTab === 'card' && <CardsPage />}
  {activeTab === 'map' && <MapPage />}
  {activeTab === 'more' && <MorePage />}
  {activeTab === 'rewards' && <RewardsPage />}
  {activeTab === 'dashboard' && <HomePage />}
  {activeTab === 'drivers' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Drivers Page</div>}
  {activeTab === 'vehicles' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Vehicles Page</div>}
  {activeTab === 'payroll-overview' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Payroll Overview Page</div>}
  {activeTab === 'payroll-history' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Payroll History Page</div>}
  {activeTab === 'statements' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Statements Page</div>}
  {activeTab === 'payment-history' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Payment History Page</div>}
  {activeTab === 'payment-methods' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Payment Methods Page</div>}
  {activeTab === 'manage-api' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Manage API Tokens Page</div>}
  {activeTab === 'connect' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Connect Page</div>}
  {activeTab === 'vehicles-cards' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Vehicles / Cards Page</div>}
  {activeTab === 'trucks-map' && <MapPage />}
  {activeTab === 'refer' && <RewardsPage />}
  {activeTab === 'support' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Support Page</div>}
  {activeTab === 'logout' && <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Logging out...</div>}

        {/* Bottom Navigation (mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 shadow-lg">
          {mobileNav.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center px-2 py-1 rounded-lg transition-all ${activeTab === item.key ? 'text-emerald-600' : 'text-gray-500'}`}
            >
              {item.icon}
              <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
            </button>
          ))}
        </nav>
        {confirmOpen && (
          <ConfirmDialog
            open={confirmOpen}
            title="Confirm deletion"
            message="Are you sure you want to delete this item?"
            onConfirm={handleConfirm}
            onCancel={() => setConfirmOpen(false)}
          />
        )}
      </main>
    </div>
  )
}

export default App

function TransactionForm({ onAdd }){
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  return (
    <div className="flex gap-2">
      <input className="input input-sm" value={date} onChange={e=>setDate(e.target.value)} />
      <input className="input input-sm" placeholder="desc" value={desc} onChange={e=>setDesc(e.target.value)} />
      <input className="input input-sm" placeholder="amount" value={amount} onChange={e=>setAmount(e.target.value)} />
      <button className="btn btn-sm" onClick={() => {
        const a = parseFloat(amount) || 0
        onAdd({ date, desc, amount: a })
        setDesc('')
        setAmount('')
      }}>Add</button>
    </div>
  )
}
