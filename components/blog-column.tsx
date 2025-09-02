"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { getBlogPosts } from "@/lib/blog-actions";
import { BlogPost } from "@/lib/types";
import BlogCard from "./blog-card";

export default function BlogColumn() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('blog');
  const locale = useLocale();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-300">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-xs md:text-sm text-gray-600 font-mono">
          {t('subtitle')}
        </p>
      </div>

      {/* Blog Posts */}
      {isLoading ? (
        <div className="p-4 md:p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      ) : posts.length > 0 ? (
        <div className="p-2 md:p-4">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 md:p-6 text-center">
          <p className="text-xs md:text-sm text-gray-500">
            {t('noPostsAvailable')}
          </p>
        </div>
      )}
    </div>
  );
}
