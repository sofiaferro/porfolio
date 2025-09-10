import Link from "next/link"
import { getBlogPosts } from "@/lib/blog-actions"
import { getProjects } from "@/lib/project-actions"

export default async function AdminDashboard() {
  let posts = []
  let projects = []
  
  try {
    posts = await getBlogPosts()
  } catch (error) {
    console.error("Error loading blog posts:", error)
  }

  try {
    projects = await getProjects()
  } catch (error) {
    console.error("Error loading projects:", error)
  }

  return (
    <div className="space-y-8">
      {/* Blog Posts Section */}
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

        {posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No blog posts yet</p>
            <p className="text-sm">Create your first blog post to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-black">
                <div className="bg-black text-white p-2 font-bold flex justify-between items-center">
                  <span>{post.title_en || post.title_es}</span>
                  <span className="text-xs font-mono">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span>{(post.excerpt_en || post.excerpt_es || "").substring(0, 80)}...</span>
                    </div>
                    <Link
                      href={`/admin/edit-post/${post.id}`}
                      className="border border-black px-3 py-1 text-sm hover:bg-gray-100"
                    >
                      EDIT
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects Section */}
      <div className="bg-white border border-black p-4 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">MANAGE PROJECTS</h2>
          <Link
            href="/admin/new-project"
            className="border border-black px-4 py-1 font-bold hover:bg-gray-100"
          >
            NEW PROJECT
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No projects yet</p>
            <p className="text-sm">Create your first project or migrate existing data!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-black">
                <div className="bg-black text-white p-2 font-bold flex justify-between items-center">
                  <span>{project.title_en || project.title_es}</span>
                  <span className="text-xs font-mono">{project.category_label_en || project.category_label_es}</span>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {project.technologies && project.technologies.length > 0 && (
                        <span>{project.technologies.slice(0, 3).join(", ")}{project.technologies.length > 3 ? "..." : ""}</span>
                      )}
                    </div>
                    <Link
                      href={`/admin/edit-project/${project.id}`}
                      className="border border-black px-3 py-1 text-sm hover:bg-gray-100"
                    >
                      EDIT
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}