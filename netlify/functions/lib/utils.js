// Common utility functions for Netlify Functions

// Standard response formatter
export const createResponse = (statusCode, data, headers = {}) => {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
    ...headers
  }

  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(data)
  }
}

// Success response
export const successResponse = (data, message = 'Success', headers = {}) => {
  return createResponse(200, {
    success: true,
    message,
    data
  }, headers)
}

// Error response
export const errorResponse = (message, statusCode = 400, details = null, headers = {}) => {
  const errorData = {
    success: false,
    error: message
  }
  
  // Only include details in development or if explicitly provided
  if (details && (isDevelopment() || statusCode >= 400)) {
    errorData.details = details
  }
  
  return createResponse(statusCode, errorData, headers)
}

// Handle CORS preflight
export const handleCORS = (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'CORS preflight' }, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Max-Age': '86400'
    })
  }
  return null
}

// Parse request body with better error handling
export const parseBody = (event) => {
  try {
    if (!event.body) return {}
    
    // Handle base64 encoded body
    const body = event.isBase64Encoded ? 
      Buffer.from(event.body, 'base64').toString() : 
      event.body
    
    return JSON.parse(body)
  } catch (error) {
    if (isDevelopment()) {
      console.error('Body parse error:', error.message)
      console.error('Raw body:', event.body)
    }
    throw new Error('Invalid JSON in request body')
  }
}

// Extract query parameters
export const getQueryParams = (event) => {
  return event.queryStringParameters || {}
}

// Extract path parameters with improved debugging
export const getPathParams = (event) => {
  const path = event.path || event.rawUrl || ''
  
  if (isDevelopment()) {
    console.log('getPathParams - input path:', path)
    console.log('getPathParams - event keys:', Object.keys(event))
  }
  
  // Remove query string if present
  const cleanPath = path.split('?')[0]
  
  // Try multiple patterns:
  // 1. /.netlify/functions/FUNCTION_NAME/PARAM
  // 2. /api/FUNCTION_NAME/PARAM (for redirected requests)
  let match = cleanPath.match(/\/\.netlify\/functions\/([^\/]+)(?:\/(.+))?/)
  
  if (!match) {
    // Try the /api/ pattern
    match = cleanPath.match(/\/api\/([^\/]+)(?:\/(.+))?/)
  }
  
  if (match) {
    const functionName = match[1]
    const pathParam = match[2]
    
    if (isDevelopment()) {
      console.log('getPathParams - functionName:', functionName)
      console.log('getPathParams - pathParam:', pathParam)
    }
    
    if (pathParam) {
      // Handle nested paths (e.g., "1/images" -> just take "1")
      const primaryParam = pathParam.split('/')[0]
      
      // Check if it's numeric (ID) or string (slug)
      const isNumeric = /^\d+$/.test(primaryParam)
      
      return {
        id: isNumeric ? parseInt(primaryParam) : null,
        slug: !isNumeric ? primaryParam : null,
        pathParam: primaryParam,
        fullPath: pathParam,
        functionName: functionName
      }
    }
  }
  
  if (isDevelopment()) {
    console.log('getPathParams - no match found')
  }
  return {}
}

// Generate pagination metadata
export const getPaginationMeta = (currentPage, totalItems, itemsPerPage) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasNext = currentPage < totalPages
  const hasPrev = currentPage > 1

  return {
    currentPage: parseInt(currentPage),
    totalPages,
    totalItems: parseInt(totalItems),
    itemsPerPage: parseInt(itemsPerPage),
    hasNext,
    hasPrev,
    nextPage: hasNext ? currentPage + 1 : null,
    prevPage: hasPrev ? currentPage - 1 : null
  }
}

// Format date for MySQL
export const formatDateForDB = (date) => {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

// Format time for MySQL
export const formatTimeForDB = (time) => {
  if (!time) return null
  return time.includes(':') ? (time.split(':').length === 2 ? time + ':00' : time) : time + ':00:00'
}

// Calculate offset for pagination
export const calculateOffset = (page, limit) => {
  return (parseInt(page) - 1) * parseInt(limit)
}

// Validate pagination parameters
export const validatePagination = (page, limit) => {
  const p = parseInt(page) || 1
  const l = parseInt(limit) || 10

  return {
    page: Math.max(1, p),
    limit: Math.min(100, Math.max(1, l)) // Max 100 items per page
  }
}

// Generate slug from title
export const generateSlug = (title, existing = []) => {
  if (!title || typeof title !== 'string') return null

  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Handle empty slug
  if (!baseSlug) {
    baseSlug = 'untitled'
  }

  // Check for duplicates
  let slug = baseSlug
  let counter = 1

  while (existing.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// Convert tags array to JSON string for database
export const tagsToJSON = (tags) => {
  if (!tags) return null
  if (Array.isArray(tags)) {
    return JSON.stringify(tags.filter(Boolean))
  }
  if (typeof tags === 'string') {
    try {
      // Check if it's already JSON
      JSON.parse(tags)
      return tags
    } catch {
      // Convert CSV to JSON array
      return JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean))
    }
  }
  return null
}

// Convert JSON string to tags array
export const JSONToTags = (jsonString) => {
  if (!jsonString) return []
  try {
    const parsed = JSON.parse(jsonString)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Check if object has all required fields
export const hasRequiredFields = (obj, requiredFields) => {
  if (!obj || typeof obj !== 'object') return false
  return requiredFields.every(field => {
    const value = obj[field]
    return value !== null && value !== undefined && value !== ''
  })
}

// Remove undefined/null fields from object
export const cleanObject = (obj) => {
  if (!obj || typeof obj !== 'object') return {}
  
  const cleaned = {}
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value
    }
  })
  return cleaned
}

// Async wrapper for error handling with better debugging
export const asyncHandler = (fn) => {
  return async (event, context) => {
    const startTime = Date.now()
    
    try {
      // Handle CORS preflight
      const corsResponse = handleCORS(event)
      if (corsResponse) return corsResponse

      // Debug logging for development
      if (isDevelopment()) {
        console.log('=== REQUEST START ===')
        console.log('Function:', context.functionName)
        console.log('Method:', event.httpMethod)
        console.log('Path:', event.path)
        console.log('User Agent:', event.headers?.['user-agent'])
        console.log('==================')
      }

      const result = await fn(event, context)
      
      const responseTime = Date.now() - startTime
      
      // Add performance headers
      if (result.headers) {
        result.headers['X-Response-Time'] = `${responseTime}ms`
        
        if (isDevelopment()) {
          result.headers['X-Debug-Function'] = context.functionName
        }
      }
      
      if (isDevelopment()) {
        console.log(`Request completed in ${responseTime}ms`)
      }
      
      return result
    } catch (error) {
      const responseTime = Date.now() - startTime
      
      if (isDevelopment()) {
        console.error('=== FUNCTION ERROR ===')
        console.error('Function:', context.functionName)
        console.error('Error:', error.message)
        console.error('Stack:', error.stack)
        console.error('Response time:', `${responseTime}ms`)
        console.error('===================')
      } else {
        console.error('Function error:', error.message)
      }
      
      return errorResponse(
        'Internal server error',
        500,
        isDevelopment() ? {
          error: error.message,
          stack: error.stack,
          function: context.functionName
        } : null
      )
    }
  }
}

// Environment variable helpers
export const isProduction = () => process.env.NODE_ENV === 'production'
export const isDevelopment = () => process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production'

// Safe JSON parse
export const safeJSONParse = (str, defaultValue = null) => {
  if (!str || typeof str !== 'string') return defaultValue
  
  try {
    return JSON.parse(str)
  } catch (error) {
    if (isDevelopment()) {
      console.warn('JSON parse failed:', error.message)
    }
    return defaultValue
  }
}

// Normalize URL
export const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return null
  
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    return `https://${trimmedUrl}`
  }
  return trimmedUrl
}

// Sanitize HTML (basic)
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return ''
  
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

// Validate email format
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate URL format
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}