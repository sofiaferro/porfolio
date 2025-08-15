import { NextResponse } from 'next/server'
import { keepAliveHelper } from './helper'
import { keepAliveConfig } from '@/config/keep-alive-config'

export async function GET() {
  try {
    const results = await keepAliveHelper(keepAliveConfig)
    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error('Keep-alive error:', error)
    return NextResponse.json(
      { error: 'Keep-alive failed' },
      { status: 500 }
    )
  }
}

// Optional: Add POST method for manual triggering
export async function POST() {
  return GET()
} 