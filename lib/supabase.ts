import { createClient } from "@supabase/supabase-js"
if (!process.env.SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable")
}

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable")
}

export const adminId = process.env.ADMIN_USER_ID
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

