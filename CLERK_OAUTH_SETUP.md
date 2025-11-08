# 🔐 Clerk OAuth Setup for Android App

## The Problem
When using OAuth (Google Sign-In, etc.) in a mobile app that loads from a web URL, Clerk needs to redirect back to your domain, not localhost.

## ✅ Current Configuration

Your app now loads from: **https://mafutapass.com**

## 🔧 Configure Clerk Dashboard

### 1. Go to Clerk Dashboard
https://dashboard.clerk.com

### 2. Select Your Application
- Click on your app (the one using `pk_test_cGxlYXNhbnQtbWFsbGFyZC05NS5jbGVyay5hY2NvdW50cy5kZXYk`)

### 3. Configure OAuth Redirect URLs

Navigate to: **Configure → Paths**

Add these URLs to **Authorized redirect URIs**:

```
https://mafutapass.com
https://mafutapass.com/*
https://mafutapass.com/oauth-callback
```

### 4. Configure Allowed Origins

Navigate to: **Configure → Restrictions**

Add to **Allowed origins**:
```
https://mafutapass.com
capacitor://localhost
capacitor://mafutapass.com
```

### 5. Enable OAuth Providers

Navigate to: **User & Authentication → Social Connections**

Enable:
- ✅ Google
- ✅ GitHub (optional)
- ✅ Apple (optional)

For Google OAuth:
1. Click "Set up" next to Google
2. You'll need to create a Google OAuth app:
   - Go to: https://console.cloud.google.com/
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth credentials
   - Authorized redirect URIs: Add Clerk's redirect URL (provided in dashboard)
3. Copy Client ID and Client Secret to Clerk

### 6. Save Changes

Click **Save** in Clerk dashboard

## 🚀 Deploy to Vercel

Your code is already pushed to GitHub. Now deploy to Vercel:

### Option A: Automatic Deployment (Already Set Up)
- Vercel will automatically deploy when you push to `main` branch
- Check: https://vercel.com/dashboard
- Wait 2-3 minutes for deployment

### Option B: Manual Deployment
```bash
vercel --prod
```

### Verify Deployment
Visit: https://mafutapass.com
- Should show your app
- No errors in console
- Try signing in with Google

## 🔐 Configure Vercel Environment Variables

Even though your `.env.production` has the keys, it's better to set them in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project: **raty-rsjf**
3. Settings → Environment Variables
4. Add these:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_cGxlYXNhbnQtbWFsbGFyZC05NS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_SUPABASE_URL=https://mdezrwxafjgptjzxdmbc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZXpyd3hhZmpncHRqenhkbWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTEyODAsImV4cCI6MjA3NzgyNzI4MH0.5hH-P_xNitSq1fLXdh9bIZT4OerdjvosFU8aCvzpf0w
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw
```

5. Select: **Production**, **Preview**, **Development** (all three)
6. Click **Save**
7. Go to Deployments → Redeploy latest

## 📱 Test in Android Studio

### 1. Click Play in Android Studio
Your app will load from **https://mafutapass.com**

### 2. Test OAuth Flow
1. Click "Sign in with Google"
2. Should open Google sign-in in app
3. After signing in, should redirect back to your app
4. ✅ Should NOT show localhost errors

## 🔍 Troubleshooting

### Issue: "Redirect URI mismatch"
**Solution:** Check Clerk dashboard → Paths → Make sure mafutapass.com is in allowed redirects

### Issue: "Origin not allowed"
**Solution:** Add `capacitor://localhost` to Clerk allowed origins

### Issue: App shows old version
**Solution:** 
```bash
# Clear and rebuild
npm run build
npx cap sync android
# Then run in Android Studio
```

### Issue: OAuth opens external browser
**Solution:** This is normal on Android. After auth, it should return to app automatically.

## ✅ Final Checklist

- [ ] Clerk redirect URIs include mafutapass.com
- [ ] Clerk allowed origins include capacitor://localhost
- [ ] Google OAuth configured in Clerk
- [ ] Vercel deployed successfully
- [ ] mafutapass.com loads your app
- [ ] Environment variables set in Vercel
- [ ] Android app synced with `npx cap sync android`
- [ ] Tested sign-in flow on physical device

## 🎯 How It Works Now

```
User clicks "Sign in with Google" in Android app
    ↓
App opens OAuth in WebView/Browser
    ↓
User signs in with Google
    ↓
Google redirects to: https://mafutapass.com/oauth-callback
    ↓
Clerk processes the auth
    ↓
User is redirected back to app
    ↓
✅ User is signed in!
```

## 🔄 Development Workflow

### After Making Code Changes
```bash
# 1. Test locally first
npm run dev

# 2. Commit and push to GitHub
git add -A
git commit -m "Your changes"
git push origin main

# 3. Vercel auto-deploys (2-3 min)
# 4. Test on web: https://mafutapass.com

# 5. Sync to Android (if needed)
npx cap sync android

# 6. Run in Android Studio
```

## 📊 Architecture

```
Android App (Capacitor)
    ↓ loads from
https://mafutapass.com (Vercel)
    ↓ authenticates via
Clerk OAuth
    ↓ stores data in
Supabase PostgreSQL
```

**Benefits:**
- ✅ No app rebuild for code changes
- ✅ Push to GitHub → Auto-deploy to Vercel → App updates instantly
- ✅ OAuth works correctly
- ✅ Single codebase for web + Android
- ✅ Can test on web before Android

## 🚀 You're Ready!

Your app now:
1. ✅ Loads from mafutapass.com
2. ✅ OAuth redirects work
3. ✅ Auto-deploys from GitHub
4. ✅ Feels like native app
5. ✅ Ready for Play Store!

**Next:** Test the sign-in flow in Android Studio, then proceed to building the signed AAB for Google Play.
