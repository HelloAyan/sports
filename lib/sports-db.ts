const API_BASE_URL = "https://www.thesportsdb.com/api/v1/json"
const API_KEY = "101847" // Using your provided API key

// Cache to store API responses
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Rate Limiter
class ApiRateLimiter {
  private callCount = 0
  private lastCallTime = 0
  private readonly maxCallsPerMinute: number = 50 // Adjust as needed
  private readonly resetInterval: number = 60 * 1000 // 1 minute

  public canMakeCall(): boolean {
    const now = Date.now()
    if (now - this.lastCallTime > this.resetInterval) {
      this.callCount = 0 // Reset call count if interval has passed
    }
    return this.callCount < this.maxCallsPerMinute
  }

  public logCall(): void {
    this.callCount++
    this.lastCallTime = Date.now()
  }

  public getTimeUntilNextAvailable(): number {
    const now = Date.now()
    const timeSinceLastReset = now - this.lastCallTime
    if (timeSinceLastReset > this.resetInterval) {
      return 0 // Ready to call immediately
    }
    return this.resetInterval - timeSinceLastReset
  }
}

const apiRateLimiter = new ApiRateLimiter()

export type League = {
  idLeague: string
  strLeague: string
  strSport: string
  strLeagueAlternate: string | null
  strBadge: string
  strCountry?: string
  strBanner?: string
}

export type Team = {
  idTeam: string
  strTeam: string
  strTeamBadge: string
  strLeague: string
  strSport: string
  strStadium?: string
  strTeamBanner?: string
}

export type Player = {
  idPlayer: string
  strPlayer: string
  strThumb: string | null
  strCutout: string | null
  strTeam: string
  strPosition: string
}

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
  strTimestamp: string
  dateEvent: string
  strTime: string
  strTVStation: string | null
  strThumb: string | null
  strStatus: string
  intHomeScore: string | null
  intAwayScore: string | null
  strVenue: string | null
  strCountry?: string
  strCity?: string
  strDescriptionEN?: string
  strHomeTeamBadge?: string
  strAwayTeamBadge?: string
  strLeagueAlternate?: string
  strPostponed?: string
  strLocked?: string
  strMap?: string
  strBanner?: string
  strTweet1?: string
  strTweet2?: string
  strTweet3?: string
  strVideo?: string
}

export type LeagueStats = {
  totalTeams: number
  totalPlayers: number
  foreignPlayers: number
  avgPlayerAge: number
}

// Update the fetchFromAPI function to use rate limiting
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

  const url = `${API_BASE_URL}/${API_KEY}/${endpoint}`
  console.log(`Fetching from API: ${url}`)

  try {
    // Log this API call
    apiRateLimiter.logCall()

    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`API request to ${endpoint} failed with status ${response.status}`)
      return { events: [], teams: [], leagues: [], countries: [], players: [], player: [] }
    }

    const data = await response.json()
    if (!data || typeof data !== "object") {
      console.warn(`Invalid response format from API for ${endpoint}`)
      return { events: [], teams: [], leagues: [], countries: [], players: [], player: [] }
    }

    // Store in cache
    apiCache.set(cacheKey, { data, timestamp: Date.now() })

    return data
  } catch (error) {
    console.error(`Error fetching from API (${endpoint}):`, error)
    return { events: [], teams: [], leagues: [], countries: [], players: [], player: [] }
  }
}

// 1. LEAGUES ENDPOINTS

// Get all leagues
export async function getAllLeagues(): Promise<League[]> {
  const data = await fetchFromAPI("all_leagues.php")
  return data.leagues || []
}

// Get leagues by country
export async function getLeaguesByCountry(country: string): Promise<League[]> {
  const data = await fetchFromAPI(`search_all_leagues.php?c=${encodeURIComponent(country)}`)
  return data.countries || []
}

// Search leagues by name
export async function getLeaguesBySearch(query: string): Promise<League[]> {
  const data = await fetchFromAPI(`search_all_leagues.php?l=${encodeURIComponent(query)}`)
  return data.countries || []
}

// Get league details by ID
export async function getLeagueById(leagueId: string): Promise<League | null> {
  const data = await fetchFromAPI(`lookupleague.php?id=${leagueId}`)
  return data.leagues && data.leagues.length > 0 ? data.leagues[0] : null
}

// Get all league IDs (for static generation)
export async function getAllLeagueIds(): Promise<string[]> {
  const leagues = await getAllLeagues()
  return leagues.map((league) => league.idLeague)
}

// 2. TEAMS ENDPOINTS

// Get all teams in a league
export async function getTeamsByLeague(leagueId: string): Promise<Team[]> {
  const data = await fetchFromAPI(`lookup_all_teams.php?id=${leagueId}`)
  return data.teams || []
}

// Search teams by name
export async function getTeamsBySearch(query: string): Promise<Team[]> {
  const data = await fetchFromAPI(`searchteams.php?t=${encodeURIComponent(query)}`)
  return data.teams || []
}

// Get team details by ID
export async function getTeamById(teamId: string): Promise<Team | null> {
  const data = await fetchFromAPI(`lookupteam.php?id=${teamId}`)
  return data.teams && data.teams.length > 0 ? data.teams[0] : null
}

// 3. PLAYERS ENDPOINTS

// Search players by name
export async function getPlayersBySearch(query: string): Promise<Player[]> {
  const data = await fetchFromAPI(`searchplayers.php?p=${encodeURIComponent(query)}`)
  return data.player || []
}

// Get player details by ID
export async function getPlayerById(playerId: string): Promise<Player | null> {
  const data = await fetchFromAPI(`lookupplayer.php?id=${playerId}`)
  return data.players && data.players.length > 0 ? data.players[0] : null
}

// 4. EVENTS/FIXTURES ENDPOINTS

// Get next 15 events by league ID
export async function getFixturesByLeague(leagueId: string): Promise<Event[]> {
  const data = await fetchFromAPI(`eventsnextleague.php?id=${leagueId}`)
  return data.events || []
}

// Get last 15 events by league ID
export async function getResultsByLeague(leagueId: string): Promise<Event[]> {
  const data = await fetchFromAPI(`eventspastleague.php?id=${leagueId}`)
  return data.events || []
}

// Get events on a specific date
export async function getFixturesByDate(date: string): Promise<Event[]> {
  const data = await fetchFromAPI(`eventsday.php?d=${date}`)
  return data.events || []
}

// Get upcoming events (next 5 days)
export async function getUpcomingEvents(limit = 20): Promise<Event[]> {
  try {
    const events: Event[] = []

    // Get events for the next 5 days
    const today = new Date()

    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      const data = await fetchFromAPI(`eventsday.php?d=${dateStr}`)
      if (data.events && data.events.length > 0) {
        events.push(...data.events)

        // If we have enough events, break the loop
        if (events.length >= limit) {
          break
        }
      }
    }

    // Limit to the requested number
    return events.slice(0, limit)
  } catch (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }
}

// Get live scores - this is the key endpoint for live events
export async function getLiveEvents(): Promise<Event[]> {
  try {
    const data = await fetchFromAPI("livescore.php")

    // If we have live events, return them
    if (data.events && data.events.length > 0) {
      // Enhance events with team badges if missing
      const enhancedEvents = await Promise.all(
        data.events.map(async (event: Event) => {
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

          // If TV station is missing, try to get it from event details
          if (!event.strTVStation) {
            try {
              const eventDetails = await fetchFromAPI(`lookupevent.php?id=${event.idEvent}`)
              if (eventDetails.events && eventDetails.events.length > 0 && eventDetails.events[0].strTVStation) {
                event.strTVStation = eventDetails.events[0].strTVStation
              }
            } catch (error) {
              console.error(`Error fetching TV station for event ${event.idEvent}:`, error)
            }
          }

          return event
        }),
      )
      return enhancedEvents
    }

    // If no live events from livescore.php, try to get today's events
    const today = new Date().toISOString().split("T")[0]
    const todayData = await fetchFromAPI(`eventsday.php?d=${today}`)

    if (todayData.events && todayData.events.length > 0) {
      // Get all today's events, not just potentially live ones
      const todayEvents = todayData.events.slice(0, 20) // Limit to 20 events

      // Enhance events with team badges if missing
      const enhancedEvents = await Promise.all(
        todayEvents.map(async (event: Event) => {
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
          return event
        }),
      )

      return enhancedEvents
    }

    return []
  } catch (error) {
    console.error("Error in getLiveEvents:", error)
    return []
  }
}

// Get live scores for a specific league
export async function getLiveScoresByLeague(leagueId: string): Promise<Event[]> {
  const allLiveEvents = await getLiveEvents()
  return allLiveEvents.filter((event) => event.idLeague === leagueId)
}

// 5. SEARCH ENDPOINTS

// Search for events by name
export async function getEventsBySearch(query: string): Promise<Event[]> {
  const data = await fetchFromAPI(`searchevents.php?e=${encodeURIComponent(query)}`)
  return data.event || []
}

// Get event details by ID
export async function getEventById(eventId: string): Promise<Event | null> {
  const data = await fetchFromAPI(`lookupevent.php?id=${eventId}`)

  if (!data.events || data.events.length === 0) {
    return null
  }

  const event = data.events[0]

  // Log TV channel information for debugging
  console.log(`TV Channel info for event ${eventId}:`, event.strTVStation)

  // If we don't have team badges, try to fetch them
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
      console.error(`Error fetching team badges for event ${eventId}:`, error)
    }
  }

  return event
}

// 6. ADDITIONAL ENDPOINTS

// Get all seasons for a league
export async function getSeasonsByLeague(leagueId: string): Promise<string[]> {
  const data = await fetchFromAPI(`search_all_seasons.php?id=${leagueId}`)
  return data.seasons?.map((season: any) => season.strSeason) || []
}

// Get table/standings for a league and season
export async function getLeagueTable(leagueId: string, season: string): Promise<any[]> {
  const data = await fetchFromAPI(`lookuptable.php?l=${leagueId}&s=${season}`)
  return data.table || []
}

// Get all events for a specific team
export async function getTeamEvents(teamId: string, type: "next" | "last" = "next"): Promise<Event[]> {
  const endpoint = type === "next" ? `eventsnext.php?id=${teamId}` : `eventslast.php?id=${teamId}`
  const data = await fetchFromAPI(endpoint)
  return data.results || []
}

// Mock league stats since TheSportsDB doesn't have a direct endpoint for this
export async function getLeagueStats(leagueId: string): Promise<LeagueStats> {
  const teams = await getTeamsByLeague(leagueId)

  return {
    totalTeams: teams.length,
    totalPlayers: teams.length * 25, // Assuming average of 25 players per team
    foreignPlayers: Math.floor(teams.length * 25 * 0.4), // Assuming 40% foreign players
    avgPlayerAge: 26.5, // Mock average age
  }
}
