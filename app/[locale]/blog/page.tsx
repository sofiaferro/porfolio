"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getBlogPosts } from "@/lib/blog-actions";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const t = useTranslations("blog");
  const locale = useLocale();

  useEffect(() => {
    setIsLoaded(true);
    const fetchPosts = async () => {
      const posts = await getBlogPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, []);

  // TODO: REFACTOR FOR MORE POSTS
  const title = locale === "es" ? posts[0]?.title_es : posts[0]?.title_en;
  const excerpt = locale === "es" ? posts[0]?.excerpt_es : posts[0]?.excerpt_en;
  return (
    <div className="pt-4 min-h-screen">
      <section className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{t("title")}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-16 md:gap-24">
          {/* Featured Post (if there are posts) */}
          {posts.length > 0 && (
            <article className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-5 md:order-1 flex flex-col justify-center">
                <p className="text-xs font-mono text-muted-foreground mb-3">
                {formatDate(posts[0].date, locale)}
                </p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4">
                  {title}
                </h2>
                <p className="text-muted-foreground mb-6">{excerpt}</p>
                <Link
                  href={`./blog/${posts[0].id}`}
                  className="inline-flex items-center group text-sm font-mono border-b-2 border-primary pb-1 hover:border-primary/70 transition-colors self-start"
                >
                  <span className="mr-2">{t("readMore")}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="md:col-span-7 md:order-2">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden rounded-lg">
                  <Image
                    src={posts[0].image}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          )}

          {/* Post Grid */}
          {posts.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {posts.slice(1).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.1 * (index % 6) }}
                  className="group"
                >
                  <Link href={`./blog/${post.id}`} className="group">
                    <div className="relative aspect-[3/2] bg-muted mb-4 flex items-center justify-center">
                      <Image
                        src={post.image}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-sans mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-muted-foreground mb-4">{excerpt}</p>
                    <div className="flex items-center text-sm font-mono">
                      <span className="mr-2">{t("readMore")}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("noPostsAvailable")}</p>
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
