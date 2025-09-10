"use server"

import { revalidatePath } from "next/cache"
import type { BlogComment, BlogPost } from "./types"
import { createClient } from '@supabase/supabase-js'

// Create admin client for server actions
function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// For read operations, use regular client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to generate URL-friendly slugs from titles
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace accented characters
    .replace(/[áàäâãå]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöôõø]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[ý]/g, 'y')
    // Remove punctuation and special characters (keep letters, numbers, spaces)
    .replace(/[^\w\s]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Limit length to 50 characters
    .substring(0, 50)
    // Remove trailing hyphen if cut off mid-word
    .replace(/-$/, '')
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // Only fetch essential fields for homepage display
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title_en, title_es, excerpt_en, excerpt_es, date, image")
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data as BlogPost[]
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching blog post:", error)
    return null
  }

  return data as BlogPost
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching blog post by slug:", error)
    return null
  }

  return data as BlogPost
}

export async function getComments(postId: string): Promise<BlogComment[]> {
  const { data, error } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("post_id", postId)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching comments:", error)
    return []
  }

  return data as BlogComment[]
}

export async function addComment(formData: FormData) {
  const postId = formData.get("postId") as string
  const authorName = formData.get("authorName") as string
  const content = formData.get("content") as string

  if (!postId || !authorName || !content) {
    return { error: "Post ID, name, and comment are required" }
  }

  const newComment: Omit<BlogComment, "id" | "date"> = {
    post_id: postId,
    author_name: authorName,
    content,
  }

  const { error } = await supabase.from("blog_comments").insert(newComment)

  if (error) {
    console.error("Error adding comment:", error)
    return { error: "Failed to add comment" }
  }

  // Get the post to find its slug for revalidation
  const post = await getBlogPost(postId)
  if (post?.slug) {
    revalidatePath(`/blog/${post.slug}`)
  }
}

export async function incrementVisitorCount(): Promise<number> {
  const { data, error } = await supabase.rpc("increment_visitor_count")

  if (error) {
    console.error("Error incrementing visitor count:", error)
    return 0
  }

  return data as number
}

export async function getVisitorCount(): Promise<number> {
  const { data, error } = await supabase.from("visitor_counter").select("count").single()

  if (error) {
    console.error("Error fetching visitor count:", error)
    return 0
  }

  return data.count
}

export async function createBlogPost(formData: FormData): Promise<{ error?: string; success?: boolean }> {

  // Use admin client for create operations
  const supabaseAdmin = getSupabaseAdmin()

  const titleEn = formData.get("title_en") as string
  const titleEs = formData.get("title_es") as string
  const contentEn = formData.get("content_en") as string
  const contentEs = formData.get("content_es") as string
  const subtitleEn = formData.get("subtitle_en") as string
  const subtitleEs = formData.get("subtitle_es") as string
  const image = formData.get("image") as string

  if (!titleEn || !titleEs || !contentEn || !contentEs) {
    return { error: "Title and content for both languages are required" }
  }

  const excerptEn = contentEn.substring(0, 100) + (contentEn.length > 100 ? "..." : "")
  const excerptEs = contentEs.substring(0, 100) + (contentEs.length > 100 ? "..." : "")

  // Generate slug from English title
  const slug = generateSlug(titleEn)

  const newPost: Omit<BlogPost, "id" | "date"> = {
    slug,
    title_en: titleEn,
    title_es: titleEs,
    content_en: contentEn,
    content_es: contentEs,
    excerpt_en: excerptEn,
    excerpt_es: excerptEs,
    subtitle: subtitleEn || '',
    image
  }

  const { error } = await supabaseAdmin.from("blog_posts").insert(newPost).select()

  if (error) {
    console.error("Error creating blog post:", error)
    return { error: "Failed to create blog post" }
  }

  revalidatePath("/blog")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateBlogPost(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  try {
    // Use admin client for update operations
    const supabaseAdmin = getSupabaseAdmin()

    const id = formData.get("id") as string
    const titleEn = formData.get("title_en") as string
    const titleEs = formData.get("title_es") as string
    const contentEn = formData.get("content_en") as string
    const contentEs = formData.get("content_es") as string
    const subtitleEn = formData.get("subtitle_en") as string
    const subtitleEs = formData.get("subtitle_es") as string
    const image = formData.get("image") as string


    if (!id || !titleEn || !titleEs || !contentEn || !contentEs) {
      return { error: "ID, title, and content for both languages are required" }
    }

    const excerptEn = contentEn.substring(0, 100) + (contentEn.length > 100 ? "..." : "")
    const excerptEs = contentEs.substring(0, 100) + (contentEs.length > 100 ? "..." : "")

    // Generate slug from English title
    const slug = generateSlug(titleEn)

    // First, try updating without subtitle columns to see if that's the issue
    const updatedPostBasic = {
      slug,
      title_en: titleEn,
      title_es: titleEs,
      content_en: contentEn,
      content_es: contentEs,
      excerpt_en: excerptEn,
      excerpt_es: excerptEs,
      image
    }

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(updatedPostBasic)
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating blog post:", error)
      return { error: "Failed to update blog post: " + error.message }
    }


    // If basic update worked but data is empty, the ID might not exist
    if (data && data.length === 0) {
      return { error: "No blog post found with the provided ID" }
    }

    revalidatePath("/blog")
    revalidatePath("/admin")
    // Revalidate both old and new slug paths in case slug changed
    if (data && data.length > 0) {
      revalidatePath(`/blog/${data[0].slug}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error("Update blog post error:", error)
    return { error: "Failed to update blog post" }
  }
}

export async function deleteBlogPost(id: string) {

  // Use admin client for delete operations
  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog post:", error)
    return { error: "Failed to delete blog post" }
  }

  revalidatePath("/blog")
  revalidatePath("/admin")
}

