import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getBlogPosts } from "@/lib/blog-actions"

export default async function AdminDashboard() {
  console.log("Admin page - Rendering started")

  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log("Admin page - User exists:", !!user)

  if (error || !user) {
    console.log("Admin page - No authenticated user, redirecting to login")
    redirect("/login")
  }

  if (user.id !== process.env.ADMIN_USER_ID) {
    console.log("Admin page - User is not admin, redirecting to home")
    redirect("/")
  }

  console.log("Admin page - User is admin, rendering admin dashboard")

  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <header className="bg-black text-white p-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">ADMIN DASHBOARD</h1>
        <div className="mt-2">
          <Link href="/" className="text-white underline">
            &lt;&lt; Back to Homepage
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white border border-black p-4 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">MANAGE BLOG POSTS</h2>
            <Link
              href="/admin/new-post"
              className="border border-black px-4 py-1 font-bold hover:bg-gray-100"
            >
              NEW POST
            </Link>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="border border-black">
                <div className="bg-black text-white p-1 font-bold">{post.title}</div>
                <div className="p-4 bg-white">
                  <div className="text-sm mb-2">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <p className="mb-4">{post.excerpt}</p>
                  <div className="flex justify-between">
                    <Link
                      href={`/admin/edit-post/${post.id}`}
                      className="text-black underline"
                    >
                      Edit Post
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-black text-white p-4 text-center">
        <p>© 2025 My Retro Blog Admin. All rights reserved.</p>
      </footer>
    </div>
  )
}