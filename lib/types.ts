export interface BlogPost {
  title_es: any
  title_en: any
  excerpt_es: any
  excerpt_en: any
  image: string
  subtitle: string
  id: string
  content_es: string
  content_en: string
  date: string
}

export interface BlogComment {
  id: string
  post_id: string
  author_name: string
  content: string
  date: string
}

