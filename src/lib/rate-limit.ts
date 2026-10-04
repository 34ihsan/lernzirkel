export interface RateLimiterInfo {
  limit: number;
  remaining: number;
  success: boolean;
}

export class RateLimiter {
  private tokenCache = new Map<string, number[]>();
  private interval: number;
  private limit: number;

  constructor(options: { interval: number; limit: number }) {
    this.interval = options.interval;
    this.limit = options.limit;

    // Clean up old entries every minute to prevent memory leaks
    if (typeof setInterval !== "undefined") {
      setInterval(() => {
        const now = Date.now();
        for (const [ip, timestamps] of this.tokenCache.entries()) {
          const validTimestamps = timestamps.filter(
            (t) => now - t < this.interval
          );
          if (validTimestamps.length === 0) {
            this.tokenCache.delete(ip);
          } else {
            this.tokenCache.set(ip, validTimestamps);
          }
        }
      }, 60000).unref?.();
    }
  }

  check(limit: number, token: string): RateLimiterInfo {
    const now = Date.now();
    const timestamps = this.tokenCache.get(token) || [];
    
    // Filter timestamps within the interval window
    const validTimestamps = timestamps.filter((t) => now - t < this.interval);
    
    const isRateLimited = validTimestamps.length >= limit;
    
    if (!isRateLimited) {
      validTimestamps.push(now);
      this.tokenCache.set(token, validTimestamps);
    }
    
    return {
      limit,
      remaining: isRateLimited ? 0 : limit - validTimestamps.length,
      success: !isRateLimited,
    };
  }
}

const limiters = new Map<number, RateLimiter>();

/** Convenience helper: `limit` requests per `windowSeconds` per key (in-memory). */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimiterInfo> {
  let limiter = limiters.get(windowSeconds);
  if (!limiter) {
    limiter = new RateLimiter({ interval: windowSeconds * 1000, limit });
    limiters.set(windowSeconds, limiter);
  }
  return limiter.check(limit, key);
}
