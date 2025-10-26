// Create a rate limiter to ensure we don't exceed TheSportsDB API limits
export class ApiRateLimiter {
  private callLog: number[] = []
  private readonly maxCallsPerMinute: number

  constructor(maxCallsPerMinute = 90) {
    // Set to 90 to leave some buffer below the 100 calls per minute limit
    this.maxCallsPerMinute = maxCallsPerMinute
  }

  canMakeCall(): boolean {
    const now = Date.now()
    // Remove calls older than 1 minute
    this.callLog = this.callLog.filter((timestamp) => now - timestamp < 60000)
    // Check if we're under the limit
    return this.callLog.length < this.maxCallsPerMinute
  }

  logCall(): void {
    this.callLog.push(Date.now())
  }

  getRemainingCalls(): number {
    const now = Date.now()
    // Remove calls older than 1 minute
    this.callLog = this.callLog.filter((timestamp) => now - timestamp < 60000)
    return this.maxCallsPerMinute - this.callLog.length
  }

  getTimeUntilNextAvailable(): number {
    if (this.canMakeCall()) return 0

    const now = Date.now()
    const oldestCall = Math.min(...this.callLog)
    return 60000 - (now - oldestCall)
  }
}

// Create a singleton instance
export const apiRateLimiter = new ApiRateLimiter()
