# 🚀 Quick Commands for Mafutapass Development

## 📱 Android Development

### Open Android Studio
```bash
npm run android:open
# or
npx cap open android
```

### Build and Sync (after making web changes)
```bash
npm run android:sync
# This runs: npm run build && npx cap sync android
```

### Full Android Dev Cycle (build + sync + open)
```bash
npm run android:dev
# This runs: npm run build && npx cap sync android && npx cap open android
```

### Manual Steps
```bash
# 1. Build web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open Android Studio
npx cap open android
```

---

## 🌐 Web Development

### Run Local Dev Server
```bash
npm run dev
# Opens: http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output: dist/
```

### Preview Production Build
```bash
npm run preview
```

---

## 🚢 Deployment

### Deploy to Vercel
```bash
vercel --prod
# or push to main branch (auto-deploys)
```

### Current Deployment
- **URL**: https://raty-rsjf-i0dh6gvby-jenks18s-projects.vercel.app
- **Project**: raty-rsjf
- **Framework**: Vite + React

---

## 📊 Database

### Connect to Supabase
```bash
# Already configured in src/lib/supabaseClient.js
# Tables: organizations, profiles, drivers, vehicles, fuel_cards, transactions, wallet_transactions, payroll_payouts
```

### Reload Schema Cache (after SQL changes)
```sql
NOTIFY pgrst, 'reload schema';
```

---

## 🔧 Common Workflows

### After Changing React Code
```bash
# Option 1: Test in browser
npm run dev

# Option 2: Test on Android
npm run android:sync  # Then click ▶️ in Android Studio
```

### First Time Android Studio Setup
```bash
# 1. Open project
npm run android:open

# 2. Wait for Gradle sync (2-5 min)

# 3. Create emulator:
#    - Tools → Device Manager → Create Device
#    - Choose: Pixel 5 or 6 + Android 14 (UpsideDownCake)

# 4. Click green ▶️ to run
```

### Update Capacitor Config
```bash
# Edit: capacitor.config.json
# Change server.url for different environments
npx cap sync android  # Apply changes
```

---

## 🎨 PWA Development

### Test PWA Locally
```bash
npm run build
npm run preview
# Visit http://localhost:4173 in mobile browser
# Try "Add to Home Screen"
```

### Update PWA Icons
```bash
# Replace placeholder icons in public/ folder:
# - pwa-192x192.svg
# - pwa-512x512.svg
# - apple-touch-icon-180x180.svg
# Then rebuild:
npm run build
```

---

## 📦 Package Management

### Install New Dependencies
```bash
# Production
npm install package-name

# Development
npm install --save-dev package-name

# Don't forget to sync Android after adding Capacitor plugins:
npx cap sync android
```

### Update Dependencies
```bash
npm update
npx cap sync android  # Sync Capacitor changes
```

---

## 🐛 Troubleshooting

### Android Build Fails
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android:sync
```

### App Shows Old Version
```bash
# Hard refresh the sync
npm run build
npx cap sync android --force
```

### PostgREST API 404 Errors
```sql
-- In Supabase SQL Editor:
NOTIFY pgrst, 'reload schema';
```

### Check Capacitor Setup
```bash
npx cap doctor
```

---

## 📱 Testing on Real Device

### Via USB (Recommended)
1. Enable Developer Options on Android phone
2. Enable USB Debugging
3. Connect via USB
4. Run in Android Studio (device will appear in dropdown)

### Via WiFi
1. Same network as development machine
2. In Android Studio: Pair via QR code
3. Run app wirelessly

---

## 🏗️ Building for Release

### Build Signed AAB (Google Play)
```bash
# In Android Studio:
# Build → Generate Signed Bundle / APK
# Choose: Android App Bundle (.aab)
# Create keystore (save credentials securely!)
# Build type: release
# Output: android/app/release/app-release.aab
```

### Build Test APK
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🌐 Domain Setup (Recommended)

### After Purchasing Domain (e.g., mafutapass.com)
1. Add domain in Vercel dashboard
2. Update DNS records (Vercel provides instructions)
3. Update `capacitor.config.json`:
   ```json
   "server": {
     "url": "https://mafutapass.com"
   }
   ```
4. Sync and rebuild:
   ```bash
   npm run android:sync
   ```

---

## 📊 Project Structure Quick Reference

```
mafuta/
├── android/              # Native Android project (Capacitor)
├── dist/                # Production build (generated)
├── public/              # Static assets + PWA icons
├── src/                 # React source code
│   ├── components/      # React components
│   ├── lib/            # Utilities, Supabase client
│   └── App.jsx         # Main app component
├── capacitor.config.json  # Capacitor configuration
├── vite.config.js       # Build configuration
└── package.json         # Dependencies + scripts
```

---

## 💡 Pro Tips

1. **Development Speed**: Use `npm run dev` for web changes (instant hot reload)
2. **Android Testing**: Only sync when you need to test native features
3. **PWA First**: Test in mobile browser before building Android
4. **Keep Vercel Synced**: Capacitor loads from Vercel URL in production
5. **Keystore Safety**: Backup your Android keystore file + passwords (cannot recover!)
6. **One-Time Costs**: Google Play = $25 forever, unlimited apps
7. **Domain Professional**: mafutapass.com >> vercel.app URL for users
8. **Native Features**: Use Capacitor plugins for camera, push notifications, etc.

---

## 🆘 Need Help?

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Vite PWA Plugin**: https://vite-pwa-org.netlify.app
- **Android Studio**: https://developer.android.com/studio
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs

---

## ✅ Current Status

- ✅ Database: 8 tables created and working
- ✅ PWA: Installed, configured, deployed
- ✅ Capacitor: Android project ready
- ✅ Scripts: Quick commands added to package.json
- ⏳ Next: Open Android Studio and test

**Ready to run**: `npm run android:open`
