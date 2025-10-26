import { type NextRequest, NextResponse } from "next/server"
import { getEventsToday, normalizeTeamBadge } from "@/lib/api/sports-db-v2"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get("sport") || ""
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 50)

    console.log(`[API] Fetching today's events for sport: ${sport || "all"}, limit: ${limit}`)

    let events = await getEventsToday(sport)

    if (!events || !Array.isArray(events)) {
      console.warn("[API] No events returned or invalid format")
      events = []
    }

    // Process and normalize events
    events = events
      .map((event, index) => {
        try {
          return {
            idEvent: event.idEvent || `today-${index}`,
            strEvent: event.strEvent || `${event.strHomeTeam || "Team A"} vs ${event.strAwayTeam || "Team B"}`,
            strLeague: event.strLeague || "Unknown League",
            strSport: event.strSport || sport || "Unknown Sport",
            strHomeTeam: event.strHomeTeam || "Home Team",
            strAwayTeam: event.strAwayTeam || "Away Team",
            dateEvent: event.dateEvent || new Date().toISOString().split("T")[0],
            strTime: event.strTime || "00:00:00",
            strStatus: event.strStatus || "Not Started",
            strVenue: event.strVenue || null,
            strTVStation: event.strTVStation || null,
            intHomeScore: event.intHomeScore || null,
            intAwayScore: event.intAwayScore || null,
            strHomeTeamBadge: normalizeTeamBadge(event.strHomeTeamBadge, event.strHomeTeam || "Home Team"),
            strAwayTeamBadge: normalizeTeamBadge(event.strAwayTeamBadge, event.strAwayTeam || "Away Team"),
          }
        } catch (eventError) {
          console.error(`[API] Error processing today's event ${index}:`, eventError)
          return null
        }
      })
      .filter(Boolean)

    // Limit results
    if (events.length > limit) {
      events = events.slice(0, limit)
    }

    console.log(`[API] Successfully processed ${events.length} today's events`)

    return NextResponse.json(
      {
        success: true,
        events: events,
        total: events.length,
        source: "TheSportsDB",
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("[API] Error in events/today route:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        success: false,
        events: [],
        total: 0,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
