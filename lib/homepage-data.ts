"use server"

import { getBlogPosts } from "./blog-actions"
import { getProjects } from "./project-actions"

export async function getHomepageData() {
  try {
    // Single combined call for homepage data
    const [projects, blogPosts] = await Promise.all([
      getProjects(),
      getBlogPosts()
    ])
    
    return {
      projects,
      blogPosts,
      success: true
    }
  } catch (error) {
    console.error("Error loading homepage data:", error)
    return {
      projects: [],
      blogPosts: [],
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
