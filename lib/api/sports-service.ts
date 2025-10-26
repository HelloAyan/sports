import { fetchFromAPI } from "./sports-db"

export type Sport = {
  idSport: string
  strSport: string
  strFormat: string
  strSportThumb: string
  strSportIconGreen: string
  strSportDescription: string
}

// Get all sports
export async function getAllSports(): Promise<Sport[]> {
  try {
    const data = await fetchFromAPI("all_sports.php")
    return data.sports || []
  } catch (error) {
    console.error("Error fetching all sports:", error)
    return []
  }
}

// Get sport by ID
export async function getSportById(id: string): Promise<Sport | null> {
  try {
    const data = await fetchFromAPI(`lookup_all_sports.php?id=${id}`)
    return data.sports && data.sports.length > 0 ? data.sports[0] : null
  } catch (error) {
    console.error(`Error fetching sport with ID ${id}:`, error)
    return null
  }
}

// Get leagues by sport
export async function getLeaguesBySport(sport: string): Promise<any[]> {
  try {
    const data = await fetchFromAPI(`search_all_leagues.php?s=${encodeURIComponent(sport)}`)
    return data.countries || []
  } catch (error) {
    console.error(`Error fetching leagues for sport ${sport}:`, error)
    return []
  }
}

// Get events by sport
export async function getEventsBySport(sport: string, date?: string): Promise<any[]> {
  try {
    // If date is provided, get events for that date and filter by sport
    if (date) {
      const data = await fetchFromAPI(`eventsday.php?d=${date}`)
      const events = data.events || []
      return events.filter((event: any) => event.strSport?.toLowerCase() === sport.toLowerCase())
    }

    // Otherwise, try to get events for today
    const today = new Date().toISOString().split("T")[0]
    const data = await fetchFromAPI(`eventsday.php?d=${today}`)
    const events = data.events || []
    return events.filter((event: any) => event.strSport?.toLowerCase() === sport.toLowerCase())
  } catch (error) {
    console.error(`Error fetching events for sport ${sport}:`, error)
    return []
  }
}
