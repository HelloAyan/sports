import { type NextRequest, NextResponse } from "next/server"
import { redisService } from "@/lib/services/redis-service"

const CRON_SECRET = process.env.CRON_SECRET_TOKEN

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[Cron] Starting highlights update...")

    // Clear the cache to force fresh data
    try {
      await redisService.del("trending-highlights")
      console.log("[Cron] Cleared highlights cache")
    } catch (error) {
      console.warn("[Cron] Error clearing cache:", error)
    }

    // Trigger a fresh fetch by calling the highlights API
    const baseUrl = request.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/highlights?refresh=true&limit=10`, {
      headers: {
        "User-Agent": "Cron-Job/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Highlights API returned ${response.status}`)
    }

    const data = await response.json()
    console.log(`[Cron] Updated ${data.total} highlights`)

    return NextResponse.json({
      success: true,
      message: "Highlights updated successfully",
      count: data.total,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[Cron] Error updating highlights:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
