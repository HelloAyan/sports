import { NextResponse } from "next/server"
import { getEventById } from "@/lib/sports-db"
import { getEventTVData } from "@/lib/api/sports-tv"

// Cache for event details
const eventCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const eventId = params.id

  try {
    // Check cache first
    const cacheKey = `event-${eventId}`
    const cachedData = eventCache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ event: cachedData.data })
    }

    // Fetch fresh data
    console.log(`Fetching event details: ${eventId}`)
    const event = await getEventById(eventId)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Get TV data specifically
    if (!event.strTVStation) {
      const tvData = await getEventTVData(eventId)
      if (tvData) {
        event.strTVStation = tvData
      }
    }

    // Update cache
    eventCache.set(cacheKey, { data: event, timestamp: Date.now() })

    return NextResponse.json({ event })
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error)
    return NextResponse.json(
      {
        error: `Failed to fetch event ${eventId}`,
        event: null,
      },
      { status: 500 },
    )
  }
}
