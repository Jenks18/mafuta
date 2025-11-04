-- =====================================================
-- VERIFY TABLES CREATED
-- Run this in Supabase SQL Editor to check if tables exist
-- =====================================================

-- Check if all tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) 
   FROM information_schema.columns 
   WHERE table_schema = 'public' 
   AND columns.table_name = tables.table_name 
   AND column_name = 'organization_id') as has_org_id
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('drivers', 'vehicles', 'profiles', 'fuel_cards', 'wallet_transactions', 'payroll_payouts')
ORDER BY table_name;

-- Check indexes
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('drivers', 'vehicles', 'profiles', 'fuel_cards', 'wallet_transactions', 'payroll_payouts')
ORDER BY tablename, indexname;

-- Check RLS policies
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('drivers', 'vehicles', 'profiles', 'fuel_cards', 'wallet_transactions', 'payroll_payouts')
ORDER BY tablename;
