"use server";

import { supabase } from './supabase';
import { Content, ProjectContent, BlogContent } from './content-types';

// Authentication actions
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    return { user: null, error };
  }
}

export async function signInWithPassword(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
}

export async function checkAdminStatus() {
  try {
    const { user } = await getCurrentUser();
    const adminUserId = process.env.ADMIN_USER_ID;
    
    // If no ADMIN_USER_ID is set, allow any authenticated user for development
    if (!adminUserId) {
      return { isAdmin: !!user };
    }
    
    return { isAdmin: user?.id === adminUserId };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false };
  }
}

// Content management actions
export async function getProjects(locale: string = 'en') {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('type', 'project')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getBlogPosts(locale: string = 'en') {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('type', 'blog')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getProject(id: string, locale: string = 'en') {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .eq('type', 'project')
      .single();
    
    if (error) throw error;
    return data as Content;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function getBlogPost(id: string, locale: string = 'en') {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .eq('type', 'blog')
      .single();
    
    if (error) throw error;
    return data as Content;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function createContent(contentData: any) {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert(contentData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Content;
  } catch (error) {
    console.error('Error creating content:', error);
    return null;
  }
}

export async function updateContent(id: string, contentData: any) {
  try {
    const { data, error } = await supabase
      .from('content')
      .update(contentData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Content;
  } catch (error) {
    console.error('Error updating content:', error);
    return null;
  }
}

export async function deleteContent(id: string) {
  try {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting content:', error);
    return false;
  }
}

export async function searchContent(query: string, type?: string) {
  try {
    let query_builder = supabase
      .from('content')
      .select('*')
      .textSearch('search_vector', query);
    
    if (type) {
      query_builder = query_builder.eq('type', type);
    }
    
    const { data, error } = await query_builder;
    
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}
