/**
 * SupabaseClient.js
 * Initializes and exports the singleton Supabase client.
 * Reads credentials from VITE_ environment variables set in `.env`.
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '⚠️  Supabase credentials missing.\n' +
    'Copy .env.example → .env and fill in VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: true,
  },
})
