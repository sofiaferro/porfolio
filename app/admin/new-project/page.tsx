"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createProject } from "@/lib/project-actions"

export default function NewProjectPage() {
  const [titleEn, setTitleEn] = useState("")
  const [titleEs, setTitleEs] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [descriptionEs, setDescriptionEs] = useState("")
  const [technologies, setTechnologies] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData()
    formData.append("title_en", titleEn)
    formData.append("title_es", titleEs)
    formData.append("description_en", descriptionEn)
    formData.append("description_es", descriptionEs)
    formData.append("technologies", technologies)
    formData.append("github_url", githubUrl)
    formData.append("live_url", liveUrl)
    formData.append("image", image)
    const result = await createProject(formData)
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <header className="bg-black text-white p-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">NEW PROJECT</h1>
        <div className="mt-2">
          <Link href="/admin" className="text-white underline">
            &lt;&lt; Back to Admin Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white border border-black p-4 mb-6">
          {error && <div className="bg-black text-white p-2 mb-4">Error: {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image */}
            <div>
              <label htmlFor="image" className="block font-bold mb-2">
                Image URL:
              </label>
              <input
                type="url"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-black p-2 bg-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Technologies */}
            <div>
              <label htmlFor="technologies" className="block font-bold mb-2">
                Technologies (comma-separated):
              </label>
              <input
                type="text"
                id="technologies"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className="w-full border border-black p-2 bg-white"
                placeholder="React, TypeScript, Next.js"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="github_url" className="block font-bold mb-2">
                  GitHub URL:
                </label>
                <input
                  type="url"
                  id="github_url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div>
                <label htmlFor="live_url" className="block font-bold mb-2">
                  Live URL:
                </label>
                <input
                  type="url"
                  id="live_url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full border border-black p-2 bg-white"
                  placeholder="https://example.com"
                />
              </div>
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
                <label htmlFor="description_en" className="block font-bold mb-2">
                  Description (English):
                </label>
                <textarea
                  id="description_en"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full border border-black p-2 bg-white h-32"
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
                <label htmlFor="description_es" className="block font-bold mb-2">
                  Description (Spanish):
                </label>
                <textarea
                  id="description_es"
                  value={descriptionEs}
                  onChange={(e) => setDescriptionEs(e.target.value)}
                  className="w-full border border-black p-2 bg-white h-32"
                  required
                ></textarea>
              </div>
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
                CREATE PROJECT
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
