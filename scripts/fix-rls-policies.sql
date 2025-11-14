-- =====================================================
-- FIX RLS POLICIES TO ALLOW ACCESS
-- This temporarily disables strict RLS for development
-- =====================================================

-- First, let's see what policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
  'organizations', 'profiles', 'drivers', 'vehicles', 
  'fuel_cards', 'transactions', 'wallet_transactions', 'payroll_payouts'
)
ORDER BY tablename, policyname;

-- =====================================================
-- DROP ALL RESTRICTIVE POLICIES (for development)
-- =====================================================

-- Drop all existing policies on these tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'organizations', 'profiles', 'drivers', 'vehicles', 
            'fuel_cards', 'transactions', 'wallet_transactions', 'payroll_payouts'
        )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- =====================================================
-- CREATE PERMISSIVE POLICIES FOR DEVELOPMENT
-- These allow all operations for development/testing
-- ⚠️ REPLACE WITH PROPER POLICIES IN PRODUCTION!
-- =====================================================

-- Organizations
CREATE POLICY "Allow all operations on organizations" 
  ON organizations FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Profiles
CREATE POLICY "Allow all operations on profiles" 
  ON profiles FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Drivers
CREATE POLICY "Allow all operations on drivers" 
  ON drivers FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Vehicles
CREATE POLICY "Allow all operations on vehicles" 
  ON vehicles FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Fuel Cards
CREATE POLICY "Allow all operations on fuel_cards" 
  ON fuel_cards FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Transactions
CREATE POLICY "Allow all operations on transactions" 
  ON transactions FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Wallet Transactions
CREATE POLICY "Allow all operations on wallet_transactions" 
  ON wallet_transactions FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Payroll Payouts
CREATE POLICY "Allow all operations on payroll_payouts" 
  ON payroll_payouts FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- =====================================================
-- GRANT PERMISSIONS TO ANON AND AUTHENTICATED ROLES
-- =====================================================

GRANT ALL ON organizations TO anon, authenticated;
GRANT ALL ON profiles TO anon, authenticated;
GRANT ALL ON drivers TO anon, authenticated;
GRANT ALL ON vehicles TO anon, authenticated;
GRANT ALL ON fuel_cards TO anon, authenticated;
GRANT ALL ON transactions TO anon, authenticated;
GRANT ALL ON wallet_transactions TO anon, authenticated;
GRANT ALL ON payroll_payouts TO anon, authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check RLS is still enabled but with permissive policies
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
  'organizations', 'profiles', 'drivers', 'vehicles', 
  'fuel_cards', 'transactions', 'wallet_transactions', 'payroll_payouts'
)
GROUP BY tablename
ORDER BY tablename;

-- Expected: Each table should have 1 policy
-- ✅ If you see 1 policy per table, you're good to go!
