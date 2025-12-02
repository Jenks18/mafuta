#!/bin/bash

# Script to prepare GitHub Secrets for CI/CD
# Run this to get the values you need to add to GitHub

echo "================================================"
echo "  MAFUTAPASS CI/CD SECRETS PREPARATION"
echo "================================================"
echo ""

cd "$(dirname "$0")"

echo "📋 Collecting secrets from your environment..."
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ Found .env file"
    echo ""
    echo "=== ENVIRONMENT VARIABLES ==="
    echo ""
    
    # Extract values from .env
    source .env
    
    echo "1. VITE_GOOGLE_VISION_API_KEY"
    echo "   Value: $VITE_GOOGLE_VISION_API_KEY"
    echo ""
    
    echo "2. VITE_CLERK_PUBLISHABLE_KEY"
    echo "   Value: $VITE_CLERK_PUBLISHABLE_KEY"
    echo ""
    
    echo "3. VITE_SUPABASE_URL"
    echo "   Value: $VITE_SUPABASE_URL"
    echo ""
    
    echo "4. VITE_SUPABASE_ANON_KEY"
    echo "   Value: $VITE_SUPABASE_ANON_KEY"
    echo ""
else
    echo "⚠️  .env file not found"
    echo ""
fi

# Check keystore
echo "=== ANDROID KEYSTORE ==="
echo ""

if [ -f "android/mafutapass.keystore" ]; then
    echo "✅ Found keystore file"
    echo ""
    echo "5. ANDROID_KEYSTORE_BASE64"
    echo "   Encoding keystore to base64..."
    KEYSTORE_BASE64=$(base64 -i android/mafutapass.keystore)
    echo "   Value: $KEYSTORE_BASE64"
    echo ""
    echo "   📋 This has been copied to clipboard!"
    echo "$KEYSTORE_BASE64" | pbcopy
else
    echo "❌ Keystore not found at android/mafutapass.keystore"
    echo ""
fi

# Check keystore properties
if [ -f "android/keystore.properties" ]; then
    echo "✅ Found keystore.properties"
    echo ""
    
    # Read keystore properties
    KEYSTORE_PASSWORD=$(grep "storePassword=" android/keystore.properties | cut -d'=' -f2)
    KEY_ALIAS=$(grep "keyAlias=" android/keystore.properties | cut -d'=' -f2)
    KEY_PASSWORD=$(grep "keyPassword=" android/keystore.properties | cut -d'=' -f2)
    
    echo "6. ANDROID_KEYSTORE_PASSWORD"
    echo "   Value: $KEYSTORE_PASSWORD"
    echo ""
    
    echo "7. ANDROID_KEY_ALIAS"
    echo "   Value: $KEY_ALIAS"
    echo ""
    
    echo "8. ANDROID_KEY_PASSWORD"
    echo "   Value: $KEY_PASSWORD"
    echo ""
else
    echo "⚠️  keystore.properties not found"
    echo ""
fi

echo "================================================"
echo ""
echo "🔑 NEXT STEPS:"
echo ""
echo "1. Go to: https://github.com/Jenks18/mafuta/settings/secrets/actions"
echo ""
echo "2. Click 'New repository secret' for each value above"
echo ""
echo "3. Copy-paste the values exactly as shown"
echo ""
echo "4. (Optional) Set up Google Play service account:"
echo "   - See CICD_SETUP.md for detailed instructions"
echo ""
echo "================================================"
echo ""
echo "📝 Save this output for reference!"
echo ""
