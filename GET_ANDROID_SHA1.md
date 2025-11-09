# 🔑 Get Android SHA-1 Fingerprint for Google OAuth

## Quick Command

Run this in your terminal:

```bash
cd ~/Documents/GitHub/mafuta/android/app
keytool -list -v -keystore mafuta-release.keystore -alias mafuta
```

**When prompted for password**: Enter your keystore password (from `android/keystore.properties`)

## What to Look For

You'll see output like this:

```
Alias name: mafuta
Creation date: ...
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=...
Issuer: CN=...
Serial number: ...
Valid from: ... until: ...
Certificate fingerprints:
	 SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:11:22:33:44
	 SHA256: ...
```

**Copy the SHA1 value** (the part after `SHA1:`): `AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:00:11:22:33:44`

## Use It In Google Console

When creating the Android OAuth client:
1. Application type: **Android**
2. Package name: `com.mafuta.app`
3. SHA-1 certificate fingerprint: **Paste the SHA1 value here**

---

## Alternative: Get SHA-1 from Debug Keystore (For Testing)

If you want to test with debug builds:

```bash
cd ~/.android
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copy the SHA-1 and create a **separate** Android OAuth client for debug builds.

---

## Troubleshooting

### "keytool: command not found"
Make sure Java JDK is installed and in your PATH.

### "Keystore was tampered with, or password was incorrect"
Check your password in `android/keystore.properties`:
```properties
storePassword=YOUR_PASSWORD_HERE
keyPassword=YOUR_PASSWORD_HERE
keyAlias=mafuta
storeFile=mafuta-release.keystore
```

### Can't find the keystore file
Make sure you're in the right directory:
```bash
ls -la ~/Documents/GitHub/mafuta/android/app/mafuta-release.keystore
```

---

## Summary

You need this SHA-1 to create the Android OAuth client in Google Cloud Console. Without it, Google can't verify that sign-in requests are actually coming from your app!
