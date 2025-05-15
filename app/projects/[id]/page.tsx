"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { useParams, notFound } from "next/navigation";
import { projectsData } from "@/data/projects";
import { parseDescription } from "../utils";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [isLoaded, setIsLoaded] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);

  useEffect(() => {
    setIsLoaded(true);

    // Find the current project and adjacent projects for navigation
    const currentIndex = projectsData.findIndex((p) => p.id === id);

    if (currentIndex === -1) {
      notFound();
    }

    setProject(projectsData[currentIndex]);

    // Set next and previous projects for navigation
    if (currentIndex > 0) {
      setPrevProject(projectsData[currentIndex - 1]);
    } else {
      setPrevProject(null);
    }

    if (currentIndex < projectsData.length - 1) {
      setNextProject(projectsData[currentIndex + 1]);
    } else {
      setNextProject(null);
    }
  }, [id]);

  if (!project) {
    return null;
  }

  return (
    <div className="pt-20 min-h-screen">
      <article className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center group text-sm font-mono mb-8 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver a proyectos
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs font-mono text-muted-foreground mb-3">
              {project.categoryLabel}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans mb-6">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm font-mono">
              <span className="text-muted-foreground">
                Año: {project.year || "2025"}
              </span>
            </div>
          </motion.header>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={project.image || "/placeholder.svg?height=900&width=1600"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Project Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16"
          >
            <div className="md:col-span-8">
              <h2 className="text-2xl font-serif mb-6">
                Descripción del proyecto
              </h2>
              <div className="space-y-4 text-foreground/90">
                {project.description?.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {parseDescription(paragraph)}
                  </p>
                ))}
              </div>
            </div>
            <div className="md:col-span-4">
              <h2 className="text-2xl font-serif mb-6">Detalles</h2>
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Categoría</span>
                  <span>{project.categoryLabel}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Año</span>
                  <span>{project.year || "2025"}</span>
                </li>
                {project.technologies && (
                  <li className="flex flex-col">
                    <span className="text-muted-foreground mb-2">
                      Tecnologías
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-muted text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </li>
                )}
                {project.link && (
                  <li className="pt-2">
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary underline hover:text-primary/80 hover:underline-offset-4 transition-all duration-200"
                      >
                      Ver proyecto en vivo
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </motion.div>

          {/* Project Gallery */}
          {project.gallery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-serif mb-8">Galería</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((item, index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] overflow-hidden bg-muted"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-sm">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Project Navigation */}
          <div className="border-t pt-8 mt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.id}`}
                  className="group mb-4 md:mb-0"
                >
                  <p className="text-xs font-mono text-muted-foreground mb-1">
                    PROYECTO ANTERIOR
                  </p>
                  <div className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-serif">{prevProject.title}</span>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {nextProject && (
                <Link
                  href={`/projects/${nextProject.id}`}
                  className="group text-right md:ml-auto"
                >
                  <p className="text-xs font-mono text-muted-foreground mb-1">
                    PROYECTO SIGUIENTE
                  </p>
                  <div className="flex items-center justify-end">
                    <span className="font-serif">{nextProject.title}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

interface GalleryImage {
  id: number;
  label: string;
  src: string;
}

interface Project {
  id: string;
  title: string;
  categoryLabel: string;
  category: string;
  image: string;
  description?: string;
  year?: string;
  client?: string;
  technologies?: string[];
  link?: string;
  gallery?: GalleryImage[];
}
