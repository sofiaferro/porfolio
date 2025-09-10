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
    const results = []
    
    // Check if projects table exists
    try {
      const { data, error } = await supabaseAdmin
        .from('projects')
        .select('id')
        .limit(1)
      
      if (error && error.code === 'PGRST116') {
        results.push('Projects table: Does not exist - Please create it manually in Supabase dashboard')
      } else if (error) {
        results.push('Projects table: Error checking - ' + error.message)
      } else {
        results.push('Projects table: Exists ✓')
      }
    } catch (error) {
      results.push('Projects table: Error - ' + (error instanceof Error ? error.message : 'Unknown error'))
    }

    // Check if content table has new columns
    try {
      const { data, error } = await supabaseAdmin
        .from('content')
        .select('content_key')
        .limit(1)
      
      if (error && error.code === 'PGRST116') {
        results.push('Content table content_key column: Does not exist - Please add it manually')
      } else if (error) {
        results.push('Content table content_key column: Error checking - ' + error.message)
      } else {
        results.push('Content table content_key column: Exists ✓')
      }
    } catch (error) {
      results.push('Content table content_key column: Error - ' + (error instanceof Error ? error.message : 'Unknown error'))
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database status checked',
      results: results,
      instructions: [
        '1. Go to your Supabase dashboard',
        '2. Navigate to SQL Editor',
        '3. Run the SQL from setup-database.sql file',
        '4. This will create the projects table and update the content table'
      ]
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Failed to check database status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
