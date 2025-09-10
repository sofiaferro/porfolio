import type React from "react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold">ADMIN DASHBOARD</h1>
          <div className="flex gap-4 flex-wrap">
            <Link href="/admin" className="text-white underline hover:text-gray-300">
              Dashboard
            </Link>
            <Link href="/admin/new-post" className="text-white underline hover:text-gray-300">
              New Post
            </Link>
            <Link href="/admin/new-project" className="text-white underline hover:text-gray-300">
              New Project
            </Link>
            <Link href="/admin/page-content" className="text-white underline hover:text-gray-300">
              Profile Editor
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

