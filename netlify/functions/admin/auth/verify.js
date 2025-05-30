const { validateToken } = require('../../utils/auth');

/**
 * Verify the authentication token
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  // Ensure method is GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const authResult = validateToken(event.headers);
    
    if (!authResult.isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: authResult.message || 'Unauthorized' }),
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Token is valid',
        user: authResult.user
      }),
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error verifying token', error: error.message }),
    };
  }
};