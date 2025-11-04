-- ============================================================================
-- MAFUTA DATABASE COMPLETE FIX - RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- ============================================================================
-- This script will:
-- 1. Drop all existing tables (clean slate)
-- 2. Create all tables with proper relationships
-- 3. Set up Row Level Security (RLS)
-- 4. Create a default organization
-- 5. Reload the PostgREST schema cache
-- ============================================================================

-- STEP 1: Drop existing tables (if any)
DROP TABLE IF EXISTS payroll_payouts CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS fuel_cards CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- STEP 2: Create organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 4: Create drivers table
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  license_number TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 5: Create vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  color TEXT,
  status TEXT DEFAULT 'active',
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 6: Create fuel_cards table
CREATE TABLE fuel_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  last_four TEXT,
  provider TEXT,
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  daily_limit DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 7: Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  card_id UUID REFERENCES fuel_cards(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  transaction_date TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  quantity DECIMAL(10,2),
  fuel_type TEXT,
  station_name TEXT,
  location TEXT,
  odometer INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 8: Create wallet_transactions table
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  transaction_date TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  category TEXT,
  reference_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 9: Create payroll_payouts table
CREATE TABLE payroll_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  payout_date TIMESTAMPTZ NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 10: Create indexes for better performance
CREATE INDEX idx_profiles_org ON profiles(organization_id);
CREATE INDEX idx_drivers_org ON drivers(organization_id);
CREATE INDEX idx_vehicles_org ON vehicles(organization_id);
CREATE INDEX idx_fuel_cards_org ON fuel_cards(organization_id);
CREATE INDEX idx_transactions_org ON transactions(organization_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_wallet_transactions_org ON wallet_transactions(organization_id);
CREATE INDEX idx_payroll_payouts_org ON payroll_payouts(organization_id);

-- STEP 11: Enable Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_payouts ENABLE ROW LEVEL SECURITY;

-- STEP 12: Create RLS policies (allow all for now - we'll secure later)
CREATE POLICY "Allow all for organizations" ON organizations FOR ALL USING (true);
CREATE POLICY "Allow all for profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all for drivers" ON drivers FOR ALL USING (true);
CREATE POLICY "Allow all for vehicles" ON vehicles FOR ALL USING (true);
CREATE POLICY "Allow all for fuel_cards" ON fuel_cards FOR ALL USING (true);
CREATE POLICY "Allow all for transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all for wallet_transactions" ON wallet_transactions FOR ALL USING (true);
CREATE POLICY "Allow all for payroll_payouts" ON payroll_payouts FOR ALL USING (true);

-- STEP 13: Grant permissions to authenticated users
GRANT ALL ON organizations TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON drivers TO authenticated;
GRANT ALL ON vehicles TO authenticated;
GRANT ALL ON fuel_cards TO authenticated;
GRANT ALL ON transactions TO authenticated;
GRANT ALL ON wallet_transactions TO authenticated;
GRANT ALL ON payroll_payouts TO authenticated;

GRANT ALL ON organizations TO anon;
GRANT ALL ON profiles TO anon;
GRANT ALL ON drivers TO anon;
GRANT ALL ON vehicles TO anon;
GRANT ALL ON fuel_cards TO anon;
GRANT ALL ON transactions TO anon;
GRANT ALL ON wallet_transactions TO anon;
GRANT ALL ON payroll_payouts TO anon;

-- STEP 14: Create default organization
INSERT INTO organizations (id, name)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Organization')
ON CONFLICT (id) DO NOTHING;

-- STEP 15: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- STEP 16: Verify tables were created
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

-- ============================================================================
-- SUCCESS! You should see all 8 tables listed above with their column counts
-- Now refresh your browser and all errors should be gone
-- ============================================================================
