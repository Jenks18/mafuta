# Mafutapass Beta Testing Guide
**Version 1.0.0** | December 2, 2025

## 🎉 Ready for Beta Testing!

Your Android APK is ready to distribute to testers. The app now includes:
- ✅ Receipt photo capture with OCR (Google Vision API)
- ✅ Transaction management
- ✅ Fleet dashboard
- ✅ Real-time fuel station map
- ✅ Clerk authentication

---

## 📱 Distribution Options

### Option 1: Direct APK Download (Fastest)
Best for quick testing with small groups (<20 people).

**Steps:**
1. **Upload APK to cloud storage:**
   ```bash
   # Upload to Google Drive, Dropbox, or GitHub Releases
   ```

2. **Share download link with testers**

3. **Installation instructions for testers:**
   - Download `mafutapass-v1.0.0-beta.apk`
   - Go to Settings → Security → Enable "Install from Unknown Sources"
   - Open the downloaded APK file
   - Tap "Install"
   - Open Mafutapass and sign up

**APK Location:** `/Users/iannjenga/Documents/GitHub/mafuta/mafutapass-v1.0.0-beta.apk`

**APK Size:** 2.7 MB

---

### Option 2: Google Play Console Internal Testing Track (Recommended)
Best for organized testing with up to 100 testers. Automatic updates!

**Steps:**
1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (com.mafutapass.app)
3. Navigate to **Testing → Internal testing**
4. Click **Create new release**
5. Upload `android/app/build/outputs/apk/release/app-release.apk`
6. Add release notes:
   ```
   Mafutapass v1.0.0 Beta
   - Photo receipt capture with OCR
   - Transaction management
   - Fleet dashboard
   - Real-time fuel stations
   ```
7. Click **Save** → **Review release** → **Start rollout**
8. Copy the **Internal testing opt-in link**
9. Share link with testers

**Tester instructions:**
- Click the opt-in link
- Accept the invitation
- Install from Google Play Store
- Updates will be automatic

---

### Option 3: Firebase App Distribution (Mid-size teams)
Great for organized testing with analytics and crash reporting.

**Setup:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize App Distribution
firebase init appdistribution

# Upload APK
firebase appdistribution:distribute \
  android/app/build/outputs/apk/release/app-release.apk \
  --app YOUR_FIREBASE_APP_ID \
  --groups "beta-testers" \
  --release-notes "Mafutapass v1.0.0 - Receipt capture beta"
```

---

## ✅ Pre-Launch Checklist

Before sending to testers, verify:

### Environment Configuration
- [ ] **Vercel:** Add `VITE_GOOGLE_VISION_API_KEY` environment variable
- [ ] **Supabase Storage:** Create `receipts` bucket (see RECEIPT_CAPTURE_SETUP.md)
- [ ] **Supabase Migration:** Run `020_add_receipt_ocr_fields.sql`
- [ ] **Google Vision API:** Restrict API key in Cloud Console

### Testing Preparation
- [ ] Test APK installation on real Android device
- [ ] Verify Clerk authentication works
- [ ] Test receipt photo capture
- [ ] Verify OCR extraction
- [ ] Check transaction list displays receipts
- [ ] Test on different Android versions (8.0+)

---

## 🧪 What Testers Should Test

### Core Features
1. **Sign Up/Login**
   - Create account with email/phone
   - Google OAuth sign-in
   - Sign out and back in

2. **Receipt Capture**
   - Take photo of fuel receipt
   - Upload existing receipt photo
   - Verify OCR extracts: amount, date, station name
   - Check confidence scores display correctly
   - Test with various receipt formats (Shell, Total, Engen, etc.)

3. **Transaction Management**
   - View transaction list
   - Click receipt thumbnails to view full image
   - Add manual transaction
   - Edit/delete transactions

4. **Fleet Features**
   - View fleet dashboard
   - Add/manage vehicles
   - Add/manage drivers
   - Assign transactions to vehicles

5. **Find Fuel**
   - View nearby stations on map
   - Search for specific stations
   - View station details

### Edge Cases to Test
- Poor lighting receipt photos
- Crumpled or damaged receipts
- Non-English receipts
- Very old receipts (faded text)
- Offline mode behavior
- Low storage scenarios

---

## 📊 Feedback Collection

### What to Ask Testers
1. **Usability:**
   - Was signup easy?
   - Is the receipt capture intuitive?
   - Did OCR work accurately?

2. **Performance:**
   - How fast is receipt processing?
   - Any lag or crashes?
   - Battery drain noticeable?

3. **Bugs:**
   - Screenshot any errors
   - Note device model and Android version
   - Steps to reproduce issues

### Feedback Channels
- Google Form survey
- WhatsApp group
- Email: support@mafutapass.com
- In-app feedback (if implemented)

---

## 🔄 Building New Versions

When you need to update the app:

```bash
# 1. Make code changes
# 2. Update version number
# Edit package.json: version "1.0.1"
# Edit android/app/build.gradle: versionCode 3, versionName "1.0.1"

# 3. Build and sync
npm run build
npx cap sync android

# 4. Build APK
cd android
./gradlew assembleRelease

# 5. Copy APK
cd ..
cp android/app/build/outputs/apk/release/app-release.apk \
   ./mafutapass-v1.0.1-beta.apk

# 6. Distribute to testers
```

**Version numbering:**
- `versionCode` (integer): Increment by 1 for each build (2, 3, 4...)
- `versionName` (string): Semantic versioning (1.0.0, 1.0.1, 1.1.0...)

---

## 🚨 Known Limitations (Beta)

1. **Receipt OCR:**
   - Accuracy depends on photo quality
   - May struggle with non-standard layouts
   - Manual review required for low confidence (<60%)

2. **Storage:**
   - Receipts stored in Supabase (free tier: 1GB)
   - Consider cleanup policy for old receipts

3. **No iOS Version Yet:**
   - Android only for now
   - iOS requires separate Apple Developer account ($99/year)

4. **No Payment Integration:**
   - Phase 1 focuses on receipt tracking
   - Payment stack coming in Phase 2

---

## 📈 Success Metrics

Track during beta:
- Signup completion rate
- Receipt capture usage (% of transactions with receipts)
- OCR accuracy (confidence scores)
- Crash rate
- User retention (Day 1, Day 7)
- Feedback sentiment

---

## 🎯 Next Steps

1. **Immediate:**
   - [ ] Configure Supabase storage bucket
   - [ ] Run database migration
   - [ ] Add Vercel environment variable
   - [ ] Test APK on your own device

2. **This Week:**
   - [ ] Recruit 5-10 beta testers
   - [ ] Set up feedback collection method
   - [ ] Monitor crash reports
   - [ ] Document common issues

3. **Next Sprint:**
   - [ ] Fix critical bugs from feedback
   - [ ] Improve OCR accuracy based on real receipts
   - [ ] Optimize performance bottlenecks
   - [ ] Prepare for wider rollout

---

## 📞 Support

**For Testers:**
- Setup issues: See RECEIPT_CAPTURE_SETUP.md
- App crashes: Email logs to support@mafutapass.com
- Feature requests: Submit via feedback form

**For You:**
- Vercel logs: https://vercel.com/dashboard
- Supabase logs: Project → Logs
- Google Vision API usage: Cloud Console → APIs & Services

---

**Built with:** React + Vite + Capacitor + Clerk + Supabase + Google Vision AI

**Last updated:** December 2, 2025
