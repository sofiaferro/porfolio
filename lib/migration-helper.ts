/**
 * Migration helper to convert existing project data to the new content management system
 */

import { contentManager, ProjectContent } from './content-manager';
import { projectsData } from '@/data/projects';

export interface LegacyProject {
  id: string;
  title: string;
  title_en: string;
  title_es: string;
  categoryLabel: string;
  categoryLabel_en: string;
  categoryLabel_es: string;
  category: string;
  description: string;
  description_es: string;
  description_en: string;
  image: string;
  link: string;
  year: string;
  technologies: string[];
  images?: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  video?: string;
}

export class MigrationHelper {
  /**
   * Convert legacy project data to new content format
   */
  static convertLegacyProject(project: LegacyProject): Omit<ProjectContent, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      type: 'project',
      slug: project.id, // Use existing ID as slug
      title: {
        en: project.title_en || project.title,
        es: project.title_es || project.title,
      },
      content: {
        en: project.description_en || project.description,
        es: project.description_es || project.description,
      },
      excerpt: {
        en: this.generateExcerpt(project.description_en || project.description),
        es: this.generateExcerpt(project.description_es || project.description),
      },
      category: project.category,
      technologies: project.technologies || [],
      year: project.year,
      published: true,
      metadata: {
        images: project.images || (project.image ? [{
          src: project.image,
          alt: project.title,
          caption: project.title
        }] : []),
        links: {
          live: project.link || undefined,
          video: project.video || undefined,
        }
      }
    };
  }

  /**
   * Generate excerpt from content (first 150 characters)
   */
  private static generateExcerpt(content: string): string {
    const cleanContent = content.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanContent.length > 150 
      ? cleanContent.substring(0, 150) + '...'
      : cleanContent;
  }

  /**
   * Migrate all legacy projects to the new content system
   */
  static async migrateProjects(): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };

    for (const project of projectsData) {
      try {
        const convertedProject = this.convertLegacyProject(project);
        const result = await contentManager.createContent(convertedProject);
        
        if (result) {
          results.success++;
          console.log(`✅ Migrated project: ${project.title}`);
        } else {
          results.errors.push(`Failed to migrate project: ${project.title}`);
        }
      } catch (error) {
        const errorMessage = `Error migrating project ${project.title}: ${error}`;
        results.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    return results;
  }

  /**
   * Check if migration is needed
   */
  static async checkMigrationStatus(): Promise<{
    needsMigration: boolean;
    existingProjects: number;
    legacyProjects: number;
  }> {
    try {
      const existingProjects = await contentManager.getContent<ProjectContent>('project');
      const legacyProjects = projectsData.length;

      return {
        needsMigration: existingProjects.length < legacyProjects,
        existingProjects: existingProjects.length,
        legacyProjects: legacyProjects,
      };
    } catch (error) {
      console.error('Error checking migration status:', error);
      return {
        needsMigration: true,
        existingProjects: 0,
        legacyProjects: projectsData.length,
      };
    }
  }

  /**
   * Create sample blog posts for testing
   */
  static async createSampleBlogPosts(): Promise<void> {
    const samplePosts = [
      {
        type: 'blog' as const,
        slug: 'welcome-to-my-portfolio',
        title: {
          en: 'Welcome to My Portfolio',
          es: 'Bienvenido a Mi Portfolio'
        },
        content: {
          en: `# Welcome to My Portfolio

This is my first blog post on my new portfolio website. I'm excited to share my journey as a software engineer, AI engineer, and creative technologist.

## What You'll Find Here

- **Projects**: A collection of my creative coding, IoT, and art installations
- **Thoughts**: My reflections on technology, art, and the creative process
- **Materials**: Explorations at the intersection of art and technology

I believe in the power of technology to create meaningful experiences that connect the digital and physical worlds.`,
          es: `# Bienvenido a Mi Portfolio

Esta es mi primera publicación en mi nuevo sitio web de portfolio. Estoy emocionada de compartir mi viaje como ingeniera de software, ingeniera de IA y tecnóloga creativa.

## Lo Que Encontrarás Aquí

- **Proyectos**: Una colección de mi programación creativa, IoT e instalaciones artísticas
- **Pensamientos**: Mis reflexiones sobre tecnología, arte y el proceso creativo
- **Materiales**: Exploraciones en la intersección del arte y la tecnología

Creo en el poder de la tecnología para crear experiencias significativas que conecten los mundos digital y físico.`
        },
        excerpt: {
          en: 'Welcome to my portfolio! I share my journey as a software engineer, AI engineer, and creative technologist.',
          es: '¡Bienvenido a mi portfolio! Comparto mi viaje como ingeniera de software, ingeniera de IA y tecnóloga creativa.'
        },
        tags: ['welcome', 'portfolio', 'introduction'],
        featured: true,
        published: true,
      },
      {
        type: 'blog' as const,
        slug: 'the-art-of-computational-poetry',
        title: {
          en: 'The Art of Computational Poetry',
          es: 'El Arte de la Poesía Computacional'
        },
        content: {
          en: `# The Art of Computational Poetry

Computational poetry represents a fascinating intersection between human creativity and machine intelligence. Through projects like **pit0nisa** and **mc-txt**, I explore how algorithms can become tools for artistic expression.

## Markov Chains as Creative Partners

Markov chains, while mathematically simple, can produce surprisingly poetic results when fed with the right source material. The key is in the curation of the input text and the careful tuning of the algorithm parameters.

## The Mediumistic Nature of Code

Code becomes a medium through which the machine can "speak" about itself. This creates a unique form of digital poetry where the machine's voice emerges from the patterns in the data.`,
          es: `# El Arte de la Poesía Computacional

La poesía computacional representa una fascinante intersección entre la creatividad humana y la inteligencia de las máquinas. A través de proyectos como **pit0nisa** y **mc-txt**, exploro cómo los algoritmos pueden convertirse en herramientas de expresión artística.

## Las Cadenas de Markov como Socios Creativos

Las cadenas de Markov, aunque matemáticamente simples, pueden producir resultados sorprendentemente poéticos cuando se alimentan con el material fuente adecuado. La clave está en la curación del texto de entrada y el ajuste cuidadoso de los parámetros del algoritmo.

## La Naturaleza Mediúmnica del Código

El código se convierte en un medio a través del cual la máquina puede "hablar" sobre sí misma. Esto crea una forma única de poesía digital donde la voz de la máquina emerge de los patrones en los datos.`
        },
        excerpt: {
          en: 'Exploring the intersection of human creativity and machine intelligence through computational poetry.',
          es: 'Explorando la intersección entre la creatividad humana y la inteligencia de las máquinas a través de la poesía computacional.'
        },
        tags: ['poetry', 'computation', 'art', 'algorithms'],
        featured: false,
        published: true,
      }
    ];

    for (const post of samplePosts) {
      try {
        await contentManager.createContent(post);
        console.log(`✅ Created sample blog post: ${post.title.en}`);
      } catch (error) {
        console.error(`❌ Error creating sample blog post: ${error}`);
      }
    }
  }
}
