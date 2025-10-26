import { redis } from "@/lib/redis"

export type CacheOptions = {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for grouped invalidation
}

export class RedisService {
  private static instance: RedisService

  private constructor() {}

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key)
    if (!data) return null
    return JSON.parse(data) as T
  }

  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const { ttl = 3600, tags = [] } = options

    await redis.set(key, JSON.stringify(value), "EX", ttl)

    // Store cache tags for grouped invalidation
    if (tags.length > 0) {
      await Promise.all(tags.map((tag) => redis.sadd(`cache:tags:${tag}`, key)))
    }
  }

  async invalidate(key: string): Promise<void> {
    await redis.del(key)
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = await redis.smembers(`cache:tags:${tag}`)
    if (keys.length > 0) {
      await redis.del(...keys, `cache:tags:${tag}`)
    }
  }

  async invalidateByPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }

  // Health check method
  async ping(): Promise<boolean> {
    try {
      const response = await redis.ping()
      return response === "PONG"
    } catch (error) {
      console.error("Redis health check failed:", error)
      return false
    }
  }

  // Get cache stats
  async getStats(): Promise<{
    keys: number
    memory: string
    hitRate?: number
  }> {
    try {
      const info = await redis.info()
      const dbSize = await redis.dbsize()

      // Extract memory usage from info string
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/)
      const memory = memoryMatch ? memoryMatch[1].trim() : "0"

      return {
        keys: dbSize,
        memory,
      }
    } catch (error) {
      console.error("Failed to get Redis stats:", error)
      return {
        keys: 0,
        memory: "0",
      }
    }
  }
}

// Export a singleton instance
export const redisService = RedisService.getInstance()
