import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Create service role client for admin operations
function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json();
    
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Check existing projects by original project ID in metadata
    const supabaseAdmin = getSupabaseAdmin();
    const { data: existingProjects } = await supabaseAdmin
      .from('content')
      .select('metadata')
      .eq('type', 'project');
    
    const existingOriginalIds = existingProjects
      ?.map(p => p.metadata?.originalId)
      .filter(Boolean) || [];

    for (const project of projects) {
      try {
        // Skip if already exists
        if (existingOriginalIds.includes(project.id)) {
          skippedCount++;
          continue;
        }

        // Convert project to new content format
        const contentData = {
          id: uuidv4(), // Generate proper UUID
          type: 'project',
          title: {
            en: project.title_en || project.title,
            es: project.title_es || project.title
          },
          content: {
            en: project.description_en || project.description,
            es: project.description_es || project.description
          },
          excerpt: {
            en: (project.description_en || project.description).substring(0, 200) + '...',
            es: (project.description_es || project.description).substring(0, 200) + '...'
          },
          slug: {
            en: (project.title_en || project.title).toLowerCase().replace(/\s+/g, '-'),
            es: (project.title_es || project.title).toLowerCase().replace(/\s+/g, '-')
          },
          published: true,
          metadata: {
            originalId: project.id, // Store original project ID
            technologies: project.technologies || [],
            tags: [project.category, project.categoryLabel],
            links: {
              demo: project.link || null,
              website: project.link || null
            },
            images: project.images ? project.images.map((img: any) => img.src) : [project.image],
            featured: false,
            order: parseInt(project.id)
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Insert into database
        const { error } = await supabaseAdmin
          .from('content')
          .insert(contentData);

        if (error) {
          console.error(`Error inserting project ${project.id}:`, error);
          errorCount++;
        } else {
          migratedCount++;
        }
      } catch (error) {
        console.error(`Error processing project ${project.id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      total: projects.length,
      migrated: migratedCount,
      skipped: skippedCount,
      errors: errorCount
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed' },
      { status: 500 }
    );
  }
}
