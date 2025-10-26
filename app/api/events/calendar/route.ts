import { NextResponse } from "next/server"
import { getEventsByDate, getEventsByDateRange } from "@/lib/api/calendar-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const sport = searchParams.get("sport") || "all"

  try {
    let events = []

    // If date range is provided
    if (startDate && endDate) {
      events = await getEventsByDateRange(startDate, endDate, sport)
    }
    // If single date is provided
    else if (date) {
      events = await getEventsByDate(date, sport)
    }
    // Default to today
    else {
      const today = new Date().toISOString().split("T")[0]
      events = await getEventsByDate(today, sport)
    }

    return NextResponse.json({ events })
  } catch (error) {
    console.error(`Error in calendar events API:`, error)
    return NextResponse.json(
      {
        error: "Failed to fetch calendar events",
        events: [],
      },
      { status: 500 },
    )
  }
}
