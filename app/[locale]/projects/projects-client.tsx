"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import type { Project } from "@/lib/types";

interface ProjectsClientProps {
  initialProjects: Project[];
  categories: string[];
  locale: string;
}

export default function ProjectsClient({ 
  initialProjects, 
  categories, 
  locale 
}: ProjectsClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const t = useTranslations('projects');

  // Set loaded state immediately since data is already available
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter projects when filter changes
  useEffect(() => {
    if (filter === "all") {
      setProjects(initialProjects);
    } else {
      setProjects(
        initialProjects.filter(
          (project) => project.category?.toLowerCase() === filter
        )
      );
    }
  }, [filter, initialProjects]);

  const uniqueCategories = [
    "all",
    ...categories
  ];

  return (
    <div className="pt-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32"
      >
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t('subtitle')}
          </p>
        </header>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-12">
          {uniqueCategories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category === "all" 
                ? t('categories.all') || 'All'
                : t(`categories.${category}`) || category
              }
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/${locale}/projects/${project.id}`}>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 bg-muted">
                  <Image
                    src={project.image ?? "/placeholder.svg?height=400&width=500"}
                    alt={project.title || 'Project image'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {locale === 'es' ? project.title_es : project.title_en}
                    </h3>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'es' ? project.category_label_es : project.category_label_en}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {locale === 'es' ? project.description_es : project.description_en}
                  </p>
                  {project.year && (
                    <p className="text-xs font-mono text-muted-foreground">
                      {project.year}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {t('noProjectsAvailable')}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
