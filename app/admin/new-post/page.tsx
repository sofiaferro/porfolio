"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBlogPost } from "@/lib/blog-actions"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    const result = await createBlogPost(formData)
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <header className="bg-black text-white p-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">NEW BLOG POST</h1>
        <div className="mt-2">
          <Link href="/admin" className="text-white underline">
            &lt;&lt; Back to Admin Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white border border-black p-4 mb-6">
          {error && <div className="bg-black text-white p-2 mb-4">Error: {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-bold mb-2">
                Title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-black p-2 bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block font-bold mb-2">
                Content:
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-black p-2 bg-white h-64"
                required
              ></textarea>
            </div>
            <div className="flex justify-between">
              <Link
                href="/admin"
                className="border border-black px-4 py-1 font-bold hover:bg-gray-100"
              >
                CANCEL
              </Link>
              <button
                type="submit"
                className="border border-black px-4 py-1 font-bold hover:bg-gray-100"
              >
                PUBLISH POST
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-black text-white p-4 text-center">
        <p>© 2025 My Retro Blog Admin. All rights reserved.</p>
      </footer>
    </div>
  )
}