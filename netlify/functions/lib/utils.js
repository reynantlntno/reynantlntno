const utils = {
  // Standard API response formatter
  formatResponse(data = null, error = null, statusCode = 200) {
    const response = {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({
        success: !error,
        data,
        error,
        timestamp: new Date().toISOString()
      })
    }
    
    return response
  },

  // Error response helper
  errorResponse(message, statusCode = 400, details = null) {
    return this.formatResponse(null, {
      message,
      details,
      code: statusCode
    }, statusCode)
  },

  // Success response helper
  successResponse(data = null, statusCode = 200) {
    return this.formatResponse(data, null, statusCode)
  },

  // Handle CORS preflight requests
  handleCORS(event) {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: ''
      }
    }
    return null
  },

  // Parse request body safely
  parseRequestBody(event) {
    try {
      return event.body ? JSON.parse(event.body) : {}
    } catch (error) {
      throw new Error('Invalid JSON in request body')
    }
  },

  // Extract query parameters
  getQueryParams(event) {
    return event.queryStringParameters || {}
  },

  // Get client IP address
  getClientIP(event) {
    return event.headers['x-forwarded-for'] || 
           event.headers['x-real-ip'] || 
           event.headers['client-ip'] || 
           'unknown'
  },

  // Get user agent
  getUserAgent(event) {
    return event.headers['user-agent'] || 'unknown'
  },

  // Generate pagination metadata
  generatePagination(page, limit, total) {
    const totalPages = Math.ceil(total / limit)
    
    return {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    }
  },

  // Calculate read time for content
  calculateReadTime(content) {
    if (!content) return 0
    
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  },

  // Generate unique reference code
  generateReferenceCode() {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `REF-${timestamp}-${random}`.toUpperCase()
  },

  // Sanitize data for database insertion
  sanitizeData(data, allowedFields = []) {
    const sanitized = {}
    
    allowedFields.forEach(field => {
      if (data.hasOwnProperty(field)) {
        if (typeof data[field] === 'string') {
          sanitized[field] = data[field].trim()
        } else {
          sanitized[field] = data[field]
        }
      }
    })
    
    return sanitized
  },

  // Log function execution time
  async executeWithTiming(fn, label = 'Function') {
    const startTime = Date.now()
    
    try {
      const result = await fn()
      const endTime = Date.now()
      console.log(`${label} executed in ${endTime - startTime}ms`)
      return result
    } catch (error) {
      const endTime = Date.now()
      console.error(`${label} failed after ${endTime - startTime}ms:`, error)
      throw error
    }
  },

  // Validate required environment variables
  validateEnvVars(requiredVars = []) {
    const missing = requiredVars.filter(varName => !process.env[varName])
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  },

  // Format date for MySQL
  formatDateForSQL(date) {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ')
  },

  // Parse JSON safely
  safeJsonParse(str, defaultValue = null) {
    try {
      return JSON.parse(str)
    } catch (error) {
      return defaultValue
    }
  },

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }
}

module.exports = { utils }