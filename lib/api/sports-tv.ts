// Improved sports-tv.ts with better error handling
import { fetchFromAPI } from "./sports-db"

// Cache for TV data
const tvDataCache = new Map<string, { data: string | null; timestamp: number }>()
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Function to get TV data for a specific event
export async function getEventTVData(eventId: string): Promise<string | null> {
  // Check cache first
  const cacheKey = `tv-${eventId}`
  const cachedData = tvDataCache.get(cacheKey)

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data
  }

  try {
    // Try multiple endpoints to get TV data

    // First try the event details endpoint
    try {
      const eventData = await fetchFromAPI(`lookupevent.php?id=${eventId}`)
      if (eventData.events && eventData.events.length > 0 && eventData.events[0].strTVStation) {
        const tvData = eventData.events[0].strTVStation
        tvDataCache.set(cacheKey, { data: tvData, timestamp: Date.now() })
        return tvData
      }
    } catch (error) {
      console.error(`Error fetching event details for TV data (${eventId}):`, error)
    }

    // Then try the live event endpoint
    try {
      const liveData = await fetchFromAPI(`eventslivebyid.php?id=${eventId}`)
      if (liveData.events && liveData.events.length > 0 && liveData.events[0].strTVStation) {
        const tvData = liveData.events[0].strTVStation
        tvDataCache.set(cacheKey, { data: tvData, timestamp: Date.now() })
        return tvData
      }
    } catch (error) {
      console.error(`Error fetching live event for TV data (${eventId}):`, error)
    }

    // For motorsports, try to get TV data from the league
    try {
      const eventDetails = await fetchFromAPI(`lookupevent.php?id=${eventId}`)
      const event = eventDetails.events && eventDetails.events.length > 0 ? eventDetails.events[0] : null

      if (event && event.idLeague && isMotorsport(event.strSport)) {
        const leagueData = await fetchFromAPI(`lookupleague.php?id=${event.idLeague}`)
        if (leagueData.leagues && leagueData.leagues.length > 0 && leagueData.leagues[0].strTVRights) {
          const tvData = leagueData.leagues[0].strTVRights
          tvDataCache.set(cacheKey, { data: tvData, timestamp: Date.now() })
          return tvData
        }
      }
    } catch (error) {
      console.error(`Error fetching league TV rights for event (${eventId}):`, error)
    }

    // If no TV data found, cache null to avoid repeated lookups
    tvDataCache.set(cacheKey, { data: null, timestamp: Date.now() })
    return null
  } catch (error) {
    console.error(`Error fetching TV data for event ${eventId}:`, error)
    return null
  }
}

// Function to check if a sport is motorsport
function isMotorsport(sport: string | undefined): boolean {
  if (!sport) return false

  const motorsportKeywords = ["motorsport", "formula 1", "f1", "motogp", "nascar", "indycar", "rally", "superbike"]

  return motorsportKeywords.some((keyword) => sport.toLowerCase().includes(keyword))
}

// Function to get TV data for multiple events efficiently with better error handling
export async function batchGetEventTVData(eventIds: string[]): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {}

  // Process in batches of 5 to avoid overwhelming the API
  const batchSize = 5
  for (let i = 0; i < eventIds.length; i += batchSize) {
    const batch = eventIds.slice(i, i + batchSize)

    try {
      const promises = batch.map((id) =>
        getEventTVData(id).catch((error) => {
          console.error(`Error fetching TV data for event ${id}:`, error)
          return null
        }),
      )

      const tvDataArray = await Promise.all(promises)

      batch.forEach((id, index) => {
        result[id] = tvDataArray[index]
      })
    } catch (batchError) {
      console.error(`Error processing batch of TV data (${i} to ${i + batchSize}):`, batchError)
      // Set null for all IDs in this batch that haven't been processed yet
      batch.forEach((id) => {
        if (!(id in result)) {
          result[id] = null
        }
      })
    }

    // Add a small delay between batches
    if (i + batchSize < eventIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return result
}
