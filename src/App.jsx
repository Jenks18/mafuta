import { useState, useEffect, lazy, Suspense } from 'react';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import './App.css';
import { useStore } from './store';
import ConfirmDialog from './components/ConfirmDialog';

// Layout
import Layout from './components/layout/Layout';

// Lazy load pages for code-splitting
const HomePage = lazy(() => import('./components/pages/HomePage'));
const FindFuelPage = lazy(() => import('./components/pages/FindFuelPage'));
const TransactionsPage = lazy(() => import('./components/pages/TransactionsPage'));
const CardsPage = lazy(() => import('./components/pages/CardsPage'));
const MorePage = lazy(() => import('./components/pages/MorePage'));
const RewardsPage = lazy(() => import('./components/pages/RewardsPage'));
const MapPage = lazy(() => import('./components/pages/MapPage'));
const DriversPage = lazy(() => import('./components/DriversPage'));
const VehiclesPage = lazy(() => import('./components/VehiclesPage'));
const PayrollPage = lazy(() => import('./components/PayrollPage'));
const DashboardPage = lazy(() => import('./components/pages/DashboardPage'));

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthenticatedApp() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Get shared state/actions from the store
  const { removeTransaction, removeCard } = useStore();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

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

  // Allow child pages to navigate by dispatching CustomEvent
  useEffect(() => {
    const onNavigate = (e) => {
      const key = e?.detail;
      if (typeof key === 'string') setActiveTab(key);
    };
    window.addEventListener('app:navigate', onNavigate);
    return () => window.removeEventListener('app:navigate', onNavigate);
  }, []);

  // Page renderer with green theming
  const renderPage = () => {
    const greenBg = "flex-1 overflow-y-auto relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full";
    
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return <DashboardPage />;
      case 'fuel':
        return <FindFuelPage />;
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
      case 'payroll-history':
        return (
          <div className={greenBg}>
            <div className="p-6"><PayrollPage /></div>
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
          <div className="text-emerald-600">Loading...</div>
        </div>
      }>
        {renderPage()}
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

function App() {

  if (!clerkPubKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h1>
          <p className="text-gray-700 mb-2">Please add your Clerk Publishable Key to the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:</p>
          <div className="bg-gray-50 p-4 rounded-lg text-left text-sm mb-4">
            <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
          </div>
          <p className="text-sm text-gray-600">Check <code className="bg-gray-100 px-1 rounded">CLERK_SUPABASE_INTEGRATION.md</code> for setup instructions.</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: '#10b981', // Emerald green
          colorBackground: '#ffffff',
          colorText: '#1f2937',
        },
        elements: {
          formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700',
          card: 'shadow-2xl',
          headerTitle: 'text-emerald-700',
          headerSubtitle: 'text-emerald-600',
          socialButtonsBlockButton: 'border-emerald-200 hover:bg-emerald-50',
          formFieldInput: 'border-emerald-200 focus:border-emerald-500',
        }
      }}
    >
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
          {/* Floating background elements */}
          <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
          <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-200/25 to-green-200/15 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⛽</div>
              <h1 className="text-4xl font-bold text-emerald-700 mb-2">Mafuta</h1>
              <p className="text-emerald-600">Your Fuel Management Platform</p>
            </div>
            
            <SignIn 
              routing="hash"
              signUpUrl="#/sign-up"
              afterSignInUrl="#/"
            />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <AuthenticatedApp />
      </SignedIn>
    </ClerkProvider>
  );
}

export default App;
