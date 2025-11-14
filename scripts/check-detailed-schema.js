import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Checking Detailed Table Schemas...\n');
console.log('='.repeat(80));

async function checkTableColumns(tableName) {
  try {
    // Get one row to see what columns exist
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`\n❌ ${tableName}: ${error.message}`);
      return null;
    }
    
    // If we got data or empty array, we can see the structure
    console.log(`\n✅ ${tableName.toUpperCase()}`);
    console.log('   Columns accessible via API:');
    
    // Try to select with specific columns to see what works
    const testColumns = {
      organizations: ['id', 'name', 'status', 'business_type', 'created_at'],
      profiles: ['id', 'clerk_id', 'email', 'first_name', 'last_name', 'organization_id'],
      drivers: ['id', 'organization_id', 'name', 'email', 'status'],
      vehicles: ['id', 'organization_id', 'make', 'model', 'status'],
      fuel_cards: ['id', 'organization_id', 'card_number', 'status'],
      transactions: ['id', 'organization_id', 'amount', 'transaction_date'],
      wallet_transactions: ['id', 'organization_id', 'amount', 'transaction_type'],
      payroll_payouts: ['id', 'organization_id', 'driver_id', 'amount']
    };
    
    const columnsToTest = testColumns[tableName] || ['id'];
    const workingColumns = [];
    const failingColumns = [];
    
    for (const col of columnsToTest) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select(col)
          .limit(1);
        
        if (error) {
          failingColumns.push(col);
        } else {
          workingColumns.push(col);
        }
      } catch (e) {
        failingColumns.push(col);
      }
    }
    
    if (workingColumns.length > 0) {
      console.log('   ✅ Working:', workingColumns.join(', '));
    }
    
    if (failingColumns.length > 0) {
      console.log('   ❌ Missing/Failing:', failingColumns.join(', '));
    }
    
    return { workingColumns, failingColumns };
    
  } catch (err) {
    console.log(`\n❌ ${tableName}: ${err.message}`);
    return null;
  }
}

(async () => {
  try {
    const tables = [
      'organizations',
      'profiles',
      'drivers',
      'vehicles',
      'fuel_cards',
      'transactions',
      'wallet_transactions',
      'payroll_payouts'
    ];
    
    const results = {};
    
    for (const table of tables) {
      results[table] = await checkTableColumns(table);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📋 SUMMARY OF ISSUES\n');
    
    let hasIssues = false;
    
    for (const [table, result] of Object.entries(results)) {
      if (result && result.failingColumns.length > 0) {
        hasIssues = true;
        console.log(`⚠️  ${table}: Missing ${result.failingColumns.length} expected columns`);
        console.log(`   Need to add: ${result.failingColumns.join(', ')}`);
      }
    }
    
    if (!hasIssues) {
      console.log('✅ All expected columns exist!');
    } else {
      console.log('\n💡 SOLUTION: Your database has a different schema than your app expects.');
      console.log('   Option 1: Drop all tables and run SETUP_DATABASE_STEP_BY_STEP.sql (DESTRUCTIVE!)');
      console.log('   Option 2: Add missing columns with ALTER TABLE statements (SAFER)');
    }
    
    console.log('\n' + '='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
})();
