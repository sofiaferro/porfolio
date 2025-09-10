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

// Portfolio content data
const portfolioContent = [
  // Hero Section
  {
    content_type: 'hero',
    content_key: 'hero_title',
    title_en: 'Sofia Ferro',
    title_es: 'Sofia Ferro',
    content_en: 'Creative Technologist & Electronic Artist',
    content_es: 'Tecnóloga Creativa & Artista Electrónica',
    description_en: 'Exploring the intersection of technology, art, and literature through interactive installations and creative coding.',
    description_es: 'Explorando la intersección entre tecnología, arte y literatura a través de instalaciones interactivas y programación creativa.'
  },
  {
    content_type: 'hero',
    content_key: 'hero_subtitle',
    title_en: 'About Me',
    title_es: 'Sobre Mí',
    content_en: 'I create interactive experiences that blend technology with artistic expression, focusing on electronic literature, IoT projects, and creative coding.',
    content_es: 'Creo experiencias interactivas que combinan tecnología con expresión artística, enfocándome en literatura electrónica, proyectos IoT y programación creativa.'
  },

  // About Section
  {
    content_type: 'about',
    content_key: 'bio_main',
    title_en: 'Biography',
    title_es: 'Biografía',
    content_en: 'Sofia Ferro is a creative technologist and electronic artist based in Argentina. She holds a Master\'s degree in Electronic Arts from UNTREF and specializes in creating interactive installations that explore the relationship between humans and technology. Her work spans electronic literature, IoT projects, creative coding, and experimental art installations.',
    content_es: 'Sofia Ferro es una tecnóloga creativa y artista electrónica radicada en Argentina. Posee una Maestría en Artes Electrónicas de la UNTREF y se especializa en crear instalaciones interactivas que exploran la relación entre humanos y tecnología. Su trabajo abarca literatura electrónica, proyectos IoT, programación creativa e instalaciones artísticas experimentales.'
  },
  {
    content_type: 'about',
    content_key: 'bio_education',
    title_en: 'Education',
    title_es: 'Educación',
    content_en: 'Master\'s in Electronic Arts - UNTREF\nBachelor\'s in Computer Science - UBA',
    content_es: 'Maestría en Artes Electrónicas - UNTREF\nLicenciatura en Ciencias de la Computación - UBA'
  },
  {
    content_type: 'about',
    content_key: 'bio_skills',
    title_en: 'Skills & Technologies',
    title_es: 'Habilidades y Tecnologías',
    content_en: 'Creative Coding, Interactive Installations, Electronic Literature, IoT Development, Arduino, ESP32, React, Next.js, Node.js, Python, JavaScript, Hardware Prototyping, Digital Art',
    content_es: 'Programación Creativa, Instalaciones Interactivas, Literatura Electrónica, Desarrollo IoT, Arduino, ESP32, React, Next.js, Node.js, Python, JavaScript, Prototipado de Hardware, Arte Digital'
  },

  // Contact Section
  {
    content_type: 'contact',
    content_key: 'contact_title',
    title_en: 'Get In Touch',
    title_es: 'Contacto',
    content_en: 'Let\'s collaborate on your next creative project',
    content_es: 'Colaboremos en tu próximo proyecto creativo'
  },
  {
    content_type: 'contact',
    content_key: 'contact_email',
    title_en: 'Email',
    title_es: 'Correo',
    content_en: 'sofia.ferro@example.com',
    content_es: 'sofia.ferro@ejemplo.com'
  },
  {
    content_type: 'contact',
    content_key: 'contact_location',
    title_en: 'Location',
    title_es: 'Ubicación',
    content_en: 'Buenos Aires, Argentina',
    content_es: 'Buenos Aires, Argentina'
  },

  // Footer
  {
    content_type: 'footer',
    content_key: 'footer_copyright',
    title_en: 'Copyright',
    title_es: 'Derechos de Autor',
    content_en: '© 2025 Sofia Ferro. All rights reserved.',
    content_es: '© 2025 Sofia Ferro. Todos los derechos reservados.'
  },
  {
    content_type: 'footer',
    content_key: 'footer_links',
    title_en: 'Quick Links',
    title_es: 'Enlaces Rápidos',
    content_en: 'Projects | About | Contact | Blog',
    content_es: 'Proyectos | Sobre Mí | Contacto | Blog'
  },

  // Navigation
  {
    content_type: 'navigation',
    content_key: 'nav_home',
    title_en: 'Home',
    title_es: 'Inicio',
    content_en: 'Home',
    content_es: 'Inicio'
  },
  {
    content_type: 'navigation',
    content_key: 'nav_projects',
    title_en: 'Projects',
    title_es: 'Proyectos',
    content_en: 'Projects',
    content_es: 'Proyectos'
  },
  {
    content_type: 'navigation',
    content_key: 'nav_about',
    title_en: 'About',
    title_es: 'Sobre Mí',
    content_en: 'About',
    content_es: 'Sobre Mí'
  },
  {
    content_type: 'navigation',
    content_key: 'nav_contact',
    title_en: 'Contact',
    title_es: 'Contacto',
    content_en: 'Contact',
    content_es: 'Contacto'
  },
  {
    content_type: 'navigation',
    content_key: 'nav_blog',
    title_en: 'Blog',
    title_es: 'Blog',
    content_en: 'Blog',
    content_es: 'Blog'
  },

  // Meta Information
  {
    content_type: 'meta',
    content_key: 'meta_title',
    title_en: 'Site Title',
    title_es: 'Título del Sitio',
    content_en: 'Sofia Ferro - Creative Technologist & Electronic Artist',
    content_es: 'Sofia Ferro - Tecnóloga Creativa & Artista Electrónica'
  },
  {
    content_type: 'meta',
    content_key: 'meta_description',
    title_en: 'Site Description',
    title_es: 'Descripción del Sitio',
    content_en: 'Portfolio of Sofia Ferro, creative technologist and electronic artist specializing in interactive installations, electronic literature, and IoT projects.',
    content_es: 'Portfolio de Sofia Ferro, tecnóloga creativa y artista electrónica especializada en instalaciones interactivas, literatura electrónica y proyectos IoT.'
  },
  {
    content_type: 'meta',
    content_key: 'meta_keywords',
    title_en: 'Keywords',
    title_es: 'Palabras Clave',
    content_en: 'creative technology, electronic art, interactive installations, IoT, Arduino, ESP32, electronic literature, creative coding, digital art, Argentina',
    content_es: 'tecnología creativa, arte electrónico, instalaciones interactivas, IoT, Arduino, ESP32, literatura electrónica, programación creativa, arte digital, Argentina'
  }
]

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const results = []
    
    // Check if content table has the required columns
    const { data: testContent, error: testError } = await supabaseAdmin
      .from('content')
      .select('content_type, content_key')
      .limit(1)
    
    if (testError && testError.code === 'PGRST116') {
      return NextResponse.json({ 
        error: 'Content table does not exist or missing required columns. Please run the database setup first.' 
      }, { status: 400 })
    }

    // Insert portfolio content
    for (const item of portfolioContent) {
      try {
        // Check if content already exists
        const { data: existing } = await supabaseAdmin
          .from('content')
          .select('id')
          .eq('content_type', item.content_type)
          .eq('content_key', item.content_key)
          .single()

        if (existing) {
          // Update existing content
          const { error: updateError } = await supabaseAdmin
            .from('content')
            .update({
              title_en: item.title_en,
              title_es: item.title_es,
              content_en: item.content_en,
              content_es: item.content_es,
              description_en: item.description_en,
              description_es: item.description_es,
              is_published: true
            })
            .eq('id', existing.id)

          if (updateError) {
            results.push(`${item.content_type}/${item.content_key}: Update failed - ${updateError.message}`)
          } else {
            results.push(`${item.content_type}/${item.content_key}: Updated successfully`)
          }
        } else {
          // Insert new content
          const { error: insertError } = await supabaseAdmin
            .from('content')
            .insert({
              content_type: item.content_type,
              content_key: item.content_key,
              title_en: item.title_en,
              title_es: item.title_es,
              content_en: item.content_en,
              content_es: item.content_es,
              description_en: item.description_en,
              description_es: item.description_es,
              is_published: true
            })

          if (insertError) {
            results.push(`${item.content_type}/${item.content_key}: Insert failed - ${insertError.message}`)
          } else {
            results.push(`${item.content_type}/${item.content_key}: Created successfully`)
          }
        }
      } catch (error) {
        results.push(`${item.content_type}/${item.content_key}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Portfolio content migration completed. Processed ${portfolioContent.length} content items.`,
      results: results
    })

  } catch (error) {
    console.error('Portfolio content migration error:', error)
    return NextResponse.json({ 
      error: 'Failed to migrate portfolio content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
