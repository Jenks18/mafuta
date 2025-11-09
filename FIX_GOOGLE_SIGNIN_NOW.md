# 🚨 URGENT: Fix Google Sign-In for Web, Android & iOS

## The Problem
- ✅ Google OAuth is enabled in Clerk
- ❌ "Use custom credentials" toggle is OFF
- ❌ Client ID and Client Secret fields are empty
- **Result**: Google sign-in fails with "missing client_id" error

## Important: You Need 3 Different OAuth Clients
- 🌐 **Web Client**: For https://mafutapass.com
- 🤖 **Android Client**: For your Android app
- 🍎 **iOS Client**: For future iOS app

---

## 🔧 Complete Fix (30 minutes)

### Step 1: Set Up Google Cloud Project

1. Go to: **https://console.cloud.google.com/apis/credentials**

2. **Select or create a project**:
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Name: **Mafuta** or **MafutaPass**
   - Click **CREATE**
   - Wait for it to be created, then select it

3. **Configure OAuth Consent Screen** (Required First):
   - Click "OAuth consent screen" in left sidebar
   - User Type: **External**
   - Click **CREATE**
   - Fill in:
     - App name: **MafutaPass**
     - User support email: **xanes.info@gmail.com**
     - App logo: (optional, upload your logo)
     - App domain:
       - Application home page: **https://mafutapass.com**
       - Privacy policy: **https://mafutapass.com/privacy** (create later)
       - Terms of service: **https://mafutapass.com/terms** (create later)
     - Authorized domains: **mafutapass.com**
     - Developer contact: **xanes.info@gmail.com**
   - Click **SAVE AND CONTINUE**
   
   - **Scopes**: Click **ADD OR REMOVE SCOPES**
     - Search for and add:
       - `.../auth/userinfo.email`
       - `.../auth/userinfo.profile`
       - `openid`
     - Click **UPDATE**
     - Click **SAVE AND CONTINUE**
   
   - **Test users** (optional for now): Click **SAVE AND CONTINUE**
   - Review and click **BACK TO DASHBOARD**

---

### Step 2: Create OAuth Client for WEB

1. Click "Credentials" in left sidebar
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: **MafutaPass Web**

**Authorized JavaScript origins** - Add ALL:
```
https://mafutapass.com
https://clerk.mafutapass.com
https://accounts.clerk.com
```

**Authorized redirect URIs** - Add:
```
https://clerk.mafutapass.com/v1/oauth_callback
```

5. Click **CREATE**
6. **SAVE THESE** (copy to a note):
   - ✅ Web Client ID: `xxxxx.apps.googleusercontent.com`
   - ✅ Web Client Secret: `GOCSPX-xxxxx`

---

### Step 3: Create OAuth Client for ANDROID

1. Click **+ CREATE CREDENTIALS** → **OAuth client ID** (again)
2. Application type: **Android**
3. Name: **MafutaPass Android**

4. **Package name**: 
   ```
   com.mafutapass.app
   ```
   *(This is your `applicationId` from `android/app/build.gradle`)*

5. **SHA-1 certificate fingerprint**:
   - This is the tricky part! You need your keystore's SHA-1
   
   **Get SHA-1 from your keystore**:
   Open terminal and run:
   ```bash
   cd ~/Documents/GitHub/mafuta/android/app
   keytool -list -v -keystore mafuta-release.keystore -alias mafuta
   ```
   - When prompted for password, enter your keystore password
   - Look for **SHA-1** in the output (looks like: `AA:BB:CC:DD:...`)
   - Copy the entire SHA-1 fingerprint

6. Paste the SHA-1 in Google Console
7. Click **CREATE**
8. **SAVE THIS**:
   - ✅ Android Client ID: `xxxxx.apps.googleusercontent.com`
   - Note: Android OAuth doesn't have a client secret

---

### Step 4: Create OAuth Client for iOS (Future-proofing)

1. Click **+ CREATE CREDENTIALS** → **OAuth client ID** (again)
2. Application type: **iOS**
3. Name: **MafutaPass iOS**
4. **Bundle ID**: 
   ```
   com.mafutapass.app
   ```
   *(Keep consistent with Android package name)*

5. Click **CREATE**
6. **SAVE THIS**:
   - ✅ iOS Client ID: `xxxxx.apps.googleusercontent.com`
   - Note: iOS OAuth doesn't have a client secret

---

### Step 5: Configure Clerk with ALL Credentials

Now you have 3 OAuth clients created! Let's configure Clerk:

1. Go to: **https://dashboard.clerk.com**
2. Navigate to: **User & Authentication** → **Social Connections** → **Google**

3. **Toggle ON**: "Use custom credentials"

4. **Enter WEB credentials**:
   - **Client ID**: Paste your **Web Client ID** (from Step 2)
   - **Client Secret**: Paste your **Web Client Secret** (from Step 2)

5. **Scroll down** - you should see additional fields for mobile:
   - **Android Client ID**: Paste your **Android Client ID** (from Step 3)
   - **iOS Client ID**: Paste your **iOS Client ID** (from Step 4)

   *(Note: If you don't see these fields, Clerk might handle it differently - the Web credentials will work for mobile too in some setups)*

6. **Verify the Authorized Redirect URI**:
   - Should show: `https://clerk.mafutapass.com/v1/oauth_callback`

7. **Keep these ON**:
   - ✅ Enable for sign-up and sign-in
   - ✅ Block email subaddresses (optional)

8. **Click SAVE** at the bottom

---

### Step 6: Update Your Android App Config

Your Android app needs to know about the OAuth configuration.

1. Your package name is already correct in `android/app/build.gradle`:
   ```gradle
   applicationId "com.mafutapass.app"
   ```

2. If Clerk requires it, you may need to add the OAuth client IDs to your app config.
   
   **Check if you need to update `capacitor.config.json`**:
   ```json
   {
     "appId": "com.mafuta.app",
     "appName": "Mafuta",
     "webDir": "dist",
     "server": {
       "url": "https://mafutapass.com",
       "cleartext": true
     },
     "android": {
       "allowMixedContent": true
     }
   }
   ```

3. Since your app loads from the web (mafutapass.com), the **Web OAuth client** is what matters most for Clerk authentication

---

### Step 7: Sync and Rebuild Android App

After configuring everything:

```bash
cd ~/Documents/GitHub/mafuta

# Sync Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

In Android Studio:
1. Build → Clean Project
2. Build → Rebuild Project
3. Run on device or emulator

---

### Step 8: Test Everything

#### Test 1: Web (Desktop Browser)
1. Wait **1-2 minutes** for Clerk changes to propagate
2. Open: **https://mafutapass.com**
3. Click **"Sign in with Google"**
4. Select your Google account
5. ✅ Should sign in successfully!

#### Test 2: Web (Mobile Browser)
1. Open https://mafutapass.com on your phone's browser (Safari/Chrome)
2. Try signing in with Google
3. ✅ Should work!

#### Test 3: Android App
1. Open your app in Android Studio
2. Run on physical device or emulator
3. Try signing in with Google
4. ✅ Should work!

---

## ✅ Complete Verification Checklist

After completing all steps above:

### Google Cloud Console
- [ ] Created project: "MafutaPass"
- [ ] Configured OAuth consent screen
- [ ] Created Web OAuth client
  - [ ] Added JavaScript origins (mafutapass.com, clerk.mafutapass.com)
  - [ ] Added redirect URI: `https://clerk.mafutapass.com/v1/oauth_callback`
  - [ ] Saved Web Client ID
  - [ ] Saved Web Client Secret
- [ ] Created Android OAuth client
  - [ ] Used package name: `com.mafuta.app`
  - [ ] Added SHA-1 fingerprint from keystore
  - [ ] Saved Android Client ID
- [ ] Created iOS OAuth client
  - [ ] Used bundle ID: `com.mafuta.app`
  - [ ] Saved iOS Client ID

### Clerk Dashboard
- [ ] Toggled ON "Use custom credentials"
- [ ] Pasted Web Client ID
- [ ] Pasted Web Client Secret
- [ ] Pasted Android Client ID (if field available)
- [ ] Pasted iOS Client ID (if field available)
- [ ] Clicked **SAVE**

### Testing
- [ ] Web sign-in works (desktop browser)
- [ ] Web sign-in works (mobile browser)
- [ ] Android app sign-in works
- [ ] Users can now log in! 🎉

---

## 🎯 Why This Fixes It

**Before**: Clerk doesn't know which Google OAuth app to use → Error
**After**: Clerk uses your Google OAuth credentials → Works! ✅

---

## ❓ Common Issues

### "Redirect URI mismatch" error
**Fix**: Make sure the redirect URI in Google Console **exactly matches**:
```
https://clerk.mafutapass.com/v1/oauth_callback
```

### "Access blocked: This app is not verified"
**Normal during development**: Google shows this for unverified apps. 

**For testing**: Click "Advanced" → "Go to MafutaPass (unsafe)"

**To remove this warning**:
1. Go to Google Cloud Console → OAuth consent screen
2. Click **PUBLISH APP**
3. Submit for verification (takes 1-4 weeks, but you can use it meanwhile)

### Android: "Sign-in failed" or "Error 10"
**Possible causes**:
1. Wrong SHA-1 fingerprint
   - **Fix**: Re-run the keytool command and verify the SHA-1
2. Wrong package name
   - **Fix**: Must be `com.mafutapass.app` (check `android/app/build.gradle`)
3. Need to rebuild app
   - **Fix**: Clean and rebuild in Android Studio

### "Developer Error" on Android
**Fix**: The Android Client ID is not configured correctly
1. Verify package name is exactly: `com.mafutapass.app`
2. Verify SHA-1 is from your release keystore
3. Wait 5-10 minutes for Google to propagate changes
4. Rebuild the app

### Still not working after 10 minutes
**Troubleshooting**:
1. Check all credentials are saved in Clerk
2. Check both Client ID and Secret are filled (for Web)
3. Try incognito/private browser window
4. Check browser console (F12) for specific errors
5. For Android: Check Android Studio Logcat for errors

---

## 🎯 Important Notes

### About Vercel
✅ Your Vercel environment variables are fine - no changes needed there!

### About Multiple OAuth Clients
The reason you need different clients:
- **Web**: Uses redirect URIs and cookies
- **Android**: Uses package name + SHA-1 fingerprint verification
- **iOS**: Uses bundle ID + URL schemes

Google verifies each platform differently for security.

### Do I Need to Rebuild the Android App?
**Maybe**:
- If your app loads everything from the web: **No rebuild needed** (your setup)
- If you need to add native OAuth handling: **Yes, rebuild needed**

Since your app loads from mafutapass.com, the web OAuth should handle everything!

### Timeline
- **Clerk changes**: Effective immediately (1-2 min)
- **Google OAuth propagation**: 5-10 minutes
- **OAuth consent screen verification**: 1-4 weeks (but app works meanwhile)

---

## 🎉 After This Works

Your users will be able to:
1. Visit mafutapass.com (web or Android app)
2. Click "Sign in with Google"
3. Select their Google account
4. Get signed in immediately
5. Start using your platform! 🚀
