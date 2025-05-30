const bcrypt = require('bcryptjs');

/**
 * Utility to generate password hash for admin setup
 * For security, this should be used once during setup and then disabled/removed
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  // Verify admin API key to restrict access to this endpoint
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.ADMIN_API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' })
    };
  }

  try {
    const { password } = JSON.parse(event.body);
    
    if (!password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Password is required' }),
      };
    }
    
    // Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        hash: hashedPassword
      }),
    };
  } catch (error) {
    console.error('Hash generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating hash', error: error.message }),
    };
  }
};