-- =====================================================
-- NUCLEAR RESET - RUN THIS TO START FRESH
-- ⚠️ THIS WILL DELETE ALL EXISTING DATA!
-- =====================================================

-- Drop everything
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Now paste the entire SETUP_DATABASE_STEP_BY_STEP.sql file below this line
-- (Go to that file, copy all contents, and paste here)
