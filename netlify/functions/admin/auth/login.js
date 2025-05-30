const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utils/auth');
require('dotenv').config();

/**
 * Admin login endpoint
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  // Ensure method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);
    
    // Check if environment variables are defined
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
      console.error('Admin credentials not properly configured in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Server configuration error' }),
      };
    }
    
    // Validate credentials
    if (username !== process.env.ADMIN_USERNAME) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }
    
    // Compare password with bcrypt hash
    const passwordMatches = await bcrypt.compare(
      password, 
      process.env.ADMIN_PASSWORD_HASH
    );
    
    if (!passwordMatches) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }
    
    // Generate JWT token
    const token = generateToken({
      username: username,
      role: 'admin'
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Login successful',
        token,
        user: {
          username,
          role: 'admin'
        }
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error during login', error: error.message }),
    };
  }
};