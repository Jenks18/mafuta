# ProGuard/R8 Mapping File Guide

## What Changed

I've enabled **R8 code shrinking and obfuscation** for your Android app. This will:
- ✅ Reduce app size by removing unused code
- ✅ Make reverse engineering harder
- ✅ Generate mapping files for crash debugging
- ✅ Remove the Play Console warning

## Configuration Updates

### 1. build.gradle Changes
- Enabled `minifyEnabled true`
- Enabled `shrinkResources true`
- Using optimized ProGuard: `proguard-android-optimize.txt`

### 2. proguard-rules.pro Updates
- Added Capacitor-specific keep rules
- Preserved WebView and JavaScript interfaces
- Kept necessary AndroidX classes
- Preserved debug information (line numbers, source files)

## Building a Release APK/AAB

### Build Release Bundle
```bash
cd android
./gradlew bundleRelease
```

### Build Release APK
```bash
cd android
./gradlew assembleRelease
```

## Finding the Mapping File

After building a release version, the mapping file will be located at:
```
android/app/build/outputs/mapping/release/mapping.txt
```

## Uploading to Google Play Console

### Option 1: Manual Upload (Current Build)
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Release** → **App bundle explorer**
4. Select your version (version code 1)
5. Click **Downloads** tab
6. Look for **Upload deobfuscation file** section
7. Upload the `mapping.txt` file from `android/app/build/outputs/mapping/release/`

### Option 2: Automatic Upload (Future Builds)
For future uploads, include the mapping file when you upload the AAB:
1. Build your release: `./gradlew bundleRelease`
2. Get the AAB: `android/app/build/outputs/bundle/release/app-release.aab`
3. Get the mapping: `android/app/build/outputs/mapping/release/mapping.txt`
4. Upload both through Play Console or use the Google Play Developer API

### Option 3: Use Gradle Play Publisher Plugin (Advanced)
You can automate the entire upload process including mapping files with:
```gradle
plugins {
    id 'com.github.triplet.play' version '3.8.6'
}
```

## Testing R8 Configuration

Before releasing, test that the app works correctly with R8 enabled:

### 1. Build and Install Release APK
```bash
cd android
./gradlew assembleRelease
adb install -r app/build/outputs/apk/release/app-release.apk
```

### 2. Test Critical Features
- WebView loading
- All JavaScript bridges
- Native plugin functionality
- Navigation and routing

### 3. Check for Crashes
Monitor logcat while testing:
```bash
adb logcat | grep -i "mafuta\|capacitor\|error"
```

## Troubleshooting

### App Crashes After Enabling R8
If your app crashes with R8 enabled, you may need to add more keep rules:

1. **Check crash logs** for class/method not found errors
2. **Add specific keep rules** for the missing classes
3. **Common issues**:
   - Third-party library classes being stripped
   - Reflection-based code needs explicit keep rules
   - Native method interfaces

### Example: Adding Keep Rules for Specific Classes
```proguard
# If you get crashes related to a specific package
-keep class com.example.package.** { *; }

# If reflection is used
-keepclassmembers class com.example.MyClass {
    *;
}
```

## App Size Comparison

Check your app size before and after R8:

### Before (R8 disabled)
```bash
ls -lh android/app/build/outputs/bundle/release/app-release.aab
```

### After (R8 enabled)
```bash
cd android && ./gradlew bundleRelease
ls -lh app/build/outputs/bundle/release/app-release.aab
```

You should see a **20-40% size reduction** typically.

## Important Notes

⚠️ **Save Mapping Files**: Always keep the mapping.txt file for each release version. You'll need it to debug crashes from that specific version.

📁 **Recommended Storage Structure**:
```
mappings/
  ├── v1.0-versionCode1/
  │   └── mapping.txt
  ├── v1.1-versionCode2/
  │   └── mapping.txt
  └── ...
```

🔐 **Security**: The mapping file contains sensitive information about your code structure. Keep it secure and don't commit it to public repositories.

## Next Steps

1. **Build a new release AAB**: `cd android && ./gradlew bundleRelease`
2. **Locate mapping file**: `android/app/build/outputs/mapping/release/mapping.txt`
3. **Upload to Play Console** for version code 1
4. **Test thoroughly** before releasing to production
5. **Save the mapping file** in a secure location for future reference

## Resources

- [Android R8 Documentation](https://developer.android.com/studio/build/shrink-code)
- [ProGuard Manual](https://www.guardsquare.com/manual/home)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
