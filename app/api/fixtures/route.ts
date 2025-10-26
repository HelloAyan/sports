import { NextResponse } from "next/server"
import { getFixturesByLeague, getFixturesByDate } from "@/lib/sports-db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const leagueId = searchParams.get("league")
    const date = searchParams.get("date")

    let events = []

    if (leagueId) {
      events = await getFixturesByLeague(leagueId)
    } else if (date) {
      events = await getFixturesByDate(date)
    } else {
      // Default to today's fixtures if no parameters provided
      const today = new Date().toISOString().split("T")[0]
      events = await getFixturesByDate(today)
    }

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error in fixtures endpoint:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
