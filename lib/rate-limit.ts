import { redis } from "@/lib/redis"

export async function rateLimit(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous"
  const key = `ratelimit:${ip}`
  const limit = 100 // requests
  const window = 60 * 60 // 1 hour in seconds

  const current = await redis.get(key)
  const count = current ? Number.parseInt(current, 10) : 0

  if (count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: await redis.ttl(key),
    }
  }

  await redis.set(key, (count + 1).toString(), "EX", window)

  return {
    success: true,
    limit,
    remaining: limit - (count + 1),
    reset: window,
  }
}
