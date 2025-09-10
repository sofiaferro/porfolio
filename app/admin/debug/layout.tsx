import type React from "react"
import Link from "next/link"

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold">DEBUG PAGE</h1>
          <div className="flex gap-4">
            <Link href="/login" className="text-white underline hover:text-gray-300">
              Login
            </Link>
            <Link href="/" className="text-white underline hover:text-gray-300">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
