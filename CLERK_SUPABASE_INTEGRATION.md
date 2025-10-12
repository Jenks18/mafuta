# 🔐 Clerk + Supabase Integration - Complete Setup Guide

## ✅ What's Been Implemented

This application now has a **clean, working implementation** of:
- ✅ Clerk Authentication (Email + Google OAuth)
- ✅ Supabase Storage (with graceful fallback if not configured)
- ✅ User Profile Management (synced between Clerk and Supabase)
- ✅ Multi-tenant support (Fleet vs Individual accounts)
- ✅ Protected routes with proper redirects

## 📁 Key Files

### Core Authentication & Data
```
src/
├── lib/
│   ├── supabaseClient.js      ← Supabase singleton client
│   └── supabaseAuth.js         ← User sync & profile management
├── hooks/
│   └── useUserData.js          ← Unified hook for user data
└── components/
    ├── auth/
    │   └── ProtectedRoute.jsx  ← Route protection
    └── onboarding/
        ├── OnboardingRouter.jsx     ← Smart onboarding routing
        ├── AccountTypeSelector.jsx  ← Choose Fleet/Individual
        └── FleetOnboarding.jsx      ← Fleet setup flow
```

## 🔄 How It Works

### 1. **Clerk as Primary Source of Truth**
- All authentication handled by Clerk
- User metadata stored in Clerk (`unsafeMetadata`)
- Works even without Supabase configured

### 2. **Supabase as Secondary Storage**
- User profiles synced to Supabase (when configured)
- Stores extended data (company info, settings, etc.)
- Gracefully falls back to Clerk metadata if Supabase unavailable

### 3. **Unified User Data Hook**
```javascript
import { useUserData } from '../hooks/useUserData';

function MyComponent() {
  const { user, profile, isLoaded, isOnboarded, accountType } = useUserData();
  
  // user = Clerk user object
  // profile = Supabase profile OR Clerk metadata fallback
  // isOnboarded = boolean
  // accountType = 'fleet' | 'individual' | null
}
```

## 🚀 Setup Instructions

### Step 1: Environment Variables

Create or update `.env`:

```bash
# Clerk Configuration (REQUIRED)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Supabase Configuration (OPTIONAL - app works without it)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 2: Clerk Dashboard Setup

1. **Go to** https://dashboard.clerk.com
2. **Select your application**
3. **Enable authentication methods:**
   - Email (Email code)
   - Google OAuth
4. **Configure OAuth redirect URLs:**
   ```
   http://localhost:5173/sign-in
   http://localhost:5173/sign-up
   https://your-domain.com/sign-in (production)
   https://your-domain.com/sign-up (production)
   ```

### Step 3: Supabase Setup (Optional)

If you want to use Supabase for data persistence:

1. **Create a Supabase project** at https://app.supabase.com
2. **Run the migration:**
   ```sql
   -- See: supabase/migrations/001_multi_tenant_schema.sql
   ```
3. **Get credentials:**
   - Settings > API > Project URL
   - Settings > API > anon/public key
4. **Add to `.env`**

## 🔐 User Flow

```
1. User signs up/in with Clerk
   ↓
2. Redirected to /onboarding
   ↓
3. OnboardingRouter checks status:
   - No account type? → Account Type Selection
   - Account type selected? → Complete onboarding
   - Fully onboarded? → Redirect to dashboard
   ↓
4. User saved in both:
   - Clerk (unsafeMetadata)
   - Supabase (users table) ← if configured
   ↓
5. Protected routes check:
   - Authenticated? (Clerk)
   - Onboarded? (Clerk + Supabase)
   - Correct account type?
```

## 📊 Data Storage Strategy

### Clerk Metadata (Always)
```javascript
user.unsafeMetadata = {
  accountType: 'fleet' | 'individual',
  onboarded: true/false,
  role: 'owner' | 'manager' | 'driver',
  companyName: 'ABC Logistics' // fleet only
}
```

### Supabase Tables (When Configured)
```sql
-- users table
{
  clerk_user_id: string (primary key),
  email: string,
  full_name: string,
  account_type: 'fleet' | 'individual',
  onboarded: boolean,
  company_id: uuid (for fleet users),
  ...
}

-- fleet_companies table (for fleet accounts)
{
  id: uuid,
  name: string,
  business_type: string,
  fleet_size: string,
  owner_id: uuid (references users.id),
  ...
}
```

## 🧪 Testing

### Test 1: Basic Auth (Clerk Only)
```bash
# Start dev server
npm run dev

# Test flow:
1. Sign up with email
2. Verify you receive email code
3. Complete onboarding
4. Should see dashboard
```

### Test 2: With Supabase
```bash
# Make sure Supabase credentials in .env
npm run dev

# Test flow:
1. Sign up with Google
2. Check Supabase > users table
3. User should be synced
4. Complete onboarding
5. Check fleet_companies table
```

### Test 3: Graceful Fallback
```bash
# Remove Supabase credentials from .env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

npm run dev

# App should still work using Clerk metadata only
```

## 🐛 Troubleshooting

### Issue: "Clerk key not found"
**Solution:** Check `.env` file has `VITE_CLERK_PUBLISHABLE_KEY`

### Issue: "Supabase error"
**Check:**
1. Is Supabase URL and Key correct?
2. Is the database migration run?
3. App should still work (check console for fallback logs)

### Issue: "Infinite redirect loop"
**Check:**
1. User metadata is being saved correctly
2. OnboardingRouter logic (console logs)
3. Clear browser cache/cookies

### Issue: "Build error: useStore not exported"
**Solution:** Check `src/store.jsx` re-exports from `./store/index.js`

## 📝 Key Features

### ✅ Works Offline-First
- Clerk metadata is always available
- Supabase is optional enhancement

### ✅ Type Safety
- User data hook provides consistent interface
- Fallback to Clerk metadata if Supabase fails

### ✅ Multi-Tenant Ready
- Fleet accounts (B2B)
- Individual accounts (B2C)
- Role-based access (Owner, Manager, Driver)

### ✅ Production Ready
- Environment variable validation
- Error handling & logging
- Graceful degradation

## 🚀 Deployment

### Vercel Setup
1. **Add environment variables:**
   ```
   VITE_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   VITE_SUPABASE_URL (optional)
   VITE_SUPABASE_ANON_KEY (optional)
   ```

2. **Configure Clerk OAuth redirects:**
   ```
   https://your-app.vercel.app/sign-in
   https://your-app.vercel.app/sign-up
   ```

3. **Deploy:**
   ```bash
   git push origin main
   ```

## 📚 Next Steps

1. ✅ Auth & Storage - **COMPLETE**
2. 🔄 Implement dashboard pages
3. 🔄 Add vehicle management
4. 🔄 Add transaction tracking
5. 🔄 Add analytics & reporting

## 🆘 Support

- **Clerk Docs:** https://clerk.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Issues:** File an issue if you find bugs

---

**Last Updated:** January 2025
**Status:** ✅ Production Ready
