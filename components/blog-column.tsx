"use client";

import { useTranslations, useLocale } from 'next-intl';
import { BlogPost } from "@/lib/types";
import BlogCard from "./blog-card";

interface BlogColumnProps {
  posts: BlogPost[];
}

export default function BlogColumn({ posts }: BlogColumnProps) {
  const t = useTranslations('blog');
  const locale = useLocale();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('title')}
        </h2>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-mono">
          {t('subtitle')}
        </p>
      </div>

      {/* Blog Posts */}
      {posts.length > 0 ? (
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
        <div className="p-4 md:p-6 text-center text-gray-500 dark:text-gray-400">
          {t('noPostsAvailable')}
        </div>
      )}
    </div>
  );
}
