const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('gurbani_verses')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (error) {
    console.error('Supabase connection error:', error);
  }
}

// Call test on module load in development
if (process.env.NODE_ENV === 'development') {
  testConnection();
}

module.exports = supabase;
