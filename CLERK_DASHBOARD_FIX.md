# URGENT: Fix Clerk Dashboard to Stop Redirects

## Problem
Production is redirecting to `accounts.mafutapass.com` instead of using embedded components with green theme.

## Solution: Update Clerk Dashboard Settings

### Step 1: Disable Hosted Pages
1. Go to https://dashboard.clerk.com
2. Select your **MafutaPass** production instance (pk_live_Y2xlcmsubWFmdXRhcGFzcy5jb20k)
3. In left sidebar: **"User & Authentication"** → **"Email, Phone, Username"**
4. Scroll down to **"Paths"** section
5. Set these URLs:
   - **Sign-in URL**: `https://mafutapass.com/`
   - **Sign-up URL**: `https://mafutapass.com/`
   - **Sign-in redirect URL**: `https://mafutapass.com/`
   - **Sign-up redirect URL**: `https://mafutapass.com/`

### Step 2: Disable Account Portal Hosted Pages
1. In left sidebar: **"Account Portal"**
2. Find **"Hosted Pages"** toggle
3. **TURN OFF** "Enable Clerk Hosted Pages"
4. OR switch to **"Component Mode"** if available

### Step 3: Update OAuth Settings (if needed)
1. Go to **"User & Authentication"** → **"Social Connections"**
2. Click **"Google"** 
3. Make sure redirect URLs include:
   - `https://mafutapass.com/*`
   - `https://clerk.mafutapass.com/*` (if using custom domain)

### Step 4: Domain Settings
1. Go to **"Domains"**
2. Make sure your domain is: `mafutapass.com`
3. If you see `accounts.mafutapass.com`, this is the hosted pages domain
4. You can either:
   - Remove this domain (to force component mode)
   - OR add a custom domain for better control

## Verification
After making changes:
1. Clear browser cache
2. Visit https://mafutapass.com
3. Click "Sign up"
4. You should see:
   - ✅ Stay on mafutapass.com (no redirect)
   - ✅ Green gradient background
   - ✅ MafutaPass logo
   - ✅ Emerald green buttons

## If Still Not Working
Contact Clerk support and tell them:
- "I want to use embedded components, not hosted pages"
- "I'm being redirected to accounts.mafutapass.com"
- "I need all auth to happen on mafutapass.com domain"

They can help disable hosted pages on their end.
