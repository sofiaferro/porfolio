"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { projectsData } from "@/data/projects";
import { useLocale, useTranslations } from 'next-intl';


export default function ProjectsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState(projectsData);
  const t = useTranslations('projects');
  const locale = useLocale();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setProjects(projectsData);
    } else {
      setProjects(
        projectsData.filter(
          (project) => project.category.toLowerCase() === filter
        )
      );
    }
  }, [filter]);

  return (
    <div className="pt-20 min-h-screen">
      <section className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{t('title')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div className="text-sm font-mono">{projects.length} {t('title').toUpperCase()}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * (index % 6) }}
              className="group"
            >
              <Link href={`/${locale}/projects/${project.id}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    placeholder={project.image ? "blur" : "empty"}
                    blurDataURL="data:image/svg+xml;base64"
                    priority={index < 3}
                  />
                </div>
                <h3 className="text-xl font-sans mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm font-mono text-muted-foreground mb-3">
                  {project.categoryLabel}
                </p>
                <div className="flex items-center text-sm font-mono">
                  <span className="mr-2">{t('viewProject')}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
