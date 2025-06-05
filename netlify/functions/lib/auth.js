const jwt = require('jsonwebtoken')
const { db } = require('./db')

const auth = {
  // Verify API key
  async verifyApiKey(apiKey) {
    if (!apiKey) {
      return { valid: false, error: 'API key is required' }
    }

    try {
      const keyData = await db.queryOne(
        'SELECT * FROM t_api_keys WHERE key_value = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > NOW())',
        [apiKey]
      )

      if (!keyData) {
        return { valid: false, error: 'Invalid or expired API key' }
      }

      // Update last used timestamp
      await db.update('t_api_keys', { last_used_at: new Date() }, 'id = ?', [keyData.id])

      return {
        valid: true,
        keyData: {
          id: keyData.id,
          name: keyData.name,
          scopes: JSON.parse(keyData.scopes || '{}')
        }
      }
    } catch (error) {
      console.error('API key verification error:', error)
      return { valid: false, error: 'Authentication error' }
    }
  },

  // Verify master API key from environment
  async verifyMasterApiKey(event) {
    const masterKey = process.env.MASTER_API_KEY
    
    if (!masterKey) {
      console.error('MASTER_API_KEY not configured in environment')
      return { valid: false, error: 'Server configuration error' }
    }

    // Get API key from headers
    const providedKey = event.headers['x-api-key'] || 
                       event.headers['X-API-Key'] || 
                       event.headers['authorization']?.replace('Bearer ', '')

    if (!providedKey) {
      return { valid: false, error: 'API key is required for this operation' }
    }

    if (providedKey !== masterKey) {
      return { valid: false, error: 'Invalid API key' }
    }

    return {
      valid: true,
      keyData: {
        id: 'master',
        name: 'Master API Key',
        scopes: { admin: true }
      }
    }
  },

  // Check if API key has required scope
  hasScope(keyData, requiredScope) {
    if (!keyData || !keyData.scopes) {
      return false
    }

    const scopes = keyData.scopes
    
    // Check for admin scope (full access)
    if (scopes.admin === true) {
      return true
    }

    // Check specific scope
    return scopes[requiredScope] === true
  },

  // Generate JWT token (for internal use)
  generateToken(payload, expiresIn = '1h') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
  },

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return null
    }
  },

  // Log API request
  async logRequest(apiKeyId, endpoint, ipAddress, userAgent, statusCode, responseTime) {
    try {
      await db.insert('t_api_requests', {
        api_key_id: apiKeyId === 'master' ? null : apiKeyId,
        endpoint,
        ip_address: ipAddress,
        user_agent: userAgent,
        status_code: statusCode,
        response_time: responseTime,
        created_at: new Date()
      })
    } catch (error) {
      console.error('Error logging API request:', error)
    }
  }
}

module.exports = { auth }