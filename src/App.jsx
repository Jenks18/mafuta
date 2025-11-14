import { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import './App.css';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import SignInPage from './components/auth/SignInPage';
import SignUpPage from './components/auth/SignUpPage';

// Lazy load pages for code-splitting
const AuthenticatedApp = lazy(() => import('./AuthenticatedApp'));

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
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
      <Routes>
        <Route
          path="/sign-in/*"
          element={<SignInPage />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUpPage />}
        />
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Suspense fallback={<div>Loading...</div>}>
                  <AuthenticatedApp />
                </Suspense>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/*"
          element={
            <SignedIn>
              <Suspense fallback={<div>Loading...</div>}>
                <AuthenticatedApp />
              </Suspense>
            </SignedIn>
          }
        />
      </Routes>
    </ClerkProvider>
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

  return <ClerkProviderWithRoutes />;
}


export default App;
