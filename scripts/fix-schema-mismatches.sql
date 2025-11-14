-- =====================================================
-- ADD MISSING COLUMNS TO MATCH APP EXPECTATIONS
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. FIX ORGANIZATIONS TABLE
-- Add status column (it probably exists with a different constraint or was renamed)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' AND column_name = 'status'
    ) THEN
        ALTER TABLE organizations ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled'));
    END IF;
END $$;

-- Add business_type if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' AND column_name = 'business_type'
    ) THEN
        ALTER TABLE organizations ADD COLUMN business_type TEXT;
    END IF;
END $$;

-- 2. FIX PROFILES TABLE  
-- Add clerk_id (critical for authentication!)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'clerk_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN clerk_id TEXT UNIQUE;
    END IF;
END $$;

-- Add first_name
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'first_name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN first_name TEXT;
    END IF;
END $$;

-- Add last_name
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'last_name'
    ) THEN
        ALTER TABLE profiles ADD COLUMN last_name TEXT;
    END IF;
END $$;

-- Add index on clerk_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);

-- 3. FIX DRIVERS TABLE
-- Add email column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'drivers' AND column_name = 'email'
    ) THEN
        ALTER TABLE drivers ADD COLUMN email TEXT;
    END IF;
END $$;

-- 4. FIX WALLET_TRANSACTIONS TABLE
-- Add transaction_type (might exist with different name)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'wallet_transactions' AND column_name = 'transaction_type'
    ) THEN
        ALTER TABLE wallet_transactions ADD COLUMN transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit', 'refund', 'adjustment'));
        
        -- If there's a 'type' column, copy its values
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'wallet_transactions' AND column_name = 'type'
        ) THEN
            UPDATE wallet_transactions SET transaction_type = type WHERE transaction_type IS NULL;
        END IF;
    END IF;
END $$;

-- =====================================================
-- VERIFICATION - Run this to confirm all columns exist
-- =====================================================

SELECT 
  'organizations' as table_name,
  COUNT(CASE WHEN column_name IN ('status', 'business_type') THEN 1 END) as required_columns,
  2 as expected_columns
FROM information_schema.columns 
WHERE table_name = 'organizations' AND column_name IN ('status', 'business_type')

UNION ALL

SELECT 
  'profiles',
  COUNT(CASE WHEN column_name IN ('clerk_id', 'first_name', 'last_name') THEN 1 END),
  3
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name IN ('clerk_id', 'first_name', 'last_name')

UNION ALL

SELECT 
  'drivers',
  COUNT(CASE WHEN column_name = 'email' THEN 1 END),
  1
FROM information_schema.columns 
WHERE table_name = 'drivers' AND column_name = 'email'

UNION ALL

SELECT 
  'wallet_transactions',
  COUNT(CASE WHEN column_name = 'transaction_type' THEN 1 END),
  1
FROM information_schema.columns 
WHERE table_name = 'wallet_transactions' AND column_name = 'transaction_type';

-- Expected result: All rows should show required_columns = expected_columns
-- If they match, you're good to go! ✅
