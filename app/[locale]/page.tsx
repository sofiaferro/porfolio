import { Suspense } from "react";
import ThreeColumnLayout from "@/components/three-column-layout";
import ProfileColumn from "@/components/profile-column";
import ProjectsColumn from "@/components/projects-column";
import BlogColumn from "@/components/blog-column";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <ThreeColumnLayout
      profileColumn={<ProfileColumn locale={locale} />}
      projectsColumn={
        <Suspense fallback={<ProjectsColumnSkeleton />}>
          <ProjectsColumn locale={locale} />
        </Suspense>
      }
      blogColumn={
        <Suspense fallback={<BlogColumnSkeleton />}>
          <BlogColumn locale={locale} />
        </Suspense>
      }
    />
  );
}

// Enable ISR (Incremental Static Regeneration) for even faster subsequent loads
export const revalidate = 300; // Revalidate every 5 minutes

function ProjectsColumnSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-300 dark:border-gray-700">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="mt-2 h-3 w-40 bg-gray-100 dark:bg-gray-700 rounded" />
      </div>
      <div className="p-4 md:p-6 space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="aspect-[4/3] rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-32 bg-gray-100 dark:bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogColumnSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-300 dark:border-gray-700">
        <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="mt-2 h-3 w-36 bg-gray-100 dark:bg-gray-700 rounded" />
      </div>
      <div className="p-4 md:p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
