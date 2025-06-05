const rateLimit = {
  // In-memory store for rate limiting (in production, consider Redis)
  store: new Map(),
  
  // Clean expired entries every 5 minutes
  cleanup() {
    const now = Date.now()
    for (const [key, data] of this.store.entries()) {
      if (now > data.resetTime) {
        this.store.delete(key)
      }
    }
  },

  // Check rate limit for an IP address
  checkLimit(ipAddress, maxRequests = 100, windowMs = 60000) {
    const now = Date.now()
    const key = `rate_limit_${ipAddress}`
    
    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      this.cleanup()
    }
    
    let record = this.store.get(key)
    
    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      record = {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now
      }
      this.store.set(key, record)
      return {
        allowed: true,
        count: 1,
        remaining: maxRequests - 1,
        resetTime: record.resetTime
      }
    }
    
    record.count++
    this.store.set(key, record)
    
    const remaining = Math.max(0, maxRequests - record.count)
    
    return {
      allowed: record.count <= maxRequests,
      count: record.count,
      remaining,
      resetTime: record.resetTime
    }
  },

  // Middleware function for Netlify Functions
  middleware(maxRequests = 100, windowMs = 60000) {
    return (event) => {
      const ipAddress = event.headers['x-forwarded-for'] || 
                       event.headers['x-real-ip'] || 
                       event.headers['client-ip'] || 
                       'unknown'
      
      const result = this.checkLimit(ipAddress, maxRequests, windowMs)
      
      if (!result.allowed) {
        return {
          statusCode: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
          },
          body: JSON.stringify({
            error: 'Rate limit exceeded',
            message: `Too many requests. Limit: ${maxRequests} per ${windowMs / 1000} seconds.`,
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
          })
        }
      }
      
      return {
        allowed: true,
        headers: {
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
        }
      }
    }
  }
}

module.exports = { rateLimit }