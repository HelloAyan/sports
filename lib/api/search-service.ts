import { fetchFromAPI } from "./sports-db"
import type { Event, Team, League } from "./sports-db"

// Search for events by name
export async function searchEvents(query: string): Promise<Event[]> {
  try {
    const data = await fetchFromAPI(`searchevents.php?e=${encodeURIComponent(query)}`)
    return data.event || []
  } catch (error) {
    console.error(`Error searching events for "${query}":`, error)
    return []
  }
}

// Search for teams by name
export async function searchTeams(query: string): Promise<Team[]> {
  try {
    const data = await fetchFromAPI(`searchteams.php?t=${encodeURIComponent(query)}`)
    return data.teams || []
  } catch (error) {
    console.error(`Error searching teams for "${query}":`, error)
    return []
  }
}

// Search for leagues by name
export async function searchLeagues(query: string): Promise<League[]> {
  try {
    const data = await fetchFromAPI(`search_all_leagues.php?l=${encodeURIComponent(query)}`)
    return data.countries || []
  } catch (error) {
    console.error(`Error searching leagues for "${query}":`, error)
    return []
  }
}

// Search for all types (combined search)
export async function searchAll(query: string) {
  try {
    const [events, teams, leagues] = await Promise.all([searchEvents(query), searchTeams(query), searchLeagues(query)])

    return {
      events,
      teams,
      leagues,
    }
  } catch (error) {
    console.error(`Error in combined search for "${query}":`, error)
    return {
      events: [],
      teams: [],
      leagues: [],
    }
  }
}
