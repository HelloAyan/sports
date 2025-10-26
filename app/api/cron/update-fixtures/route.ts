import { NextResponse } from "next/server"
import { validateCronRequest } from "@/lib/utils/auth"
import { redisService } from "@/lib/services/redis-service"
import { getFixturesByDate } from "@/lib/sports-db"

export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Fetch fresh fixtures data directly from TheSportsDB
    const fixtures = await getFixturesByDate(today)

    // Update cache with new data
    await redisService.set("fixtures:today", fixtures, {
      ttl: 300, // 5 minutes
      tags: ["fixtures"],
    })

    return NextResponse.json({
      success: true,
      message: "Fixtures cache updated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating fixtures cache:", error)
    return NextResponse.json(
      {
        error: "Failed to update fixtures cache",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
