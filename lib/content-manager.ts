/**
 * Centralized Content Management System
 * Handles all text content with proper internationalization and validation
 */

import { z } from 'zod';
import { supabase } from './supabase';

// Content schemas for validation
export const ContentSchema = z.object({
  id: z.string(),
  type: z.enum(['project', 'blog', 'page']),
  slug: z.string(),
  title: z.record(z.string()), // { en: "Title", es: "Título" }
  content: z.record(z.string()), // { en: "Content", es: "Contenido" }
  excerpt: z.record(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  published: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProjectContentSchema = ContentSchema.extend({
  type: z.literal('project'),
  category: z.string(),
  technologies: z.array(z.string()),
  year: z.string(),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional(),
  })).optional(),
  links: z.object({
    live: z.string().optional(),
    github: z.string().optional(),
    video: z.string().optional(),
  }).optional(),
});

export const BlogContentSchema = ContentSchema.extend({
  type: z.literal('blog'),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
});

export type Content = z.infer<typeof ContentSchema>;
export type ProjectContent = z.infer<typeof ProjectContentSchema>;
export type BlogContent = z.infer<typeof BlogContentSchema>;

// Content Manager Class
export class ContentManager {
  private static instance: ContentManager;
  private cache = new Map<string, Content[]>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  // Get content by type and locale
  async getContent<T extends Content>(
    type: Content['type'],
    locale: string = 'en'
  ): Promise<T[]> {
    const cacheKey = `${type}-${locale}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached as T[];
    }

    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', type)
        .eq('published', true)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const content = data?.map(item => this.transformContent(item, locale)) || [];
      this.cache.set(cacheKey, content);
      this.setCacheExpiry(cacheKey);

      return content as T[];
    } catch (error) {
      console.error(`Error fetching ${type} content:`, error);
      return [];
    }
  }

  // Get single content item
  async getContentById<T extends Content>(
    id: string,
    locale: string = 'en'
  ): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this.transformContent(data, locale) as T;
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error);
      return null;
    }
  }

  // Create new content
  async createContent<T extends Content>(
    content: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
    locale: string = 'en'
  ): Promise<T | null> {
    try {
      const now = new Date().toISOString();
      const newContent = {
        ...content,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from('content')
        .insert(newContent)
        .select()
        .single();

      if (error) throw error;

      this.clearCache();
      return this.transformContent(data, locale) as T;
    } catch (error) {
      console.error('Error creating content:', error);
      return null;
    }
  }

  // Update content
  async updateContent<T extends Content>(
    id: string,
    updates: Partial<Omit<T, 'id' | 'createdAt'>>,
    locale: string = 'en'
  ): Promise<T | null> {
    try {
      const now = new Date().toISOString();
      const updatedContent = {
        ...updates,
        updatedAt: now,
      };

      const { data, error } = await supabase
        .from('content')
        .update(updatedContent)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      this.clearCache();
      return this.transformContent(data, locale) as T;
    } catch (error) {
      console.error(`Error updating content ${id}:`, error);
      return null;
    }
  }

  // Delete content
  async deleteContent(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.clearCache();
      return true;
    } catch (error) {
      console.error(`Error deleting content ${id}:`, error);
      return false;
    }
  }

  // Transform content for specific locale
  private transformContent<T extends Content>(content: any, locale: string): T {
    return {
      ...content,
      title: this.getLocalizedText(content.title, locale),
      content: this.getLocalizedText(content.content, locale),
      excerpt: content.excerpt ? this.getLocalizedText(content.excerpt, locale) : undefined,
    } as T;
  }

  // Get localized text with fallback
  private getLocalizedText(texts: Record<string, string>, locale: string): string {
    return texts[locale] || texts['en'] || texts[Object.keys(texts)[0]] || '';
  }

  // Cache management
  private isCacheValid(key: string): boolean {
    const expiry = this.cache.get(`${key}_expiry`);
    return expiry ? Date.now() < expiry : false;
  }

  private setCacheExpiry(key: string): void {
    this.cache.set(`${key}_expiry`, Date.now() + this.cacheExpiry);
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // Search content
  async searchContent(
    query: string,
    type?: Content['type'],
    locale: string = 'en'
  ): Promise<Content[]> {
    try {
      let supabaseQuery = supabase
        .from('content')
        .select('*')
        .eq('published', true)
        .or(`title->${locale}.ilike.%${query}%,content->${locale}.ilike.%${query}%`);

      if (type) {
        supabaseQuery = supabaseQuery.eq('type', type);
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      return data?.map(item => this.transformContent(item, locale)) || [];
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }
}

// Export singleton instance
export const contentManager = ContentManager.getInstance();

// Helper functions for common operations
export async function getProjects(locale: string = 'en'): Promise<ProjectContent[]> {
  return contentManager.getContent<ProjectContent>('project', locale);
}

export async function getBlogPosts(locale: string = 'en'): Promise<BlogContent[]> {
  return contentManager.getContent<BlogContent>('blog', locale);
}

export async function getProject(id: string, locale: string = 'en'): Promise<ProjectContent | null> {
  return contentManager.getContentById<ProjectContent>(id, locale);
}

export async function getBlogPost(id: string, locale: string = 'en'): Promise<BlogContent | null> {
  return contentManager.getContentById<BlogContent>(id, locale);
}
