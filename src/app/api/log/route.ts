import { NextRequest, NextResponse } from 'next/server'
import { addLog, getLink } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shortCode, location } = body

    // Validate input
    if (!shortCode || typeof shortCode !== 'string') {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      )
    }

    // Check if the short code exists
    const linkData = getLink(shortCode)
    if (!linkData) {
      return NextResponse.json(
        { error: 'Short code not found' },
        { status: 404 }
      )
    }

    // Validate location data if provided
    if (location && (
      typeof location.lat !== 'number' || 
      typeof location.lng !== 'number' ||
      (location.accuracy !== undefined && typeof location.accuracy !== 'number')
    )) {
      return NextResponse.json(
        { error: 'Invalid location data format' },
        { status: 400 }
      )
    }

    // Get additional request metadata
    const userAgent = request.headers.get('user-agent') || undefined
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || undefined

    // Add log entry
    addLog(shortCode, {
      location,
      userAgent,
      ip
    })

    return NextResponse.json({
      success: true,
      message: 'Location logged successfully'
    })

  } catch (error) {
    console.error('Error logging data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
