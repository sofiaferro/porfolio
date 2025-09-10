import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    
    // Get all blog posts with their IDs
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('id, title_en, title_es, date')
      .order('date', { ascending: false })

    if (error) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: error,
        tableExists: false 
      })
    }

    // Test if we can update the specific post
    if (posts && posts.length > 0) {
      const testId = posts[0].id
      const { data: updateTest, error: updateError } = await supabase
        .from('blog_posts')
        .update({ title_en: posts[0].title_en }) // Update with same value
        .eq('id', testId)
        .select()

      return NextResponse.json({ 
        success: true, 
        posts: posts || [],
        count: posts?.length || 0,
        updateTest: {
          canUpdate: !updateError,
          error: updateError,
          updatedRows: updateTest?.length || 0
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      posts: posts || [],
      count: posts?.length || 0
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error
    })
  }
}
