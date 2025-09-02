"use client";

import ThreeColumnLayout from "@/components/three-column-layout";
import ProfileColumn from "@/components/profile-column";
import ProjectsColumn from "@/components/projects-column";
import BlogColumn from "@/components/blog-column";

export default function Home() {
  return (
    <ThreeColumnLayout
      profileColumn={<ProfileColumn />}
      projectsColumn={<ProjectsColumn />}
      blogColumn={<BlogColumn />}
    />
  );
}
