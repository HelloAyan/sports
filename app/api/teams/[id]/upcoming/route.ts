import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamId = params.id
    console.log(`[API] Fetching upcoming events for team ID: ${teamId}`)

    // Mock upcoming events data - in real app, this would fetch from SportsDB
    const upcomingEvents = [
      {
        idEvent: "upcoming-1",
        strEvent: "Liverpool vs Manchester City",
        dateEvent: "2024-01-15",
        strTime: "15:00:00",
        strStatus: "Not Started",
        strHomeTeam: "Liverpool",
        strAwayTeam: "Manchester City",
        intHomeScore: null,
        intAwayScore: null,
      },
      {
        idEvent: "upcoming-2",
        strEvent: "Arsenal vs Liverpool",
        dateEvent: "2024-01-22",
        strTime: "17:30:00",
        strStatus: "Not Started",
        strHomeTeam: "Arsenal",
        strAwayTeam: "Liverpool",
        intHomeScore: null,
        intAwayScore: null,
      },
    ]

    return NextResponse.json({
      success: true,
      events: upcomingEvents,
      total: upcomingEvents.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[API] Error fetching upcoming events for team ${params.id}:`, error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        events: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
