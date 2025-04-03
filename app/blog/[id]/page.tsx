import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBlogPost, getComments } from "@/lib/blog-actions"
import CommentForm from "@/components/comment-form"
import { notFound } from "next/navigation"

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  const comments = await getComments(params.id)

  const formattedDate = new Date(post.date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="pt-20 min-h-screen">
      <article className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center group text-sm font-mono mb-8 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver al blog
          </Link>

          <header className="mb-12">
            <p className="text-xs font-mono text-muted-foreground mb-3">{formattedDate.toUpperCase()}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">{post.title}</h1>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Comments Section */}
          <section className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-serif mb-8">Comentarios</h2>

            {comments.length > 0 ? (
              <div className="space-y-8 mb-12">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-muted/50 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{comment.author_name}</h3>
                      <p className="text-xs font-mono text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mb-8">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
            )}

            <CommentForm postId={params.id} />
          </section>
        </div>
      </article>
    </div>
  )
}

