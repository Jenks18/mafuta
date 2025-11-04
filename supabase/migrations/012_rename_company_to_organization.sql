-- =====================================================
-- RENAME company_id to organization_id
-- This fixes the mismatch between database schema and app code
-- =====================================================

-- Rename columns in all tables
ALTER TABLE vehicles 
  RENAME COLUMN company_id TO organization_id;

ALTER TABLE transactions 
  RENAME COLUMN company_id TO organization_id;

ALTER TABLE driver_assignments 
  RENAME COLUMN company_id TO organization_id;

ALTER TABLE payroll_payouts 
  RENAME COLUMN company_id TO organization_id;

-- Update index names
DROP INDEX IF EXISTS idx_vehicles_company;
CREATE INDEX idx_vehicles_organization ON vehicles(organization_id);

DROP INDEX IF EXISTS idx_transactions_company;
CREATE INDEX idx_transactions_organization ON transactions(organization_id);

DROP INDEX IF EXISTS idx_driver_assignments_company;
CREATE INDEX idx_driver_assignments_organization ON driver_assignments(organization_id);

DROP INDEX IF EXISTS idx_payroll_payouts_company;
CREATE INDEX idx_payroll_payouts_organization ON payroll_payouts(organization_id);

-- Note: users table uses company_id as a foreign key, keeping as is since it's a reference
-- fuel_cards already uses organization_id
-- wallet_transactions doesn't have company_id
