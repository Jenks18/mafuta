# Reload Supabase Schema Cache

## The Problem
After creating tables in Supabase, the schema cache needs to be refreshed. Otherwise, you'll get 404 errors like:
- "Could not find the table 'public.drivers' in the schema cache"
- "Could not find the table 'public.fuel_cards' in the schema cache"

## Solution: Follow These Steps

### Option 1: Reload Schema in Supabase Dashboard (RECOMMENDED)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/epyybtyguntyamvgpbuz

2. **Go to API Settings**
   - Click on "Settings" in the left sidebar
   - Click on "API" 

3. **Reload Schema Cache**
   - Scroll down to find the "Schema" section
   - Click the **"Reload schema"** button
   - Wait for confirmation that schema has been reloaded

### Option 2: Run SQL Command to Reload

Run this SQL command in the Supabase SQL Editor:

```sql
NOTIFY pgrst, 'reload schema';
```

### Option 3: Restart PostgREST (Nuclear Option)

If the above doesn't work, restart the PostgREST server:

1. Go to your project settings in Supabase
2. Find the "Restart PostgREST" option
3. Click to restart

## Verification

After reloading the schema, verify the tables exist by running:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'organizations', 'profiles', 'drivers', 'vehicles', 
    'fuel_cards', 'transactions', 'wallet_transactions', 'payroll_payouts'
  )
ORDER BY table_name;
```

You should see all 8 tables listed.

## Then Refresh Your Browser

After the schema is reloaded in Supabase:
1. Go back to your app at http://localhost:5173
2. Do a **hard refresh**: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows/Linux)
3. All errors should be gone!

## Why This Happens

Supabase uses PostgREST to auto-generate REST APIs from your database schema. PostgREST caches the schema for performance. When you create new tables, you must explicitly tell PostgREST to reload the schema cache.
