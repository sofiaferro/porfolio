import { NextResponse } from 'next/server'

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
    
    // First, get all existing projects from content table
    const { data: existingProjects, error: fetchError } = await supabaseAdmin
      .from('content')
      .select('*')
      .eq('type', 'project')

    if (fetchError) {
      console.error('Error fetching existing projects:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch existing projects' }, { status: 500 })
    }

    if (!existingProjects || existingProjects.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No projects found in content table to migrate' 
      })
    }

    // Transform and insert into projects table
    const projectsToInsert = existingProjects.map(project => ({
      id: project.id, // Keep the same ID
      original_id: project.original_id || project.id,
      title_en: project.title_en || '',
      title_es: project.title_es || '',
      description_en: project.description_en || '',
      description_es: project.description_es || '',
      category: project.category || null,
      category_en: project.category_en || null,
      category_es: project.category_es || null,
      category_label: project.category_label || null,
      category_label_en: project.category_label_en || null,
      category_label_es: project.category_label_es || null,
      technologies: project.technologies || [],
      github_url: project.github_url || null,
      live_url: project.live_url || null,
      image: project.image || null,
      year: project.year || null,
      video: project.video || null,
      images: project.images || [],
      status: 'published',
      created_at: project.created_at,
      updated_at: project.updated_at || project.created_at
    }))

    // Insert into projects table
    const { error: insertError } = await supabaseAdmin
      .from('projects')
      .upsert(projectsToInsert, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (insertError) {
      console.error('Error inserting projects:', insertError)
      return NextResponse.json({ error: 'Failed to insert projects' }, { status: 500 })
    }

    // Optionally, delete from content table after successful migration
    const { error: deleteError } = await supabaseAdmin
      .from('content')
      .delete()
      .eq('type', 'project')

    if (deleteError) {
      console.error('Error deleting from content table:', deleteError)
      // Don't fail the whole operation, just log the error
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully migrated ${projectsToInsert.length} projects to the projects table`,
      migrated: projectsToInsert.length
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Failed to migrate projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
