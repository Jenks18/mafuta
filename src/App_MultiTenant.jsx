import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';

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
import Layout from './components/layout/Layout';
import DashboardPage from './components/pages/DashboardPage';
import FindFuelPage from './components/pages/FindFuelPage';
import TransactionsPage from './components/pages/TransactionsPage';
import CardsPage from './components/pages/CardsPage';
import RewardsPage from './components/pages/RewardsPage';
import MorePage from './components/pages/MorePage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route 
        path="/sign-in/*" 
        element={<SignIn routing="path" path="/sign-in" afterSignInUrl="/onboarding" />} 
      />
      <Route 
        path="/sign-up/*" 
        element={<SignUp routing="path" path="/sign-up" afterSignUpUrl="/onboarding" />} 
      />

      {/* Onboarding Routes */}
      <Route path="/onboarding" element={<OnboardingRouter />} />
      <Route path="/onboarding/account-type" element={<AccountTypeSelector />} />
      <Route path="/onboarding/fleet" element={<FleetOnboarding />} />
      <Route path="/onboarding/individual" element={<IndividualOnboarding />} />

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
                {/* Add more fleet routes here later */}
              </Routes>
            </FleetLayout>
          </ProtectedRoute>
        }
      />

      {/* Individual Routes (B2C) - Protected */}
      <Route
        path="/*"
        element={
          <ProtectedRoute accountType="individual">
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/find-fuel" element={<FindFuelPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/cards" element={<CardsPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/more" element={<MorePage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
