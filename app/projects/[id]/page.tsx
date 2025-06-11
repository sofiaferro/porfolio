"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useParams, notFound } from "next/navigation";
import { projectsData } from "@/data/projects";
import { parseDescription } from "../utils";

export default function ProjectDetailPage() {
  const { id } = useParams() as { id: string };
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const index = projectsData.findIndex((p) => p.id === id);
    if (index === -1) return notFound();

    setProject(projectsData[index]);
    setPrevProject(index > 0 ? projectsData[index - 1] : null);
    setNextProject(index < projectsData.length - 1 ? projectsData[index + 1] : null);
    setCurrentImageIndex(0); // Reset carousel cuando cambia el proyecto
  }, [id]);

  if (!project) return null;

  const getVideoEmbedUrl = (url: string) => {
    const isYouTube = url.includes("youtu");
    const isVimeo = url.includes("vimeo");

    if (isYouTube) {
      const videoId = url.includes("youtu.be")
        ? url.split("/").pop()?.split("?")[0]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (isVimeo) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  };

  const nextImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === project.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images!.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="pt-20 min-h-screen">
      <article className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32 max-w-5xl">
        <Link href="/projects" className="group text-sm font-mono inline-flex items-center mb-8 hover:text-primary transition">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a proyectos
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-mono text-muted-foreground mb-2">{project.categoryLabel}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
          <p className="text-sm font-mono text-muted-foreground">Año: {project.year ?? "2025"}</p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={project.image ?? "/placeholder.svg?height=900&width=1600"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16"
        >
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-2xl font-serif mb-4">Descripción del proyecto</h2>
            {project.description?.split("\n").map((paragraph, i) => (
              <p key={i} className="text-foreground/90">
                {parseDescription(paragraph)}
              </p>
            ))}
          </div>
          <aside className="md:col-span-4 space-y-4">
            <h2 className="text-2xl font-serif mb-4">Detalles</h2>
            <ul className="space-y-2 text-sm font-mono">
              <li className="flex justify-between text-muted-foreground">
                <span>Categoría</span>
                <span className="text-foreground">{project.categoryLabel}</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>Año</span>
                <span className="text-foreground">{project.year ?? "2025"}</span>
              </li>
              {project.technologies && (
                <li>
                  <p className="text-muted-foreground mb-2">Tecnologías</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="bg-muted px-2 py-1 rounded-full text-xs">{tech}</span>
                    ))}
                  </div>
                </li>
              )}
              {/* {project.link && (
                <li className="pt-2">
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Ver proyecto en vivo
                    <ExternalLink className="ml-1 w-3 h-3" />
                  </Link>
                </li>
              )} */}
            </ul>
          </aside>
        </motion.section>

        {/* NUEVA SECCIÓN: Carousel de Imágenes */}
        {project.images && project.images.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-serif mb-8">Galería del proyecto</h2>
            
            <div className="relative">
              {/* Imagen principal del carousel */}
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={project.images[currentImageIndex].src}
                  alt={project.images[currentImageIndex].alt || `Imagen ${currentImageIndex + 1} de ${project.title}`}
                  style={{objectFit: "contain"}}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
                
                {/* Controles de navegación */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Contador de imágenes */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">
                    {currentImageIndex + 1} / {project.images.length}
                  </div>
                )}
              </div>

              {/* Caption de la imagen actual */}
              {project.images[currentImageIndex].caption && (
                <p className="text-sm text-muted-foreground mt-3 text-center font-mono">
                  {project.images[currentImageIndex].caption}
                </p>
              )}

              {/* Thumbnails / Indicadores */}
              {project.images.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-primary' 
                          : 'bg-muted hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Ir a imagen ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Versión alternativa con thumbnails de las imágenes */}
              {project.images.length > 1 && project.images.length <= 6 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
                  {project.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'ring-2 ring-primary ring-offset-2' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || `Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {project.video && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-serif mb-8">Video</h2>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-black">
              <iframe
                src={getVideoEmbedUrl(project.video)}
                className="absolute inset-0 w-full h-full"
                title={`Video de ${project.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.section>
        )}

        {project.link && !project.video && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
{/*              <h2 className="text-2xl font-serif mb-8">Enlace al proyecto</h2>
 */}           <div /* className="relative aspect-[16/9] overflow-hidden rounded-lg group" */>
{/*                <Image
                src={project.link}
                alt={`Vista previa de ${project.title}`}
                fill
                className="object-cover"
              />  */}
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className=" flex items-center justify-start bg-black/30 hover:bg-black/50 transition"
              >
                <div className="bg-white px-6 py-3 rounded-full flex items-center gap-2 text-black font-medium shadow-md">
                  Ir al proyecto <ExternalLink className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.section>
        )}

        {/* Navegación entre proyectos */}
        {(prevProject || nextProject) && (
          <div className="flex justify-between mt-24 border-t pt-8">
            {prevProject ? (
              <Link href={`/projects/${prevProject.id}`} className="group text-sm font-mono inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {prevProject.title}
              </Link>
            ) : <span />}
            {nextProject ? (
              <Link href={`/projects/${nextProject.id}`} className="group text-sm font-mono inline-flex items-center">
                {nextProject.title}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <span />}
          </div>
        )}
      </article>
    </div>
  );
}


interface GalleryImage {
  id: number;
  label: string;
  src: string;
}

interface ProjectImage {
  src: string;
  alt?: string;
  caption?: string;
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
  video?: string; // Nueva prop para videos de YouTube/Vimeo
  images?: ProjectImage[]; // Nueva prop para array de imágenes
  gallery?: GalleryImage[]; // Mantenemos la galería legacy
}