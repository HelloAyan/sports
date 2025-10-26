import { fetchFromAPI } from "./sports-db"
import type { League } from "./sports-db"

// Get all leagues
export async function getAllLeagues(): Promise<League[]> {
  try {
    const data = await fetchFromAPI("all_leagues.php")
    return data.leagues || []
  } catch (error) {
    console.error("Error fetching all leagues:", error)
    return []
  }
}

// Get league by ID
export async function getLeagueById(leagueId: string): Promise<League | null> {
  try {
    const data = await fetchFromAPI(`lookupleague.php?id=${leagueId}`)
    return data.leagues && data.leagues.length > 0 ? data.leagues[0] : null
  } catch (error) {
    console.error(`Error fetching league with ID ${leagueId}:`, error)
    return null
  }
}

// Get leagues by country
export async function getLeaguesByCountry(country: string): Promise<League[]> {
  try {
    const data = await fetchFromAPI(`search_all_leagues.php?c=${encodeURIComponent(country)}`)
    return data.countries || []
  } catch (error) {
    console.error(`Error fetching leagues for country ${country}:`, error)
    return []
  }
}

// Get leagues by sport
export async function getLeaguesBySport(sport: string): Promise<League[]> {
  try {
    const data = await fetchFromAPI(`search_all_leagues.php?s=${encodeURIComponent(sport)}`)
    return data.countries || []
  } catch (error) {
    console.error(`Error fetching leagues for sport ${sport}:`, error)
    return []
  }
}

// Get seasons for a league
export async function getSeasonsByLeague(leagueId: string): Promise<string[]> {
  try {
    const data = await fetchFromAPI(`search_all_seasons.php?id=${leagueId}`)
    return data.seasons?.map((season: any) => season.strSeason) || []
  } catch (error) {
    console.error(`Error fetching seasons for league ${leagueId}:`, error)
    return []
  }
}

// Get league table/standings
export async function getLeagueTable(leagueId: string, season: string): Promise<any[]> {
  try {
    const data = await fetchFromAPI(`lookuptable.php?l=${leagueId}&s=${season}`)
    return data.table || []
  } catch (error) {
    console.error(`Error fetching table for league ${leagueId}, season ${season}:`, error)
    return []
  }
}
