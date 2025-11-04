-- =====================================================
-- COMPLETE FIX: Drop old tables and recreate with correct schema
-- This will delete all existing data in these tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS payroll_payouts CASCADE;
DROP TABLE IF EXISTS fuel_cards CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create drivers table with organization_id
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  invite_status TEXT DEFAULT 'pending' CHECK (invite_status IN ('pending', 'sent', 'accepted')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicles table with organization_id
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  license_plate TEXT,
  vin TEXT,
  vehicle_type TEXT,
  fuel_type TEXT,
  status TEXT DEFAULT 'active',
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create fuel_cards table
CREATE TABLE fuel_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  card_number TEXT UNIQUE,
  last_four TEXT,
  card_type TEXT DEFAULT 'physical' CHECK (card_type IN ('physical', 'virtual')),
  network TEXT DEFAULT 'shell' CHECK (network IN ('shell', 'other')),
  assigned_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  daily_spending_limit DECIMAL(10, 2),
  weekly_spending_limit DECIMAL(10, 2),
  monthly_spending_limit DECIMAL(10, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'in delivery', 'blocked', 'cancelled')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wallet_transactions table
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  user_id UUID,
  transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit', 'refund', 'transfer')),
  amount DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2),
  description TEXT,
  reference_number TEXT,
  metadata JSONB DEFAULT '{}',
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payroll_payouts table
CREATE TABLE payroll_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  driver_name TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  payout_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'completed',
  reference_number TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_drivers_organization ON drivers(organization_id);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_vehicles_organization ON vehicles(organization_id);
CREATE INDEX idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_fuel_cards_organization ON fuel_cards(organization_id);
CREATE INDEX idx_fuel_cards_driver ON fuel_cards(assigned_driver_id);
CREATE INDEX idx_fuel_cards_vehicle ON fuel_cards(assigned_vehicle_id);
CREATE INDEX idx_fuel_cards_status ON fuel_cards(status);
CREATE INDEX idx_wallet_transactions_organization ON wallet_transactions(organization_id);
CREATE INDEX idx_wallet_transactions_date ON wallet_transactions(transaction_date);
CREATE INDEX idx_payroll_organization ON payroll_payouts(organization_id);
CREATE INDEX idx_payroll_driver ON payroll_payouts(driver_id);
CREATE INDEX idx_payroll_date ON payroll_payouts(payout_date);

-- Enable RLS on all tables
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_payouts ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allow all for development)
CREATE POLICY "Allow all for drivers" ON drivers FOR ALL USING (true);
CREATE POLICY "Allow all for vehicles" ON vehicles FOR ALL USING (true);
CREATE POLICY "Allow all for profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Allow all for fuel_cards" ON fuel_cards FOR ALL USING (true);
CREATE POLICY "Allow all for wallet_transactions" ON wallet_transactions FOR ALL USING (true);
CREATE POLICY "Allow all for payroll_payouts" ON payroll_payouts FOR ALL USING (true);

-- Success message
DO $$ 
BEGIN 
  RAISE NOTICE '✅ All tables created successfully with organization_id!';
END $$;
