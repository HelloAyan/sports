import type { Fixture, FilterState, ApiResponse } from "./types"

const ITEMS_PER_BATCH = 25
const API_CACHE = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Simplified API with better error handling
export async function fetchFixtures(
  filters: FilterState,
  batch: number,
  timePreference: "local" | "your",
): Promise<ApiResponse<Fixture[]>> {
  const cacheKey = `fixtures-${JSON.stringify(filters)}-${batch}-${timePreference}`

  // Check cache first
  const cached = API_CACHE.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    // Mock data for now - replace with actual API call
    const fixtures: Fixture[] = generateMockFixtures(100)

    // Apply filters
    const filtered = applyFilters(fixtures, filters)

    // Paginate
    const start = (batch - 1) * ITEMS_PER_BATCH
    const end = start + ITEMS_PER_BATCH
    const batchFixtures = filtered.slice(start, end)

    const result: ApiResponse<Fixture[]> = {
      data: batchFixtures,
      total: filtered.length,
      hasMore: filtered.length > end,
    }

    // Cache result
    API_CACHE.set(cacheKey, { data: result, timestamp: Date.now() })

    return result
  } catch (error) {
    console.error("Error fetching fixtures:", error)
    return {
      data: [],
      error: "Failed to fetch fixtures",
      total: 0,
      hasMore: false,
    }
  }
}

function generateMockFixtures(count: number): Fixture[] {
  const sports = ["Football", "Basketball", "Tennis", "Cricket"]
  const competitions = ["Premier League", "NBA", "Wimbledon", "IPL"]

  return Array.from({ length: count }, (_, index) => ({
    id: `fixture-${index + 1}`,
    sport: sports[index % sports.length],
    competition: competitions[index % competitions.length],
    homeTeam: {
      id: `team-${index * 2 + 1}`,
      name: `Team ${index * 2 + 1}`,
      logo: "/placeholder.svg",
    },
    awayTeam: {
      id: `team-${index * 2 + 2}`,
      name: `Team ${index * 2 + 2}`,
      logo: "/placeholder.svg",
    },
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    time: "15:00",
    venue: {
      name: `Stadium ${index + 1}`,
      city: "City",
      country: "Country",
      countryCode: "CC",
    },
    status: ["not_started", "live", "finished"][index % 3] as any,
    tvChannels: ["Sky Sports", "ESPN"],
    gender: "male" as const,
    location: "Location",
    eventType: "League Match",
    isAllDay: false,
    isFavorite: false,
    hasReminder: false,
    coordinates: { lat: 0, lng: 0 },
  }))
}

function applyFilters(fixtures: Fixture[], filters: FilterState): Fixture[] {
  return fixtures.filter((fixture) => {
    if (filters.sport && filters.sport !== "all" && fixture.sport !== filters.sport) return false
    if (filters.competition && filters.competition !== "all" && fixture.competition !== filters.competition)
      return false
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return (
        fixture.homeTeam.name.toLowerCase().includes(search) ||
        fixture.awayTeam.name.toLowerCase().includes(search) ||
        fixture.competition.toLowerCase().includes(search)
      )
    }
    return true
  })
}
