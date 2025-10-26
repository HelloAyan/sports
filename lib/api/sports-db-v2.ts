// TheSportsDB API integration
const SPORTSDB_API_KEY = "101847"
const SPORTSDB_BASE_URL = "https://www.thesportsdb.com/api/v1/json"

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Fallback data for when API fails
const FALLBACK_EVENTS = [
  {
    idEvent: "fallback-1",
    strEvent: "Liverpool vs Manchester United",
    strHomeTeam: "Liverpool",
    strAwayTeam: "Manchester United",
    strLeague: "English Premier League",
    strSport: "Soccer",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "15:00:00",
    strStatus: "Not Started",
    strVenue: "Anfield",
    strTVStation: "Sky Sports",
    intHomeScore: null,
    intAwayScore: null,
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
  },
  {
    idEvent: "fallback-2",
    strEvent: "Lakers vs Warriors",
    strHomeTeam: "Los Angeles Lakers",
    strAwayTeam: "Golden State Warriors",
    strLeague: "NBA",
    strSport: "Basketball",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "19:30:00",
    strStatus: "Not Started",
    strVenue: "Crypto.com Arena",
    strTVStation: "ESPN",
    intHomeScore: null,
    intAwayScore: null,
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
  },
  {
    idEvent: "fallback-3",
    strEvent: "Real Madrid vs Barcelona",
    strHomeTeam: "Real Madrid",
    strAwayTeam: "Barcelona",
    strLeague: "La Liga",
    strSport: "Soccer",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "20:00:00",
    strStatus: "LIVE",
    strVenue: "Santiago Bernabéu",
    strTVStation: "ESPN+",
    intHomeScore: "2",
    intAwayScore: "1",
    strHomeTeamBadge: null,
    strAwayTeamBadge: null,
  },
]

interface SportsDBResponse<T> {
  events?: T[]
  leagues?: T[]
  teams?: T[]
  players?: T[]
  error?: string
}

async function fetchFromSportsDB<T>(endpoint: string): Promise<SportsDBResponse<T>> {
  const cacheKey = endpoint
  const cached = cache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[SportsDB] Using cached data for ${endpoint}`)
    return cached.data
  }

  try {
    // TheSportsDB API v1 format: {base_url}/{api_key}/{endpoint}
    const url = `${SPORTSDB_BASE_URL}/${SPORTSDB_API_KEY}/${endpoint}`
    console.log(`[SportsDB] Fetching from: ${url}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "SportsFixtures/1.0",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`SportsDB API error: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()

    // Check if the response is empty or not valid JSON
    if (!text || text.trim() === "") {
      console.warn("[SportsDB] Empty response")
      return { events: [] }
    }

    // Check if response looks like an error message (starts with "Invalid")
    const trimmedText = text.trim()
    if (trimmedText.startsWith("Invalid") || trimmedText.startsWith("Error")) {
      console.warn(`[SportsDB] API error response: ${trimmedText}`)
      return { events: [] }
    }

    // Check if response looks like JSON before parsing
    if (!trimmedText.startsWith("{") && !trimmedText.startsWith("[")) {
      console.warn(`[SportsDB] Response doesn't look like JSON: ${trimmedText.substring(0, 200)}`)
      return { events: [] }
    }

    let data: SportsDBResponse<T>
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.warn(`[SportsDB] JSON parse error: ${parseError}`)
      console.warn(`[SportsDB] Response text: ${text.substring(0, 200)}`)
      return { events: [] }
    }

    // Cache the response
    cache.set(cacheKey, { data, timestamp: Date.now() })
    console.log(`[SportsDB] Successfully fetched and cached data for ${endpoint}`)

    return data
  } catch (error) {
    console.warn(`[SportsDB] Error fetching from ${endpoint}:`, error)

    // Return cached data if available, even if expired
    if (cached) {
      console.log(`[SportsDB] Using expired cache for ${endpoint}`)
      return cached.data
    }

    // Return empty response structure
    return {
      events: [],
      leagues: [],
      teams: [],
      players: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getLiveEvents(sport = "Soccer"): Promise<any[]> {
  try {
    console.log(`[SportsDB] Getting live events for sport: ${sport}`)

    // TheSportsDB v1 API doesn't have a direct livescore endpoint
    // Instead, we'll get today's events and filter for ones that are live
    const today = new Date().toISOString().split("T")[0]

    // First try with the sport parameter
    const response = await fetchFromSportsDB(`eventsday.php?d=${today}&s=${encodeURIComponent(sport)}`)

    if (!response.events || response.events.length === 0) {
      // If no events for the specific sport, try all sports
      console.log(`[SportsDB] No events found for ${sport}, trying all sports`)
      const allSportsResponse = await fetchFromSportsDB(`eventsday.php?d=${today}`)

      if (!allSportsResponse.events || allSportsResponse.events.length === 0) {
        console.log("[SportsDB] No events found at all, using fallback data")
        return FALLBACK_EVENTS
      }

      // Filter for live events first, then return recent events
      const liveEvents = allSportsResponse.events.filter((event) => isEventLive(event.strStatus))

      if (liveEvents.length > 0) {
        console.log(`[SportsDB] Found ${liveEvents.length} live events`)
        return liveEvents
      }

      // Return recent events if no live ones
      return allSportsResponse.events.slice(0, 10)
    }

    // Filter for live events first
    const liveEvents = response.events.filter((event) => isEventLive(event.strStatus))

    if (liveEvents.length > 0) {
      console.log(`[SportsDB] Found ${liveEvents.length} live events for ${sport}`)
      return liveEvents
    }

    // Return recent events if no live ones
    console.log(`[SportsDB] No live events for ${sport}, returning recent events`)
    return response.events.slice(0, 10)
  } catch (error) {
    console.error("[SportsDB] Error getting live events:", error)
    return FALLBACK_EVENTS
  }
}

export async function getEventsToday(sport = ""): Promise<any[]> {
  try {
    console.log(`[SportsDB] Getting today's events for sport: ${sport || "all"}`)

    const today = new Date().toISOString().split("T")[0]
    const endpoint = sport ? `eventsday.php?d=${today}&s=${encodeURIComponent(sport)}` : `eventsday.php?d=${today}`

    const response = await fetchFromSportsDB(endpoint)

    if (!response.events || response.events.length === 0) {
      console.log("[SportsDB] No today's events found, using fallback data")
      return FALLBACK_EVENTS
    }

    console.log(`[SportsDB] Found ${response.events.length} events for today`)
    return response.events
  } catch (error) {
    console.error("[SportsDB] Error getting today's events:", error)
    return FALLBACK_EVENTS
  }
}

export async function getEventsByDate(date: string, sport = ""): Promise<any[]> {
  try {
    console.log(`[SportsDB] Getting events for date: ${date}, sport: ${sport || "all"}`)

    const endpoint = sport ? `eventsday.php?d=${date}&s=${encodeURIComponent(sport)}` : `eventsday.php?d=${date}`

    const response = await fetchFromSportsDB(endpoint)
    return response.events || []
  } catch (error) {
    console.error(`[SportsDB] Error getting events for ${date}:`, error)
    return []
  }
}

export async function getAllLeagues(): Promise<any[]> {
  try {
    console.log("[SportsDB] Getting all leagues")

    const response = await fetchFromSportsDB("all_leagues.php")
    return response.leagues || []
  } catch (error) {
    console.error("[SportsDB] Error getting leagues:", error)
    return []
  }
}

export async function searchTeams(query: string): Promise<any[]> {
  try {
    console.log(`[SportsDB] Searching teams for: ${query}`)

    const response = await fetchFromSportsDB(`searchteams.php?t=${encodeURIComponent(query)}`)
    return response.teams || []
  } catch (error) {
    console.error("[SportsDB] Error searching teams:", error)
    return []
  }
}

export async function getTeamById(teamId: string): Promise<any | null> {
  try {
    console.log(`[SportsDB] Getting team by ID: ${teamId}`)

    const response = await fetchFromSportsDB(`lookupteam.php?id=${teamId}`)
    return response.teams?.[0] || null
  } catch (error) {
    console.error(`[SportsDB] Error getting team ${teamId}:`, error)
    return null
  }
}

export async function getEventById(eventId: string): Promise<any | null> {
  try {
    console.log(`[SportsDB] Getting event by ID: ${eventId}`)

    const response = await fetchFromSportsDB(`lookupevent.php?id=${eventId}`)
    return response.events?.[0] || null
  } catch (error) {
    console.error(`[SportsDB] Error getting event ${eventId}:`, error)
    return null
  }
}

// Helper function to check if an event is live based on status
export function isEventLive(status: string): boolean {
  if (!status) return false

  const liveStatuses = [
    "LIVE",
    "IN PLAY",
    "1H",
    "2H",
    "HT",
    "ET",
    "PEN",
    "ONGOING",
    "STARTED",
    "PLAYING",
    "ACTIVE",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "1ST",
    "2ND",
    "3RD",
    "OVERTIME",
    "SHOOTOUT",
  ]

  return liveStatuses.some((s) => status.toUpperCase().includes(s))
}

// Helper function to normalize team badge URLs
export function normalizeTeamBadge(badge: string | null | undefined, teamName: string): string {
  if (!badge || badge === "null" || badge === "") {
    return `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(teamName + " team logo")}`
  }

  // If it's already a full URL, return it
  if (badge.startsWith("http")) {
    return badge
  }

  // If it's a relative path, construct the full URL
  if (badge.startsWith("/")) {
    return `https://www.thesportsdb.com${badge}`
  }

  // Otherwise, construct the full URL with the standard path
  return `https://www.thesportsdb.com/images/media/team/badge/${badge}`
}
