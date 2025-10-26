// Simple in-memory cache as fallback when Redis is not available
class MemoryCache {
  private cache = new Map<string, { value: any; expiry: number | null }>()

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key)
    if (!item) return null
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key)
      return null
    }
    return item.value
  }

  async set(key: string, value: any, expiryMode?: string, time?: number): Promise<"OK"> {
    let expiry: number | null = null

    if (expiryMode === "EX" && time) {
      expiry = Date.now() + time * 1000
    }

    this.cache.set(key, { value, expiry })
    return "OK"
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0
    for (const key of keys) {
      if (this.cache.delete(key)) count++
    }
    return count
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(pattern.replace("*", ".*"))
    return Array.from(this.cache.keys()).filter((key) => regex.test(key))
  }

  async ttl(key: string): Promise<number> {
    const item = this.cache.get(key)
    if (!item) return -2
    if (!item.expiry) return -1
    return Math.max(0, Math.floor((item.expiry - Date.now()) / 1000))
  }

  async ping(): Promise<string> {
    return "PONG"
  }

  async dbsize(): Promise<number> {
    return this.cache.size
  }

  async smembers(key: string): Promise<string[]> {
    const item = this.cache.get(key)
    return item?.value || []
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    const item = this.cache.get(key)
    const set = new Set(item?.value || [])
    let added = 0

    for (const member of members) {
      if (!set.has(member)) {
        set.add(member)
        added++
      }
    }

    this.cache.set(key, {
      value: Array.from(set),
      expiry: item?.expiry || null,
    })

    return added
  }

  async info(): Promise<string> {
    return `used_memory_human:${(JSON.stringify(this.cache).length / 1024).toFixed(2)}kb`
  }
}

// Create a Redis client or use memory cache fallback
const redis = new MemoryCache()

export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttl = 60): Promise<T> {
  try {
    const cachedData = await redis.get(key)
    if (cachedData) {
      return JSON.parse(cachedData) as T
    }

    const freshData = await fetchFn()
    await redis.set(key, JSON.stringify(freshData), "EX", ttl)
    return freshData
  } catch (error) {
    console.error("Cache operation failed:", error)
    // If cache fails, fall back to fresh data
    return fetchFn()
  }
}

export async function setCachedData<T>(key: string, data: T, ttl = 60): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl)
  } catch (error) {
    console.error("Failed to set cache:", error)
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("Failed to invalidate cache:", error)
  }
}

export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error("Failed to invalidate pattern:", error)
  }
}

export { redis }
export default redis
