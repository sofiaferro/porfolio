export interface BlogPost {
  id: string
  slug: string
  date: string
  image: string
  content_en: string
  excerpt_en: any
  title_en: any
  content_es: string
  excerpt_es: any
  title_es: any
  subtitle: string
}

export interface BlogComment {
  id: string
  post_id: string
  author_name: string
  content: string
  date: string
}

export interface Project {
  id: string
  created_at: string
  updated_at: string
  original_id?: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  category?: string
  category_en?: string
  category_es?: string
  category_label?: string
  category_label_en?: string
  category_label_es?: string
  technologies: string[]
  github_url?: string
  live_url?: string
  link?: string // Mapped from live_url for component compatibility
  image?: string
  year?: string
  video?: string
  images?: Array<{
    src: string
    alt: string
    caption: string
  }>
  status: 'draft' | 'published' | 'archived'
}

