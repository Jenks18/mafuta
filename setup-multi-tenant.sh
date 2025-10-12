#!/bin/bash

# 🎯 Mafuta Multi-Tenant Setup Script
# Run this to quickly set up your multi-tenant environment

set -e  # Exit on error

echo "🚀 Mafuta Multi-Tenant Setup"
echo "================================"
echo ""

# Check if running in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

echo "📦 Step 1: Installing dependencies..."
echo "================================"

# Check if Clerk is already installed
if ! grep -q "@clerk/clerk-react" package.json; then
  echo "Installing Clerk..."
  npm install @clerk/clerk-react
else
  echo "✓ Clerk already installed"
fi

# Check if Supabase client is installed
if ! grep -q "@supabase/supabase-js" package.json; then
  echo "Installing Supabase client..."
  npm install @supabase/supabase-js
else
  echo "✓ Supabase client already installed"
fi

# Check if React Router is installed
if ! grep -q "react-router-dom" package.json; then
  echo "Installing React Router..."
  npm install react-router-dom
else
  echo "✓ React Router already installed"
fi

echo ""
echo "✅ Dependencies installed!"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "📝 Step 2: Creating .env file..."
  echo "================================"
  
  cat > .env << 'EOF'
# Clerk Configuration
# Get these from https://dashboard.clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# Supabase Configuration
# Get these from https://app.supabase.com
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Optional: Supabase Service Role Key (for admin operations)
# SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
EOF

  echo "✅ Created .env file"
  echo ""
  echo "⚠️  ACTION REQUIRED:"
  echo "   1. Go to https://dashboard.clerk.com and create a new app"
  echo "   2. Copy your Publishable Key to .env"
  echo "   3. Go to https://app.supabase.com and create a new project"
  echo "   4. Copy your URL and Anon Key to .env"
  echo ""
  read -p "Press Enter once you've updated .env with your keys..."
else
  echo "✓ .env file already exists"
fi

echo ""
echo "🗄️  Step 3: Database Setup"
echo "================================"
echo ""
echo "Next, you need to set up your Supabase database:"
echo ""
echo "Option A: Using Supabase CLI (recommended)"
echo "   1. Install Supabase CLI: npm install -g supabase"
echo "   2. Run: npx supabase db push"
echo ""
echo "Option B: Manual Setup"
echo "   1. Go to your Supabase project"
echo "   2. Open the SQL Editor"
echo "   3. Copy the contents of supabase/migrations/001_multi_tenant_schema.sql"
echo "   4. Run the SQL script"
echo ""
read -p "Have you completed the database setup? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "⚠️  Please complete the database setup and run this script again."
  exit 1
fi

echo ""
echo "🔐 Step 4: Clerk JWT Template Setup"
echo "================================"
echo ""
echo "You need to configure Clerk to generate Supabase-compatible JWTs:"
echo ""
echo "1. Go to: https://dashboard.clerk.com → JWT Templates"
echo "2. Click 'New Template' → Select 'Supabase'"
echo "3. Use these claims:"
echo ""
cat << 'EOF'
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address}}",
  "role": "{{user.public_metadata.role}}",
  "account_type": "{{user.public_metadata.accountType}}"
}
EOF
echo ""
echo "4. Save the template"
echo ""
read -p "Have you set up the Clerk JWT template? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "⚠️  Please complete the Clerk JWT setup and run this script again."
  exit 1
fi

echo ""
echo "🔄 Step 5: Activating Multi-Tenant App"
echo "================================"

# Check if App.jsx is the old version
if grep -q "useState\|activeTab" src/App.jsx 2>/dev/null; then
  echo "Backing up old App.jsx..."
  cp src/App.jsx src/App_Backup_$(date +%Y%m%d_%H%M%S).jsx
  echo "✓ Backup created"
fi

# Ask if user wants to replace App.jsx
echo ""
echo "Do you want to replace src/App.jsx with the multi-tenant version?"
echo "(Your current App.jsx will be backed up)"
read -p "Replace App.jsx? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  cp src/App_MultiTenant.jsx src/App.jsx
  echo "✅ App.jsx replaced with multi-tenant version"
else
  echo "ℹ️  Skipping App.jsx replacement"
  echo "   You can manually use App_MultiTenant.jsx later"
fi

echo ""
echo "🎨 Step 6: Checking Required Files"
echo "================================"

files=(
  "src/config/userTypes.js"
  "src/lib/supabaseAuth.js"
  "src/components/onboarding/AccountTypeSelector.jsx"
  "src/components/onboarding/FleetOnboarding.jsx"
  "src/components/onboarding/IndividualOnboarding.jsx"
  "src/components/onboarding/OnboardingRouter.jsx"
  "src/components/auth/ProtectedRoute.jsx"
  "src/pages/fleet/FleetDashboard.jsx"
)

all_files_exist=true

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file"
  else
    echo "❌ Missing: $file"
    all_files_exist=false
  fi
done

if [ "$all_files_exist" = false ]; then
  echo ""
  echo "⚠️  Some required files are missing!"
  echo "   Please make sure all files were created correctly."
  exit 1
fi

echo ""
echo "✅ All required files present!"

echo ""
echo "🧪 Step 7: Running Tests"
echo "================================"

# Test environment variables
if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ] || [ "$VITE_CLERK_PUBLISHABLE_KEY" = "pk_test_YOUR_KEY_HERE" ]; then
  echo "⚠️  Warning: VITE_CLERK_PUBLISHABLE_KEY not set or using placeholder"
  echo "   Make sure to update .env with your real Clerk key"
else
  echo "✓ Clerk key configured"
fi

if [ -z "$VITE_SUPABASE_URL" ] || [ "$VITE_SUPABASE_URL" = "https://YOUR_PROJECT.supabase.co" ]; then
  echo "⚠️  Warning: VITE_SUPABASE_URL not set or using placeholder"
  echo "   Make sure to update .env with your real Supabase URL"
else
  echo "✓ Supabase URL configured"
fi

echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start your development server:"
echo "   npm run dev"
echo ""
echo "2. Test the onboarding flow:"
echo "   • Sign up at /sign-up"
echo "   • Choose account type (Fleet or Individual)"
echo "   • Complete onboarding"
echo "   • Verify you land on the correct dashboard"
echo ""
echo "3. Read the implementation guide:"
echo "   cat MULTI_TENANT_IMPLEMENTATION.md"
echo ""
echo "4. Review architecture diagrams:"
echo "   cat ARCHITECTURE_DIAGRAMS.md"
echo ""
echo "📚 Documentation:"
echo "   • MULTI_TENANT_AUTH_GUIDE.md - Training manual"
echo "   • MULTI_TENANT_IMPLEMENTATION.md - Step-by-step guide"
echo "   • ARCHITECTURE_DIAGRAMS.md - Visual diagrams"
echo ""
echo "Happy coding! 🚀"
