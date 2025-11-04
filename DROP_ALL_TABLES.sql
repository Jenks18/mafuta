-- =====================================================
-- STEP 1: DROP ALL EXISTING TABLES
-- Run this FIRST to clean your database
-- =====================================================

DROP TABLE IF EXISTS payroll_payouts CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS fuel_cards CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Confirm tables are dropped
SELECT 'All tables dropped successfully! Now run CREATE_ALL_TABLES.sql' as message;
