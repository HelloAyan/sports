import { NextResponse } from "next/server"
import { getFixturesByLeague } from "@/lib/sports-db"

// Cache for league fixtures
const fixturesCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const leagueId = params.id

  try {
    // Check cache first
    const cacheKey = `fixtures-${leagueId}`
    const cachedData = fixturesCache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ events: cachedData.data })
    }

    // Fetch fresh data
    console.log(`Fetching fixtures for league: ${leagueId}`)
    const events = await getFixturesByLeague(leagueId)

    // Update cache
    fixturesCache.set(cacheKey, { data: events, timestamp: Date.now() })

    return NextResponse.json({ events })
  } catch (error) {
    console.error(`Error fetching fixtures for league ${leagueId}:`, error)
    return NextResponse.json({
      error: `Failed to fetch fixtures for league ${leagueId}`,
      events: [],
    })
  }
}
