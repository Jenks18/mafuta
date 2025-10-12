# Mafuta Multi-Tenant Setup - Quick Start

## 🎯 Overview
Mafuta now supports **two customer types**:
- **Fleet Management (B2B)**: Companies managing vehicle fleets (like AtoB Fuel)
- **Individual Consumers (B2C)**: Single users finding fuel deals (like Upside)

## 📱 Features
- ✅ Mobile & Desktop Responsive
- ✅ Clerk Authentication (Google, Email)
- ✅ Supabase Database with Row Level Security
- ✅ Multi-tenant architecture
- ✅ Role-based permissions
- ✅ Onboarding flows for both account types

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root (copy from `.env.local`):

```env
# Clerk - Get from https://dashboard.clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Supabase - Get from https://app.supabase.com
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Mapbox (optional)
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN_HERE
```

### 3. Setup Supabase Database
Run the migration script:
```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
npx supabase db push
```

Or manually run the SQL in `supabase/migrations/001_multi_tenant_schema.sql` in Supabase SQL Editor.

### 4. Configure Clerk
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable Email and Google OAuth
4. In **JWT Templates**, create a template named "supabase":
   - Add custom claims:
   ```json
   {
     "account_type": "{{user.publicMetadata.accountType}}",
     "onboarded": "{{user.publicMetadata.onboarded}}",
     "role": "{{user.publicMetadata.role}}"
   }
   ```
5. Copy the Publishable Key to `.env`

### 5. Start Development Server
```bash
npm run dev
```

## 🏗️ Architecture

### Routes
- `/sign-in`, `/sign-up` - Authentication
- `/onboarding` - Smart routing based on user state
- `/fleet/*` - Fleet management pages (B2B)
- `/app/*` - Individual consumer pages (B2C)

### Fleet Routes (Protected)
- `/fleet/dashboard` - Company overview
- `/fleet/vehicles` - Vehicle management
- `/fleet/drivers` - Driver management
- `/fleet/transactions` - Fuel purchase approvals
- `/fleet/payroll` - Payroll management

### Individual Routes (Protected)
- `/app/dashboard` - Personal dashboard
- `/app/find-fuel` - Find fuel stations
- `/app/cards` - Manage digital cards
- `/app/transactions` - Transaction history
- `/app/rewards` - Rewards & cashback

## 👥 User Roles

### Fleet Roles (B2B)
- `fleet_owner` - Full access
- `fleet_admin` - Admin access
- `fleet_manager` - Manage vehicles & drivers
- `fleet_accountant` - Financial management
- `fleet_driver` - View own data only

### Individual Roles (B2C)
- `individual_user` - Standard user
- `individual_premium` - Premium features
- `individual_business` - Business account

## 🔒 Permissions
Defined in `src/config/userTypes.js`:
- `canAddVehicle`, `canEditVehicle`, `canDeleteVehicle`
- `canManageDrivers`, `canApprovePurchase`
- `canAccessReports`, `canManageSettings`

## 📁 Key Files

### Configuration
- `src/App.jsx` - Main multi-tenant router
- `src/config/userTypes.js` - Roles & permissions
- `src/lib/supabaseAuth.js` - Auth helpers

### Components
- `src/components/onboarding/` - Onboarding flows
- `src/components/auth/ProtectedRoute.jsx` - Route guards
- `src/components/layout/FleetLayout.jsx` - Fleet sidebar (mobile responsive)

### Pages
- `src/pages/fleet/` - Fleet management pages
- `src/components/pages/` - Individual consumer pages

### Database
- `supabase/migrations/001_multi_tenant_schema.sql` - Complete schema

## 🎨 Mobile Responsiveness
All fleet pages are mobile-responsive with:
- Collapsible sidebar (desktop) / hamburger menu (mobile)
- Responsive grids (1 column mobile, 2-3 columns desktop)
- Touch-friendly buttons and forms
- Optimized typography for small screens

## 🧪 Testing

### Test Fleet Account
1. Sign up with email
2. Choose "Fleet Management"
3. Complete onboarding (company name, role, billing)
4. Access `/fleet/dashboard`

### Test Individual Account
1. Sign up with email
2. Choose "Individual Consumer"
3. Complete onboarding (preferences, vehicle info)
4. Access `/app/dashboard`

## 📚 Documentation
- `MULTI_TENANT_AUTH_GUIDE.md` - Complete authentication guide
- `MULTI_TENANT_IMPLEMENTATION.md` - Implementation details
- `ARCHITECTURE_DIAGRAMS.md` - System architecture
- `QUICK_START_GUIDE.md` - Detailed setup guide
- `EXECUTIVE_SUMMARY.md` - Business overview

## 🛠️ Development

### Add New Fleet Page
```jsx
// src/pages/fleet/MyNewPage.jsx
import { useUser } from '@clerk/clerk-react';
import { hasFleetPermission } from '../../config/userTypes';

export default function MyNewPage() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  
  if (!hasFleetPermission(userRole, 'canAccessReports')) {
    return <div>Access Denied</div>;
  }
  
  return <div className="p-4 lg:p-6">My New Page</div>;
}
```

Then add to `src/App.jsx`:
```jsx
<Route path="my-page" element={<MyNewPage />} />
```

### Database Queries
```jsx
import { useAuthenticatedSupabase } from '../../lib/supabaseAuth';

export default function MyComponent() {
  const supabase = useAuthenticatedSupabase();
  
  // Query with RLS applied automatically
  const { data, error } = await supabase
    .from('vehicles')
    .select('*');
}
```

## 🚨 Troubleshooting

### "Configuration Required" Message
- Make sure `.env` exists with valid Clerk keys
- Restart dev server after adding `.env`

### Auth Not Working
- Check Clerk dashboard for correct OAuth providers
- Verify JWT template is configured
- Check browser console for errors

### Database Errors
- Verify Supabase migrations ran successfully
- Check RLS policies are enabled
- Confirm user has proper metadata in Clerk

## 📦 Dependencies
- React 19 + Vite 5
- Clerk (Auth)
- Supabase (Database)
- React Router 7
- Tailwind CSS + DaisyUI
- Lucide React (Icons)
- Mapbox GL (Maps)
- Zustand (State)

## 🔄 What's Changed
- ✅ App.jsx now uses React Router instead of tab state
- ✅ Removed old Suspense/lazy loading (for cleaner routing)
- ✅ Added Clerk authentication
- ✅ Added Supabase RLS database
- ✅ Created fleet management pages
- ✅ Added mobile responsive layouts
- ✅ Implemented multi-tenant architecture

## 📞 Support
For issues or questions:
1. Check documentation in root directory
2. Review `MULTI_TENANT_AUTH_GUIDE.md`
3. Check Clerk Dashboard for auth issues
4. Check Supabase Dashboard for database issues

---

**Ready to go!** Start with `npm run dev` and visit `http://localhost:5173`
