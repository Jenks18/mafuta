import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Need: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Checking Database Schema...\n');
console.log('=' .repeat(60));

async function checkTableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        return { exists: false, error: 'Table not found', details: error.message };
      }
      if (error.code === '42501') {
        return { exists: true, accessible: false, error: 'RLS blocking access', details: error.message };
      }
      return { exists: true, accessible: false, error: error.message, details: error.hint };
    }
    
    return { exists: true, accessible: true, rowCount: data?.length || 0 };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function checkAllTables() {
  const requiredTables = [
    'organizations',
    'profiles', 
    'drivers',
    'vehicles',
    'fuel_cards',
    'transactions',
    'wallet_transactions',
    'payroll_payouts'
  ];

  console.log('\n📊 TABLE STATUS CHECK\n');
  
  let allGood = true;
  
  for (const table of requiredTables) {
    const result = await checkTableExists(table);
    
    if (result.exists && result.accessible) {
      console.log(`✅ ${table.padEnd(25)} - EXISTS & ACCESSIBLE (${result.rowCount} rows)`);
    } else if (result.exists && !result.accessible) {
      console.log(`⚠️  ${table.padEnd(25)} - EXISTS but ${result.error}`);
      console.log(`   Details: ${result.details || 'No additional details'}`);
      allGood = false;
    } else {
      console.log(`❌ ${table.padEnd(25)} - ${result.error}`);
      allGood = false;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (allGood) {
    console.log('\n🎉 All tables exist and are accessible!');
    console.log('\n💡 If you\'re still seeing errors, the issue might be:');
    console.log('   1. Missing organization/profile data');
    console.log('   2. Clerk authentication not passing user info correctly');
  } else {
    console.log('\n❌ Found issues with database tables (see above)');
    console.log('\n💡 Next steps:');
    console.log('   1. For missing tables: Run SETUP_DATABASE_STEP_BY_STEP.sql');
    console.log('   2. For RLS issues: Check Supabase SQL Editor for RLS policies');
    console.log('   3. For access issues: Ensure anon key has proper permissions');
  }
}

async function checkData() {
  console.log('\n\n📦 DATA CHECK\n');
  console.log('='.repeat(60));
  
  // Check organizations
  const { data: orgs, error: orgsError } = await supabase
    .from('organizations')
    .select('id, name, status')
    .limit(5);
  
  if (!orgsError && orgs) {
    console.log(`\n✅ Organizations: ${orgs.length} found`);
    if (orgs.length > 0) {
      orgs.forEach(org => {
        console.log(`   - ${org.name} (${org.id}) - ${org.status}`);
      });
    } else {
      console.log('   ⚠️  No organizations in database - you need at least one!');
    }
  } else {
    console.log(`\n❌ Organizations: ${orgsError?.message || 'Unable to check'}`);
  }
  
  // Check profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, organization_id')
    .limit(5);
  
  if (!profilesError && profiles) {
    console.log(`\n✅ Profiles: ${profiles.length} found`);
    if (profiles.length > 0) {
      profiles.forEach(profile => {
        console.log(`   - ${profile.email} (${profile.first_name || ''} ${profile.last_name || ''})`);
      });
    } else {
      console.log('   ⚠️  No profiles in database - create one after signing up!');
    }
  } else {
    console.log(`\n❌ Profiles: ${profilesError?.message || 'Unable to check'}`);
  }
}

async function checkTableSchema() {
  console.log('\n\n🔧 SCHEMA STRUCTURE CHECK\n');
  console.log('='.repeat(60));
  
  // Check if organizations has the right structure
  const { data: orgCols, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .limit(0);
  
  if (!orgError) {
    console.log('\n✅ Organizations table structure looks good');
  } else {
    console.log(`\n❌ Organizations: ${orgError.message}`);
  }
  
  // Try a test query similar to what the app does
  const { data: testData, error: testError } = await supabase
    .from('drivers')
    .select('*')
    .eq('organization_id', '00000000-0000-0000-0000-000000000000')
    .limit(1);
  
  if (!testError) {
    console.log('✅ Driver queries with organization_id filter work');
  } else {
    console.log(`❌ Driver queries failing: ${testError.message}`);
    if (testError.details) {
      console.log(`   Details: ${testError.details}`);
    }
  }
}

// Run all checks
(async () => {
  try {
    await checkAllTables();
    await checkData();
    await checkTableSchema();
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Database check complete!\n');
  } catch (error) {
    console.error('\n❌ Error running checks:', error.message);
    process.exit(1);
  }
})();
