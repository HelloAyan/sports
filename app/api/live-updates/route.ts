import { NextResponse } from "next/server"
import { getLiveEvents } from "@/lib/sports-db"

// Cache for live events
let cachedEvents = null as any
let lastFetchTime = 0
const CACHE_TTL = 60 * 1000 // 1 minute

async function getEvents() {
  const now = Date.now()
  if (cachedEvents && now - lastFetchTime < CACHE_TTL) {
    return cachedEvents
  }

  const events = await getLiveEvents()
  cachedEvents = events
  lastFetchTime = now
  return events
}

export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          // Get live events using our cached function
          const events = await getEvents()

          const data = encoder.encode(`data: ${JSON.stringify(events)}\n\n`)
          controller.enqueue(data)
          await new Promise((resolve) => setTimeout(resolve, 10000)) // Update every 10 seconds
        }
      } catch (error) {
        console.error("Error in live updates stream:", error)
        controller.close()
      }
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
