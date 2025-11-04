import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your Supabase credentials
const supabaseUrl = 'https://mdezrwxafjgptjzxdmbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kZXpyd3hhZmpncHRqenhkbWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNTEyODAsImV4cCI6MjA3NzgyNzI4MH0.5hH-P_xNitSq1fLXdh9bIZT4OerdjvosFU8aCvzpf0w';

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyWalletMigration() {
  try {
    console.log('📋 Reading wallet_transactions migration...\n');
    const migrationPath = join(__dirname, '../supabase/migrations/010_wallet_transactions.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('🚀 Applying wallet_transactions migration to Supabase...\n');

    // Execute the SQL using Supabase RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.log('⚠️  Direct RPC not available. Using SQL Editor method instead.\n');
      console.log('📋 Please copy and paste this SQL into your Supabase SQL Editor:\n');
      console.log('🔗 https://supabase.com/dashboard/project/mdezrwxafjgptjzxdmbc/sql/new\n');
      console.log('='.repeat(80));
      console.log(migrationSQL);
      console.log('='.repeat(80));
      console.log('\n✅ After running the SQL, the wallet_transactions table will be created!');
    } else {
      console.log('✅ Migration applied successfully!');
      console.log('✅ wallet_transactions table created with all policies and triggers');
      console.log('\n🎉 You can now use the Wallet page in your app!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Please apply the migration manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/mdezrwxafjgptjzxdmbc/sql/new');
    console.log('2. Copy contents of: supabase/migrations/010_wallet_transactions.sql');
    console.log('3. Paste and click RUN');
  }
}

applyWalletMigration();
