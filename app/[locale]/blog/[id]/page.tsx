"use client"

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogPost } from "@/lib/blog-actions";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";

export default function BlogPostPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = use(params);
  const t = useTranslations('blog');
  const c = useTranslations('common');

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPost(id).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);
  if (loading) return <div>{c('loading')}</div>;
  if (!post) return notFound();

  const content = locale === "es" ? post.content_es : post.content_en;
  const excerpt = locale === "es" ? post.excerpt_es : post.excerpt_en;

  const formattedDate = new Date(post.date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pt-20 min-h-screen">
      <article className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center group text-sm font-mono mb-8 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {t('backToBlog')}
          </Link>

          <header className="mb-12">
            <p className="text-xs font-mono text-muted-foreground mb-3">
              {formattedDate.toUpperCase()}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
              {post.title}
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
