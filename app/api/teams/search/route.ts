import { type NextRequest, NextResponse } from "next/server"
import { searchTeams, normalizeTeamBadge } from "@/lib/api/sports-db-v2"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query || query.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query must be at least 3 characters",
          teams: [],
          total: 0,
        },
        { status: 400 },
      )
    }

    console.log(`Searching teams for: ${query}`)

    let teams = await searchTeams(query)

    // Normalize team badges
    teams = teams.map((team) => ({
      ...team,
      strTeamBadge: normalizeTeamBadge(team.strTeamBadge, team.strTeam),
    }))

    // Limit the results
    if (teams && teams.length > limit) {
      teams = teams.slice(0, limit)
    }

    return NextResponse.json({
      success: true,
      teams: teams || [],
      total: teams?.length || 0,
      query,
      source: "TheSportsDB",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in teams/search API:", error)

    return NextResponse.json(
      {
        success: false,
        teams: [],
        total: 0,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
