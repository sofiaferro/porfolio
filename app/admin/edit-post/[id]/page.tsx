"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/blog-actions"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [titleEn, setTitleEn] = useState("")
  const [titleEs, setTitleEs] = useState("")
  const [subtitleEn, setSubtitleEn] = useState("")
  const [subtitleEs, setSubtitleEs] = useState("")
  const [contentEn, setContentEn] = useState("")
  const [contentEs, setContentEs] = useState("")
  const [image, setImage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params
        const post = await getBlogPost(resolvedParams.id)
        if (post) {
          setTitleEn(post.title_en || "")
          setTitleEs(post.title_es || "")
          setSubtitleEn(post.subtitle_en || "")
          setSubtitleEs(post.subtitle_es || "")
          setContentEn(post.content_en || "")
          setContentEs(post.content_es || "")
          setImage(post.image || "")
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
      formData.append("title_en", titleEn)
      formData.append("title_es", titleEs)
      formData.append("subtitle_en", subtitleEn)
      formData.append("subtitle_es", subtitleEs)
      formData.append("content_en", contentEn)
      formData.append("content_es", contentEs)
      formData.append("image", image)
      
      const result = await updateBlogPost(formData)
      
      if (result?.error) {
        alert("Error updating post: " + result.error)
      } else {
        alert("Post updated successfully!")
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Error updating post: " + (error instanceof Error ? error.message : 'Unknown error'))
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image */}
            <div>
              <label htmlFor="image" className="block font-bold mb-2">
                Image URL:
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-black p-2 bg-white"
                placeholder="https://example.com/image.jpg or /images/photo.jpg"
              />
            </div>

            {/* English Section */}
            <div className="border border-gray-300 p-4">
              <h2 className="text-xl font-bold mb-4 text-blue-600">English Content</h2>
              
              <div className="mb-4">
                <label htmlFor="title_en" className="block font-bold mb-2">
                  Title (English):
                </label>
                <input
                  type="text"
                  id="title_en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="subtitle_en" className="block font-bold mb-2">
                  Subtitle (English):
                </label>
                <input
                  type="text"
                  id="subtitle_en"
                  value={subtitleEn}
                  onChange={(e) => setSubtitleEn(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="content_en" className="block font-bold mb-2">
                  Content (English):
                </label>
                <textarea
                  id="content_en"
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  className="w-full border border-black p-2 bg-white h-64"
                  required
                ></textarea>
              </div>
            </div>

            {/* Spanish Section */}
            <div className="border border-gray-300 p-4">
              <h2 className="text-xl font-bold mb-4 text-red-600">Spanish Content</h2>
              
              <div className="mb-4">
                <label htmlFor="title_es" className="block font-bold mb-2">
                  Title (Spanish):
                </label>
                <input
                  type="text"
                  id="title_es"
                  value={titleEs}
                  onChange={(e) => setTitleEs(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="subtitle_es" className="block font-bold mb-2">
                  Subtitle (Spanish):
                </label>
                <input
                  type="text"
                  id="subtitle_es"
                  value={subtitleEs}
                  onChange={(e) => setSubtitleEs(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="content_es" className="block font-bold mb-2">
                  Content (Spanish):
                </label>
                <textarea
                  id="content_es"
                  value={contentEs}
                  onChange={(e) => setContentEs(e.target.value)}
                  className="w-full border border-black p-2 bg-white h-64"
                  required
                ></textarea>
              </div>
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