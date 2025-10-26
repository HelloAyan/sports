import { type NextRequest, NextResponse } from "next/server"
import { getAllLeagues } from "@/lib/api/sports-db-v2"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sport = searchParams.get("sport") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    console.log(`Fetching leagues for sport: ${sport || "all"}`)

    let leagues = await getAllLeagues()

    // Filter by sport if specified
    if (sport) {
      leagues = leagues.filter((league) => league.strSport.toLowerCase() === sport.toLowerCase())
    }

    // Limit the results
    if (leagues && leagues.length > limit) {
      leagues = leagues.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      leagues: leagues || [],
      total: leagues?.length || 0,
      source: "TheSportsDB",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in leagues API:", error)

    return NextResponse.json(
      {
        success: false,
        leagues: [],
        total: 0,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
