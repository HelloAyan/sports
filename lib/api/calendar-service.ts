import { fetchFromAPI } from "./sports-db"
import type { Event } from "./sports-db"

// Get events for a specific date
export async function getEventsByDate(date: string, sport = "all"): Promise<Event[]> {
  try {
    const data = await fetchFromAPI(`eventsday.php?d=${date}`)
    let events = data.events || []

    // Filter by sport if specified
    if (sport !== "all") {
      events = events.filter((event: Event) => event.strSport?.toLowerCase() === sport.toLowerCase())
    }

    return events
  } catch (error) {
    console.error(`Error fetching events for date ${date}:`, error)
    return []
  }
}

// Get events for a date range (by fetching each day individually)
export async function getEventsByDateRange(startDate: string, endDate: string, sport = "all"): Promise<Event[]> {
  try {
    // Convert dates to Date objects
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format")
    }

    // Limit the date range to avoid too many API calls
    const maxDays = 14 // Maximum 14 days range
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > maxDays) {
      throw new Error(`Date range too large. Maximum range is ${maxDays} days`)
    }

    // Generate array of dates in the range
    const dates: string[] = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Fetch events for each date
    const eventsPromises = dates.map((date) => getEventsByDate(date, sport))
    const eventsArrays = await Promise.all(eventsPromises)

    // Flatten the array of arrays
    const allEvents = eventsArrays.flat()

    return allEvents
  } catch (error) {
    console.error(`Error fetching events for date range ${startDate} to ${endDate}:`, error)
    return []
  }
}

// Get upcoming events for a specific league
export async function getUpcomingEventsByLeague(leagueId: string): Promise<Event[]> {
  try {
    const data = await fetchFromAPI(`eventsnextleague.php?id=${leagueId}`)
    return data.events || []
  } catch (error) {
    console.error(`Error fetching upcoming events for league ${leagueId}:`, error)
    return []
  }
}

// Get past events for a specific league
export async function getPastEventsByLeague(leagueId: string): Promise<Event[]> {
  try {
    const data = await fetchFromAPI(`eventspastleague.php?id=${leagueId}`)
    return data.events || []
  } catch (error) {
    console.error(`Error fetching past events for league ${leagueId}:`, error)
    return []
  }
}
