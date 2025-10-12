# 🚨 URGENT: Fix Clerk Authentication Errors

## Current Errors You're Seeing:

1. **"Failed to fetch"** - Magic link not working
2. **Google redirects to Supabase** - Wrong OAuth configuration

---

## ✅ FIX NOW - Step by Step

### Step 1: Open Clerk Dashboard
1. Go to: https://dashboard.clerk.com
2. Click on your **"Mafuta"** application (or the app using your Clerk key)

### Step 2: Fix Application URLs
1. In left sidebar, click **"Paths"**
2. Under **"Application URLs"**, add:
   - Application name: `Mafuta`
   - Home URL: `http://localhost:5174`
   - Sign-in URL: `http://localhost:5174/sign-in`
   - Sign-up URL: `http://localhost:5174/sign-up`
   - After sign-in URL: `http://localhost:5174/onboarding`
   - After sign-up URL: `http://localhost:5174/onboarding`
3. Click **"Save changes"**

### Step 3: Enable & Configure Email
1. In left sidebar, go to **"User & Authentication"** → **"Email, Phone, Username"**
2. Make sure **Email address** is **ENABLED** and set to **Required**
3. Under **"Authentication strategies"**:
   - ✅ Enable **"Email verification link"**
   - ✅ Enable **"Email verification code"** 
4. Click **"Save"**

### Step 4: Enable & Configure Google OAuth
1. Go to **"User & Authentication"** → **"Social Connections"**
2. Find **"Google"** in the list
3. Toggle it **ON**
4. Select **"Use Clerk's development keys"** (for testing)
5. Click **"Save"**

### Step 5: Configure Redirect URLs (CRITICAL!)
1. Still in **"Social Connections"**
2. Click on **"Google"** to expand settings
3. Under **"Authorized redirect URIs"**, make sure it shows:
   - `http://localhost:5174/sign-in/sso-callback`
   - `http://localhost:5174/sign-up/sso-callback`
4. If not, click **"Add redirect URI"** and add them
5. Click **"Save"**

### Step 6: Remove Any Supabase Configuration
1. In Clerk Dashboard, search for "Supabase" in settings
2. If you see any Supabase integrations, **DISABLE** them
3. Your app uses Clerk for auth, not Supabase Auth

---

## 🧪 Test After Configuration

### Test Email Magic Link:
1. Refresh http://localhost:5174/
2. Enter your email: `foronjenga19@gmail.com`
3. Click **"Send magic link"**
4. Check your email
5. Click the link
6. ✅ Should redirect to `/onboarding`

### Test Google Sign In:
1. Refresh http://localhost:5174/
2. Click **"Continue with Google"**
3. Select Google account
4. ✅ Should redirect to `/onboarding` (NOT Supabase!)

---

## 🔧 If Still Not Working

### Clear Browser Cache:
```
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
```

### Check Console for Errors:
```
1. Open DevTools (F12)
2. Click "Console" tab
3. Look for red errors
4. Share them if you still have issues
```

---

## 📋 Checklist - Do This In Order:

- [ ] Step 1: Open Clerk Dashboard
- [ ] Step 2: Set Application URLs (home, sign-in, sign-up)
- [ ] Step 3: Enable Email verification
- [ ] Step 4: Enable Google with Clerk's dev keys
- [ ] Step 5: Add redirect URIs for Google
- [ ] Step 6: Disable any Supabase auth integration
- [ ] Clear browser cache
- [ ] Test email magic link
- [ ] Test Google sign-in

---

## ⚠️ Important Notes:

1. **DO NOT** use Supabase for authentication
2. **USE** Clerk for ALL authentication (email, Google, etc.)
3. Supabase is ONLY for database storage
4. The redirect to Supabase means Google OAuth is misconfigured in Clerk

---

**Complete these steps in Clerk Dashboard, then refresh your app and try again!**

After you complete these steps, both email and Google auth will work perfectly.
