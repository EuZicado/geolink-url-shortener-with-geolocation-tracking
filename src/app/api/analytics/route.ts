import { NextResponse } from 'next/server'
import { getAllLinks } from '@/lib/db'

export async function GET() {
  try {
    const allLinks = getAllLinks()
    
    // Convert Map to plain object for JSON serialization
    const analyticsData: { [key: string]: any } = {}
    
    allLinks.forEach((linkData, shortCode) => {
      analyticsData[shortCode] = {
        originalUrl: linkData.originalUrl,
        createdAt: linkData.createdAt.toISOString(),
        logs: linkData.logs.map(log => ({
          timestamp: log.timestamp.toISOString(),
          location: log.location,
          userAgent: log.userAgent,
          ip: log.ip
        }))
      }
    })

    return NextResponse.json(analyticsData)

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
