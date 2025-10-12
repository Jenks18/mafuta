# 🎯 Multi-Tenant Implementation Guide

## ✅ What We've Built

### 1. **Database Schema** (`supabase/migrations/001_multi_tenant_schema.sql`)
   - ✅ Unified `users` table for both fleet and individual
   - ✅ `fleet_companies` table for B2B customers
   - ✅ `vehicles`, `trips`, `maintenance_records` for fleet
   - ✅ `individual_cards`, `rewards` for consumers
   - ✅ Shared `fuel_transactions` table
   - ✅ Row Level Security (RLS) policies for complete data isolation

### 2. **User Roles & Permissions** (`src/config/userTypes.js`)
   - ✅ Account types: `FLEET` vs `INDIVIDUAL`
   - ✅ Fleet roles: admin, manager, driver, accountant, dispatcher
   - ✅ Individual roles: consumer, premium, business
   - ✅ Permission helpers for both types

### 3. **Onboarding Flow**
   - ✅ `AccountTypeSelector.jsx` - User picks fleet vs individual
   - ✅ `FleetOnboarding.jsx` - Multi-step B2B onboarding (company info, role, billing)
   - ✅ `IndividualOnboarding.jsx` - B2C onboarding (preferences, vehicle, plan)
   - ✅ `OnboardingRouter.jsx` - Smart routing based on onboarding state

### 4. **Authentication Integration**
   - ✅ Clerk for authentication
   - ✅ Supabase for authorization (RLS)
   - ✅ JWT token flow between Clerk → Supabase
   - ✅ `useAuthenticatedSupabase()` hook

### 5. **Fleet Dashboard** (`src/pages/fleet/FleetDashboard.jsx`)
   - ✅ Company overview with stats
   - ✅ Vehicle, driver, transaction counts
   - ✅ Monthly spending analytics
   - ✅ Pending approval notifications
   - ✅ Recent transactions table

### 6. **Protected Routes**
   - ✅ Account type validation
   - ✅ Automatic redirect to correct dashboard
   - ✅ Onboarding gate

---

## 🚀 Next Steps to Complete

### Phase 1: Setup Environment (15 min)

1. **Add Clerk to your project:**
   ```bash
   npm install @clerk/clerk-react
   ```

2. **Create `.env` file:**
   ```env
   # Clerk
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   
   # Supabase
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

3. **Configure Clerk JWT Template:**
   - Go to Clerk Dashboard → JWT Templates
   - Create template named `supabase`
   - Add claims:
     ```json
     {
       "sub": "{{user.id}}",
       "email": "{{user.primary_email_address}}",
       "role": "{{user.public_metadata.role}}",
       "account_type": "{{user.public_metadata.accountType}}"
     }
     ```

### Phase 2: Run Database Migration (10 min)

1. **Initialize Supabase:**
   ```bash
   npx supabase init
   ```

2. **Apply migration:**
   ```bash
   npx supabase db push
   ```
   
   Or copy SQL from `supabase/migrations/001_multi_tenant_schema.sql` and run in Supabase SQL Editor.

3. **Verify tables created:**
   - Check `fleet_companies`, `users`, `vehicles`, etc. exist

### Phase 3: Switch to New App Router (5 min)

Replace your current `App.jsx`:

```jsx
// Rename current App.jsx
// mv src/App.jsx src/App_Old.jsx

// Rename new multi-tenant version
// mv src/App_MultiTenant.jsx src/App.jsx
```

Or manually update `src/main.jsx` to use `App_MultiTenant.jsx`.

### Phase 4: Test Complete Flow (20 min)

1. **Sign Up Flow:**
   - Go to `/sign-up`
   - Create account
   - Select "Fleet Management"
   - Complete onboarding
   - See fleet dashboard

2. **Test Individual Flow:**
   - Sign up again (different email)
   - Select "Personal Account"
   - Complete onboarding
   - See consumer dashboard

3. **Test Data Isolation:**
   - Create 2 fleet companies
   - Add vehicles to each
   - Verify company A cannot see company B's data

---

## 📚 How to Add Fleet Features

### Add Vehicle Management Page

```jsx
// src/pages/fleet/VehiclesPage.jsx
import { useState, useEffect } from 'react';
import { useAuthenticatedSupabase } from '../../lib/supabaseAuth';
import { hasFleetPermission } from '../../config/userTypes';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  
  useEffect(() => {
    async function fetchVehicles() {
      const supabase = useAuthenticatedSupabase();
      const { data } = await supabase
        .from('vehicles')
        .select('*, assigned_driver:users(first_name, last_name)')
        .order('vehicle_number');
      setVehicles(data || []);
    }
    fetchVehicles();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1>Vehicles</h1>
      {/* Vehicle list/grid */}
    </div>
  );
}
```

Then add route:
```jsx
// In App.jsx
<Route path="fleet/vehicles" element={<VehiclesPage />} />
```

### Add Driver Management

```jsx
// src/pages/fleet/DriversPage.jsx
export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  
  useEffect(() => {
    async function fetchDrivers() {
      const supabase = useAuthenticatedSupabase();
      const { data } = await supabase
        .from('users')
        .select('*, assigned_vehicle:vehicles(vehicle_number)')
        .eq('role', 'driver')
        .order('last_name');
      setDrivers(data || []);
    }
    fetchDrivers();
  }, []);

  return (
    <div>
      {/* Driver management UI */}
    </div>
  );
}
```

---

## 🔐 Permission System Usage

```jsx
import { hasFleetPermission } from '../config/userTypes';
import { useUser } from '@clerk/clerk-react';

function MyComponent() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;

  return (
    <>
      {hasFleetPermission(userRole, 'canAddVehicle') && (
        <button>Add Vehicle</button>
      )}
      
      {hasFleetPermission(userRole, 'canApprovePurchase') && (
        <button>Approve Transaction</button>
      )}
    </>
  );
}
```

---

## 🎨 UI Components You Can Reuse

All your existing components work for **Individual** accounts:
- ✅ `FindFuelPage` - Station finder
- ✅ `CardsPage` - Digital cards
- ✅ `TransactionsPage` - Fuel history
- ✅ `RewardsPage` - Cashback & rewards

For **Fleet** accounts, create new components:
- 🚧 `FleetVehiclesPage`
- 🚧 `FleetDriversPage`
- 🚧 `FleetTransactionsPage` (with approval workflow)
- 🚧 `FleetReportsPage`

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property 'account_type' of null"
**Solution:** User hasn't completed onboarding. Check `OnboardingRouter` redirect.

### Issue: RLS blocking queries
**Solution:** Verify Clerk JWT template includes `sub` claim and Supabase function `current_user_clerk_id()` works.

### Issue: Wrong dashboard after login
**Solution:** `ProtectedRoute` checks account type and redirects. Verify user metadata saved correctly.

### Issue: Vehicles not showing for driver
**Solution:** Check vehicle `assigned_driver_id` matches user's ID and RLS policy allows driver to see assigned vehicle.

---

## 📊 Sample Data for Testing

**Fleet Company:**
```sql
INSERT INTO fleet_companies (name, business_type, created_by, plan)
VALUES ('Test Logistics Inc', 'logistics', 'user_clerk_id', 'professional');
```

**Fleet User:**
```sql
INSERT INTO users (clerk_id, email, first_name, last_name, account_type, role, company_id)
VALUES ('user_clerk_id', 'admin@test.com', 'John', 'Admin', 'fleet', 'fleet_admin', 'company_uuid');
```

**Vehicle:**
```sql
INSERT INTO vehicles (company_id, vehicle_number, make, model, year, status)
VALUES ('company_uuid', 'TRK-001', 'Ford', 'F-150', 2022, 'active');
```

---

## 🎯 Success Checklist

- [ ] Clerk integrated and signup works
- [ ] Supabase tables created
- [ ] RLS policies active
- [ ] Account type selector appears after signup
- [ ] Fleet onboarding saves company + user
- [ ] Individual onboarding saves user + card
- [ ] Fleet users see fleet dashboard
- [ ] Individual users see consumer dashboard
- [ ] Data isolated between companies
- [ ] Permissions enforce correctly
- [ ] JWT flow Clerk → Supabase working

---

## 🚀 Future Enhancements

1. **Fleet Features:**
   - [ ] GPS tracking integration
   - [ ] Fuel card API (WEX, Fleet One)
   - [ ] Route optimization
   - [ ] Maintenance scheduling
   - [ ] Driver safety scores

2. **Individual Features:**
   - [ ] Premium subscription (Stripe)
   - [ ] Fuel price alerts
   - [ ] Loyalty program
   - [ ] Receipt scanning (OCR)
   - [ ] Carbon footprint tracking

3. **Shared Features:**
   - [ ] Mobile apps (React Native)
   - [ ] SMS notifications
   - [ ] Email reports
   - [ ] API for third-party integrations

---

## 💡 Key Architectural Decisions

1. **Why single `users` table?**
   - Simplifies auth lookup
   - `account_type` discriminator handles routing
   - Clerk user ID → Supabase user always 1:1

2. **Why Clerk + Supabase (not just Supabase Auth)?**
   - Clerk: Better UI, webhooks, organizations
   - Supabase: RLS is perfect for multi-tenant data isolation
   - Best of both worlds

3. **Why separate onboarding pages?**
   - Fleet needs company info (tax ID, fleet size)
   - Individual needs preferences (vehicle, interests)
   - Different UX requirements

4. **Why shared `fuel_transactions` table?**
   - Both types record fuel purchases
   - Account type + RLS policies handle access
   - Easier analytics across all users

---

**Ready to launch! 🎉** Follow the Next Steps above and you'll have a working multi-tenant fuel platform supporting both fleet management companies and individual consumers.
