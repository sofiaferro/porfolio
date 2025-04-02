"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Code, Cpu, Lightbulb, Github, Linkedin, Mail } from "lucide-react"
import { getBlogPosts } from "@/lib/actions"
import type { BlogPost } from "@/lib/actions"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    setIsLoaded(true)

    const fetchPosts = async () => {
      const posts = await getBlogPosts()
      setLatestPosts(posts.slice(0, 2)) // Get only the 2 most recent posts
    }

    fetchPosts()
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section with Integrated Specialties */}
      <section className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p variants={fadeIn} className="text-sm font-mono tracking-wider text-muted-foreground">
              ABOUT ME
            </motion.p>
            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight tracking-tight"
            >
              Sofia Ferro
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl font-sans">
              Software Engineer, AI Engineer & Creative Technologist
            </motion.p>
            <motion.div variants={fadeIn} className="pt-4 max-w-2xl text-foreground/90 space-y-4">
              <p>
                Explorando la intersección entre el desarrollo de software, la inteligencia artificial y la creatividad
                tecnológica. Mi trabajo se enfoca en crear experiencias digitales que combinen funcionalidad con diseño
                editorial.
              </p>
              <p>
                Con un enfoque en la tipografía como elemento estructural, mis proyectos buscan el equilibrio perfecto
                entre minimalismo y experimentación.
              </p>
            </motion.div>

            {/* Specialties Grid */}
            <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-4">
              <div className="space-y-3">
                <div className="bg-primary/10 dark:bg-primary/5 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-serif">Software Engineering</h3>
                <p className="text-sm text-muted-foreground">
                  Desarrollo de aplicaciones web y móviles con enfoque en arquitecturas limpias.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-primary/10 dark:bg-primary/5 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-serif">AI Engineering</h3>
                <p className="text-sm text-muted-foreground">
                  Implementación de soluciones de inteligencia artificial y aprendizaje automático.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-primary/10 dark:bg-primary/5 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-serif">Creative Technology</h3>
                <p className="text-sm text-muted-foreground">
                  Exploración de nuevas formas de interacción entre humanos y tecnología.
                </p>
              </div>
            </motion.div>

            {/* Contact Links */}
            <motion.div variants={fadeIn} className="flex items-center space-x-6 pt-4">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors flex items-center"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 mr-2" />
                <span className="font-mono text-sm">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors flex items-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                <span className="font-mono text-sm">LinkedIn</span>
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="text-foreground hover:text-primary transition-colors flex items-center"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 mr-2" />
                <span className="font-mono text-sm">Email</span>
              </Link>
            </motion.div>

            {/* CTA Links */}
            <motion.div variants={fadeIn} className="pt-8 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center group text-lg font-mono border-b-2 border-primary pb-1 hover:border-primary/70 transition-colors"
              >
                Ver proyectos
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center group text-lg font-mono border-b-2 border-primary pb-1 hover:border-primary/70 transition-colors"
              >
                Leer blog
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="bg-muted py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Últimas publicaciones</h2>
              <div className="h-px w-24 bg-primary"></div>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {latestPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group"
                  >
                    <Link href={`/blog/${post.id}`}>
                      <p className="text-xs font-mono text-muted-foreground mb-2">
                        {new Date(post.date)
                          .toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                          .toUpperCase()}
                      </p>
                      <h3 className="text-xl md:text-2xl font-serif mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-sm font-mono">
                        <span className="mr-2">Leer más</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay publicaciones disponibles.</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center group text-lg font-mono border-b-2 border-primary pb-1 hover:border-primary/70 transition-colors"
              >
                Ver todas las publicaciones
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

