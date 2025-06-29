// Temporary mock Supabase client for development without API keys
console.warn('⚠️  Database features disabled - no Supabase configuration found.');
console.warn('   Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env file to enable database features.');

// Export a mock supabase object that won't crash
const mockSupabase = {
  from: (table) => ({
    select: (columns, options) => Promise.resolve({ data: [], error: null }),
    insert: (data) => Promise.resolve({ data: null, error: null }),
    eq: (column, value) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      limit: () => Promise.resolve({ data: [], error: null })
    }),
    limit: (count) => Promise.resolve({ data: [], error: null }),
    order: (column) => Promise.resolve({ data: [], error: null }),
    range: (from, to) => Promise.resolve({ data: [], error: null })
  }),
  rpc: (functionName, params) => Promise.resolve({ data: [], error: null })
};

module.exports = mockSupabase;
