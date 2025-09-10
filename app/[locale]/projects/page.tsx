import { getProjects } from "@/lib/project-actions";
import { getTranslations } from "next-intl/server";
import ProjectsClient from "./projects-client";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

// Server Component - Data is fetched on the server!
export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  
  // Fetch data on the server
  const projects = await getProjects();
  
  // Get translations on the server
  const t = await getTranslations('projects');
  
  // Get unique categories for filtering
  const categories = Array.from(
    new Set(projects.map(p => p.category).filter(Boolean))
  );

  return (
    <ProjectsClient 
      initialProjects={projects}
      categories={categories}
      locale={locale}
    />
  );
}

// Enable ISR for projects page
export const revalidate = 300; // Revalidate every 5 minutes

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('projects');
  
  return {
    title: await t('title'),
    description: await t('subtitle'),
    openGraph: {
      title: await t('title'),
      description: await t('subtitle'),
      type: 'website',
    },
  };
}