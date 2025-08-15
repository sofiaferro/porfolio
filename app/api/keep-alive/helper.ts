import { supabase } from '@/lib/supabase'

interface KeepAliveResult {
  success: boolean
  message: string
  timestamp: string
  randomString?: string
}

interface KeepAliveConfig {
  tableName: string
  columnName: string
  enableInsertion: boolean
  enableDeletion: boolean
  otherEndpoints?: string[]
}

const defaultConfig: KeepAliveConfig = {
  tableName: 'keep-alive',
  columnName: 'name',
  enableInsertion: true,
  enableDeletion: true,
  otherEndpoints: []
}

export async function keepAliveHelper(config: KeepAliveConfig = defaultConfig): Promise<KeepAliveResult> {
  const randomString = generateRandomString()
  const timestamp = new Date().toISOString()

  try {
    // Make a database call to keep the project active
    const { data, error } = await supabase
      .from(config.tableName)
      .select(config.columnName)
      .eq(config.columnName, randomString)

    if (error) {
      throw error
    }

    let message = `Success - found ${data?.length || 0} entries for '${randomString}'`
    
    // Optional: Insert a new record
    if (config.enableInsertion) {
      const { error: insertError } = await supabase
        .from(config.tableName)
        .insert([{ [config.columnName]: randomString }])
      
      if (!insertError) {
        message += ` | Inserted new record with '${randomString}'`
      }
    }

    // Optional: Delete the inserted record (cleanup)
    if (config.enableDeletion) {
      const { error: deleteError } = await supabase
        .from(config.tableName)
        .delete()
        .eq(config.columnName, randomString)
      
      if (!deleteError) {
        message += ` | Deleted record with '${randomString}'`
      }
    }

    return {
      success: true,
      message,
      timestamp,
      randomString
    }

  } catch (error) {
    console.error('Keep-alive database error:', error)
    return {
      success: false,
      message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp
    }
  }
}

function generateRandomString(length: number = 12): string {
  const alphabetOffset = 'a'.charCodeAt(0)
  let newString = ''

  for (let i = 0; i < length; i++) {
    newString += String.fromCharCode(alphabetOffset + Math.floor(Math.random() * 26))
  }

  return newString
} 