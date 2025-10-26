import { NextResponse } from "next/server"
import { validateCronRequest } from "@/lib/utils/auth"
import { redisService } from "@/lib/services/redis-service"

export async function GET(request: Request) {
  if (!validateCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get cache stats before cleanup
    const beforeStats = await redisService.getStats()

    // Clean up expired keys
    await redisService.invalidateByPattern("*:stale:*")

    // Get cache stats after cleanup
    const afterStats = await redisService.getStats()

    return NextResponse.json({
      success: true,
      message: "Cache cleanup completed successfully",
      stats: {
        before: beforeStats,
        after: afterStats,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error during cache cleanup:", error)
    return NextResponse.json(
      {
        error: "Failed to cleanup cache",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
