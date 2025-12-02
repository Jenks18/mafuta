# iOS App Store Setup (Future)

When you're ready to add iOS to your automated deployment:

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - https://developer.apple.com/programs/

2. **Add iOS to Capacitor:**
   ```bash
   npm install @capacitor/ios
   npx cap add ios
   ```

3. **Xcode** (Mac required)
   - Install from Mac App Store

## CI/CD Setup

### 1. Generate App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. **Users and Access → Keys → App Store Connect API**
3. Click **"+"** to generate new key
4. Role: **App Manager**
5. Download `.p8` file (only available once!)
6. Note: **Issuer ID** and **Key ID**

### 2. Add iOS to GitHub Actions

Add to `.github/workflows/deploy-all-platforms.yml`:

```yaml
ios-build:
  name: Build iOS IPA
  runs-on: macos-latest
  needs: web-build
  steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build web app
      run: npm run build
      env:
        VITE_GOOGLE_VISION_API_KEY: ${{ secrets.VITE_GOOGLE_VISION_API_KEY }}
        VITE_CLERK_PUBLISHABLE_KEY: ${{ secrets.VITE_CLERK_PUBLISHABLE_KEY }}
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Sync Capacitor
      run: npx cap sync ios
    
    - name: Import Code Signing Certificates
      uses: apple-actions/import-codesign-certs@v2
      with:
        p12-file-base64: ${{ secrets.IOS_CERTIFICATES_P12 }}
        p12-password: ${{ secrets.IOS_CERTIFICATES_PASSWORD }}
    
    - name: Download Provisioning Profile
      run: |
        mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
        echo "${{ secrets.IOS_PROVISIONING_PROFILE }}" | base64 -d > ~/Library/MobileDevice/Provisioning\ Profiles/profile.mobileprovision
    
    - name: Build iOS Archive
      run: |
        cd ios/App
        xcodebuild -workspace App.xcworkspace \
          -scheme App \
          -configuration Release \
          -archivePath $PWD/build/App.xcarchive \
          archive
    
    - name: Export IPA
      run: |
        cd ios/App
        xcodebuild -exportArchive \
          -archivePath $PWD/build/App.xcarchive \
          -exportPath $PWD/build \
          -exportOptionsPlist ExportOptions.plist
    
    - name: Upload to TestFlight
      uses: apple-actions/upload-testflight-build@v1
      with:
        app-path: ios/App/build/App.ipa
        issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
        api-key-id: ${{ secrets.APPSTORE_API_KEY_ID }}
        api-private-key: ${{ secrets.APPSTORE_API_PRIVATE_KEY }}
```

### 3. GitHub Secrets for iOS

| Secret Name | How to Get |
|------------|------------|
| `IOS_CERTIFICATES_P12` | Export cert from Keychain → base64 encode |
| `IOS_CERTIFICATES_PASSWORD` | Password when exporting cert |
| `IOS_PROVISIONING_PROFILE` | Download from Apple Developer → base64 encode |
| `APPSTORE_ISSUER_ID` | From App Store Connect API key page |
| `APPSTORE_API_KEY_ID` | From App Store Connect API key page |
| `APPSTORE_API_PRIVATE_KEY` | Content of .p8 file |

## Quick iOS Build Locally

```bash
# Build and open in Xcode
npm run build
npx cap sync ios
npx cap open ios

# In Xcode:
# 1. Select target device (iPhone or simulator)
# 2. Product → Archive
# 3. Distribute App → TestFlight
```

## Cost Summary

- **Apple Developer:** $99/year (required)
- **GitHub Actions (macOS runner):** $0.08/minute
  - Each iOS build: ~15 minutes = $1.20/build
  - 100 builds/month = ~$120/month

**Note:** For now, building Android only is free and sufficient for beta testing.
