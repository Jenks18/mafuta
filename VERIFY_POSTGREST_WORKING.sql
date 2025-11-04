-- Run this to verify PostgREST can see all your tables
-- This checks the REST API endpoints are working

-- Test 1: Check all tables are accessible
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN (
    'organizations',
    'profiles', 
    'drivers',
    'vehicles',
    'fuel_cards',
    'transactions',
    'wallet_transactions',
    'payroll_payouts'
  )
ORDER BY tablename;

-- Test 2: Verify foreign key relationships exist
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'profiles', 
    'drivers',
    'vehicles',
    'fuel_cards',
    'transactions',
    'wallet_transactions',
    'payroll_payouts'
  )
ORDER BY tc.table_name, kcu.column_name;

-- Test 3: Verify default organization exists
SELECT * FROM organizations;

-- All tests should return results
-- If any return 0 rows, there's a problem
