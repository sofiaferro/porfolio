import { supabase } from "./supabase"

export async function getSession() {
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
  const adminUserId = process.env.ADMIN_USER_ID
  
  // If no ADMIN_USER_ID is set, allow any authenticated user for development
  if (!adminUserId) {
    return !!userId
  }
  
  return userId === adminUserId
}

