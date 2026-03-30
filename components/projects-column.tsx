import { getTranslations } from "next-intl/server";
import ProjectCard from "./project-card";
import { getProjects } from "@/lib/project-actions";

interface ProjectsColumnProps {
  locale: string;
}

export default async function ProjectsColumn({ locale }: ProjectsColumnProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const projects = await getProjects();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('title')}
        </h2>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 font-mono">
          {t('subtitle')}
        </p>
      </div>

      {/* Projects List */}
      <div className="p-4 md:p-6 space-y-8 md:space-y-12 w-full min-w-0">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('noProjectsAvailable')}
          </div>
        )}
      </div>
    </div>
  );
}
