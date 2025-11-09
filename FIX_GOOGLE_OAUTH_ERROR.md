# 🚨 Fix: Google OAuth "Missing client_id" Error

## The Problem
You're seeing this error when trying to sign in with Google:
```
Access blocked: Authorization Error
Missing required parameter: client_id
Error 400: invalid_request
```

This means **Google OAuth is not configured in Clerk**.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Go to Clerk Dashboard
https://dashboard.clerk.com

### Step 2: Select Your Application
- Look for your app (the one using `pk_test_cGxlYXNhbnQtbWFsbGFyZC05NS5jbGVyay5hY2NvdW50cy5kZXYk`)

### Step 3: Navigate to Social Connections
- Click **User & Authentication** in sidebar
- Click **Social Connections**

### Step 4: Configure Google
- Find **Google** in the list
- Click **Set up** or **Configure**

### Step 5: Use Clerk's Development Keys (RECOMMENDED)
- Toggle ON: **"Use development keys"** or **"Use Clerk's OAuth"**
- Click **Save**
- ✅ **Done!** Google sign-in will now work

---

## 🔧 Alternative: Use Your Own Google OAuth (For Production)

If you want to use your own Google OAuth credentials:

### Step 1: Create Google OAuth Credentials

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Search for **"Google+ API"** or **"Google Identity Services"** and enable it
4. Go to **APIs & Services** → **Credentials**
5. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
6. Application type: **Web application**
7. Name: "Mafuta App" (or any name)
8. **Authorized redirect URIs**: Add the URL that Clerk provides in the dashboard
   - It looks like: `https://accounts.clerk.com/v1/oauth_callback`
   - You'll see this exact URL in Clerk's Google configuration page
9. Click **Create**
10. Copy the **Client ID** and **Client Secret**

### Step 2: Add to Clerk

1. Go back to Clerk Dashboard → Social Connections → Google
2. Paste your **Client ID**
3. Paste your **Client Secret**
4. Click **Save**

### Step 3: Test

1. Try signing in again with Google
2. ✅ Should work now!

---

## 🎯 What Happens After You Fix This

1. Users click "Sign in with Google" in your app
2. Clerk handles the OAuth flow
3. Google authenticates the user
4. User is redirected back to your app
5. ✅ User is signed in!

---

## ❓ Why This Happens

Your app uses Clerk's `<SignIn />` component which includes Google as a sign-in option by default. But Clerk needs OAuth credentials to actually connect to Google. You need to either:
- Use Clerk's development OAuth keys (for testing)
- Provide your own Google OAuth credentials (for production)

---

## 🚀 Next Steps

1. ✅ Fix Google OAuth in Clerk (choose Option A or B above)
2. Test sign-in on your local development
3. Test on your deployed site (mafutapass.com)
4. Test in your Android app

---

## 📝 Important Notes

- **Development keys** are perfect for testing but have limitations
- **Your own OAuth** is required for production/Play Store
- You can switch between them anytime in Clerk dashboard
- No code changes needed - it's all in Clerk configuration!

---

## ✅ Verification

After configuring, test by:
1. Opening your app: https://mafutapass.com
2. Clicking "Sign in with Google"
3. Should see Google account picker
4. Select account
5. ✅ Should sign in successfully

If you still see errors, check:
- Clerk publishable key is correct in your `.env` file
- Google OAuth is enabled and saved in Clerk
- Your app is using the latest Clerk key (redeploy if needed)
