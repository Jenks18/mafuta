# 🚀 Deployment Guide - Mafuta Multi-Tenant App

## Current Issue: Blank Screen & Build Errors

### ✅ Fixes Applied:
1. **Store Export Fix** - Added re-export in `src/store.jsx`
2. **Environment Variables** - Created `.env` template
3. **Git Ignore** - Added `.env` to `.gitignore`

---

## 🔧 Quick Fix for Local Development

### Option 1: Run Without Authentication (Quick Test)
If you just want to see the UI without setting up Clerk/Supabase:

1. **Temporarily bypass auth** - Comment out Clerk check in `src/App.jsx`:
```jsx
function App() {
  // Comment out this check temporarily
  // if (!clerkPubKey) {
  //   return (
  //     <div style={{ padding: '40px', textAlign: 'center' }}>
  //       <h1>⚠️ Configuration Required</h1>
  //       <p>Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file</p>
  //     </div>
  //   );
  // }

  return (
    // ... rest of app
```

2. **Run dev server**:
```bash
npm run dev
```

### Option 2: Set Up Full Authentication (Recommended)

#### Step 1: Create Clerk Account
1. Go to https://dashboard.clerk.com
2. Sign up / Log in
3. Click "Create Application"
4. Name it "Mafuta" 
5. Enable **Email** and **Google** sign-in
6. Click "Create Application"

#### Step 2: Get Clerk Keys
1. In Clerk Dashboard, go to **API Keys**
2. Copy the **Publishable Key** (starts with `pk_test_`)
3. Open `.env` file in your project
4. Replace `VITE_CLERK_PUBLISHABLE_KEY` value:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

#### Step 3: Configure JWT Template (Important!)
1. In Clerk Dashboard, go to **JWT Templates**
2. Click **New Template**
3. Choose **Blank**
4. Name it: `supabase`
5. Add these claims:
```json
{
  "account_type": "{{user.publicMetadata.accountType}}",
  "onboarded": "{{user.publicMetadata.onboarded}}",
  "role": "{{user.publicMetadata.role}}"
}
```
6. Save the template

#### Step 4: Create Supabase Project
1. Go to https://app.supabase.com
2. Create new project
3. Choose a name, password, and region
4. Wait for project to be ready (~2 minutes)

#### Step 5: Get Supabase Keys
1. In Supabase Dashboard, go to **Settings > API**
2. Copy the **Project URL**
3. Copy the **anon/public** key
4. Update `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Step 6: Run Database Migration
1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire content of `supabase/migrations/001_multi_tenant_schema.sql`
4. Paste and click **Run**
5. You should see "Success" message

#### Step 7: Start Development
```bash
npm run dev
```

---

## 🌐 Vercel Deployment Fix

### Problem:
```
"useStore" is not exported by "src/store.jsx"
```

### Solution (Already Applied):
✅ Updated `src/store.jsx` to re-export from `src/store/index.js`

### Deploy to Vercel:

1. **Push the fixes**:
```bash
git add -A
git commit -m "fix: Add store re-export and environment configuration"
git push origin main
```

2. **Configure Vercel Environment Variables**:
   - Go to your Vercel project dashboard
   - Click **Settings** > **Environment Variables**
   - Add these variables:
     - `VITE_CLERK_PUBLISHABLE_KEY` = (your Clerk key)
     - `VITE_SUPABASE_URL` = (your Supabase URL)
     - `VITE_SUPABASE_ANON_KEY` = (your Supabase key)
   - Click **Save**

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Or just push new code - auto-deploy will trigger

---

## 🎯 Testing the Multi-Tenant System

### Test Fleet Account (B2B):
1. Go to `http://localhost:5173`
2. Click **Sign Up**
3. Sign up with email or Google
4. Choose **Fleet Management**
5. Fill in:
   - Company Name: "Test Fleet Co"
   - Role: Fleet Owner
   - Payment Method: Credit Card
6. You'll be redirected to `/fleet/dashboard`
7. Test pages:
   - Dashboard - View company stats
   - Vehicles - Manage fleet vehicles
   - Drivers - Manage drivers
   - Transactions - Approve fuel purchases

### Test Individual Account (B2C):
1. Open incognito/private window
2. Go to `http://localhost:5173`
3. Sign up with different email
4. Choose **Individual Consumer**
5. Fill in preferences
6. You'll be redirected to `/app/dashboard`
7. Test pages:
   - Find Fuel - Search stations
   - Cards - Digital fuel cards
   - Rewards - Cashback & rewards

---

## 📋 Troubleshooting

### Blank Screen (No Error)
- **Check browser console** (F12) for errors
- **Verify .env file** has valid Clerk key
- **Restart dev server** after changing `.env`

### "Configuration Required" Message
- Clerk key is missing or invalid
- Check `.env` file exists
- Key should start with `pk_test_` or `pk_live_`

### Build Errors
- Run `npm install` to ensure dependencies are installed
- Clear build cache: `rm -rf node_modules/.vite`
- Restart: `npm run dev`

### Auth Not Working
- Check Clerk Dashboard > Applications is active
- Verify JWT template is created
- Check browser allows cookies/localStorage

### Database Errors
- Verify Supabase migration ran successfully
- Check Supabase Dashboard > Table Editor for tables
- Confirm RLS policies are enabled

---

## 🎨 Mobile Testing

### Test Responsive Design:
1. Open app in browser
2. Press **F12** for DevTools
3. Click **Device Toolbar** icon (or Ctrl+Shift+M)
4. Select device:
   - iPhone 12/13/14 (375px)
   - iPad (768px)
   - Desktop (1920px)
5. Test fleet sidebar:
   - Should collapse to hamburger menu on mobile
   - Click hamburger to open sidebar
   - Click outside to close

---

## 📱 Features by Account Type

### Fleet Management (B2B):
- ✅ Company dashboard with metrics
- ✅ Vehicle fleet management
- ✅ Driver management  
- ✅ Fuel transaction approvals
- ✅ Payroll management
- ✅ Role-based permissions
- ✅ Mobile responsive sidebar

### Individual Consumer (B2C):
- ✅ Find nearby fuel stations
- ✅ Compare fuel prices
- ✅ Digital fuel cards
- ✅ Transaction history
- ✅ Rewards & cashback
- ✅ Map view with stations

---

## 🔐 Security Notes

- ✅ `.env` is in `.gitignore` - won't be committed
- ✅ All API keys are environment variables
- ✅ Supabase uses Row Level Security (RLS)
- ✅ Clerk handles authentication securely
- ✅ JWT tokens for API authorization

---

## 📞 Next Steps

1. ✅ Fix store export - **DONE**
2. ⏳ Add Clerk keys to `.env`
3. ⏳ Add Supabase keys to `.env`
4. ⏳ Run database migration
5. ⏳ Test locally
6. ⏳ Deploy to Vercel with env vars
7. ⏳ Test production deployment

---

**Need Help?**
- Clerk Docs: https://clerk.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev

**Your app is ready to go!** Just add the API keys and start testing! 🚀
