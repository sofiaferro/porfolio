import { createClient } from "@supabase/supabase-js"

// Server-side Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable")
}

if (!supabaseKey) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable")
}

export const supabase = createClient(supabaseUrl, supabaseKey)

