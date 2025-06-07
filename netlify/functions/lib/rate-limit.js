import { insertRecord, getCount, executeQuery } from './db.js'

// Rate limiting configuration
const RATE_LIMITS = {
  default: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  strict: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10
  },
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5
  },
  newsletter: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 3
  }
}

// Extract IP address from event
export const getClientIP = (event) => {
  return event.headers['x-forwarded-for']?.split(',')[0] ||
         event.headers['x-real-ip'] ||
         event.headers['cf-connecting-ip'] ||
         event.clientContext?.identity?.ip ||
         '127.0.0.1'
}

// Check rate limit for IP and endpoint
export const checkRateLimit = async (ip, endpoint, limitType = 'default') => {
  try {
    const limit = RATE_LIMITS[limitType] || RATE_LIMITS.default
    const windowStart = new Date(Date.now() - limit.windowMs)

    // Count requests in the current window
    const query = `
      SELECT COUNT(*) as count 
      FROM t_api_requests 
      WHERE ip_address = ? 
        AND endpoint = ? 
        AND created_at > ?
    `
    
    const result = await executeQuery(query, [ip, endpoint, windowStart])
    
    if (!result.success) {
      console.error('Rate limit check failed:', result.error)
      return { allowed: true } // Allow on error to prevent blocking
    }

    const requestCount = result.data[0]?.count || 0
    const allowed = requestCount < limit.maxRequests

    return {
      allowed,
      currentCount: requestCount,
      maxRequests: limit.maxRequests,
      windowMs: limit.windowMs,
      resetTime: new Date(Date.now() + limit.windowMs)
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    return { allowed: true } // Allow on error
  }
}

// Log API request
export const logRequest = async (ip, endpoint, statusCode, responseTime = null, apiKeyId = null, userAgent = null) => {
  try {
    await insertRecord('t_api_requests', {
      api_key_id: apiKeyId,
      endpoint,
      ip_address: ip,
      user_agent: userAgent,
      status_code: statusCode,
      response_time: responseTime
    })
  } catch (error) {
    console.error('Request logging error:', error)
  }
}

// Rate limiting middleware
export const rateLimitMiddleware = (limitType = 'default') => {
  return async (event) => {
    const ip = getClientIP(event)
    const endpoint = event.path || event.rawUrl
    const userAgent = event.headers['user-agent']

    const rateLimit = await checkRateLimit(ip, endpoint, limitType)

    if (!rateLimit.allowed) {
      // Log the blocked request
      await logRequest(ip, endpoint, 429, null, null, userAgent)

      return {
        statusCode: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil(rateLimit.windowMs / 1000),
          'X-RateLimit-Limit': rateLimit.maxRequests,
          'X-RateLimit-Remaining': 0,
          'X-RateLimit-Reset': rateLimit.resetTime?.toISOString() || new Date().toISOString()
        },
        body: JSON.stringify({
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: rateLimit.resetTime || new Date()
        })
      }
    }

    // Add rate limit headers to successful responses
    const remaining = rateLimit.maxRequests - rateLimit.currentCount - 1
    
    // Ensure resetTime exists, fallback to current time + windowMs
    const resetTime = rateLimit.resetTime || new Date(Date.now() + (rateLimit.windowMs || 900000))

    return {
      rateLimitHeaders: {
        'X-RateLimit-Limit': rateLimit.maxRequests,
        'X-RateLimit-Remaining': Math.max(0, remaining),
        'X-RateLimit-Reset': resetTime.toISOString()
      },
      ip,
      userAgent,
      endpoint
    }
  }
}

// Clean old request logs (call periodically)
export const cleanOldLogs = async (daysToKeep = 30) => {
  try {
    const cutoffDate = new Date(Date.now() - (daysToKeep * 24 * 60 * 60 * 1000))
    
    const query = 'DELETE FROM t_api_requests WHERE created_at < ?'
    const result = await executeQuery(query, [cutoffDate])
    
    return {
      success: result.success,
      deletedRows: result.data?.affectedRows || 0
    }
  } catch (error) {
    console.error('Log cleanup error:', error)
    return { success: false, error: error.message }
  }
}