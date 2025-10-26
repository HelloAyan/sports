import { fetchFromAPI } from "./sports-db"
import { getEventsByDate } from "./calendar-service"
import type { Event } from "./sports-db"

interface TVGuideFilters {
  date: string
  sport?: string | null
  country?: string | null
}

// Get TV guide for a specific date with optional filters
export async function getTVGuide(filters: TVGuideFilters): Promise<Event[]> {
  try {
    // Get events for the specified date
    const events = await getEventsByDate(filters.date)

    // Filter events that have TV information
    let tvEvents = events.filter((event) => event.strTVStation)

    // Apply additional filters if provided
    if (filters.sport) {
      tvEvents = tvEvents.filter((event) => event.strSport?.toLowerCase() === filters.sport.toLowerCase())
    }

    // Filter by country (based on TV station info)
    if (filters.country) {
      tvEvents = tvEvents.filter((event) => {
        if (!event.strTVStation) return false

        // Check if any TV station contains the country name
        // This is a simplistic approach and might need refinement
        return event.strTVStation.toLowerCase().includes(filters.country.toLowerCase())
      })
    }

    return tvEvents
  } catch (error) {
    console.error(`Error fetching TV guide for date ${filters.date}:`, error)
    return []
  }
}

// Get TV channels for a specific event
export async function getTVChannelsByEvent(eventId: string): Promise<string[]> {
  try {
    const data = await fetchFromAPI(`lookupevent.php?id=${eventId}`)

    if (!data.events || data.events.length === 0) {
      return []
    }

    const event = data.events[0]

    if (!event.strTVStation) {
      return []
    }

    // Split TV stations string into array and trim whitespace
    return event.strTVStation.split(",").map((channel: string) => channel.trim())
  } catch (error) {
    console.error(`Error fetching TV channels for event ${eventId}:`, error)
    return []
  }
}

// Get events by TV channel
export async function getEventsByTVChannel(channel: string, date?: string): Promise<Event[]> {
  try {
    // Get events for today or specified date
    const targetDate = date || new Date().toISOString().split("T")[0]
    const events = await getEventsByDate(targetDate)

    // Filter events that are broadcast on the specified channel
    return events.filter((event) => {
      if (!event.strTVStation) return false

      // Check if the TV station list contains the channel
      return event.strTVStation.toLowerCase().includes(channel.toLowerCase())
    })
  } catch (error) {
    console.error(`Error fetching events for TV channel ${channel}:`, error)
    return []
  }
}
