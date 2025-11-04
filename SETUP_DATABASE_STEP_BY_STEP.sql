-- =====================================================
-- STEP 1: DROP ALL EXISTING TABLES (CLEAN SLATE)
-- =====================================================
-- Run this first if you have any existing tables

DROP TABLE IF EXISTS payroll_payouts CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS fuel_cards CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- =====================================================
-- STEP 2: ENABLE EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 3: CREATE TABLES IN ORDER (respecting foreign keys)
-- =====================================================

-- 3.1: Organizations (no dependencies)
CREATE TABLE organizations (
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

-- 3.2: Profiles (depends on organizations)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3: Drivers (depends on organizations)
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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

-- 3.4: Vehicles (depends on organizations and drivers)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  vin TEXT,
  color TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('car', 'van', 'truck', 'semi', 'motorcycle', 'other')),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'cng', 'lng')),
  odometer DECIMAL(10, 2),
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'sold')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5: Fuel Cards (depends on organizations, drivers, vehicles)
CREATE TABLE fuel_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  last_four TEXT,
  card_provider TEXT,
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
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

-- 3.6: Transactions (depends on organizations, fuel_cards, drivers, vehicles)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  card_id UUID REFERENCES fuel_cards(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
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

-- 3.7: Wallet Transactions (depends on organizations and profiles)
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
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

-- 3.8: Payroll Payouts (depends on organizations and drivers)
CREATE TABLE payroll_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
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
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_created_at ON organizations(created_at DESC);

CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

CREATE INDEX idx_drivers_organization_id ON drivers(organization_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_created_at ON drivers(created_at DESC);

CREATE INDEX idx_vehicles_organization_id ON vehicles(organization_id);
CREATE INDEX idx_vehicles_assigned_driver_id ON vehicles(assigned_driver_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);

CREATE INDEX idx_fuel_cards_organization_id ON fuel_cards(organization_id);
CREATE INDEX idx_fuel_cards_assigned_driver_id ON fuel_cards(assigned_driver_id);
CREATE INDEX idx_fuel_cards_assigned_vehicle_id ON fuel_cards(assigned_vehicle_id);
CREATE INDEX idx_fuel_cards_status ON fuel_cards(status);
CREATE INDEX idx_fuel_cards_created_at ON fuel_cards(created_at DESC);

CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_card_id ON transactions(card_id);
CREATE INDEX idx_transactions_driver_id ON transactions(driver_id);
CREATE INDEX idx_transactions_vehicle_id ON transactions(vehicle_id);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date DESC);

CREATE INDEX idx_wallet_transactions_organization_id ON wallet_transactions(organization_id);
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_transaction_date ON wallet_transactions(transaction_date DESC);

CREATE INDEX idx_payroll_payouts_organization_id ON payroll_payouts(organization_id);
CREATE INDEX idx_payroll_payouts_driver_id ON payroll_payouts(driver_id);
CREATE INDEX idx_payroll_payouts_payout_date ON payroll_payouts(payout_date DESC);
CREATE INDEX idx_payroll_payouts_status ON payroll_payouts(status);

-- =====================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
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
-- STEP 6: CREATE PERMISSIVE RLS POLICIES (DEVELOPMENT ONLY!)
-- =====================================================

CREATE POLICY "Allow all operations on organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on drivers" ON drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vehicles" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on fuel_cards" ON fuel_cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on wallet_transactions" ON wallet_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payroll_payouts" ON payroll_payouts FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- STEP 7: GRANT PERMISSIONS
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
-- STEP 8: INSERT A DEFAULT ORGANIZATION FOR TESTING
-- =====================================================

INSERT INTO organizations (id, name, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'Default Organization', 'active')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT 
  '✅ All tables created successfully!' as message,
  COUNT(*) as table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('organizations', 'profiles', 'drivers', 'vehicles', 'fuel_cards', 'transactions', 'wallet_transactions', 'payroll_payouts');
