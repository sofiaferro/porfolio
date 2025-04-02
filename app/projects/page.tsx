"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [filter, setFilter] = useState("all")
  const [projects, setProjects] = useState(projectsData)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (filter === "all") {
      setProjects(projectsData)
    } else {
      setProjects(projectsData.filter((project) => project.category.toLowerCase() === filter))
    }
  }, [filter])

  return (
    <div className="pt-20 min-h-screen">
      <section className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-6">Proyectos</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Una colección de trabajos que exploran la intersección entre el diseño editorial y las experiencias
            digitales modernas.
          </p>
        </motion.div>

        <div className="flex justify-between items-center mb-8 md:mb-12">
          <div className="text-sm font-mono">{projects.length} PROYECTOS</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-mono text-xs">
                <Filter className="h-3 w-3 mr-2" />
                FILTRAR
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("editorial")}>Editorial</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("web")}>Web</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("branding")}>Branding</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <Link href={`/projects/${project.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden mb-4">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm font-mono text-muted-foreground mb-3">{project.categoryLabel}</p>
                <div className="flex items-center text-sm font-mono">
                  <span className="mr-2">Ver proyecto</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

const projectsData = [
  {
    id: "01",
    title: "Revista Digital Vanguardia",
    categoryLabel: "DISEÑO EDITORIAL",
    category: "editorial",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "02",
    title: "Exposición Tipográfica",
    categoryLabel: "BRANDING",
    category: "branding",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "03",
    title: "Plataforma Minimalista",
    categoryLabel: "DISEÑO WEB",
    category: "web",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "04",
    title: "Catálogo Interactivo",
    categoryLabel: "DISEÑO EDITORIAL",
    category: "editorial",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "05",
    title: "Identidad Visual Estudio",
    categoryLabel: "BRANDING",
    category: "branding",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "06",
    title: "Aplicación Móvil Minimalista",
    categoryLabel: "DISEÑO WEB",
    category: "web",
    image: "/placeholder.svg?height=600&width=480",
  },
]

