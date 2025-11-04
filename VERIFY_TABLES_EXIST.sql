-- Run this in Supabase SQL Editor to check if tables exist
-- This will show you which tables are actually in your database

SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'organizations', 
    'profiles', 
    'drivers', 
    'vehicles', 
    'fuel_cards', 
    'transactions', 
    'wallet_transactions', 
    'payroll_payouts'
  )
ORDER BY table_name;

-- If this returns 0 rows, it means you DIDN'T run the SETUP_DATABASE_STEP_BY_STEP.sql script
-- You need to run that script FIRST before the NOTIFY command will work
