import { getOne, updateRecord } from './db.js'
import { createHash } from 'crypto'

// Validate API key
export const validateApiKey = async (apiKey) => {
  if (!apiKey) {
    return { valid: false, error: 'API key required' }
  }

  try {
    // Check if it's the master key first
    if (apiKey === process.env.API_SECRET_KEY) {
      return {
        valid: true,
        keyId: 'master',
        scopes: { '*': true }, // Master key has all permissions
        name: 'Master Key'
      }
    }

    // Hash the API key for database comparison
    const hashedKey = createHash('sha256').update(apiKey).digest('hex')
    
    const keyRecord = await getOne('t_api_keys', { 
      key_value: hashedKey,
      is_active: 1 
    })

    if (!keyRecord) {
      return { valid: false, error: 'Invalid API key' }
    }

    // Check expiration
    if (keyRecord.expires_at && new Date() > new Date(keyRecord.expires_at)) {
      return { valid: false, error: 'API key expired' }
    }

    // Update last used timestamp (skip for master key)
    await updateRecord('t_api_keys', 
      { last_used_at: new Date() }, 
      { id: keyRecord.id }
    )

    return { 
      valid: true, 
      keyId: keyRecord.id,
      scopes: JSON.parse(keyRecord.scopes || '{}'),
      name: keyRecord.name
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Authentication failed' }
  }
}

// Check if API key has required scope
export const hasScope = (scopes, requiredScope) => {
  if (!scopes || typeof scopes !== 'object') return false
  
  // Support for wildcard scope
  if (scopes['*'] === true) return true
  
  // Check specific scope
  return scopes[requiredScope] === true
}

// Extract API key from request headers
export const extractApiKey = (event) => {
  return event.headers['x-api-key'] || 
         event.headers['X-API-Key'] || 
         event.headers['authorization']?.replace('Bearer ', '')
}

// Middleware for API key authentication
export const requireAuth = (requiredScope = null) => {
  return async (event) => {
    const apiKey = extractApiKey(event)
    
    if (!apiKey) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'API key required'
        })
      }
    }

    const authResult = await validateApiKey(apiKey)
    
    if (!authResult.valid) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: authResult.error
        })
      }
    }

    // Check scope if required
    if (requiredScope && !hasScope(authResult.scopes, requiredScope)) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Insufficient permissions'
        })
      }
    }

    return authResult
  }
}