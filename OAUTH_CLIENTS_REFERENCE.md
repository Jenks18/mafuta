# 📋 OAuth Clients Quick Reference

## Summary: You Need 3 OAuth Clients in Google Cloud Console

| Platform | Type | Name | Key Info |
|----------|------|------|----------|
| 🌐 Web | Web application | MafutaPass Web | Client ID + Client Secret |
| 🤖 Android | Android | MafutaPass Android | Package name + SHA-1 |
| 🍎 iOS | iOS | MafutaPass iOS | Bundle ID |

---

## 🌐 Web OAuth Client

**Application Type**: Web application  
**Name**: MafutaPass Web

**Authorized JavaScript origins**:
```
https://mafutapass.com
https://clerk.mafutapass.com
https://accounts.clerk.com
```

**Authorized redirect URIs**:
```
https://clerk.mafutapass.com/v1/oauth_callback
```

**What you get**:
- ✅ Client ID: `xxxxx-xxxxx.apps.googleusercontent.com`
- ✅ Client Secret: `GOCSPX-xxxxx`

**Add to Clerk**: Both Client ID and Client Secret

---

## 🤖 Android OAuth Client

**Application Type**: Android  
**Name**: MafutaPass Android

**Package name**:
```
com.mafutapass.app
```

**SHA-1 certificate fingerprint**:
```bash
# Get it by running:
cd ~/Documents/GitHub/mafuta/android/app
keytool -list -v -keystore mafuta-release.keystore -alias mafuta
# Copy the SHA1 value
```

**What you get**:
- ✅ Client ID: `xxxxx-xxxxx.apps.googleusercontent.com`
- ❌ No Client Secret (Android doesn't use it)

**Add to Clerk**: Android Client ID (if Clerk has a field for it)

---

## 🍎 iOS OAuth Client

**Application Type**: iOS  
**Name**: MafutaPass iOS

**Bundle ID**:
```
com.mafutapass.app
```

**What you get**:
- ✅ Client ID: `xxxxx-xxxxx.apps.googleusercontent.com`
- ❌ No Client Secret (iOS doesn't use it)

**Add to Clerk**: iOS Client ID (if Clerk has a field for it)

---

## 🔑 What Goes in Clerk Dashboard

After creating all 3 OAuth clients in Google Cloud Console:

1. **Toggle ON**: "Use custom credentials"

2. **Enter these**:
   - **Client ID**: Your **Web** Client ID
   - **Client Secret**: Your **Web** Client Secret
   - **Android Client ID**: Your Android Client ID (if field exists)
   - **iOS Client ID**: Your iOS Client ID (if field exists)

3. **Click SAVE**

---

## ⚡ Quick Setup Order

1. ✅ Configure OAuth Consent Screen (one time)
2. ✅ Create Web OAuth Client → Copy Web Client ID & Secret
3. ✅ Create Android OAuth Client → Copy Android Client ID
4. ✅ Create iOS OAuth Client → Copy iOS Client ID
5. ✅ Add all credentials to Clerk
6. ✅ Test on web → Should work!
7. ✅ Test on Android → Should work!

---

## 🎯 Why Multiple Clients?

Each platform has different security requirements:

- **Web**: Uses cookies + redirect URIs
- **Android**: Uses app package + certificate fingerprint
- **iOS**: Uses bundle ID + URL schemes

Google verifies each platform separately to ensure security.

---

## 📝 Store These Safely

After creating all OAuth clients, save these in a secure place:

```
PROJECT: MafutaPass

WEB OAUTH CLIENT:
- Client ID: [paste here]
- Client Secret: [paste here]

ANDROID OAUTH CLIENT:
- Client ID: [paste here]
- Package: com.mafutapass.app
- SHA-1: [paste here]

IOS OAUTH CLIENT:
- Client ID: [paste here]
- Bundle ID: com.mafutapass.app
```

You'll need these if you ever have to reconfigure Clerk or debug OAuth issues.
