import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

export const createServerSupabaseClient = cache(() => createServerComponentClient({ cookies }))

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUserId() {
  const session = await getSession()
  return session?.user?.id
}

export async function isAdmin() {
  const userId = await getUserId()
  return userId === process.env.NEXT_PUBLIC_ADMIN_USER_ID
}

