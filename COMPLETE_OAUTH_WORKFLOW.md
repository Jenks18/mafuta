# ✅ COMPLETE WORKFLOW: Fix Google Sign-In for All Platforms

## Follow These Steps IN ORDER

---

## ⏱️ Total Time: ~30 minutes

---

## 📍 STEP 1: Get Your Android SHA-1 (5 minutes)

Open terminal and run:

```bash
cd ~/Documents/GitHub/mafuta/android/app
keytool -list -v -t mafuta-release.keystore -alias mafuta
```

**Enter password when prompted** (from your `android/keystore.properties` file)

**Look for this in the output**:
```
SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:11:22:33:44
```

**Copy the entire SHA-1 string** and save it in a note. You'll need it soon!

---

## 📍 STEP 2: Go to Google Cloud Console

Open: **https://console.cloud.google.com/apis/credentials**

**Sign in with your Google account** (xanes.info@gmail.com)

---

## 📍 STEP 3: Create or Select Project (2 minutes)

1. Click the **project dropdown** at the top
2. Click **"NEW PROJECT"**
3. Project name: **MafutaPass**
4. Click **CREATE**
5. Wait for it to be created
6. Click **SELECT PROJECT** to use it

---

## 📍 STEP 4: Configure OAuth Consent Screen (5 minutes)

**MUST DO THIS FIRST** before creating any OAuth clients!

1. Click **"OAuth consent screen"** in left sidebar
2. User Type: Select **"External"**
3. Click **CREATE**

**Fill in the form**:
- App name: **MafutaPass**
- User support email: **xanes.info@gmail.com**
- App logo: (optional - skip for now)
- App domain section:
  - Application home page: **https://mafutapass.com**
  - Privacy policy link: **https://mafutapass.com/privacy** (create later)
  - Terms of service: **https://mafutapass.com/terms** (create later)
- Authorized domains: **mafutapass.com**
- Developer contact: **xanes.info@gmail.com**

4. Click **SAVE AND CONTINUE**

**Scopes page**:
5. Click **ADD OR REMOVE SCOPES**
6. Search for and check these:
   - `.../auth/userinfo.email` ✓
   - `.../auth/userinfo.profile` ✓
   - `openid` ✓
7. Click **UPDATE**
8. Click **SAVE AND CONTINUE**

**Test users page**:
9. (Optional) Add your email as test user
10. Click **SAVE AND CONTINUE**

**Summary page**:
11. Review everything
12. Click **BACK TO DASHBOARD**

✅ OAuth Consent Screen is now configured!

---

## 📍 STEP 5: Create WEB OAuth Client (3 minutes)

1. Click **"Credentials"** in left sidebar
2. Click **"+ CREATE CREDENTIALS"** at top
3. Select **"OAuth client ID"**

**Fill in**:
- Application type: **Web application**
- Name: **MafutaPass Web**

**Authorized JavaScript origins** - Click "+ ADD URI" 3 times and add:
```
https://mafutapass.com
https://clerk.mafutapass.com
https://accounts.clerk.com
```

**Authorized redirect URIs** - Click "+ ADD URI" and add:
```
https://clerk.mafutapass.com/v1/oauth_callback
```

4. Click **CREATE**

**IMPORTANT**: A popup appears with your credentials!

5. **COPY THESE IMMEDIATELY**:
   - Web Client ID: `something.apps.googleusercontent.com`
   - Web Client Secret: `GOCSPX-something`

6. Save them in a note! You'll need them for Clerk.

7. Click **OK** to close the popup

✅ Web OAuth Client created!

---

## 📍 STEP 6: Create ANDROID OAuth Client (3 minutes)

1. Click **"+ CREATE CREDENTIALS"** again
2. Select **"OAuth client ID"**

**Fill in**:
- Application type: **Android**
- Name: **MafutaPass Android**
- Package name: **com.mafutapass.app**
- SHA-1 certificate fingerprint: **[Paste the SHA-1 from Step 1]**

3. Click **CREATE**

**COPY THIS**:
- Android Client ID: `something.apps.googleusercontent.com`

4. Save it in your note!

✅ Android OAuth Client created!

---

## 📍 STEP 7: Create iOS OAuth Client (2 minutes)

1. Click **"+ CREATE CREDENTIALS"** again
2. Select **"OAuth client ID"**

**Fill in**:
- Application type: **iOS**
- Name: **MafutaPass iOS**
- Bundle ID: **com.mafutapass.app**

3. Click **CREATE**

**COPY THIS**:
- iOS Client ID: `something.apps.googleusercontent.com`

4. Save it in your note!

✅ iOS OAuth Client created!

---

## 📍 STEP 8: Configure Clerk (5 minutes)

Now you have all 3 OAuth clients! Time to add them to Clerk.

1. Open: **https://dashboard.clerk.com**
2. Sign in to your Clerk account
3. Select your application
4. Go to: **User & Authentication** → **Social Connections**
5. Find **Google** and click to configure it

**On the Google OAuth configuration page**:

6. **Toggle ON**: "Use custom credentials"
   - The toggle should turn blue/purple

7. **Fill in the fields**:
   - **Client ID**: Paste your **Web Client ID**
   - **Client Secret**: Paste your **Web Client Secret**

8. **Check for additional fields** (scroll down):
   - If you see **"Android Client ID"**: Paste your Android Client ID
   - If you see **"iOS Client ID"**: Paste your iOS Client ID
   - (Note: Some Clerk setups may not have these fields - that's OK!)

9. **Keep these settings**:
   - ✅ Enable for sign-up and sign-in: **ON**
   - ✅ Block email subaddresses: **ON** (recommended)

10. **Verify** the Authorized Redirect URI shows:
    ```
    https://clerk.mafutapass.com/v1/oauth_callback
    ```

11. **Click SAVE** at the bottom

12. Wait for "Settings saved successfully" confirmation

✅ Clerk is now configured with Google OAuth!

---

## 📍 STEP 9: Test Web Sign-In (2 minutes)

1. Wait **1-2 minutes** for changes to propagate

2. Open a new browser tab (or incognito window)

3. Go to: **https://mafutapass.com**

4. Click **"Sign in with Google"** or **"Continue with Google"**

5. You should see:
   - Google account picker
   - (May see "This app isn't verified" - click "Advanced" → "Go to MafutaPass")
   - Select your Google account
   - ✅ **Should sign in successfully!**

**If it works**: 🎉 Congratulations! Web sign-in is working!

**If it doesn't work**: See troubleshooting section below

---

## 📍 STEP 10: Test Android Sign-In (3 minutes)

1. Open **Android Studio**

2. Open your project:
   ```bash
   cd ~/Documents/GitHub/mafuta
   npx cap open android
   ```

3. **Clean and rebuild**:
   - Build → Clean Project
   - Build → Rebuild Project

4. **Run on device or emulator**

5. When app opens, try **"Sign in with Google"**

6. Should show Google account picker

7. Select account

8. ✅ **Should sign in successfully!**

**If it works**: 🎉 Android sign-in is working too!

---

## 🎯 COMPLETE! What You've Done

✅ Created Google Cloud project: MafutaPass  
✅ Configured OAuth consent screen  
✅ Created Web OAuth client (with Client ID + Secret)  
✅ Created Android OAuth client (with package name + SHA-1)  
✅ Created iOS OAuth client (for future)  
✅ Added all credentials to Clerk  
✅ Tested web sign-in - working!  
✅ Tested Android sign-in - working!  

**Your users can now log in on all platforms!** 🚀

---

## 🔧 Troubleshooting

### Web: Still getting "missing client_id" error
1. Check that "Use custom credentials" toggle is **ON** in Clerk
2. Check that both Client ID and Secret are filled in Clerk
3. Wait 2-3 minutes and try again
4. Clear browser cache and try incognito window
5. Check browser console (F12) for specific errors

### Web: "Redirect URI mismatch"
1. Go back to Google Console → Credentials → Web OAuth client
2. Verify redirect URI is exactly: `https://clerk.mafutapass.com/v1/oauth_callback`
3. Save and wait 5 minutes

### Android: "Sign-in failed" or "Error 10"
1. Verify SHA-1 is correct (re-run keytool command)
2. Verify package name is exactly: `com.mafutapass.app`
3. In Google Console, check Android OAuth client has correct package + SHA-1
4. Wait 10 minutes for Google to propagate changes
5. Rebuild app in Android Studio

### Android: "Developer Error"
1. Double-check the Android Client ID in Google Console
2. Verify package name: `com.mafutapass.app`
3. Verify SHA-1 matches your keystore
4. Wait 10 minutes and rebuild

### "This app isn't verified" warning
**This is normal!** During development:
- Click "Advanced"
- Click "Go to MafutaPass (unsafe)"
- This lets you test while waiting for verification

**To remove this warning** (optional):
1. Google Console → OAuth consent screen
2. Click **PUBLISH APP**
3. Submit for verification (takes 1-4 weeks)
4. App works fine while waiting!

---

## 📝 Save Your Credentials

Keep this information in a safe place:

```
GOOGLE CLOUD PROJECT: MafutaPass

WEB OAUTH:
- Client ID: [your web client id]
- Client Secret: [your web client secret]

ANDROID OAUTH:
- Client ID: [your android client id]
- Package: com.mafutapass.app
- SHA-1: [your sha-1 fingerprint]

IOS OAUTH:
- Client ID: [your ios client id]
- Bundle ID: com.mafutapass.app
```

You may need these to reconfigure Clerk or debug issues later!

---

## 🎉 You're Done!

Your users can now:
- ✅ Sign in with Google on the web (mafutapass.com)
- ✅ Sign in with Google on Android app
- ✅ Sign in with Google on iOS app (when you build it)

All platforms use the same Google account and sync through Clerk! 🚀
