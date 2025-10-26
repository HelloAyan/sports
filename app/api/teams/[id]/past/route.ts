import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamId = params.id
    console.log(`[API] Fetching past events for team ID: ${teamId}`)

    // Mock past events data - in real app, this would fetch from SportsDB
    const pastEvents = [
      {
        idEvent: "past-1",
        strEvent: "Liverpool vs Chelsea",
        dateEvent: "2024-01-08",
        strTime: "15:00:00",
        strStatus: "Match Finished",
        strHomeTeam: "Liverpool",
        strAwayTeam: "Chelsea",
        intHomeScore: "2",
        intAwayScore: "1",
      },
      {
        idEvent: "past-2",
        strEvent: "Manchester United vs Liverpool",
        dateEvent: "2024-01-01",
        strTime: "16:30:00",
        strStatus: "Match Finished",
        strHomeTeam: "Manchester United",
        strAwayTeam: "Liverpool",
        intHomeScore: "1",
        intAwayScore: "3",
      },
    ]

    return NextResponse.json({
      success: true,
      events: pastEvents,
      total: pastEvents.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[API] Error fetching past events for team ${params.id}:`, error)

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
