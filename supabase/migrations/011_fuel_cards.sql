-- =====================================================
-- FUEL CARDS TABLE FOR FLEET
-- Updated to use organization_id to match app code
-- =====================================================

CREATE TABLE IF NOT EXISTS fuel_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Card details
  card_number TEXT UNIQUE,
  last_four TEXT,
  card_type TEXT DEFAULT 'physical' CHECK (card_type IN ('physical', 'virtual')),
  network TEXT DEFAULT 'shell' CHECK (network IN ('shell', 'other')),
  
  -- Assignment
  assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  
  -- Spending controls
  daily_spending_limit DECIMAL(10, 2),
  weekly_spending_limit DECIMAL(10, 2),
  monthly_spending_limit DECIMAL(10, 2),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending', 'in delivery', 'blocked', 'cancelled')),
  
  -- Additional info
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fuel_cards_organization ON fuel_cards(organization_id);
CREATE INDEX IF NOT EXISTS idx_fuel_cards_driver ON fuel_cards(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_fuel_cards_vehicle ON fuel_cards(assigned_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fuel_cards_status ON fuel_cards(status);

-- RLS
ALTER TABLE fuel_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fleet users can view company cards"
  ON fuel_cards FOR SELECT
  USING (
    organization_id = current_user_company_id() AND (
      current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager', 'accountant') OR
      (current_user_role() = 'driver' AND assigned_driver_id = (SELECT id FROM users WHERE clerk_id = current_user_clerk_id()))
    )
  );

CREATE POLICY "Fleet admins can insert cards"
  ON fuel_cards FOR INSERT
  WITH CHECK (
    organization_id = current_user_company_id() AND
    current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager')
  );

CREATE POLICY "Fleet admins can update cards"
  ON fuel_cards FOR UPDATE
  USING (
    organization_id = current_user_company_id() AND
    current_user_role() IN ('platform_admin', 'fleet_admin', 'fleet_manager')
  );

-- Update trigger
CREATE OR REPLACE FUNCTION update_fuel_cards_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fuel_cards_updated_at
  BEFORE UPDATE ON fuel_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_fuel_cards_timestamp();
