import { NextResponse } from "next/server"
import { getTVGuide, getTVChannelsByEvent } from "@/lib/api/tv-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const sport = searchParams.get("sport")
  const country = searchParams.get("country")
  const eventId = searchParams.get("eventId")

  try {
    // If eventId is provided, get TV channels for that specific event
    if (eventId) {
      const channels = await getTVChannelsByEvent(eventId)
      return NextResponse.json({ channels })
    }

    // Otherwise, get TV guide based on filters
    const tvGuide = await getTVGuide({
      date: date || new Date().toISOString().split("T")[0],
      sport,
      country,
    })

    return NextResponse.json({ tvGuide })
  } catch (error) {
    console.error(`Error in TV guide API:`, error)
    return NextResponse.json(
      {
        error: "Failed to fetch TV guide",
        tvGuide: [],
      },
      { status: 500 },
    )
  }
}
