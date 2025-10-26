import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { verifyApiKey } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Check for valid API key if not an internal route
    if (!request.nextUrl.pathname.startsWith("/api/cron")) {
      const apiKey = request.headers.get("x-api-key")
      if (apiKey && !verifyApiKey(apiKey)) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      }
    }

    // Apply rate limiting
    try {
      const { success, limit, remaining, reset } = await rateLimit(request)

      if (!success) {
        return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
          status: 429,
          headers: {
            "content-type": "application/json",
            "x-ratelimit-limit": limit.toString(),
            "x-ratelimit-remaining": remaining.toString(),
            "x-ratelimit-reset": reset.toString(),
          },
        })
      }
    } catch {
      console.error("Rate limiting failed")
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

  return response
}

export const config = {
  matcher: "/api/:path*",
}
