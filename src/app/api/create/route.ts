import { NextRequest, NextResponse } from 'next/server'
import { addLink, generateShortCode, getLink } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { originalUrl } = body

    // Validate input
    if (!originalUrl || typeof originalUrl !== 'string') {
      return NextResponse.json(
        { error: 'Original URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(originalUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Generate unique short code
    let shortCode: string
    let attempts = 0
    const maxAttempts = 10

    do {
      shortCode = generateShortCode()
      attempts++
      
      if (attempts > maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code' },
          { status: 500 }
        )
      }
    } while (getLink(shortCode))

    // Store the link
    addLink(shortCode, originalUrl)

    // Get the base URL from the request
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const shortUrl = `${baseUrl}/${shortCode}`

    return NextResponse.json({
      shortUrl,
      shortCode,
      originalUrl
    })

  } catch (error) {
    console.error('Error creating short link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
