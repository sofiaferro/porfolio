import { NextResponse } from 'next/server'
import { projectsData } from '@/data/projects'

function getSupabaseAdmin() {
  return require('@supabase/supabase-js').createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const results = []
    
    // First, check if projects table exists
    const { data: tableCheck, error: tableError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .limit(1)
    
    if (tableError) {
      return NextResponse.json({ 
        error: 'Projects table does not exist. Please run the database setup first.',
        details: tableError.message
      }, { status: 400 })
    }
    
    // Transform static projects data to projects table format
    const projectsToInsert = projectsData.map(project => ({
      original_id: project.id,
      title_en: project.title_en || project.title,
      title_es: project.title_es || project.title,
      description_en: project.description_en || project.description,
      description_es: project.description_es || project.description,
      category: project.category || null,
      category_en: project.category_en || null,
      category_es: project.category_es || null,
      category_label: project.categoryLabel || null,
      category_label_en: project.categoryLabel_en || project.categoryLabel || null,
      category_label_es: project.categoryLabel_es || project.categoryLabel || null,
      technologies: project.technologies || [],
      github_url: project.link || null,
      live_url: project.link || null,
      image: project.image || null,
      year: project.year || null,
      video: project.video || null,
      images: project.images || [],
      status: 'published'
    }))

    // Check for existing projects by original_id
    const existingProjects = await supabaseAdmin
      .from('projects')
      .select('original_id')
      .in('original_id', projectsToInsert.map(p => p.original_id))

    const existingIds = new Set(existingProjects.data?.map(p => p.original_id) || [])

    let migrated = 0
    let skipped = 0
    let errors = 0

    // Insert projects one by one to handle duplicates
    for (const project of projectsToInsert) {
      try {
        if (existingIds.has(project.original_id)) {
          results.push(`Project ${project.original_id}: Skipped (already exists)`)
          skipped++
          continue
        }

        const { error } = await supabaseAdmin
          .from('projects')
          .insert(project)

        if (error) {
          console.error(`Error inserting project ${project.original_id}:`, error)
          results.push(`Project ${project.original_id}: Error - ${error.message}`)
          errors++
        } else {
          results.push(`Project ${project.original_id}: Migrated successfully`)
          migrated++
        }
      } catch (error) {
        results.push(`Project ${project.original_id}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`)
        errors++
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Static projects migration completed. Migrated: ${migrated}, Skipped: ${skipped}, Errors: ${errors}`,
      migrated,
      skipped,
      errors,
      results: results
    })

  } catch (error) {
    console.error('Static projects migration error:', error)
    return NextResponse.json({ 
      error: 'Failed to migrate static projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
