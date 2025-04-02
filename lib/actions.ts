"use server"

import { supabase } from "./supabase"
import { revalidatePath } from "next/cache"

export type BlogPost = {
  id: string
  title: string
  content: string
  excerpt: string
  date: string
}

export type BlogComment = {
  id: string
  post_id: string
  author_name: string
  content: string
  date: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data || []
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching blog post with id ${id}:`, error)
    return null
  }

  return data
}

export async function getPostComments(postId: string): Promise<BlogComment[]> {
  const { data, error } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("post_id", postId)
    .order("date", { ascending: true })

  if (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }

  return data || []
}

export async function addComment(postId: string, authorName: string, content: string) {
  const { error } = await supabase.from("blog_comments").insert([{ post_id: postId, author_name: authorName, content }])

  if (error) {
    console.error("Error adding comment:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/blog/${postId}`)
  return { success: true }
}

export async function incrementVisitorCount() {
  const { data, error } = await supabase.rpc("increment_visitor_count")

  if (error) {
    console.error("Error incrementing visitor count:", error)
    return null
  }

  return data
}

export async function getVisitorCount(): Promise<number> {
  const { data, error } = await supabase.from("visitor_counter").select("count").eq("id", 1).single()

  if (error) {
    console.error("Error fetching visitor count:", error)
    return 0
  }

  return data?.count || 0
}

export async function createBlogPost(title: string, content: string, excerpt: string) {
  const { error } = await supabase.from("blog_posts").insert([{ title, content, excerpt }])

  if (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/blog")
  return { success: true }
}

export async function updateBlogPost(id: string, title: string, content: string, excerpt: string) {
  const { error } = await supabase.from("blog_posts").update({ title, content, excerpt }).eq("id", id)

  if (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/blog/${id}`)
  revalidatePath("/blog")
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/blog")
  return { success: true }
}

