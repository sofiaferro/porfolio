import { z } from "zod";

export const LOCALES = ["es", "en"] as const;
export const LocaleSchema = z.enum(LOCALES);
export type Locale = z.infer<typeof LocaleSchema>;

export const CATEGORIES = [
  "literatura-expandida",
  "bots",
  "iot",
  "hardware",
  "creative-coding",
  "instalacion",
] as const;
export const CategorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof CategorySchema>;

const LocalizedString = z.object({
  es: z.string().optional(),
  en: z.string().optional(),
});

export const ImageSchema = z.object({
  src: z.string(),
  alt: LocalizedString.optional(),
  caption: LocalizedString.optional(),
});

export const ProjectMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/),
  category: CategorySchema,
  tech: z.array(z.string()).default([]),
  links: z
    .object({
      live: z.url().optional(),
      github: z.url().optional(),
      video: z.url().optional(),
    })
    .default({}),
  images: z.array(ImageSchema).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["published", "archived"]).default("published"),
});
export type ProjectMeta = z.infer<typeof ProjectMetaSchema>;

export const PostMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  image: z.string().optional(),
  // Supabase UUID preserved for the redirect map from old /blog/<uuid> URLs.
  legacyId: z.string().optional(),
  status: z.enum(["published", "archived"]).default("published"),
});
export type PostMeta = z.infer<typeof PostMetaSchema>;

// Frontmatter of each per-locale MDX file: only translatable fields live here.
export const LocalizedDocSchema = z.object({
  title: z.string(),
  summary: z.string(),
  // Short search-intent phrase appended to the <title> ("robot conversacional con IA").
  descriptor: z.string().optional(),
});
export type LocalizedDoc = z.infer<typeof LocalizedDocSchema>;

export const SiteSchema = z.object({
  name: z.string(),
  domain: z.url(),
  email: z.email(),
  personId: z.string(),
  sameAs: z.array(z.url()),
  tagline: LocalizedString,
});
export type Site = z.infer<typeof SiteSchema>;
