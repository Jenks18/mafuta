-- =====================================================
-- CREATE ALL MISSING TABLES FOR MAFUTA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ORGANIZATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business_type TEXT,
  tax_id TEXT,
  billing_address JSONB,
  billing_email TEXT,
  phone TEXT,
  website TEXT,
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id),
  role TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DRIVERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  employee_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- VEHICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  vin TEXT,
  color TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('car', 'van', 'truck', 'semi', 'motorcycle', 'other')),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'cng', 'lng')),
  odometer DECIMAL(10, 2),
  assigned_driver_id UUID REFERENCES drivers(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'sold')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUEL_CARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fuel_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  card_number TEXT NOT NULL,
  last_four TEXT,
  card_provider TEXT,
  assigned_driver_id UUID REFERENCES drivers(id),
  assigned_vehicle_id UUID REFERENCES vehicles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lost', 'expired')),
  daily_limit DECIMAL(10, 2),
  weekly_limit DECIMAL(10, 2),
  monthly_limit DECIMAL(10, 2),
  expiry_date DATE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, card_number)
);

-- =====================================================
-- TRANSACTIONS TABLE (for fuel card transactions)
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  card_id UUID REFERENCES fuel_cards(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  amount DECIMAL(10, 2) NOT NULL,
  quantity DECIMAL(10, 2),
  unit_price DECIMAL(10, 2),
  fuel_type TEXT,
  station_name TEXT,
  station_location TEXT,
  odometer DECIMAL(10, 2),
  receipt_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'disputed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- WALLET_TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID REFERENCES profiles(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'refund', 'adjustment')),
  amount DECIMAL(10, 2) NOT NULL,
  balance_before DECIMAL(10, 2),
  balance_after DECIMAL(10, 2),
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PAYROLL_PAYOUTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payroll_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  driver_id UUID REFERENCES drivers(id) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  base_amount DECIMAL(10, 2),
  bonuses DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payout_date DATE,
  payout_method TEXT CHECK (payout_method IN ('bank_transfer', 'check', 'cash', 'mobile_money')),
  account_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid', 'cancelled')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON organizations(created_at DESC);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- Drivers indexes
CREATE INDEX IF NOT EXISTS idx_drivers_organization_id ON drivers(organization_id);
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_created_at ON drivers(created_at DESC);

-- Vehicles indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_organization_id ON vehicles(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_assigned_driver_id ON vehicles(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);

-- Fuel cards indexes
CREATE INDEX IF NOT EXISTS idx_fuel_cards_organization_id ON fuel_cards(organization_id);
CREATE INDEX IF NOT EXISTS idx_fuel_cards_assigned_driver_id ON fuel_cards(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_fuel_cards_assigned_vehicle_id ON fuel_cards(assigned_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_cards_status ON fuel_cards(status);
CREATE INDEX IF NOT EXISTS idx_fuel_cards_created_at ON fuel_cards(created_at DESC);

-- Transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_card_id ON transactions(card_id);
CREATE INDEX IF NOT EXISTS idx_transactions_driver_id ON transactions(driver_id);
CREATE INDEX IF NOT EXISTS idx_transactions_vehicle_id ON transactions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_date ON transactions(transaction_date DESC);

-- Wallet transactions indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_organization_id ON wallet_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_transaction_date ON wallet_transactions(transaction_date DESC);

-- Payroll payouts indexes
CREATE INDEX IF NOT EXISTS idx_payroll_payouts_organization_id ON payroll_payouts(organization_id);
CREATE INDEX IF NOT EXISTS idx_payroll_payouts_driver_id ON payroll_payouts(driver_id);
CREATE INDEX IF NOT EXISTS idx_payroll_payouts_payout_date ON payroll_payouts(payout_date DESC);
CREATE INDEX IF NOT EXISTS idx_payroll_payouts_status ON payroll_payouts(status);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_payouts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES (Allow all for now - development only)
-- =====================================================

-- Organizations policies
DROP POLICY IF EXISTS "Allow all operations on organizations" ON organizations;
CREATE POLICY "Allow all operations on organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);

-- Profiles policies
DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Drivers policies
DROP POLICY IF EXISTS "Allow all operations on drivers" ON drivers;
CREATE POLICY "Allow all operations on drivers" ON drivers FOR ALL USING (true) WITH CHECK (true);

-- Vehicles policies
DROP POLICY IF EXISTS "Allow all operations on vehicles" ON vehicles;
CREATE POLICY "Allow all operations on vehicles" ON vehicles FOR ALL USING (true) WITH CHECK (true);

-- Fuel cards policies
DROP POLICY IF EXISTS "Allow all operations on fuel_cards" ON fuel_cards;
CREATE POLICY "Allow all operations on fuel_cards" ON fuel_cards FOR ALL USING (true) WITH CHECK (true);

-- Transactions policies
DROP POLICY IF EXISTS "Allow all operations on transactions" ON transactions;
CREATE POLICY "Allow all operations on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

-- Wallet transactions policies
DROP POLICY IF EXISTS "Allow all operations on wallet_transactions" ON wallet_transactions;
CREATE POLICY "Allow all operations on wallet_transactions" ON wallet_transactions FOR ALL USING (true) WITH CHECK (true);

-- Payroll payouts policies
DROP POLICY IF EXISTS "Allow all operations on payroll_payouts" ON payroll_payouts;
CREATE POLICY "Allow all operations on payroll_payouts" ON payroll_payouts FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- GRANT PERMISSIONS
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
-- INSERT DEFAULT ORGANIZATION
-- =====================================================

-- Create a default organization with the ID your app expects
INSERT INTO organizations (id, name, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Organization', 'active')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check that all tables exist
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables tables
WHERE table_schema = 'public'
  AND table_name IN ('organizations', 'profiles', 'drivers', 'vehicles', 'fuel_cards', 'transactions', 'wallet_transactions', 'payroll_payouts')
ORDER BY table_name;
