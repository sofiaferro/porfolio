import { createClient } from "@supabase/supabase-js"
console.log('ASCACACACACAC ', process.env.NEXT_PUBLIC_SUPABASE_URL)
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}
/* 
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */
export const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

