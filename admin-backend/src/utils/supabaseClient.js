// admin-backend/src/utils/supabaseClient.js

const { createClient } = require('@supabase/supabase-js');

// Ensure these environment variables are set on Render!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; 

if (!supabaseUrl || !supabaseKey) {
    console.error("[SUPABASE ERROR] Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
    // In a production app, you might crash the app here if Supabase is critical.
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("[SUPABASE INIT] Supabase client created.");

module.exports = {
    supabase
};
