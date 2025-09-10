import { getHomepageData } from "@/lib/homepage-data";
import ThreeColumnLayout from "@/components/three-column-layout";
import ProfileColumn from "@/components/profile-column";
import ProjectsColumn from "@/components/projects-column";
import BlogColumn from "@/components/blog-column";

// Server Component - Data is fetched on the server, no loading states needed!
export default async function HomePage() {
  // Data is fetched on the server before the page renders
  const { projects, blogPosts } = await getHomepageData();

  return (
    <ThreeColumnLayout
      profileColumn={<ProfileColumn />}
      projectsColumn={<ProjectsColumn projects={projects} />}
      blogColumn={<BlogColumn posts={blogPosts} />}
    />
  );
}

// Enable ISR (Incremental Static Regeneration) for even faster subsequent loads
export const revalidate = 300; // Revalidate every 5 minutes