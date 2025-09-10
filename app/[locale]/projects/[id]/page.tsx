import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { notFound } from "next/navigation";
import { parseDescription } from "../utils";
import { getTranslations } from "next-intl/server";
import { getProject, getProjects } from "@/lib/project-actions";
import type { Project } from "@/lib/types";
import ProjectGallery from "./project-gallery";

interface ProjectDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

// Server Component - Data is fetched on the server!
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id, locale } = await params;
  
  // Fetch data on the server
  const [project, allProjects] = await Promise.all([
    getProject(id),
    getProjects()
  ]);

  if (!project) {
    notFound();
  }

  // Get translations on the server
  const t = await getTranslations("projects");

  // Find prev/next projects
  const currentIndex = allProjects.findIndex((p) => p.id === id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

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

  return (
    <div className="pt-4 min-h-screen">
      <article className="container mx-auto px-4 md:px-6 pt-12 md:pt-24 lg:pt-32 max-w-5xl">
        <Link
          href={`/${locale}/projects`}
          className="group text-sm font-mono inline-flex items-center mb-8 hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t("backToProjects")}
        </Link>

        <header className="mb-12">
          <p className="text-xs font-mono text-muted-foreground mb-2">
            {locale === 'es' ? project.category_label_es : project.category_label_en}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {locale === 'es' ? project.title_es : project.title_en}
          </h1>
          <p className="text-sm font-mono text-muted-foreground">
            {t("year")}: {project.year ?? "2025"}
          </p>
        </header>

        <div className="mb-16">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src={project.image ?? "/placeholder.svg?height=900&width=1600"}
              alt={project.title || 'Project image'}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-2xl font-serif mb-4">{t("description")}</h2>
            {(locale === 'es' ? project.description_es : project.description_en)?.split("\n").map((paragraph, i) => (
              <p key={i} className="text-foreground/90">
                {parseDescription(paragraph)}
              </p>
            ))}
          </div>
          <aside className="md:col-span-4 space-y-4">
            <h2 className="text-2xl font-serif mb-4">{t("details")}</h2>
            <ul className="space-y-2 text-sm font-mono">
              <li className="flex justify-between text-muted-foreground">
                <span>{t("category")}</span>
                <span className="text-foreground">{locale === 'es' ? project.category_label_es : project.category_label_en}</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>{t("year")}</span>
                <span className="text-foreground">
                  {project.year ?? "2025"}
                </span>
              </li>
              {project.technologies && (
                <li>
                  <p className="text-muted-foreground mb-2">{t("technologies")}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-muted px-2 py-1 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </aside>
        </section>

        {/* Image Gallery - Client Component for Interactivity */}
        {project.images && project.images.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif mb-8">{t("gallery")}</h2>
            <ProjectGallery images={project.images} projectTitle={project.title || 'Project'} />
          </section>
        )}

        {/* Video Section */}
        {project.video && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif mb-8">{t("video")}</h2>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-black">
              <iframe
                src={getVideoEmbedUrl(project.video)}
                className="absolute inset-0 w-full h-full"
                title={`Video de ${project.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* Live Demo Link */}
        {project.link && !project.video && (
          <section className="mb-16">
            <div>
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-start transition"
              >
                <div className="bg-white px-6 py-3 rounded-full flex items-center gap-2 text-black font-medium shadow-md">
                  {t("live")} <ExternalLink className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Project Navigation */}
        {(prevProject || nextProject) && (
          <div className="flex justify-between mt-24 border-t pt-8">
            {prevProject ? (
              <Link
                href={`/${locale}/projects/${prevProject.id}`}
                className="group text-sm font-mono inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                {locale === 'es' ? prevProject.title_es : prevProject.title_en}
              </Link>
            ) : (
              <span />
            )}
            {nextProject ? (
              <Link
                href={`/${locale}/projects/${nextProject.id}`}
                className="group text-sm font-mono inline-flex items-center"
              >
                {locale === 'es' ? nextProject.title_es : nextProject.title_en}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </article>
    </div>
  );
}

// Enable ISR for projects
export const revalidate = 600; // Revalidate every 10 minutes

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((project) => ({
      id: project.id.toString(),
    }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { id, locale } = await params;
  const project = await getProject(id);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = locale === "es" ? project.title_es : project.title_en;
  const description = locale === "es" ? project.description_es : project.description_en;

  return {
    title,
    description: description?.substring(0, 160),
    openGraph: {
      title,
      description: description?.substring(0, 160),
      type: 'article',
      images: project.image ? [{ url: project.image }] : [],
    },
  };
}