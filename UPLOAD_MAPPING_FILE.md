# 🎯 Quick Fix: Upload Mapping File to Play Console

## ✅ What's Been Fixed

1. **R8 enabled** in `android/app/build.gradle`
   - Code shrinking: ✅ ON
   - Resource shrinking: ✅ ON
   - Optimization: ✅ FULL

2. **ProGuard rules configured** for Capacitor
   - WebView interfaces: ✅ Protected
   - Capacitor plugins: ✅ Protected
   - Debug information: ✅ Preserved

3. **Mapping file generated** ✅
   - Location: `android/app/build/outputs/mapping/release/mapping.txt`
   - Size: 8.5MB
   - Ready to upload

## 🚀 Upload to Play Console NOW

### Step-by-Step:

1. **Go to Play Console**: https://play.google.com/console
2. **Select your app**: Mafuta Pass
3. Click: **Release** → **App bundle explorer** (left menu)
4. Find **Version code 1** in the list
5. Click the **Downloads** tab
6. Find section: **"Obfuscation file (mapping.txt)"**
7. Click **Upload deobfuscation file**
8. Upload this file:
   ```
   /Users/iannjenga/Documents/GitHub/mafuta/android/app/build/outputs/mapping/release/mapping.txt
   ```
9. ✅ Warning will disappear!

## 📦 For Your NEXT Release

The new AAB is ready with R8 enabled:
```
File: android/app/build/outputs/bundle/release/app-release.aab
Size: 3.4MB
```

When you upload this AAB as version 2:
- The mapping file will be automatically generated
- Upload it alongside the AAB
- The warning won't appear for new versions

## 🔍 Files Locations

```bash
# Your new release bundle (for next version)
android/app/build/outputs/bundle/release/app-release.aab

# The mapping file (for version 1)
android/app/build/outputs/mapping/release/mapping.txt

# Other ProGuard outputs (optional, for reference)
android/app/build/outputs/mapping/release/configuration.txt
android/app/build/outputs/mapping/release/seeds.txt
android/app/build/outputs/mapping/release/usage.txt
```

## 💾 Save Mapping Files

**IMPORTANT**: Create a `mappings/` folder to archive mapping files:

```bash
mkdir -p mappings/v1.0-versionCode1
cp android/app/build/outputs/mapping/release/mapping.txt mappings/v1.0-versionCode1/
```

You'll need this file if you get crash reports from version 1 users!

## 🧪 Before Next Release: Test R8

```bash
# Build and install release APK
cd android
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk

# Test all features thoroughly!
# - Login/Authentication
# - Navigation
# - Maps
# - All Capacitor plugins
```

## ℹ️ More Info

See `PROGUARD_MAPPING_GUIDE.md` for detailed documentation.
