"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "./supabase"

export interface PageContent {
  id: string
  content_type: string
  content_key: string
  title_en?: string
  title_es?: string
  content_en?: string
  content_es?: string
  description_en?: string
  description_es?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export async function getPageContent(contentType?: string): Promise<PageContent[]> {
  let query = supabase
    .from("content")
    .select("*")
    .eq("is_published", true)
    .order("content_type", { ascending: true })
    .order("content_key", { ascending: true })

  if (contentType) {
    query = query.eq("content_type", contentType)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching page content:", error)
    return []
  }

  return data as PageContent[]
}

export async function getPageContentByKey(contentKey: string): Promise<PageContent | null> {
  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("content_key", contentKey)
    .eq("is_published", true)
    .single()

  if (error) {
    console.error("Error fetching page content by key:", error)
    return null
  }

  return data as PageContent
}

export async function createPageContent(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const contentType = formData.get("content_type") as string
  const contentKey = formData.get("content_key") as string
  const titleEn = formData.get("title_en") as string
  const titleEs = formData.get("title_es") as string
  const contentEn = formData.get("content_en") as string
  const contentEs = formData.get("content_es") as string
  const descriptionEn = formData.get("description_en") as string
  const descriptionEs = formData.get("description_es") as string
  const isPublished = formData.get("is_published") === "true"

  if (!contentType || !contentKey) {
    return { error: "Content type and key are required" }
  }

  const newContent = {
    content_type: contentType,
    content_key: contentKey,
    title_en: titleEn || null,
    title_es: titleEs || null,
    content_en: contentEn || null,
    content_es: contentEs || null,
    description_en: descriptionEn || null,
    description_es: descriptionEs || null,
    is_published: isPublished
  }

  const { error } = await supabase.from("content").insert(newContent).select()

  if (error) {
    console.error("Error creating page content:", error)
    return { error: "Failed to create page content" }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updatePageContent(formData: FormData) {
  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const id = formData.get("id") as string
  const contentType = formData.get("content_type") as string
  const contentKey = formData.get("content_key") as string
  const titleEn = formData.get("title_en") as string
  const titleEs = formData.get("title_es") as string
  const contentEn = formData.get("content_en") as string
  const contentEs = formData.get("content_es") as string
  const descriptionEn = formData.get("description_en") as string
  const descriptionEs = formData.get("description_es") as string
  const isPublished = formData.get("is_published") === "true"

  if (!id || !contentType || !contentKey) {
    return { error: "ID, content type, and key are required" }
  }

  const updatedContent = {
    content_type: contentType,
    content_key: contentKey,
    title_en: titleEn || null,
    title_es: titleEs || null,
    content_en: contentEn || null,
    content_es: contentEs || null,
    description_en: descriptionEn || null,
    description_es: descriptionEs || null,
    is_published: isPublished
  }

  const { error } = await supabase.from("content").update(updatedContent).eq("id", id)

  if (error) {
    console.error("Error updating page content:", error)
    return { error: "Failed to update page content" }
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deletePageContent(id: string) {
  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const { error } = await supabase.from("content").delete().eq("id", id)

  if (error) {
    console.error("Error deleting page content:", error)
    return { error: "Failed to delete page content" }
  }

  revalidatePath("/")
  revalidatePath("/admin")
}
