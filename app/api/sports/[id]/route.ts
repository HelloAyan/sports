import { NextResponse } from "next/server"
import { fetchFromAPI } from "@/lib/sports-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const apiId = searchParams.get("apiId")

  if (!apiId) {
    return NextResponse.json({ error: "API ID is required" }, { status: 400 })
  }

  try {
    // Fetch all leagues for this sport
    const data = await fetchFromAPI(`search_all_leagues.php?s=${params.id}`)

    // Get upcoming events for this sport
    const eventsData = await fetchFromAPI(`eventsday.php?s=${params.id}`)

    return NextResponse.json({
      sport: params.id,
      apiId,
      leagues: data.countries || [],
      events: eventsData.events || [],
    })
  } catch (error) {
    console.error(`Error fetching data for sport ${params.id}:`, error)
    return NextResponse.json({ error: `Failed to fetch data for sport ${params.id}` }, { status: 500 })
  }
}
