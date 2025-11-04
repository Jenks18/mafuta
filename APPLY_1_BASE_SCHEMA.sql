-- =====================================================
-- MAFUTA MULTI-TENANT DATABASE SCHEMA
-- Supports both Fleet (B2B) and Individual (B2C) users
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FLEET TABLES (B2B)
-- =====================================================

-- Fleet Companies (Organizations)
CREATE TABLE fleet_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business_type TEXT CHECK (business_type IN ('logistics', 'delivery', 'trucking', 'rideshare', 'taxi', 'service', 'other')),
  tax_id TEXT,
  billing_address JSONB, -- { street, city, state, zip, country }
  billing_email TEXT,
  phone TEXT,
  website TEXT,
  created_by TEXT NOT NULL,  -- Clerk user ID of creator
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  monthly_spending_limit DECIMAL(10, 2),
  fleet_size_range TEXT CHECK (fleet_size_range IN ('1-10', '11-50', '51-200', '201-500', '501+')),
  settings JSONB DEFAULT '{}', -- Company preferences
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Unified for both Fleet and Individual)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  
  -- Account type
  account_type TEXT NOT NULL CHECK (account_type IN ('fleet', 'individual')),
  
  -- Fleet-specific fields
  role TEXT, -- fleet_admin, fleet_manager, driver, accountant, dispatcher
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE,
  employee_id TEXT,
  license_number TEXT,
  license_expiry DATE,
  
  -- Individual-specific fields
  subscription_tier TEXT DEFAULT 'consumer' CHECK (subscription_tier IN ('consumer', 'premium', 'business')),
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  
  -- Common fields
  avatar_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  onboarded BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_fleet_has_company CHECK (
    account_type != 'fleet' OR company_id IS NOT NULL
  ),
  CONSTRAINT check_fleet_has_role CHECK (
    account_type != 'fleet' OR role IS NOT NULL
  )
);

-- Vehicles (Fleet only)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  vehicle_number TEXT NOT NULL, -- Company's internal ID
  vin TEXT, -- Vehicle Identification Number
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('car', 'van', 'truck', 'semi', 'motorcycle', 'other')),
  fuel_type TEXT CHECK (fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid', 'cng', 'lng')),
  fuel_card_number TEXT, -- Physical fuel card
  odometer DECIMAL(10, 2), -- Current mileage
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired', 'sold')),
  assigned_driver_id UUID REFERENCES users(id),
  daily_spending_limit DECIMAL(10, 2),
  weekly_spending_limit DECIMAL(10, 2),
  monthly_spending_limit DECIMAL(10, 2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, vehicle_number)
);

-- =====================================================
-- INDIVIDUAL TABLES (B2C)
-- =====================================================

-- Digital Cards (Individual users)
CREATE TABLE individual_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  card_name TEXT NOT NULL,
  card_number TEXT UNIQUE NOT NULL, -- Virtual card number
  card_type TEXT DEFAULT 'virtual' CHECK (card_type IN ('virtual', 'physical')),
  network TEXT DEFAULT 'shell' CHECK (network IN ('shell', 'visa', 'mastercard')),
  balance DECIMAL(10, 2) DEFAULT 0,
  spending_limit_daily DECIMAL(10, 2),
  spending_limit_monthly DECIMAL(10, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled')),
  pin_set BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SHARED TABLES (Both Fleet and Individual)
-- =====================================================

-- Fuel Transactions
CREATE TABLE fuel_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Link to user (either fleet or individual)
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('fleet', 'individual')),
  
  -- Fleet-specific
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id), -- Who performed transaction
  
  -- Individual-specific
  card_id UUID REFERENCES individual_cards(id) ON DELETE SET NULL,
  
  -- Transaction details
  station_id TEXT, -- From your stations database
  station_name TEXT NOT NULL,
  station_address TEXT,
  station_network TEXT, -- Shell, BP, Chevron, etc.
  station_latitude DECIMAL(10, 8),
  station_longitude DECIMAL(11, 8),
  
  fuel_type TEXT NOT NULL,
  gallons DECIMAL(10, 2) NOT NULL,
  price_per_gallon DECIMAL(10, 4) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  
  odometer_reading DECIMAL(10, 2),
  transaction_date TIMESTAMPTZ NOT NULL,
  
  -- Payment
  payment_method TEXT CHECK (payment_method IN ('fuel_card', 'digital_card', 'credit_card', 'cash')),
  fuel_card_number TEXT,
  receipt_url TEXT,
  
  -- Approval (Fleet only)
  approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'flagged')),
  approved_by UUID REFERENCES users(id),
  approval_notes TEXT,
  
  -- Rewards (Individual only)
  rewards_earned DECIMAL(10, 2) DEFAULT 0,
  
  notes TEXT,
  metadata JSONB DEFAULT '{}', -- GPS coords, pump number, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_fleet_has_company CHECK (
    account_type != 'fleet' OR company_id IS NOT NULL
  ),
  CONSTRAINT check_fleet_has_vehicle CHECK (
    account_type != 'fleet' OR vehicle_id IS NOT NULL
  )
);

-- Rewards (Individual only)
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID REFERENCES fuel_transactions(id) ON DELETE CASCADE,
  
  type TEXT CHECK (type IN ('cashback', 'points', 'discount', 'referral', 'bonus')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'earned', 'redeemed', 'expired')),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  metadata JSONB DEFAULT '{}'
);

-- Trips/Routes (Fleet only)
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
  driver_id UUID REFERENCES users(id) NOT NULL,
  
  trip_number TEXT,
  start_location TEXT,
  end_location TEXT,
  start_latitude DECIMAL(10, 8),
  start_longitude DECIMAL(11, 8),
  end_latitude DECIMAL(10, 8),
  end_longitude DECIMAL(11, 8),
  
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  start_odometer DECIMAL(10, 2),
  end_odometer DECIMAL(10, 2),
  distance_miles DECIMAL(10, 2),
  
  purpose TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Records (Fleet only)
CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
  
  maintenance_type TEXT CHECK (maintenance_type IN ('oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'other')),
  description TEXT NOT NULL,
  cost DECIMAL(10, 2),
  
  odometer_at_service DECIMAL(10, 2),
  service_date DATE NOT NULL,
  next_service_date DATE,
  next_service_odometer DECIMAL(10, 2),
  
  service_provider TEXT,
  invoice_url TEXT,
  
  status TEXT DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spending Alerts (Fleet only)
CREATE TABLE spending_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  
  alert_type TEXT CHECK (alert_type IN ('daily_limit', 'weekly_limit', 'monthly_limit', 'per_transaction', 'unusual_activity', 'maintenance_due')),
  threshold_amount DECIMAL(10, 2),
  
  scope TEXT CHECK (scope IN ('company', 'vehicle', 'driver')),
  scope_id UUID, -- vehicle_id or driver_id
  
  is_active BOOLEAN DEFAULT TRUE,
  notification_emails TEXT[],
  
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_account_type ON users(account_type);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Fleet Companies
CREATE INDEX idx_fleet_companies_created_by ON fleet_companies(created_by);
CREATE INDEX idx_fleet_companies_status ON fleet_companies(status);

-- Vehicles
CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_assigned_driver ON vehicles(assigned_driver_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Individual Cards
CREATE INDEX idx_individual_cards_user_id ON individual_cards(user_id);
CREATE INDEX idx_individual_cards_status ON individual_cards(status);

-- Fuel Transactions
CREATE INDEX idx_fuel_transactions_user_id ON fuel_transactions(user_id);
CREATE INDEX idx_fuel_transactions_account_type ON fuel_transactions(account_type);
CREATE INDEX idx_fuel_transactions_company_id ON fuel_transactions(company_id);
CREATE INDEX idx_fuel_transactions_vehicle_id ON fuel_transactions(vehicle_id);
CREATE INDEX idx_fuel_transactions_driver_id ON fuel_transactions(driver_id);
CREATE INDEX idx_fuel_transactions_card_id ON fuel_transactions(card_id);
CREATE INDEX idx_fuel_transactions_date ON fuel_transactions(transaction_date);
CREATE INDEX idx_fuel_transactions_approval ON fuel_transactions(approval_status);

-- Rewards
CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_rewards_status ON rewards(status);

-- Trips
CREATE INDEX idx_trips_company_id ON trips(company_id);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);

-- Maintenance
CREATE INDEX idx_maintenance_company_id ON maintenance_records(company_id);
CREATE INDEX idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE fleet_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_alerts ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION current_user_clerk_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claim.sub', true)
  )::text;
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_record()
RETURNS SETOF users AS $$
  SELECT * FROM users WHERE clerk_id = current_user_clerk_id();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_account_type()
RETURNS TEXT AS $$
  SELECT account_type FROM users WHERE clerk_id = current_user_clerk_id();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users WHERE clerk_id = current_user_clerk_id();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE clerk_id = current_user_clerk_id();
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Fleet Companies: See only your company
CREATE POLICY fleet_companies_select ON fleet_companies
FOR SELECT USING (
  id = current_user_company_id() OR
  created_by = current_user_clerk_id()
);

CREATE POLICY fleet_companies_update ON fleet_companies
FOR UPDATE USING (
  id = current_user_company_id() AND
  current_user_role() IN ('platform_admin', 'fleet_admin')
);

-- Users: See yourself + your company members
CREATE POLICY users_select ON users
FOR SELECT USING (
  clerk_id = current_user_clerk_id() OR
  (account_type = 'fleet' AND company_id = current_user_company_id())
);

CREATE POLICY users_update ON users
FOR UPDATE USING (
  clerk_id = current_user_clerk_id() OR
  (company_id = current_user_company_id() AND 
   current_user_role() IN ('platform_admin', 'fleet_admin'))
);

-- Vehicles: Fleet users see company vehicles, drivers see assigned
CREATE POLICY vehicles_select ON vehicles
FOR SELECT USING (
  company_id = current_user_company_id() AND (
    current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'accountant', 'dispatcher') OR
    (current_user_role() = 'driver' AND assigned_driver_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id()))
  )
);

CREATE POLICY vehicles_insert ON vehicles
FOR INSERT WITH CHECK (
  company_id = current_user_company_id() AND
  current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager')
);

CREATE POLICY vehicles_update ON vehicles
FOR UPDATE USING (
  company_id = current_user_company_id() AND
  current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager')
);

-- Individual Cards: See only your own cards
CREATE POLICY individual_cards_select ON individual_cards
FOR SELECT USING (
  user_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())
);

CREATE POLICY individual_cards_insert ON individual_cards
FOR INSERT WITH CHECK (
  user_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())
);

CREATE POLICY individual_cards_update ON individual_cards
FOR UPDATE USING (
  user_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())
);

-- Fuel Transactions: Account-type specific access
CREATE POLICY fuel_transactions_select ON fuel_transactions
FOR SELECT USING (
  -- Individual users see their own
  (account_type = 'individual' AND user_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())) OR
  -- Fleet admins/managers see all company transactions
  (account_type = 'fleet' AND company_id = current_user_company_id() AND 
   current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'accountant')) OR
  -- Fleet drivers see their own transactions
  (account_type = 'fleet' AND driver_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id()))
);

CREATE POLICY fuel_transactions_insert ON fuel_transactions
FOR INSERT WITH CHECK (
  -- Individual users create their own
  (account_type = 'individual' AND user_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())) OR
  -- Fleet users create for their company
  (account_type = 'fleet' AND company_id = current_user_company_id())
);

-- Rewards: Individual users only
CREATE POLICY rewards_select ON rewards
FOR SELECT USING (
  user_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())
);

-- Trips: Fleet only
CREATE POLICY trips_select ON trips
FOR SELECT USING (
  company_id = current_user_company_id() AND (
    current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'dispatcher', 'accountant') OR
    driver_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())
  )
);

-- Maintenance: Fleet only
CREATE POLICY maintenance_select ON maintenance_records
FOR SELECT USING (
  company_id = current_user_company_id() AND (
    current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager') OR
    vehicle_id IN (
      SELECT id FROM vehicles WHERE assigned_driver_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id())
    )
  )
);
