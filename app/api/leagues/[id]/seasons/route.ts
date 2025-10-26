import { NextResponse } from "next/server"
import { getSeasonsByLeague } from "@/lib/sports-db"

// Cache for league seasons
const seasonsCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const leagueId = params.id

  try {
    // Check cache first
    const cacheKey = `seasons-${leagueId}`
    const cachedData = seasonsCache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ seasons: cachedData.data })
    }

    // Fetch fresh data
    console.log(`Fetching seasons for league: ${leagueId}`)
    const seasons = await getSeasonsByLeague(leagueId)

    // Update cache
    seasonsCache.set(cacheKey, { data: seasons, timestamp: Date.now() })

    return NextResponse.json({ seasons })
  } catch (error) {
    console.error(`Error fetching seasons for league ${leagueId}:`, error)
    return NextResponse.json({
      error: `Failed to fetch seasons for league ${leagueId}`,
      seasons: [],
    })
  }
}
