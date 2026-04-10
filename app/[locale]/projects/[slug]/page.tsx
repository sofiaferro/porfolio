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
import { getProjectBySlug, getProjects } from "@/lib/project-actions";
import ProjectGallery from "./project-gallery";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Server Component - Data is fetched on the server!
export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug, locale } = await params;
  
  // Fetch data on the server
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects()
  ]);

  if (!project) {
    notFound();
  }

  // Get translations on the server
  const t = await getTranslations({ locale, namespace: "projects" });

  // Find prev/next projects
  const currentIndex = allProjects.findIndex((p) => p.slug === slug || p.id === slug);
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

  const title = locale === "es" ? project.title_es : project.title_en;
  const categoryLabel = locale === "es" ? project.category_label_es : project.category_label_en;
  const description = locale === "es" ? project.description_es : project.description_en;

  const descriptionParagraphs = description
    ? description.split("\n").map((line: string) => line.trim()).filter(Boolean)
    : [];
  const [leadParagraph, ...bodyParagraphs] = descriptionParagraphs;

  return (
    <div className="pt-4 min-h-screen bg-[#f5f5f0] dark:bg-neutral-900">
      <article className="container mx-auto px-4 md:px-6 pt-10 md:pt-20 max-w-5xl">
        <Link
          href={`/${locale}`}
          className="group text-sm font-mono inline-flex items-center mb-8 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          {t("backToHome")}
        </Link>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-gray-300 dark:border-gray-700 pb-10">
          <div className="md:col-span-4">
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-neutral-900/40 p-4 md:p-5 space-y-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {t("details")}
                </p>
              </div>
              <div className="space-y-2 text-xs md:text-sm">
                {categoryLabel && (
                  <div className="flex items-center justify-between text-gray-700 dark:text-gray-200">
                    <span className="font-mono text-gray-500 dark:text-gray-400">{t("category")}</span>
                    <span>{categoryLabel}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-200">
                  <span className="font-mono text-gray-500 dark:text-gray-400">{t("year")}</span>
                  <span>{project.year ?? t("yearFallback")}</span>
                </div>
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
                    {t("technologies")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-full text-[10px] md:text-xs font-mono bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            {leadParagraph && (
              <p className="mt-4 text-xs md:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {parseDescription(leadParagraph)}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs md:text-sm">
              {project.link && (
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs md:text-sm inline-flex items-center rounded-full px-4 py-2 bg-gray-900 text-white shadow-sm hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
                >
                  {t("live")} <ExternalLink className="w-3 h-3 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="py-10 border-b border-gray-300 dark:border-gray-700">
          {project.images && project.images.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-neutral-900/40">
              <ProjectGallery images={project.images} projectTitle={title || t("title")} locale={locale} />
            </div>
          ) : (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <Image
                src={project.image ?? "/placeholder.svg?height=900&width=1600"}
                alt={title || t("imageAlt")}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </section>

        <section className="py-10 border-b border-gray-300 dark:border-gray-700">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300">
              {t("description")}
            </h2>
            {bodyParagraphs.map((paragraph: string, i: number) => (
              <p key={i} className="text-xs md:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {parseDescription(paragraph)}
              </p>
            ))}
          </div>
        </section>

        {project.video && (
          <section id="project-video" className="py-10 border-b border-gray-300 dark:border-gray-700">
            <h2 className="text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-6">
              {t("video")}
            </h2>
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-black">
              <iframe
                src={getVideoEmbedUrl(project.video)}
                className="absolute inset-0 w-full h-full"
                title={t("videoTitle", { title: title || t("title") })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}


        {(prevProject || nextProject) && (
          <div className="flex justify-between py-10">
            {prevProject ? (
              <Link
                href={`/${locale}/projects/${prevProject.slug ?? prevProject.id}`}
                className="group text-xs md:text-sm font-mono inline-flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {locale === "es" ? prevProject.title_es : prevProject.title_en}
              </Link>
            ) : (
              <span />
            )}
            {nextProject ? (
              <Link
                href={`/${locale}/projects/${nextProject.slug ?? nextProject.id}`}
                className="group text-xs md:text-sm font-mono inline-flex items-center gap-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {locale === "es" ? nextProject.title_es : nextProject.title_en}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
    return projects
      .filter((project) => project.slug)
      .map((project) => ({
        slug: project.slug as string,
      }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug, locale } = await params;
  const project = await getProjectBySlug(slug);
  const t = await getTranslations({ locale, namespace: "projects" });
  
  if (!project) {
    return {
      title: t("notFoundTitle"),
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
