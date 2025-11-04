import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log('📋 Reading wallet_transactions migration...');
    const migrationPath = join(__dirname, '../supabase/migrations/010_wallet_transactions.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('🚀 Applying migration to Supabase...');
    
    // Note: We need to use the service role key for migrations, but for now
    // we'll provide instructions to run this in the Supabase SQL Editor
    console.log('\n⚠️  Please apply this migration manually in the Supabase SQL Editor:');
    console.log('\n1. Go to https://app.supabase.com/project/YOUR_PROJECT/sql/new');
    console.log('2. Copy the contents of: supabase/migrations/010_wallet_transactions.sql');
    console.log('3. Paste and run the SQL\n');
    
    console.log('Alternatively, you can run it directly here:\n');
    console.log('='.repeat(80));
    console.log(migrationSQL);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  }
}

applyMigration();
