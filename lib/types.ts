export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  date: string
}

export interface BlogComment {
  id: string
  post_id: string
  author_name: string
  content: string
  date: string
}

