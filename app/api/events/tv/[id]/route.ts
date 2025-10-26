import { NextResponse } from "next/server"
import { getEventTVData } from "@/lib/api/sports-tv"

// Cache for TV data responses
const responseCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const eventId = params.id

  // Check cache first
  const cacheKey = `tv-response-${eventId}`
  const cachedResponse = responseCache.get(cacheKey)

  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    return NextResponse.json(cachedResponse.data)
  }

  try {
    const tvData = await getEventTVData(eventId)

    const response = {
      eventId,
      tvData: tvData || null,
      channels: tvData ? tvData.split(",").map((channel) => channel.trim()) : [],
      hasTV: !!tvData,
    }

    // Cache the response
    responseCache.set(cacheKey, { data: response, timestamp: Date.now() })

    return NextResponse.json(response)
  } catch (error) {
    console.error(`Error fetching TV data for event ${eventId}:`, error)
    return NextResponse.json(
      { error: "Failed to fetch TV data", eventId, tvData: null, channels: [], hasTV: false },
      { status: 500 },
    )
  }
}
