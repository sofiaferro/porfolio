import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/blog-actions";
import Image from "next/image";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="pt-20 min-h-screen">
      <section className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <div className="max-w-3xl mb-16 md:mb-24">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Mensajes en una botella digital.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 md:gap-24">
          {/* Featured Post (if there are posts) */}
          {blogPosts.length > 0 && (
            <article className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-5 md:order-1 flex flex-col justify-center">
                <p className="text-xs font-mono text-muted-foreground mb-3">
                  {new Date(blogPosts[0].date)
                    .toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <Link
                  href={`/blog/${blogPosts[0].id}`}
                  className="inline-flex items-center group text-sm font-mono border-b-2 border-primary pb-1 hover:border-primary/70 transition-colors self-start"
                >
                  Leer artículo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="md:col-span-7 md:order-2">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden rounded-lg">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </article>
          )}

          {/* Post Grid */}
          {blogPosts.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {blogPosts.slice(1).map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.id}`} className="group">
                    <div className="relative aspect-[3/2] bg-muted mb-4 flex items-center justify-center">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={300}
                        height={200}
                      />
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mb-2">
                      {new Date(post.date)
                        .toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                        .toUpperCase()}
                    </p>
                    <h3 className="text-xl md:text-2xl font-serif mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-sm font-mono">
                      <span className="mr-2">Leer artículo</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay publicaciones disponibles.
              </p>
            </div>
          ) : null}
        </div>

        {/* Categories and Tags */}
{/*         <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h3 className="text-lg font-serif mb-4">Categorías</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Desarrollo de Software
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Inteligencia Artificial
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Diseño Web
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Tecnología Creativa
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Experimentación
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-8">
            <h3 className="text-lg font-serif mb-4">Etiquetas</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href="#"
                  className="px-3 py-1 bg-muted hover:bg-muted/80 text-xs font-mono rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div> */}
      </section>
    </div>
  );
}

const tags = [
  "JAVASCRIPT",
  "REACT",
  "NEXTJS",
  "AI",
  "MACHINE LEARNING",
  "UX",
  "TYPOGRAPHY",
  "DESIGN SYSTEMS",
  "CREATIVE CODING",
  "PYTHON",
  "SUPABASE",
];
