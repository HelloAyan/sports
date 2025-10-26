import { NextResponse } from "next/server"
import redis from "@/lib/redis"
import { getAllLeagues, getFixturesByDate, getLiveEvents } from "@/lib/sports-db"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Update fixtures cache
    const fixtures = await getFixturesByDate(today)
    await redis.set("fixtures:all", JSON.stringify(fixtures), "EX", 300)

    // Update leagues cache
    const leagues = await getAllLeagues()
    await redis.set("leagues:all", JSON.stringify(leagues), "EX", 3600)

    // Update live events cache
    const liveEvents = await getLiveEvents()
    await redis.set("live-events:all", JSON.stringify(liveEvents), "EX", 30)

    return NextResponse.json({ message: "Cache updated successfully" })
  } catch (error) {
    console.error("Error updating cache:", error)
    return NextResponse.json({ error: "Failed to update cache" }, { status: 500 })
  }
}
