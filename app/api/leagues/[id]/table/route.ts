import { NextResponse } from "next/server"
import { getLeagueTable, getSeasonsByLeague } from "@/lib/sports-db"

// Cache for league tables
const tableCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const leagueId = params.id
  const { searchParams } = new URL(request.url)
  let season = searchParams.get("season")

  try {
    // If no season provided, get the latest season
    if (!season) {
      const seasons = await getSeasonsByLeague(leagueId)
      if (seasons.length > 0) {
        season = seasons[0] // Most recent season
      } else {
        return NextResponse.json({
          error: "No seasons found for this league",
          table: [],
        })
      }
    }

    // Check cache first
    const cacheKey = `table-${leagueId}-${season}`
    const cachedData = tableCache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ table: cachedData.data })
    }

    // Fetch fresh data
    console.log(`Fetching table for league ${leagueId}, season ${season}`)
    const table = await getLeagueTable(leagueId, season)

    // Update cache
    tableCache.set(cacheKey, { data: table, timestamp: Date.now() })

    return NextResponse.json({ table })
  } catch (error) {
    console.error(`Error fetching table for league ${leagueId}:`, error)
    return NextResponse.json({
      error: `Failed to fetch table for league ${leagueId}`,
      table: [],
    })
  }
}
