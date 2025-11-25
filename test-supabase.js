/**
 * Quick test script to verify Supabase connection
 * Run with: node test-supabase.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase connection...\n');
console.log('URL:', url ? '✅ Set' : '❌ Missing');
console.log('Key:', key ? `✅ Set (${key.substring(0, 20)}...)` : '❌ Missing');

if (!url || !key) {
  console.error('\n❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
  console.log('\n📊 Testing table access...\n');
  
  // Test 1: Try to select from echoes table
  console.log('Test 1: Fetching from echoes table...');
  const { data, error } = await supabase
    .from('echoes')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Details:', error.details);
    console.error('   Hint:', error.hint);
    
    if (error.message.includes('does not exist') || error.message.includes('invalid')) {
      console.error('\n💡 This usually means the table doesn\'t exist.');
      console.error('   Go to Supabase Dashboard → SQL Editor and run the setup SQL.');
    }
  } else {
    console.log('✅ Success! Table exists and is accessible.');
    console.log('   Found', data?.length || 0, 'rows');
  }
  
  // Test 2: Try to insert a test row
  console.log('\nTest 2: Testing insert...');
  const { error: insertError } = await supabase
    .from('echoes')
    .insert({ text: 'Test message', approved: false });
  
  if (insertError) {
    console.error('❌ Insert error:', insertError.message);
  } else {
    console.log('✅ Insert successful!');
  }
}

test().catch(console.error);

