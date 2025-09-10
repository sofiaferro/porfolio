// Content types for the CMS - no server-side dependencies
export interface Content {
  id: string;
  type: 'project' | 'blog' | 'page';
  title: Record<string, string>; // { en: "Title", es: "Título" }
  content: Record<string, string>; // { en: "Content", es: "Contenido" }
  excerpt?: Record<string, string>;
  slug: Record<string, string>;
  published: boolean;
  metadata?: {
    technologies?: string[];
    tags?: string[];
    links?: {
      github?: string;
      demo?: string;
      website?: string;
    };
    images?: string[];
    featured?: boolean;
    order?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectContent extends Content {
  type: 'project';
  metadata: {
    technologies: string[];
    tags: string[];
    links: {
      github?: string;
      demo?: string;
      website?: string;
    };
    images: string[];
    featured: boolean;
    order: number;
  };
}

export interface BlogContent extends Content {
  type: 'blog';
  metadata?: {
    tags?: string[];
    featured?: boolean;
  };
}

export interface PageContent extends Content {
  type: 'page';
  metadata?: {
    featured?: boolean;
    order?: number;
  };
}
