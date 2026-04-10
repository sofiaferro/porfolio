import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/project-actions";
import { parseDescription } from "@/app/[locale]/projects/utils";

interface ProjectsColumnProps {
  locale: string;
}

export default async function ProjectsColumn({ locale }: ProjectsColumnProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = await getProjects();

  return (
    <div className="flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("title")}
        </h2>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-mono">
          {t("subtitle")}
        </p>
      </div>

      <div className="p-4 md:p-6 w-full min-w-0">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => {
              const title = locale === "es" ? project.title_es : project.title_en;
              const category = locale === "es"
                ? project.category_label_es
                : project.category_label_en;
              const description = locale === "es"
                ? project.description_es
                : project.description_en;
              const descriptionNoLinks = description
                ? description.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
                : "";

              return (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.slug ?? project.id}`}
                  className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 overflow-hidden transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 dark:focus-visible:ring-gray-100/30"
                >
                  <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={project.image ?? "/placeholder.svg?height=400&width=500"}
                      alt={title || t("title")}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={index < 2}
                    />
                  </div>

                  <div className="p-4 md:p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {title}
                      </h3>
                      {category && (
                        <p className="text-xs md:text-sm font-mono text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          {category}
                        </p>
                      )}
                    </div>

                    {descriptionNoLinks && (
                      <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {parseDescription(descriptionNoLinks)}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs md:text-sm font-mono text-gray-600 dark:text-gray-400">
                        {project.year}
                      </span>
                      {project.technologies && project.technologies.length > 0 && (
                        <span className="text-[10px] md:text-xs font-mono text-gray-500 dark:text-gray-400 ml-4">
                          {project.technologies.slice(0, 3).join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t("noProjectsAvailable")}
          </div>
        )}
      </div>
    </div>
  );
}
