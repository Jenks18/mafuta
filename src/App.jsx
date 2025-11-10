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
const WalletPage = lazy(() => import('./components/pages/WalletPage'));
const MapPage = lazy(() => import('./components/pages/MapPage'));
const DriversPage = lazy(() => import('./components/DriversPage'));
const VehiclesPage = lazy(() => import('./components/VehiclesPage'));
const PayrollPage = lazy(() => import('./components/PayrollPage'));
const PayrollHistoryPage = lazy(() => import('./components/pages/PayrollHistoryPage'));
const DashboardPage = lazy(() => import('./components/pages/DashboardPage'));

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthenticatedApp() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Get shared state/actions from the store
  const { removeTransaction, removeCard, initializeData } = useStore();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  
  // Initialize all data from Supabase on mount - only once per session
  useEffect(() => {
    if (isLoaded && user && !dataInitialized) {
      // Use requestIdleCallback to defer heavy data loading
      const loadData = () => {
        initializeData().then(() => {
          setDataInitialized(true);
        });
      };
      
      if ('requestIdleCallback' in window) {
        // @ts-ignore
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

  // Allow child pages to navigate by dispatching CustomEvent
  useEffect(() => {
    const onNavigate = (e) => {
      const key = e?.detail;
      if (typeof key === 'string') {
        // Add brief transition state for visual feedback
        setIsTransitioning(true);
        // Use setTimeout to ensure state updates before heavy page loads
        setTimeout(() => {
          setActiveTab(key);
          setIsTransitioning(false);
        }, 50);
      }
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

function App() {
  const [authMode, setAuthMode] = useState('sign-in');

  // Listen for hash changes to switch between sign-in and sign-up
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/sign-up') {
        setAuthMode('sign-up');
      } else {
        setAuthMode('sign-in');
      }
    };
    
    // Set initial mode
    handleHashChange();
    
    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
          colorTextOnPrimaryBackground: '#ffffff',
          colorTextSecondary: '#6b7280',
          colorSuccess: '#10b981',
          colorDanger: '#ef4444',
          colorWarning: '#10b981', // Changed from orange to green
          colorNeutral: '#f3f4f6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '16px',
          borderRadius: '0.75rem',
        },
        elements: {
          // Root card styling
          rootBox: 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100',
          card: 'shadow-2xl rounded-2xl border border-emerald-200 bg-white',
          
          // Header
          headerTitle: 'text-emerald-700 font-bold text-2xl',
          headerSubtitle: 'text-emerald-600 text-base',
          
          // Logo
          logoImage: 'h-12 w-12',
          logoBox: 'h-16 w-16 mb-4',
          
          // Form elements
          formButtonPrimary: 
            'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg',
          formButtonReset: 'text-emerald-600 hover:text-emerald-700',
          
          // Input fields
          formFieldInput: 
            'border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg px-4 py-2 transition-all',
          formFieldLabel: 'text-gray-700 font-medium text-sm mb-1',
          formFieldInputShowPasswordButton: 'text-emerald-600 hover:text-emerald-700',
          
          // Social buttons (Google, etc.)
          socialButtonsBlockButton: 
            'border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg transition-all duration-200',
          socialButtonsBlockButtonText: 'text-gray-700 font-medium',
          socialButtonsIconButton: 'border-emerald-200 hover:bg-emerald-50',
          
          // Divider
          dividerLine: 'bg-emerald-200',
          dividerText: 'text-gray-500 text-sm',
          
          // Footer
          footer: 'bg-transparent',
          footerActionText: 'text-gray-600',
          footerActionLink: 'text-emerald-600 hover:text-emerald-700 font-semibold',
          footerAction: 'text-gray-600',
          footerPages: 'bg-transparent',
          footerPageLink: 'text-emerald-600 hover:text-emerald-700',
          
          // Alerts and notifications
          alertText: 'text-sm text-emerald-700',
          alert: 'bg-emerald-50 border-emerald-200',
          
          // Identity preview (user info)
          identityPreviewText: 'text-gray-700',
          identityPreviewEditButton: 'text-emerald-600 hover:text-emerald-700',
          identityPreviewEditButtonIcon: 'text-emerald-600',
          
          // Navigation
          navbarButton: 'text-gray-700 hover:text-emerald-600',
          navbarButtonIcon: 'text-emerald-600',
          
          // Buttons
          button: 'rounded-lg font-medium transition-all duration-200',
          buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg',
          buttonArrowIcon: 'text-emerald-600',
          
          // Organization switcher
          organizationSwitcherTrigger: 'border-2 border-emerald-200 hover:border-emerald-300',
          organizationSwitcherTriggerIcon: 'text-emerald-600',
          
          // User button
          userButtonPopoverCard: 'shadow-2xl border border-emerald-200',
          userButtonPopoverActionButton: 'hover:bg-emerald-50',
          userButtonPopoverActionButtonText: 'text-gray-700',
          userButtonPopoverActionButtonIcon: 'text-emerald-600',
          
          // Modal
          modalBackdrop: 'bg-black/50',
          modalContent: 'bg-white shadow-2xl rounded-2xl border border-emerald-200',
          modalCloseButton: 'text-gray-500 hover:text-emerald-600',
          
          // Badge - Hide development mode badge
          badge: 'hidden',
          
          // Verification
          otpCodeFieldInput: 'border-2 border-emerald-200 focus:border-emerald-500',
          
          // Links
          link: 'text-emerald-600 hover:text-emerald-700 font-medium',
          
          // Form fields
          formFieldAction: 'text-emerald-600 hover:text-emerald-700',
          formFieldHintText: 'text-gray-500',
          formFieldSuccessText: 'text-emerald-600',
          formFieldErrorText: 'text-red-600',
          formFieldWarningText: 'text-emerald-600',
          
          // Form field rows
          formFieldRow: 'gap-2',
          
          // Main container
          main: 'bg-white rounded-2xl',
          
          // Internal card
          __internal_cardBox: 'shadow-2xl rounded-2xl border border-emerald-200 bg-white',
          
          // Profile section
          profileSection: 'border-t border-emerald-100',
          profileSectionTitle: 'text-emerald-700 font-semibold',
          profileSectionContent: 'text-gray-700',
          profileSectionPrimaryButton: 'text-emerald-600 hover:text-emerald-700',
          
          // Page scrollbox
          pageScrollBox: 'bg-white',
          
          // Accordion
          accordionTriggerButton: 'text-emerald-600 hover:text-emerald-700',
          accordionContent: 'text-gray-700',
          
          // Avatar
          avatarBox: 'border-2 border-emerald-200',
          avatarImage: 'rounded-full',
          
          // Menu
          menuButton: 'hover:bg-emerald-50',
          menuItem: 'hover:bg-emerald-50',
          menuList: 'border border-emerald-200 rounded-lg',
          
          // Table
          tableHead: 'bg-emerald-50',
          
          // Tabs
          tabButton: 'text-gray-600 hover:text-emerald-600 data-[state=active]:text-emerald-600 data-[state=active]:border-emerald-600',
          tabPanel: 'text-gray-700',
          tabListContainer: 'border-b border-emerald-100',
        },
        layout: {
          socialButtonsPlacement: 'top',
          socialButtonsVariant: 'blockButton',
          logoPlacement: 'none',
          showOptionalFields: true,
          termsPageUrl: '/terms',
          privacyPageUrl: '/privacy',
        },
      }}
    >
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden p-4">
          {/* Floating background elements */}
          <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
          <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-200/25 to-green-200/15 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-6">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img 
                  src="/logos/mafutapass-icon-only.svg" 
                  alt="MafutaPass Logo" 
                  className="w-20 h-20"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-6xl">⛽</div>';
                  }}
                />
              </div>
              <h1 className="text-4xl font-bold text-emerald-700 mb-2">MafutaPass</h1>
              <p className="text-emerald-600 text-lg">Your Fuel Management Platform</p>
            </div>
            
            {/* Conditionally render SignIn or SignUp based on hash */}
            {authMode === 'sign-up' ? (
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'w-full shadow-2xl',
                  }
                }}
                forceRedirectUrl="/"
                signInUrl="/"
                routing="hash"
                signInForceRedirectUrl="/"
                afterSignUpUrl="/"
              />
            ) : (
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'w-full shadow-2xl',
                  }
                }}
                forceRedirectUrl="/"
                signUpUrl="/#/sign-up"
                routing="hash"
                signUpForceRedirectUrl="/"
                afterSignInUrl="/"
              />
            )}
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
