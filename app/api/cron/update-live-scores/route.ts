import { NextResponse } from "next/server"
import { validateCronRequest } from "@/lib/utils/auth"
import { redisService } from "@/lib/services/redis-service"
import { getLiveEvents } from "@/lib/sports-db"

// Track API calls to stay within limits
let apiCallsTimestamps = [] as number[]
const API_CALL_WINDOW = 60 * 1000 // 1 minute
const API_CALL_LIMIT = 90 // Leave some buffer below 100

function canMakeApiCall() {
  const now = Date.now()
  // Remove timestamps older than the window
  apiCallsTimestamps = apiCallsTimestamps.filter((ts) => now - ts < API_CALL_WINDOW)
  // Check if we're under the limit
  return apiCallsTimestamps.length < API_CALL_LIMIT
}

function trackApiCall() {
  apiCallsTimestamps.push(Date.now())
}

export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if we can make an API call
  if (!canMakeApiCall()) {
    return NextResponse.json({
      success: false,
      message: "API call limit reached, skipping update",
      timestamp: new Date().toISOString(),
    })
  }

  try {
    // Track this API call
    trackApiCall()

    // Get live events
    const liveScores = await getLiveEvents()

    // Update cache with new data
    await redisService.set("live-scores", liveScores, {
      ttl: 30, // 30 seconds for live scores
      tags: ["live-scores"],
    })

    return NextResponse.json({
      success: true,
      message: "Live scores cache updated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating live scores cache:", error)
    return NextResponse.json(
      {
        error: "Failed to update live scores cache",
        message: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 200 }, // Return 200 even on error to prevent cron job failures
    )
  }
}
