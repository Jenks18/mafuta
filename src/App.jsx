// MAFUTA MULTI-TENANT APPLICATION
// Supports both Fleet Management (B2B) and Individual Consumers (B2C)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import './App.css'

// Onboarding
import OnboardingRouter from './components/onboarding/OnboardingRouter';
import AccountTypeSelector from './components/onboarding/AccountTypeSelector';
import FleetOnboarding from './components/onboarding/FleetOnboarding';
import IndividualOnboarding from './components/onboarding/IndividualOnboarding';

// Protected Routes
import ProtectedRoute from './components/auth/ProtectedRoute';

// Fleet Layout & Pages (B2B)
import FleetLayout from './components/layout/FleetLayout';
import FleetDashboard from './pages/fleet/FleetDashboard';
import FleetVehiclesPage from './pages/fleet/FleetVehiclesPage';
import FleetTransactionsPage from './pages/fleet/FleetTransactionsPage';

// Individual Pages (B2C) - Your existing pages
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

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Debug logging
console.log('🔍 Clerk Key Check:', {
  keyExists: !!clerkPubKey,
  keyPrefix: clerkPubKey?.substring(0, 15),
  envMode: import.meta.env.MODE
});

function AppRoutes() {
  console.log('📍 AppRoutes rendering...');
  
  return (
    <Routes>
      {/* Public Landing - Redirect based on auth status */}
      <Route 
        path="/" 
        element={
          <>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
            <SignedIn>
              <Navigate to="/onboarding" replace />
            </SignedIn>
          </>
        } 
      />

      {/* Auth Routes */}
      <Route 
        path="/sign-in/*" 
        element={
          <>
            <SignedOut>
              <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
                <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
                <SignIn routing="path" path="/sign-in" afterSignInUrl="/onboarding" signUpUrl="/sign-up" />
              </div>
            </SignedOut>
            <SignedIn>
              <Navigate to="/onboarding" replace />
            </SignedIn>
          </>
        } 
      />
      <Route 
        path="/sign-up/*" 
        element={
          <>
            <SignedOut>
              <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
                <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
                <SignUp routing="path" path="/sign-up" afterSignUpUrl="/onboarding" signInUrl="/sign-in" />
              </div>
            </SignedOut>
            <SignedIn>
              <Navigate to="/onboarding" replace />
            </SignedIn>
          </>
        } 
      />

      {/* Onboarding Routes - Protected */}
      <Route 
        path="/onboarding" 
        element={
          <>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
            <SignedIn>
              <OnboardingRouter />
            </SignedIn>
          </>
        } 
      />
      <Route 
        path="/onboarding/account-type" 
        element={
          <>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
            <SignedIn>
              <AccountTypeSelector />
            </SignedIn>
          </>
        } 
      />
      <Route 
        path="/onboarding/fleet" 
        element={
          <>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
            <SignedIn>
              <FleetOnboarding />
            </SignedIn>
          </>
        } 
      />
      <Route 
        path="/onboarding/individual" 
        element={
          <>
            <SignedOut>
              <Navigate to="/sign-in" replace />
            </SignedOut>
            <SignedIn>
              <IndividualOnboarding />
            </SignedIn>
          </>
        } 
      />

      {/* Fleet Routes (B2B) - Protected */}
      <Route
        path="/fleet/*"
        element={
          <ProtectedRoute accountType="fleet">
            <FleetLayout>
              <Routes>
                <Route path="dashboard" element={<FleetDashboard />} />
                <Route path="vehicles" element={<FleetVehiclesPage />} />
                <Route path="transactions" element={<FleetTransactionsPage />} />
                <Route path="drivers" element={<DriversPage />} />
                <Route path="payroll" element={<PayrollPage />} />
                <Route path="*" element={<Navigate to="/fleet/dashboard" replace />} />
              </Routes>
            </FleetLayout>
          </ProtectedRoute>
        }
      />

      {/* Individual Routes (B2C) - Protected */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute accountType="individual">
            <Layout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="find-fuel" element={<FindFuelPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="rewards" element={<RewardsPage />} />
                <Route path="map" element={<MapPage />} />
                <Route path="more" element={<MorePage />} />
                <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to sign in */}
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

function App() {
  // Debug: Log environment variables
  console.log('🔑 Environment Check:', {
    hasClerkKey: !!clerkPubKey,
    clerkKeyStart: clerkPubKey?.substring(0, 20),
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV
  });

  if (!clerkPubKey) {
    console.error('❌ Missing Clerk Publishable Key');
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={{ color: '#dc2626', marginBottom: '16px' }}>⚠️ Configuration Required</h1>
        <p>Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '16px' }}>
          Check CLERK_CONFIGURATION.md for setup instructions
        </p>
      </div>
    );
  }

  console.log('✅ Clerk key found, initializing provider...');

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      routing="path"
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App
