import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET() {
  try {
    // Simple ping to check Redis connection
    await redis.ping()
    return NextResponse.json({ status: "healthy" })
  } catch (error) {
    console.error("Redis health check failed:", error)
    return NextResponse.json({ status: "unhealthy", error: "Redis connection failed" }, { status: 500 })
  }
}
