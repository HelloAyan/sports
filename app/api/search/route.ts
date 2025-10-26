import { NextResponse } from "next/server"
import { searchEvents, searchTeams, searchLeagues } from "@/lib/api/search-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "all" // all, events, teams, leagues

  if (!query) {
    return NextResponse.json(
      {
        error: "Search query is required",
        results: [],
      },
      { status: 400 },
    )
  }

  try {
    const results = {
      events: [],
      teams: [],
      leagues: [],
    }

    // Perform search based on type
    if (type === "all" || type === "events") {
      const events = await searchEvents(query)
      results.events = events
    }

    if (type === "all" || type === "teams") {
      const teams = await searchTeams(query)
      results.teams = teams
    }

    if (type === "all" || type === "leagues") {
      const leagues = await searchLeagues(query)
      results.leagues = leagues
    }

    return NextResponse.json({
      query,
      type,
      results,
    })
  } catch (error) {
    console.error(`Error in search API:`, error)
    return NextResponse.json(
      {
        error: "Failed to perform search",
        query,
        results: [],
      },
      { status: 500 },
    )
  }
}
