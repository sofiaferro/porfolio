"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { BlogPost } from "@/lib/types";
import ReactMarkdown from "react-markdown";

interface BlogCardProps {
  post: BlogPost;
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const title = locale === "es" ? post.title_es : post.title_en;
  const content = locale === "es" ? post.content_es : post.content_en;

  console.log("Blog post data:", post);
  console.log("Post image field:", post.image);
  console.log("Content preview:", content?.substring(0, 200));

  // Extract first image from markdown content if post.image is not available
  const extractImageFromContent = (text: string) => {
    if (!text) return null;
    // Match markdown images like ![alt text](/images/zen.jpeg)
    const imgMatch = text.match(/!\[.*?\]\(([^)]+)\)/);
    console.log("Image match result:", imgMatch);
    return imgMatch ? imgMatch[1] : null;
  };

  const imageUrl = post.image || extractImageFromContent(content);
  console.log("Final image URL:", imageUrl);

  return (
    <article className="mb-6 md:mb-8 p-3 md:p-4 border-b border-gray-200 last:border-b-0">
      {/* Date */}
      <p className="text-xs font-mono text-gray-500 mb-2">
        {formatDate(post.date, locale)}
      </p>

      {/* Title */}
      <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 leading-tight">
        {title}
      </h3>

      {/* Subtitle */}
      {post.subtitle && (
        <p className="text-xs text-gray-600 mb-3 font-mono">{post.subtitle}</p>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="w-full h-24 md:h-32 rounded overflow-hidden mb-3 bg-gray-100">
          <img
            src={imageUrl}
            alt={title || "Blog post image"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            onLoad={() => {}}
          />
        </div>
      )}

      {/* Full Content */}
      {content && (
        <div className="blog-content text-xs md:text-sm text-gray-700 leading-relaxed mb-3">
          <div className="markdown-content">
            <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-2 last:mb-0 break-words">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono break-all">
                  {children}
                </code>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {children}
                </a>
              ),
              li: ({ children }) => (
                <li className="break-words mb-1">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
                  {children}
                </blockquote>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto block mx-auto my-2 rounded"
                />
              ),
            }}
                      >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Read More Link */}
      <Link
        href={`/${locale}/blog/${post.id}`}
        className="inline-flex items-center text-xs font-mono text-gray-600 hover:text-gray-800 transition-colors"
      >
        Read full post →
      </Link>
    </article>
  );
}
