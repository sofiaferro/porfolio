"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/blog-actions"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params
        const post = await getBlogPost(resolvedParams.id)
        if (post) {
          setTitle(post.title)
          setContent(post.content)
        }
      } catch (error) {
        console.error("Error loading post:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const resolvedParams = await params
      const formData = new FormData()
      formData.append("id", resolvedParams.id)
      formData.append("title", title)
      formData.append("content", content)
      await updateBlogPost(formData)
      router.push("/admin")
    } catch (error) {
      console.error("Error updating post:", error)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const resolvedParams = await params
        await deleteBlogPost(resolvedParams.id)
        router.push("/admin")
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white font-sans text-black flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <header className="bg-black text-white p-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">EDIT BLOG POST</h1>
        <div className="mt-2">
          <Link href="/admin" className="text-white underline">
            &lt;&lt; Back to Admin Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white border border-black p-4 mb-6">
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
              <button
                type="button"
                onClick={handleDelete}
                className="border border-black px-4 py-1 font-bold hover:bg-gray-100"
              >
                DELETE POST
              </button>
              <button
                type="submit"
                className="border border-black px-4 py-1 font-bold hover:bg-gray-100"
              >
                UPDATE POST
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