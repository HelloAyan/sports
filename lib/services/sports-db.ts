import { redis } from "@/lib/redis"
import { logger } from "@/lib/logger"
import { fetchFromAPI } from "@/lib/sports-db"

const CACHE_TTL = 300 // 5 minutes

class SportsDBService {
  private static instance: SportsDBService
  private constructor() {}

  static getInstance(): SportsDBService {
    if (!SportsDBService.instance) {
      SportsDBService.instance = new SportsDBService()
    }
    return SportsDBService.instance
  }

  private async getCachedData<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    try {
      // Try to get from cache
      const cached = await redis.get(key)
      if (cached) {
        return JSON.parse(cached) as T
      }

      // If not in cache, fetch fresh data
      const result = await fetchFn()

      // Cache the successful response
      await redis.set(key, JSON.stringify(result), "EX", CACHE_TTL)

      return result
    } catch (error) {
      logger.error("Cache operation failed:", error)
      // If cache fails, try direct fetch
      return fetchFn()
    }
  }

  async getLeagues(): Promise<any> {
    return this.getCachedData("leagues", () => fetchFromAPI("all_leagues.php"))
  }

  async getTeams(leagueId: string): Promise<any> {
    return this.getCachedData(`teams:${leagueId}`, () => fetchFromAPI(`lookup_all_teams.php?id=${leagueId}`))
  }

  async getLiveScores(): Promise<any> {
    // Get today's events and filter for live ones
    const today = new Date().toISOString().split("T")[0]
    const data = await fetchFromAPI(`eventsday.php?d=${today}`)

    // Filter for events that are currently live
    const events = data.events || []
    return {
      events: events.filter(
        (event) =>
          event.strStatus &&
          ["LIVE", "IN PLAY", "PLAYING", "ONGOING", "1H", "2H", "HT", "Q1", "Q2", "Q3", "Q4"].includes(
            event.strStatus.toUpperCase(),
          ),
      ),
    }
  }

  async getFixtures(leagueId: string): Promise<any> {
    return this.getCachedData(`fixtures:${leagueId}`, () => fetchFromAPI(`eventsnextleague.php?id=${leagueId}`))
  }
}

export const sportsDBService = SportsDBService.getInstance()
