# Apply Database Migrations - URGENT FIX

## Problem
Your app is showing errors because the database tables don't exist yet:
```
Error loading drivers: Could not find the table 'public.drivers'
Error loading vehicles: Could not find the table 'public.vehicles'  
Error loading cards: Could not find the table 'public.fuel_cards'
Error loading wallet transactions: Could not find the table 'public.wallet_transactions'
Error loading payroll payouts: Could not find the table 'public.payroll_payouts'
```

## Solution
Apply the 3 migrations in order to create all required tables.

---

## Step 1: Apply Base Schema Migration

This creates the core tables: organizations, profiles, drivers, vehicles, transactions.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project: `epyybtyguntyamvgpbuz`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the contents of `supabase/migrations/001_multi_tenant_schema.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Ctrl/Cmd + Enter)
8. Wait for confirmation: "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
cd /Users/iannjenga/Documents/GitHub/mafuta
supabase db push
```

---

## Step 2: Apply Wallet Transactions Migration

This creates the wallet_transactions table for digital wallet features.

1. In **SQL Editor**, click **New Query**
2. Copy contents of `supabase/migrations/010_wallet_transactions.sql`
3. Paste and click **Run**

---

## Step 3: Apply Fuel Cards Migration

This creates the fuel_cards table for card management.

1. In **SQL Editor**, click **New Query**
2. Copy contents of `supabase/migrations/011_fuel_cards.sql`
3. Paste and click **Run**

---

## Verification

After applying all 3 migrations, refresh your app. The errors should be gone and you should see:

✅ Drivers page loads (empty or with data)
✅ Vehicles page loads  
✅ Cards page loads
✅ Wallet page loads
✅ Payroll pages load

---

## What Gets Created

### Migration 001 (Base Schema):
- `organizations` - Multi-tenant organization management
- `profiles` - User profiles linked to Clerk auth
- `drivers` - Driver management
- `vehicles` - Fleet vehicle tracking
- `transactions` - Fuel transaction records
- `payroll_payouts` - Driver payroll payments

### Migration 010 (Wallet):
- `wallet_transactions` - Digital wallet transaction history

### Migration 011 (Fuel Cards):
- `fuel_cards` - Fuel card management with driver/vehicle assignments

---

## Quick Copy Commands

### Get Base Schema:
```bash
cat supabase/migrations/001_multi_tenant_schema.sql
```

### Get Wallet Migration:
```bash
cat supabase/migrations/010_wallet_transactions.sql
```

### Get Fuel Cards Migration:
```bash
cat supabase/migrations/011_fuel_cards.sql
```

---

## Troubleshooting

### Error: "relation already exists"
Some tables may already exist. That's okay - continue with the next migration.

### Error: "permission denied"
Make sure you're using the **Service Role Key** or you're logged in as the project owner.

### Still seeing 404 errors after migrations?
1. Check that migrations ran successfully (no red error messages)
2. Hard refresh the app (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Clear browser cache and reload

---

## After Migrations Are Applied

Once all tables exist, your app will:
- Load all pages without 404 errors
- Show empty state messages instead of errors
- Allow you to add drivers, vehicles, cards, etc.
- Properly track transactions and payroll

**All mobile-optimized pages are ready to use!**
