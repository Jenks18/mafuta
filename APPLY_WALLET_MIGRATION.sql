-- =====================================================
-- WALLET TRANSACTIONS TABLE - APPLY THIS IN SUPABASE
-- =====================================================
-- Copy all the SQL below and paste into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/mdezrwxafjgptjzxdmbc/sql/new

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES fleet_companies(id) ON DELETE CASCADE,
  
  -- Transaction details
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'deposit', 'withdrawal', 'payment', 'refund')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  fee DECIMAL(10, 2) DEFAULT 0,
  balance_after DECIMAL(10, 2),
  
  -- Payment details
  recipient_name TEXT,
  recipient_phone TEXT,
  description TEXT,
  reference_number TEXT UNIQUE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  
  -- Metadata
  payment_method TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_company ON wallet_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created ON wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_reference ON wallet_transactions(reference_number);

-- RLS Policies
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet transactions"
  ON wallet_transactions FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT clerk_id FROM users WHERE id = wallet_transactions.user_id
    )
  );

CREATE POLICY "Fleet admins can view company wallet transactions"
  ON wallet_transactions FOR SELECT
  USING (
    auth.uid()::text IN (
      SELECT u.clerk_id FROM users u 
      WHERE u.company_id = wallet_transactions.company_id
      AND u.role IN ('fleet_admin', 'fleet_manager', 'accountant')
    )
  );

CREATE POLICY "Users can create own wallet transactions"
  ON wallet_transactions FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (
      SELECT clerk_id FROM users WHERE id = wallet_transactions.user_id
    )
  );

CREATE POLICY "Fleet admins can create company wallet transactions"
  ON wallet_transactions FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (
      SELECT u.clerk_id FROM users u 
      WHERE u.company_id = wallet_transactions.company_id
      AND u.role IN ('fleet_admin', 'fleet_manager', 'accountant')
    )
  );

-- Triggers
CREATE OR REPLACE FUNCTION update_wallet_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wallet_transactions_updated_at
  BEFORE UPDATE ON wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_transaction_timestamp();

CREATE OR REPLACE FUNCTION generate_transaction_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number = 'WTX-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wallet_transactions_generate_reference
  BEFORE INSERT ON wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION generate_transaction_reference();
