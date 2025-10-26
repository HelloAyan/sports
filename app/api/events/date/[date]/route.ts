import { type NextRequest, NextResponse } from "next/server"
import { getEventsByDate, normalizeTeamBadge } from "@/lib/api/sports-db-v2"

export async function GET(request: NextRequest, { params }: { params: { date: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get("sport") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const date = params.date

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid date format. Use YYYY-MM-DD",
          events: [],
          total: 0,
        },
        { status: 400 },
      )
    }

    console.log(`Fetching events for date: ${date}, sport: ${sport || "all"}`)

    let events = await getEventsByDate(date, sport)

    // Normalize team badges
    events = events.map((event) => ({
      ...event,
      strHomeTeamBadge: normalizeTeamBadge(event.strHomeTeamBadge, event.strHomeTeam),
      strAwayTeamBadge: normalizeTeamBadge(event.strAwayTeamBadge, event.strAwayTeam),
    }))

    // Limit the results
    if (events && events.length > limit) {
      events = events.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      events: events || [],
      total: events?.length || 0,
      date,
      source: "TheSportsDB",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error in events/date/${params.date} API:`, error)

    return NextResponse.json(
      {
        success: false,
        events: [],
        total: 0,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
