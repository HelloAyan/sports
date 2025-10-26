import { type NextRequest, NextResponse } from "next/server"
import { getLiveEvents, normalizeTeamBadge } from "@/lib/api/sports-db-v2"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get("sport") || "Soccer"
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 50) // Cap at 50

    console.log(`[API] Fetching live events for sport: ${sport}, limit: ${limit}`)

    let events = await getLiveEvents(sport)

    if (!events || !Array.isArray(events)) {
      console.warn("[API] No events returned or invalid format")
      events = []
    }

    // Normalize team badges and ensure all required fields exist
    events = events
      .map((event, index) => {
        try {
          return {
            idEvent: event.idEvent || `fallback-${index}`,
            strEvent: event.strEvent || `${event.strHomeTeam || "Team A"} vs ${event.strAwayTeam || "Team B"}`,
            strLeague: event.strLeague || "Unknown League",
            strSport: event.strSport || sport,
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
          console.error(`[API] Error processing event ${index}:`, eventError)
          return null
        }
      })
      .filter(Boolean) // Remove null entries

    // Limit the results
    if (events.length > limit) {
      events = events.slice(0, limit)
    }

    console.log(`[API] Successfully processed ${events.length} events`)

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
    console.error("[API] Error in live-events route:", error)

    // Return a more detailed error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        success: false,
        events: [],
        total: 0,
        error: errorMessage,
        errorDetails: process.env.NODE_ENV === "development" ? errorStack : undefined,
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
