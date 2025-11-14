-- =====================================================
-- FIX SCHEMA MISMATCHES
-- This adds missing columns that the app expects
-- =====================================================

-- Check what columns exist in organizations
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'organizations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in profiles  
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in drivers
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'drivers'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in vehicles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'vehicles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in fuel_cards
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'fuel_cards'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check what columns exist in transactions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'transactions'
AND table_schema = 'public'
ORDER BY ordinal_position;
