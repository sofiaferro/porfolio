"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import type { BlogComment, BlogPost } from "./types"
import { supabase } from "./supabase"

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false })

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

  revalidatePath(`/blog/${postId}`)
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

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!title || !content) {
    return { error: "Title and content are required" }
  }

  const excerpt = content.substring(0, 100) + (content.length > 100 ? "..." : "")

  const newPost: Omit<BlogPost, "id" | "date"> = {
    title,
    content,
    excerpt,
  }

  const { error } = await supabase.from("blog_posts").insert(newPost).select()

  if (error) {
    console.error("Error creating blog post:", error)
    return { error: "Failed to create blog post" }
  }

  revalidatePath("/blog")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateBlogPost(formData: FormData) {

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!id || !title || !content) {
    return { error: "ID, title, and content are required" }
  }

  const excerpt = content.substring(0, 100) + (content.length > 100 ? "..." : "")

  const updatedPost: Omit<BlogPost, "date"> = {
    id,
    title,
    content,
    excerpt,
  }

  const { error } = await supabase.from("blog_posts").update(updatedPost).eq("id", id)

  if (error) {
    console.error("Error updating blog post:", error)
    return { error: "Failed to update blog post" }
  }

  revalidatePath("/blog")
  revalidatePath("/admin")
  revalidatePath(`/blog/${id}`)
}

export async function deleteBlogPost(id: string) {

  // Check if the user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user || user.id !== process.env.ADMIN_USER_ID) {
    return { error: "Unauthorized. Please log in as an admin." }
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog post:", error)
    return { error: "Failed to delete blog post" }
  }

  revalidatePath("/blog")
  revalidatePath("/admin")
}

