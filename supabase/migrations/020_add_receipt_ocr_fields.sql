-- =====================================================
-- ADD RECEIPT OCR FIELDS TO TRANSACTIONS
-- Supports photo receipt capture with Google Vision API
-- =====================================================

-- Add OCR-related columns to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS receipt_image_url TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ocr_status TEXT DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed', 'manual'));
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ocr_data JSONB DEFAULT '{}';
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ocr_confidence DECIMAL(5, 2);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS ocr_processed_at TIMESTAMPTZ;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS manual_review_required BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN transactions.receipt_image_url IS 'URL to receipt image stored in Supabase Storage';
COMMENT ON COLUMN transactions.ocr_status IS 'Status of OCR processing: pending (just uploaded), processing (API called), completed (data extracted), failed (OCR error), manual (user entered manually)';
COMMENT ON COLUMN transactions.ocr_data IS 'Extracted data from receipt: {amount, date, station_name, fuel_type, raw_text, etc}';
COMMENT ON COLUMN transactions.ocr_confidence IS 'Google Vision API confidence score (0-100)';
COMMENT ON COLUMN transactions.ocr_processed_at IS 'Timestamp when OCR processing completed';
COMMENT ON COLUMN transactions.manual_review_required IS 'Flag for transactions needing human verification (low confidence, missing data, etc)';

-- Create index for OCR status queries
CREATE INDEX IF NOT EXISTS idx_transactions_ocr_status ON transactions(ocr_status) WHERE ocr_status IN ('pending', 'processing', 'failed');
CREATE INDEX IF NOT EXISTS idx_transactions_manual_review ON transactions(manual_review_required) WHERE manual_review_required = true;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_transaction_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_timestamp();

