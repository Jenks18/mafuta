import { useState, useEffect, lazy, Suspense } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useStore } from './store';
import ConfirmDialog from './components/ConfirmDialog';
import Layout from './components/layout/Layout';

// Lazy load pages
const DashboardPage = lazy(() => import('./components/pages/DashboardPage'));
const FindFuelPage = lazy(() => import('./components/pages/FindFuelPage'));
const TransactionsPage = lazy(() => import('./components/pages/TransactionsPage'));
const CardsPage = lazy(() => import('./components/pages/CardsPage'));
const MorePage = lazy(() => import('./components/pages/MorePage'));
const RewardsPage = lazy(() => import('./components/pages/RewardsPage'));
const WalletPage = lazy(() => import('./components/pages/WalletPage'));
const MapPage = lazy(() => import('./components/pages/MapPage'));
const DriversPage = lazy(() => import('./components/DriversPage'));
const VehiclesPage = lazy(() => import('./components/VehiclesPage'));
const PayrollPage = lazy(() => import('./components/PayrollPage'));
const PayrollHistoryPage = lazy(() => import('./components/pages/PayrollHistoryPage'));

function AuthenticatedApp() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { removeTransaction, removeCard, initializeData } = useStore();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  
  useEffect(() => {
    if (isLoaded && user && !dataInitialized) {
      const loadData = () => {
        initializeData().then(() => {
          setDataInitialized(true);
        });
      };
      
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadData, { timeout: 2000 });
      } else {
        setTimeout(loadData, 100);
      }
    }
  }, [isLoaded, user, dataInitialized, initializeData]);

  const handleConfirm = () => {
    if (!pendingDelete) return setConfirmOpen(false);
    if (pendingDelete.type === 'card') removeCard(pendingDelete.id);
    if (pendingDelete.type === 'tx') removeTransaction(pendingDelete.id);
    setPendingDelete(null);
    setConfirmOpen(false);
  };

  const handleCancel = () => { 
    setPendingDelete(null);
    setConfirmOpen(false);
  };

  useEffect(() => {
    const onNavigate = (e) => {
      const key = e?.detail;
      if (typeof key === 'string') {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveTab(key);
          setIsTransitioning(false);
        }, 50);
      }
    };
    window.addEventListener('app:navigate', onNavigate);
    return () => window.removeEventListener('app:navigate', onNavigate);
  }, []);

  const renderPage = () => {
    const greenBg = "flex-1 overflow-y-auto relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full";
    
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return <DashboardPage />;
      case 'fuel':
        return (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <FindFuelPage />
          </div>
        );
      case 'transactions':
        return <TransactionsPage />;
      case 'card':
      case 'cards':
        return <CardsPage />;
      case 'map':
      case 'trucks-map':
        return <MapPage />;
      case 'more':
        return <MorePage />;
      case 'rewards':
      case 'refer':
        return <RewardsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'drivers':
        return (
          <div className={greenBg}>
            <div className="p-6"><DriversPage /></div>
          </div>
        );
      case 'vehicles':
        return (
          <div className={greenBg}>
            <div className="p-6"><VehiclesPage /></div>
          </div>
        );
      case 'payroll-overview':
        return (
          <div className={greenBg}>
            <div className="p-6"><PayrollPage /></div>
          </div>
        );
      case 'payroll-history':
        return (
          <div className={greenBg}>
            <div className="p-6"><PayrollHistoryPage /></div>
          </div>
        );
      case 'profile':
        return (
          <div className={greenBg}>
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
                <p className="text-gray-600">Profile settings coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'statements':
        return (
          <div className={greenBg}>
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Statements</h2>
                <p className="text-gray-600">Billing statements coming soon...</p>
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className={greenBg}>
            <div className="p-6">
              <div className="bg-white rounded-xl shadow-sm border border-emerald-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Support</h2>
                <p className="text-gray-600">Support center coming soon...</p>
              </div>
            </div>
          </div>
        );
      default:
        return <DashboardPage />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⛽</div>
          <h2 className="text-2xl font-bold text-emerald-700">Mafuta</h2>
          <p className="text-emerald-600 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
          <div className="text-emerald-600 flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <div>Loading page...</div>
          </div>
        </div>
      }>
        {isTransitioning ? (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
            <div className="text-emerald-600">Switching page...</div>
          </div>
        ) : (
          renderPage()
        )}
      </Suspense>
      
      <ConfirmDialog 
        open={confirmOpen}
        message={pendingDelete?.message || 'Are you sure?'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Layout>
  );
}

export default AuthenticatedApp;
