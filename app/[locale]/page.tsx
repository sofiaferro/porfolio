"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/blog-actions";
import { BlogPost } from "@/lib/types";
import { projectsData } from "@/data/projects";
import { useTranslations, useLocale } from 'next-intl';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const latestProjects = projectsData.slice(-3).reverse();
  const t = useTranslations('home');
  const locale = useLocale();

  useEffect(() => {
    setIsLoaded(true);
    const fetchPosts = async () => {
      const posts = await getBlogPosts();
      setLatestPosts(posts.slice(0, 2));
    };
    fetchPosts();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto pt-24 pb-16 md:pt-32 md:pb-24 lg:py-36">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.p
              variants={fadeIn}
              className="text-sm font-mono tracking-wider text-muted-foreground"
            >
              {t('aboutMe')}
            </motion.p>

            <motion.div variants={fadeIn} className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
                {t('title')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-sans">
                {t('subtitle')}
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="prose prose-lg max-w-2xl text-foreground/90 space-y-4"
            >
              <p>
                {t('description1')}
              </p>
              <p>
                {t('description2')}
              </p>
            </motion.div>

            {/* Contact Links */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <Link
                href="https://github.com/sofiaferro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-foreground hover:line-through transition-colors"
              >
                <span className="font-mono text-sm">GitHub</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/sofiaferro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-foreground hover:line-through transition-colors"
              >
                <span className="font-mono text-sm">LinkedIn</span>
              </Link>
              <Link
                href="mailto:svf.inbox@gmail.com"
                className="flex items-center text-foreground hover:line-through transition-colors"
              >
                <span className="font-mono text-sm">Email</span>
              </Link>
            </motion.div>

            {/* Projects Grid */}
            <motion.div variants={fadeIn} className="pt-12">
              <h2 className="text-2xl md:text-3xl font-serif mb-6">
                {t('recentProjects')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                  >
                    <Link
                      href={`/${locale}/projects/${project.id}`}
                      className="block h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-gray-50">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 2}
                        />
                      </div>
                      <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 font-mono">
                        {project.categoryLabel}
                      </p>
                      <div className="flex items-center text-sm font-mono text-primary">
                        <span className="mr-2">{t('viewProject')}</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href={`/${locale}/projects`}
                  className="inline-flex items-center text-lg font-mono border-b border-primary pb-1 hover:border-primary/70 transition-colors"
                >
                  {t('viewAllProjects')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="bg-muted py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                {t('latestPosts')}
              </h2>
              <div className="h-px w-24 bg-primary"></div>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {latestPosts.map((post, index) => {
                  
  const title = locale === "es" ? post.title_es : post.title_en;
  const excerpt = locale === "es" ? post.excerpt_es : post.excerpt_en;
                  return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                  >
                    <Link href={`/${locale}/blog/${post.id}`}>
                      <p className="text-xs font-mono text-muted-foreground mb-2">
                        {new Date(post.date)
                          .toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .toLowerCase()}
                      </p>
                      <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {excerpt}
                      </p>
                      <div className="flex items-center text-sm font-mono text-primary">
                        <span className="mr-2">{t('readMore')}</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.article>
                )})}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {t('noPostsAvailable')}
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center text-lg font-mono border-b border-primary pb-1 hover:border-primary/70 transition-colors"
              >
                {t('viewAllPosts')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
