-- =====================================================
-- QUICK FIX: Create missing tables with correct column names
-- Run this if tables don't exist or have wrong column names
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create drivers table (if users table doesn't work as drivers)
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL, -- Changed from company_id
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
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL, -- Changed from company_id
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  color TEXT,
  license_plate TEXT,
  vin TEXT,
  vehicle_type TEXT,
  fuel_type TEXT,
  status TEXT DEFAULT 'active',
  driver_id UUID REFERENCES drivers(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

-- Create payroll_payouts table
CREATE TABLE IF NOT EXISTS payroll_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL, -- Changed from company_id
  driver_id UUID REFERENCES drivers(id),
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_drivers_organization ON drivers(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_organization ON vehicles(organization_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_driver ON vehicles(driver_id);
CREATE INDEX IF NOT EXISTS idx_payroll_organization ON payroll_payouts(organization_id);
CREATE INDEX IF NOT EXISTS idx_payroll_driver ON payroll_payouts(driver_id);

-- Enable RLS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_payouts ENABLE ROW LEVEL SECURITY;

-- Create simple policies (allow all for development)
DROP POLICY IF EXISTS "Allow all for drivers" ON drivers;
CREATE POLICY "Allow all for drivers" ON drivers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for vehicles" ON vehicles;
CREATE POLICY "Allow all for vehicles" ON vehicles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for profiles" ON profiles;
CREATE POLICY "Allow all for profiles" ON profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for payroll_payouts" ON payroll_payouts;
CREATE POLICY "Allow all for payroll_payouts" ON payroll_payouts FOR ALL USING (true);
