"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkSession = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    console.log("Login page - User check:", { user, error })
    if (user && user.id === process.env.ADMIN_USER_ID) {
      console.log("Login page - User is authenticated and admin, redirecting to admin")
      router.push("/admin")
    } else {
      console.log("Login page - User is not authenticated or not admin")
    }
  }, [router, supabase.auth])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log("Login page - Login successful", data)

      // Check session status after login
      await checkSession()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Login page - Login error:", errorMessage);
      setError(errorMessage);
    }
  }

  return (
    <div className="min-h-screen bg-[#c0c0c0] font-mono text-black flex items-center justify-center">
      <div className="bg-white border-2 border-black p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ADMIN LOGIN</h1>
        {error && <div className="bg-[#FF0000] text-white p-2 mb-4">Error: {error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#c0c0c0] border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 border-[#808080] px-4 py-2 font-bold active:border-t-2 active:border-l-2 active:border-[#808080] active:border-r-2 active:border-b-2 active:border-[#ffffff]"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  )
}

