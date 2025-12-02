# CI/CD Automation Setup Guide

This guide explains how to automatically deploy to Web, Android APK, and Google Play Store when you push code.

## 🚀 How It Works

**Push to GitHub** → **Automatic builds for Web + Android** → **Deploy everywhere**

### Workflow Triggers
- Push to `main` branch → Build and deploy to internal testing
- Create tag `v1.0.1` → Build and create GitHub Release
- Manual trigger → Run workflow anytime from GitHub Actions tab

---

## ⚙️ Setup Instructions

### Step 1: Prepare Android Keystore

You need to encode your keystore file as base64 for GitHub Secrets:

```bash
cd /Users/iannjenga/Documents/GitHub/mafuta

# Encode keystore to base64
base64 -i android/mafutapass.keystore | pbcopy
# This copies the encoded keystore to clipboard
```

### Step 2: Add GitHub Secrets

Go to your GitHub repo: https://github.com/Jenks18/mafuta/settings/secrets/actions

Click **"New repository secret"** and add each of these:

#### Required Secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `VITE_GOOGLE_VISION_API_KEY` | `AIzaSyBQr-E-ZLd9bdRheFbT9x0wllCKChxyOtI` | Your .env file |
| `VITE_CLERK_PUBLISHABLE_KEY` | Your Clerk key | .env file |
| `VITE_SUPABASE_URL` | Your Supabase URL | .env file |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase key | .env file |
| `ANDROID_KEYSTORE_BASE64` | Paste from clipboard (Step 1) | Base64 encoded keystore |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password | From keystore.properties |
| `ANDROID_KEY_ALIAS` | Your key alias | From keystore.properties |
| `ANDROID_KEY_PASSWORD` | Your key password | From keystore.properties |

#### Optional (for Google Play auto-upload):

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Service account JSON | See "Google Play Setup" below |

---

## 📱 Google Play Store Auto-Upload Setup

To automatically upload to Google Play Internal Testing:

### 1. Create Service Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app → **Setup → API access**
3. Click **Create new service account**
4. Follow link to Google Cloud Console
5. Create service account with name: `github-actions-deploy`
6. Grant permissions: **Service Account User**
7. Create JSON key → Download it

### 2. Grant Play Console Access

Back in Play Console:
1. **Setup → API access → Service accounts**
2. Find your service account
3. Click **Grant access**
4. Permissions:
   - ✅ View app information
   - ✅ Create and edit draft releases
   - ✅ Release to testing tracks
5. Click **Invite user** → **Send invite**

### 3. Add Secret to GitHub

```bash
# Copy the JSON file content
cat ~/Downloads/your-service-account-key.json | pbcopy
```

Add to GitHub Secrets:
- Name: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
- Value: Paste the entire JSON content

---

## 🎯 Usage

### Automatic Deploy (Every Push)

Simply push to main:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

This will:
1. ✅ Build web version (Vercel auto-deploys)
2. ✅ Build Android APK
3. ✅ Build Android AAB (App Bundle)
4. ✅ Upload APK to Google Play Internal Testing (if configured)
5. ✅ Save APK as GitHub artifact (downloadable for 30 days)

### Create Release with Downloads

To create a public release with downloadable APK:

```bash
# 1. Update version in package.json and android/app/build.gradle
# versionCode: 3, versionName: "1.0.1"

# 2. Commit version bump
git add .
git commit -m "Bump version to 1.0.1"

# 3. Create and push tag
git tag v1.0.1
git push origin main --tags
```

This creates a GitHub Release at:
`https://github.com/Jenks18/mafuta/releases/tag/v1.0.1`

With downloadable:
- `app-release.apk` (for direct install)
- `app-release.aab` (for Play Store)

### Manual Deploy

Go to GitHub Actions tab:
`https://github.com/Jenks18/mafuta/actions/workflows/deploy-all-platforms.yml`

Click **"Run workflow"** → **"Run workflow"**

---

## 📦 What Gets Built

### Every Push to Main:

| Platform | Output | Deployed To | Access |
|----------|--------|-------------|---------|
| **Web** | Static site | Vercel (auto) | Live: mafutapass.vercel.app |
| **Android APK** | app-release.apk | GitHub Artifacts | Download from Actions run |
| **Android AAB** | app-release.aab | Google Play Internal | Internal testing link |

### Tagged Release (v1.0.x):

| Platform | Output | Deployed To | Access |
|----------|--------|-------------|---------|
| **Web** | Static site | Vercel | Live URL |
| **Android APK** | app-release.apk | GitHub Release | Public download link |
| **Android AAB** | app-release.aab | Google Play Production | Draft release (manual publish) |

---

## 🔍 Monitoring Deployments

### Check Build Status

**GitHub Actions:**
https://github.com/Jenks18/mafuta/actions

- ✅ Green checkmark = Build succeeded
- ❌ Red X = Build failed (click for logs)
- 🟡 Yellow dot = Building...

### Download APK from Actions

1. Go to successful workflow run
2. Scroll to **Artifacts** section
3. Download **android-apk** (valid for 30 days)
4. Unzip and share with testers

### Vercel Deployment

Vercel auto-deploys on every push:
- Dashboard: https://vercel.com/dashboard
- Preview URL generated per commit
- Production: Your custom domain

---

## 🎨 Customization

### Change Deployment Tracks

Edit `.github/workflows/deploy-all-platforms.yml`:

```yaml
# For beta testing track instead of internal
track: beta  # Options: internal, alpha, beta, production

# For immediate production release (not draft)
status: completed  # Options: draft, completed
```

### Add iOS Build (Future)

When you set up iOS:

```yaml
ios-build:
  name: Build iOS IPA
  runs-on: macos-latest
  steps:
    - uses: actions/checkout@v4
    # iOS build steps here
    # Upload to TestFlight
```

Requires:
- Apple Developer account
- iOS signing certificates
- Provisioning profiles

---

## 🔧 Troubleshooting

### Build Fails: "SDK location not found"

Android SDK is automatically installed on GitHub runners. If it fails, check Java version:
```yaml
java-version: '17'  # Must be 11 or 17
```

### Build Fails: "Keystore not found"

Verify secrets are set correctly:
1. Check `ANDROID_KEYSTORE_BASE64` is the full base64 string
2. Verify `ANDROID_KEYSTORE_PASSWORD` matches your keystore

### Google Play Upload Fails

Common issues:
- Service account doesn't have proper permissions
- Package name mismatch (`com.mafutapass.app`)
- Version code not incremented
- First upload must be manual via Play Console

### Artifacts Not Appearing

Artifacts only kept for 30 days. For permanent downloads, create tagged releases.

---

## 💡 Best Practices

### Version Bumping Strategy

**For each release:**
1. Increment `versionCode` (always +1)
2. Update `versionName` semantically:
   - `1.0.0` → `1.0.1` (bug fixes)
   - `1.0.0` → `1.1.0` (new features)
   - `1.0.0` → `2.0.0` (breaking changes)

### Testing Strategy

1. **Internal Testing** (automatic):
   - Every push to main
   - Small group of testers
   - Fast feedback

2. **Beta Testing** (manual promotion):
   - Promote from internal after validation
   - Wider audience
   - Collect analytics

3. **Production** (manual):
   - Full testing complete
   - Gradual rollout (10% → 50% → 100%)

### Release Notes

Create `metadata/release-notes/en-US/default.txt`:
```
What's New in v1.0.1:
- Improved receipt OCR accuracy
- Fixed transaction list crash
- Better offline support
```

---

## 📊 Cost Estimate

### GitHub Actions (Free Tier)

- 2,000 minutes/month free for public repos
- Each full build: ~10 minutes
- **Est. 200 builds/month free**

### Paid Tiers

If you exceed free tier:
- $0.008/minute for Linux runners
- $0.016/minute for macOS runners (iOS)

---

## 🚀 Quick Reference

### Deploy New Version

```bash
# 1. Make changes
vim src/components/TransactionForm.jsx

# 2. Update version
# Edit package.json: "version": "1.0.1"
# Edit android/app/build.gradle: versionCode 3, versionName "1.0.1"

# 3. Commit and push
git add .
git commit -m "Add feature X"
git push origin main

# 4. (Optional) Create release
git tag v1.0.1
git push origin --tags

# 5. Monitor build
# https://github.com/Jenks18/mafuta/actions

# 6. Download APK or share Play Store link
```

### Emergency Hotfix

```bash
# Fix critical bug
git add .
git commit -m "Hotfix: Fix crash on launch"
git push origin main

# Build completes in ~10 minutes
# Download APK from Actions → Share with users
```

---

**That's it!** One push updates everything. 🎉
