import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getBlogPost } from "@/lib/blog-actions";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getTranslations } from "next-intl/server";
import { formatDate } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Server Component - Data is fetched on the server!
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
  
  // Try to fetch by slug first, fallback to ID if slug doesn't exist
  let post = await getBlogPostBySlug(slug);
  
  // If no post found by slug, try treating slug as an ID (for backward compatibility)
  if (!post) {
    post = await getBlogPost(slug);
  }
  
  if (!post) {
    notFound();
  }

  // Get translations on the server
  const t = await getTranslations({ locale, namespace: 'blog' });

  const title = locale === "es" ? post.title_es : post.title_en;
  const content = locale === "es" ? post.content_es : post.content_en;
  const excerpt = locale === "es" ? post.excerpt_es : post.excerpt_en;

  return (
    <div className="min-h-screen bg-[#f5f5f0] dark:bg-neutral-900 pt-4">
      <article className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center group text-sm font-mono mb-8 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t('back')}
          </Link>

          <header className="mb-12">
            <p className="text-xs font-mono text-muted-foreground mb-3">
              {formatDate(post.date, locale)}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {excerpt && (
              <p className="prose prose-lg dark:prose-invert max-w-none">
                <em>{excerpt}</em>
              </p>
            )}
            {post.subtitle && (
              <h2 className="text-xl md:text-2xl font-serif text-muted-foreground mb-4">
                {post.subtitle}
              </h2>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none text-left">
            <ReactMarkdown
              components={{
                img: ({ node, ...props }) => (
                  <img
                    src={props.src}
                    alt={props.alt || ""}
                    className="max-w-full h-auto block mx-auto"
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </article>
    </div>
  );
}

// Enable ISR for blog posts - they don't change frequently
export const revalidate = 600; // Revalidate every 10 minutes

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  // We could pre-generate some popular blog posts here
  // For now, we'll let them be generated on-demand
  return [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug, locale } = await params;
  
  // Try to fetch by slug first, fallback to ID if slug doesn't exist
  let post = await getBlogPostBySlug(slug);
  if (!post) {
    post = await getBlogPost(slug);
  }
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = locale === "es" ? post.title_es : post.title_en;
  const excerpt = locale === "es" ? post.excerpt_es : post.excerpt_en;

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}