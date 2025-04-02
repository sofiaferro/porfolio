"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { useParams, notFound } from "next/navigation"

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [isLoaded, setIsLoaded] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [nextProject, setNextProject] = useState<Project | null>(null)
  const [prevProject, setPrevProject] = useState<Project | null>(null)

  useEffect(() => {
    setIsLoaded(true)

    // Find the current project and adjacent projects for navigation
    const currentIndex = projectsData.findIndex((p) => p.id === id)

    if (currentIndex === -1) {
      notFound()
    }

    setProject(projectsData[currentIndex])

    // Set next and previous projects for navigation
    if (currentIndex > 0) {
      setPrevProject(projectsData[currentIndex - 1])
    } else {
      setPrevProject(null)
    }

    if (currentIndex < projectsData.length - 1) {
      setNextProject(projectsData[currentIndex + 1])
    } else {
      setNextProject(null)
    }
  }, [id])

  if (!project) {
    return null // This will be replaced by notFound() in the useEffect
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
            <p className="text-xs font-mono text-muted-foreground mb-3">{project.categoryLabel}</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">{project.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm font-mono">
              <span className="text-muted-foreground">Año: {project.year || "2025"}</span>
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
              <h2 className="text-2xl font-serif mb-6">Descripción del proyecto</h2>
              <div className="space-y-4 text-foreground/90">
                <p>
                  {project.description ||
                    `Este proyecto explora la intersección entre el diseño editorial clásico y las interfaces digitales modernas. 
                  Utilizando principios de tipografía y composición, se creó una experiencia que equilibra la funcionalidad con la estética.`}
                </p>
                <p>
                  La estructura se basa en una cuadrícula flexible que permite una adaptación fluida a diferentes
                  tamaños de pantalla, manteniendo siempre la jerarquía visual y la legibilidad como prioridades.
                </p>
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
                    <span className="text-muted-foreground mb-2">Tecnologías</span>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-muted text-xs rounded-full">
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
                      className="inline-flex items-center text-primary hover:underline"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-serif mb-8">Galería</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono text-sm">
                    Imagen {item} del proyecto
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Project Navigation */}
          <div className="border-t pt-8 mt-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              {prevProject ? (
                <Link href={`/projects/${prevProject.id}`} className="group mb-4 md:mb-0">
                  <p className="text-xs font-mono text-muted-foreground mb-1">PROYECTO ANTERIOR</p>
                  <div className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-serif">{prevProject.title}</span>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {nextProject && (
                <Link href={`/projects/${nextProject.id}`} className="group text-right md:ml-auto">
                  <p className="text-xs font-mono text-muted-foreground mb-1">PROYECTO SIGUIENTE</p>
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
  )
}

interface Project {
  id: string
  title: string
  categoryLabel: string
  category: string
  image: string
  description?: string
  year?: string
  client?: string
  technologies?: string[]
  link?: string
}

const projectsData: Project[] = [
  {
    id: "01",
    title: "Revista Digital Vanguardia",
    categoryLabel: "DISEÑO EDITORIAL",
    category: "editorial",
    image: "/placeholder.svg?height=600&width=480",
    description:
      "Diseño y desarrollo de una revista digital que combina la estética editorial tradicional con interacciones digitales modernas.",
    year: "2025",
    client: "Editorial Vanguardia",
    technologies: ["HTML", "CSS", "JavaScript", "React"],
    link: "https://example.com/vanguardia",
  },
  {
    id: "02",
    title: "Exposición Tipográfica",
    categoryLabel: "BRANDING",
    category: "branding",
    image: "/placeholder.svg?height=600&width=480",
    description: "Identidad visual y materiales promocionales para una exposición de tipografía experimental.",
    year: "2024",
    client: "Museo de Diseño",
    technologies: ["Illustrator", "Photoshop", "InDesign"],
  },
  {
    id: "03",
    title: "Plataforma Minimalista",
    categoryLabel: "DISEÑO WEB",
    category: "web",
    image: "/placeholder.svg?height=600&width=480",
    description: "Diseño y desarrollo de una plataforma web con enfoque minimalista para una startup de tecnología.",
    year: "2024",
    client: "TechMinimal",
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    link: "https://example.com/techminimal",
  },
  {
    id: "04",
    title: "Catálogo Interactivo",
    categoryLabel: "DISEÑO EDITORIAL",
    category: "editorial",
    image: "/placeholder.svg?height=600&width=480",
    description: "Catálogo digital interactivo para una colección de arte contemporáneo.",
    year: "2023",
    client: "Galería Moderna",
    technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
    link: "https://example.com/catalogo",
  },
  {
    id: "05",
    title: "Identidad Visual Estudio",
    categoryLabel: "BRANDING",
    category: "branding",
    image: "/placeholder.svg?height=600&width=480",
    description: "Desarrollo de identidad visual completa para un estudio de diseño multidisciplinar.",
    year: "2023",
    client: "Estudio Creativo",
    technologies: ["Illustrator", "Photoshop", "After Effects"],
  },
  {
    id: "06",
    title: "Aplicación Móvil Minimalista",
    categoryLabel: "DISEÑO WEB",
    category: "web",
    image: "/placeholder.svg?height=600&width=480",
    description: "Diseño de interfaz y experiencia de usuario para una aplicación móvil de productividad.",
    year: "2022",
    client: "ProductivApp",
    technologies: ["Figma", "React Native", "TypeScript"],
    link: "https://example.com/productivapp",
  },
]

