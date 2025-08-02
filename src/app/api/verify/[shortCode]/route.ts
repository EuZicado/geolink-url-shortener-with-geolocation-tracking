import { NextRequest, NextResponse } from 'next/server'
import { getLink } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params

    if (!shortCode || typeof shortCode !== 'string') {
      return NextResponse.json(
        { error: 'Short code is required' },
        { status: 400 }
      )
    }

    const linkData = getLink(shortCode)

    if (!linkData) {
      return NextResponse.json(
        { error: 'Short code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      originalUrl: linkData.originalUrl,
      createdAt: linkData.createdAt,
      visitCount: linkData.logs.length
    })

  } catch (error) {
    console.error('Error verifying short code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
