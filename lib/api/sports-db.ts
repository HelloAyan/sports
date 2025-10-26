// Update the existing sports-db.ts file with better error handling
import { apiRateLimiter } from "@/lib/api-rate-limiter"
import { getEventTVData, batchGetEventTVData } from "./sports-tv"

const API_BASE_URL = "https://www.thesportsdb.com/api/v1/json"
const API_KEY = process.env.SPORTSDB_API_KEY || "1"

// Cache to store API responses
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Fallback data for when API is unavailable
const FALLBACK_EVENTS = [
  {
    idEvent: "fallback1",
    strEvent: "Liverpool vs Manchester United",
    strLeague: "Premier League",
    strSport: "Football",
    strHomeTeam: "Liverpool",
    strAwayTeam: "Manchester United",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "15:00:00",
    strStatus: "Upcoming",
    strVenue: "Anfield",
    strTVStation: "Sky Sports, BT Sport",
    intHomeScore: null,
    intAwayScore: null,
  },
  {
    idEvent: "fallback2",
    strEvent: "Los Angeles Lakers vs Golden State Warriors",
    strLeague: "NBA",
    strSport: "Basketball",
    strHomeTeam: "Los Angeles Lakers",
    strAwayTeam: "Golden State Warriors",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "19:30:00",
    strStatus: "Upcoming",
    strVenue: "Staples Center",
    strTVStation: "ESPN, TNT",
    intHomeScore: null,
    intAwayScore: null,
  },
  {
    idEvent: "fallback3",
    strEvent: "Formula 1 Monaco Grand Prix",
    strLeague: "Formula 1",
    strSport: "Motorsport",
    strHomeTeam: "Circuit de Monaco",
    strAwayTeam: "Race",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "14:00:00",
    strStatus: "Upcoming",
    strVenue: "Circuit de Monaco",
    strTVStation: "Sky Sports F1, ESPN",
    intHomeScore: null,
    intAwayScore: null,
  },
  {
    idEvent: "fallback4",
    strEvent: "Novak Djokovic vs Rafael Nadal",
    strLeague: "Wimbledon",
    strSport: "Tennis",
    strHomeTeam: "Novak Djokovic",
    strAwayTeam: "Rafael Nadal",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "13:00:00",
    strStatus: "Upcoming",
    strVenue: "Centre Court, Wimbledon",
    strTVStation: "BBC, ESPN",
    intHomeScore: null,
    intAwayScore: null,
  },
  {
    idEvent: "fallback5",
    strEvent: "New York Yankees vs Boston Red Sox",
    strLeague: "MLB",
    strSport: "Baseball",
    strHomeTeam: "New York Yankees",
    strAwayTeam: "Boston Red Sox",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "19:05:00",
    strStatus: "Upcoming",
    strVenue: "Yankee Stadium",
    strTVStation: "ESPN, MLB Network",
    intHomeScore: null,
    intAwayScore: null,
  },
  {
    idEvent: "fallback6",
    strEvent: "Celtic vs Rangers",
    strLeague: "Scottish Premiership",
    strSport: "Football",
    strHomeTeam: "Celtic",
    strAwayTeam: "Rangers",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "12:30:00",
    strStatus: "Upcoming",
    strVenue: "Celtic Park",
    strTVStation: "Sky Sports, BT Sport",
    intHomeScore: null,
    intAwayScore: null,
  },
  {
    idEvent: "fallback7",
    strEvent: "UFC 300: Main Event",
    strLeague: "UFC",
    strSport: "MMA",
    strHomeTeam: "Fighter 1",
    strAwayTeam: "Fighter 2",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "22:00:00",
    strStatus: "Upcoming",
    strVenue: "T-Mobile Arena, Las Vegas",
    strTVStation: "ESPN+, UFC Fight Pass",
    intHomeScore: null,
    intAwayScore: null,
  },
  {
    idEvent: "fallback8",
    strEvent: "Super Bowl LVIII",
    strLeague: "NFL",
    strSport: "American Football",
    strHomeTeam: "Kansas City Chiefs",
    strAwayTeam: "San Francisco 49ers",
    dateEvent: new Date().toISOString().split("T")[0],
    strTime: "18:30:00",
    strStatus: "Upcoming",
    strVenue: "Allegiant Stadium, Las Vegas",
    strTVStation: "CBS, NFL Network",
    intHomeScore: null,
    intAwayScore: null,
  },
]

export type Event = {
  idEvent: string
  idHomeTeam?: string
  idAwayTeam?: string
  idLeague?: string
  strEvent: string
  strLeague: string
  strSport: string
  strHomeTeam: string
  strAwayTeam: string
  strTimestamp?: string
  dateEvent: string
  strTime: string
  strTVStation: string | null
  strThumb?: string | null
  strStatus: string
  intHomeScore: string | null
  intAwayScore: string | null
  strVenue: string | null
  strCountry?: string
  strCity?: string
  strDescriptionEN?: string
  strHomeTeamBadge?: string
  strAwayTeamBadge?: string
}

// Fetch data from the API with caching and improved error handling
export async function fetchFromAPI(endpoint: string): Promise<any> {
  // Check cache first
  const cacheKey = endpoint
  const cachedData = apiCache.get(cacheKey)

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data
  }

  // Check if we can make an API call
  if (!apiRateLimiter.canMakeCall()) {
    console.warn(`API rate limit reached, waiting ${apiRateLimiter.getTimeUntilNextAvailable()}ms before next call`)

    // If we have cached data, return it even if it's expired
    if (cachedData) {
      return cachedData.data
    }

    // Wait until we can make a call
    await new Promise((resolve) => setTimeout(resolve, apiRateLimiter.getTimeUntilNextAvailable()))
  }

  // Use the API key from environment variables
  const apiKey = process.env.SPORTSDB_API_KEY || "1"
  const url = `${API_BASE_URL}/${apiKey}/${endpoint}`
  console.log(`Fetching from API: ${url}`)

  try {
    // Log this API call
    apiRateLimiter.logCall()

    // Add timeout to fetch to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    // Use a retry mechanism for network failures
    let retries = 3
    let response = null

    while (retries > 0 && !response) {
      try {
        response = await fetch(url, {
          signal: controller.signal,
          // Add headers to help with CORS issues
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // Add cache control to avoid browser caching
          cache: "no-store",
        })
      } catch (fetchError) {
        retries--
        if (retries === 0) throw fetchError
        console.log(`Fetch attempt failed, retrying... (${retries} attempts left)`)
        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } finally {
        clearTimeout(timeoutId)
      }
    }

    if (!response || !response.ok) {
      console.warn(`API request to ${endpoint} failed with status ${response?.status || "unknown"}`)

      // If we have cached data, return it even if it's expired
      if (cachedData) {
        console.log(`Using expired cache for ${endpoint}`)
        return cachedData.data
      }

      // Return fallback data based on endpoint
      if (endpoint.includes("livescore")) {
        return { events: FALLBACK_EVENTS }
      }

      return { events: [], teams: [], leagues: [], countries: [], players: [], player: [] }
    }

    const data = await response.json()
    if (!data || typeof data !== "object") {
      console.warn(`Invalid response format from API for ${endpoint}`)

      // If we have cached data, return it even if it's expired
      if (cachedData) {
        return cachedData.data
      }

      return { events: [], teams: [], leagues: [], countries: [], players: [], player: [] }
    }

    // Store in cache
    apiCache.set(cacheKey, { data, timestamp: Date.now() })

    return data
  } catch (error) {
    console.error(`Error fetching from API (${endpoint}):`, error)

    // If we have cached data, return it even if it's expired
    if (cachedData) {
      console.log(`Using expired cache for ${endpoint} after error`)
      return cachedData.data
    }

    // Return fallback data for live events
    if (endpoint.includes("livescore")) {
      return { events: FALLBACK_EVENTS }
    }

    // For other endpoints, return empty data structures
    return { events: [], teams: [], leagues: [], countries: [], players: [], player: [] }
  }
}

// Get live events with enhanced TV data and better error handling
export async function getLiveEvents(): Promise<Event[]> {
  try {
    const data = await fetchFromAPI("livescore.php")

    // If we have live events, return them
    if (data.events && data.events.length > 0) {
      // Get event IDs for batch TV data lookup
      const eventIds = data.events.map((event: Event) => event.idEvent)

      try {
        // Batch get TV data for all events
        const tvDataMap = await batchGetEventTVData(eventIds)

        // Enhance events with team badges and TV info
        const enhancedEvents = await Promise.all(
          data.events.map(async (event: Event) => {
            try {
              // Add TV data from our batch lookup
              if (!event.strTVStation && tvDataMap[event.idEvent]) {
                event.strTVStation = tvDataMap[event.idEvent]
              }

              // Fetch team badges if needed
              if ((!event.strHomeTeamBadge || !event.strAwayTeamBadge) && (event.idHomeTeam || event.idAwayTeam)) {
                try {
                  // Fetch home team details if needed
                  if (!event.strHomeTeamBadge && event.idHomeTeam) {
                    const homeTeamData = await fetchFromAPI(`lookupteam.php?id=${event.idHomeTeam}`)
                    if (homeTeamData.teams && homeTeamData.teams.length > 0) {
                      event.strHomeTeamBadge = homeTeamData.teams[0].strTeamBadge
                    }
                  }

                  // Fetch away team details if needed
                  if (!event.strAwayTeamBadge && event.idAwayTeam) {
                    const awayTeamData = await fetchFromAPI(`lookupteam.php?id=${event.idAwayTeam}`)
                    if (awayTeamData.teams && awayTeamData.teams.length > 0) {
                      event.strAwayTeamBadge = awayTeamData.teams[0].strTeamBadge
                    }
                  }
                } catch (error) {
                  console.error(`Error fetching team badges for event ${event.idEvent}:`, error)
                }
              }
            } catch (enhanceError) {
              console.error(`Error enhancing event ${event.idEvent}:`, enhanceError)
            }
            return event
          }),
        )
        return enhancedEvents
      } catch (batchError) {
        console.error("Error in batch TV data processing:", batchError)
        // Return events without TV enhancement if batch processing fails
        return data.events
      }
    }

    // If no live events, try to get today's events
    try {
      const today = new Date().toISOString().split("T")[0]
      const todayData = await fetchFromAPI(`eventsday.php?d=${today}`)

      if (todayData.events && todayData.events.length > 0) {
        return todayData.events.slice(0, 20) // Limit to 20 events
      }
    } catch (todayError) {
      console.error("Error fetching today's events:", todayError)
    }

    // If all else fails, return fallback events
    return FALLBACK_EVENTS
  } catch (error) {
    console.error("Error in getLiveEvents:", error)
    return FALLBACK_EVENTS
  }
}

// Get event details by ID with enhanced TV info and better error handling
export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const data = await fetchFromAPI(`lookupevent.php?id=${eventId}`)

    if (!data.events || data.events.length === 0) {
      return null
    }

    const event = data.events[0]

    // If TV station is missing, get it from our specialized TV data function
    if (!event.strTVStation) {
      try {
        const tvData = await getEventTVData(eventId)
        if (tvData) {
          event.strTVStation = tvData
        }
      } catch (tvError) {
        console.error(`Error fetching TV data for event ${eventId}:`, tvError)
      }
    }

    return event
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error)

    // If it's a fallback event ID, return the matching fallback event
    if (eventId.startsWith("fallback")) {
      const fallbackEvent = FALLBACK_EVENTS.find((e) => e.idEvent === eventId)
      return fallbackEvent || null
    }

    return null
  }
}

// Get events by date with TV info and better error handling
export async function getEventsByDate(date: string): Promise<Event[]> {
  try {
    const data = await fetchFromAPI(`eventsday.php?d=${date}`)

    if (!data.events || data.events.length === 0) {
      // If no events for the date, return fallback events with adjusted date
      return FALLBACK_EVENTS.map((event) => ({
        ...event,
        dateEvent: date,
      }))
    }

    // Get event IDs for batch TV data lookup (limit to 10 to avoid too many API calls)
    const eventIds = data.events.slice(0, 10).map((event: Event) => event.idEvent)

    try {
      // Batch get TV data for these events
      const tvDataMap = await batchGetEventTVData(eventIds)

      // Enhance events with TV info
      const enhancedEvents = data.events.slice(0, 10).map((event: Event) => {
        if (!event.strTVStation && tvDataMap[event.idEvent]) {
          event.strTVStation = tvDataMap[event.idEvent]
        }
        return event
      })

      // Return enhanced events + remaining events
      return [...enhancedEvents, ...data.events.slice(10)]
    } catch (tvError) {
      console.error(`Error fetching TV data for events on ${date}:`, tvError)
      // Return original events if TV enhancement fails
      return data.events
    }
  } catch (error) {
    console.error(`Error fetching events for date ${date}:`, error)

    // Return fallback events with adjusted date
    return FALLBACK_EVENTS.map((event) => ({
      ...event,
      dateEvent: date,
    }))
  }
}

/* -------------------------------------------------------------------------- */
/*  Search & League helpers – minimum viable versions to satisfy the build.   */
/*  You can replace endpoint logic later with richer implementations.         */
/* -------------------------------------------------------------------------- */

export async function getEventsBySearch(query: string) {
  const data = await fetchFromAPI(`searchevents.php?e=${encodeURIComponent(query)}`)
  return data?.event ?? []
}

export async function getAllLeagues() {
  const data = await fetchFromAPI("all_leagues.php")
  return data?.leagues ?? []
}

export async function getLeaguesByCountry(country: string) {
  const data = await fetchFromAPI(`search_all_leagues.php?c=${encodeURIComponent(country)}`)
  return data?.countrys ?? []
}

export async function getLeaguesBySearch(query: string) {
  const data = await fetchFromAPI(`search_all_leagues.php?l=${encodeURIComponent(query)}`)
  return data?.countrys ?? []
}

export async function getPlayersBySearch(query: string) {
  const data = await fetchFromAPI(`searchplayers.php?p=${encodeURIComponent(query)}`)
  return data?.player ?? []
}

export async function getTeamsBySearch(query: string) {
  const data = await fetchFromAPI(`searchteams.php?t=${encodeURIComponent(query)}`)
  return data?.teams ?? []
}

export async function getLeagueStats(leagueId: string) {
  const data = await fetchFromAPI(`lookuptable.php?l=${leagueId}`)
  return data?.table ?? []
}

export async function getLeagueById(leagueId: string) {
  const data = await fetchFromAPI(`lookupleague.php?id=${leagueId}`)
  return data?.leagues?.[0] ?? null
}

export async function getAllLeagueIds(): Promise<string[]> {
  const leagues = await getAllLeagues()
  return leagues.map((l: { idLeague: string }) => l.idLeague)
}
