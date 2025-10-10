import { useState, useEffect } from 'react'
import './App.css'
import { useStore } from './store'
import ConfirmDialog from './components/ConfirmDialog'

// Import the new modular components
import Layout from './components/layout/Layout'
import HomePage from './components/pages/HomePage'
import FindFuelPage from './components/pages/FindFuelPage'
import TransactionsPage from './components/pages/TransactionsPage'
import CardsPage from './components/pages/CardsPage'
import MorePage from './components/pages/MorePage'
import RewardsPage from './components/pages/RewardsPage'
import MapPage from './components/pages/MapPage'
import DriversPage from './components/pages/DriversPage'
import VehiclesPage from './components/pages/VehiclesPage'
import PayrollPage from './components/pages/PayrollPage'
import DashboardPage from './components/pages/DashboardPage'
 
function App() {
  const [activeTab, setActiveTab] = useState('home')
  
  // Get shared state/actions from the store
  const {
    removeTransaction, removeCard
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

  const handleCancel = () => { 
    setPendingDelete(null)
    setConfirmOpen(false) 
  }

  // Page renderer function
  const renderPage = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return <DashboardPage />
      case 'fuel':
        return <FindFuelPage />
      case 'transactions':
        return <TransactionsPage />
      case 'card':
      case 'cards':
        return <CardsPage />
      case 'map':
      case 'trucks-map':
        return <MapPage />
      case 'more':
        return <MorePage />
      case 'rewards':
      case 'refer':
        return <RewardsPage />
      case 'drivers':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="p-6"><DriversPage /></div>
            </div>
          </div>
        )
      case 'vehicles':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="p-6"><VehiclesPage /></div>
            </div>
          </div>
        )
      case 'payroll-overview':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="p-6"><PayrollPage /></div>
            </div>
          </div>
        )
      case 'payroll-history':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="p-6"><PayrollPage /></div>
            </div>
          </div>
        )
      case 'statements':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Statements - Coming Soon</div>
            </div>
          </div>
        )
      case 'payment-history':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Payment History - Coming Soon</div>
            </div>
          </div>
        )
      case 'payment-methods':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Payment Methods - Coming Soon</div>
            </div>
          </div>
        )
      case 'manage-api':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">API Tokens - Coming Soon</div>
            </div>
          </div>
        )
      case 'connect':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Connect - Coming Soon</div>
            </div>
          </div>
        )
      case 'vehicles-cards':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Vehicles/Cards - Coming Soon</div>
            </div>
          </div>
        )
      case 'support':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Support - Coming Soon</div>
            </div>
          </div>
        )
      case 'logout':
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
              <div className="flex-1 flex items-center justify-center text-2xl text-gray-500">Logging out...</div>
            </div>
          </div>
        )
      default:
        return <HomePage />
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderPage()}
      
      {/* Confirm Dialog */}
      {confirmOpen && (
        <ConfirmDialog
          open={confirmOpen}
          title="Confirm deletion"
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </Layout>
  )
}

export default App
