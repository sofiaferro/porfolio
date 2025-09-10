"use server"

import { revalidatePath } from "next/cache"
import type { Project } from "./types"
import { supabase } from "./supabase"

export async function getProjects(): Promise<Project[]> {
  try {
    // Only fetch essential fields for homepage display
    const { data, error } = await supabase
      .from("projects")
      .select("id, title_en, title_es, description_en, description_es, technologies, image, images, video, category, category_label_en, category_label_es, year, github_url, live_url")
      .eq("status", "published")
      .order("created_at", { ascending: true })

    if (error) {
      // Check if it's a table not found error
      if (error.code === 'PGRST116' || error.message.includes('relation "projects" does not exist')) {
        console.warn("Projects table does not exist yet. Please run the database setup.")
        return []
      }
      console.error("Error fetching projects:", error)
      return []
    }

    // Map live_url to link for component compatibility
    const projects = data?.map(project => ({
      ...project,
      link: project.live_url
    })) || []
    
    return projects as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      // Check if it's a table not found error
      if (error.code === 'PGRST116' || error.message.includes('relation "projects" does not exist')) {
        console.warn("Projects table does not exist yet. Please run the database setup.")
        return null
      }
      console.error("Error fetching project:", error)
      return null
    }

    // Map live_url to link for component compatibility
    const project = {
      ...data,
      link: data.live_url
    }
    
    return project as Project
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function createProject(formData: FormData): Promise<{ error?: string; success?: boolean }> {

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const titleEn = formData.get("title_en") as string
  const titleEs = formData.get("title_es") as string
  const descriptionEn = formData.get("description_en") as string
  const descriptionEs = formData.get("description_es") as string
  const technologies = formData.get("technologies") as string
  const githubUrl = formData.get("github_url") as string
  const liveUrl = formData.get("live_url") as string
  const image = formData.get("image") as string

  if (!titleEn || !titleEs || !descriptionEn || !descriptionEs) {
    return { error: "Title and description for both languages are required" }
  }

  const newProject = {
    title_en: titleEn,
    title_es: titleEs,
    description_en: descriptionEn,
    description_es: descriptionEs,
    technologies: technologies.split(",").map(t => t.trim()).filter(t => t),
    github_url: githubUrl,
    live_url: liveUrl,
    image,
    status: "published"
  }

  const { error } = await supabase.from("projects").insert(newProject).select()

  if (error) {
    console.error("Error creating project:", error)
    return { error: "Failed to create project" }
  }

  revalidatePath("/projects")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateProject(formData: FormData) {

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const id = formData.get("id") as string
  const titleEn = formData.get("title_en") as string
  const titleEs = formData.get("title_es") as string
  const descriptionEn = formData.get("description_en") as string
  const descriptionEs = formData.get("description_es") as string
  const technologies = formData.get("technologies") as string
  const githubUrl = formData.get("github_url") as string
  const liveUrl = formData.get("live_url") as string
  const image = formData.get("image") as string

  if (!id || !titleEn || !titleEs || !descriptionEn || !descriptionEs) {
    return { error: "ID, title, and description for both languages are required" }
  }

  const updatedProject = {
    title_en: titleEn,
    title_es: titleEs,
    description_en: descriptionEn,
    description_es: descriptionEs,
    technologies: technologies.split(",").map(t => t.trim()).filter(t => t),
    github_url: githubUrl,
    live_url: liveUrl,
    image
  }

  const { error } = await supabase.from("projects").update(updatedProject).eq("id", id)

  if (error) {
    console.error("Error updating project:", error)
    return { error: "Failed to update project" }
  }

  revalidatePath("/projects")
  revalidatePath("/admin")
  revalidatePath(`/projects/${id}`)
}

export async function deleteProject(id: string) {

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("Error deleting project:", error)
    return { error: "Failed to delete project" }
  }

  revalidatePath("/projects")
  revalidatePath("/admin")
}
