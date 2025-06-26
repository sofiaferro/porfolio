export interface BlogPost {
  id: string
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

