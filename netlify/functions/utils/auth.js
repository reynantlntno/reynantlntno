const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate a JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '24h' }
  );
};

/**
 * Validate authentication token from request headers
 * @param {Object} headers - Request headers
 * @returns {Object} Validation result
 */
const validateToken = (headers) => {
  try {
    const authHeader = headers.authorization || headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isValid: false, message: 'Missing or invalid authorization header' };
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return { isValid: false, message: 'Invalid token' };
    }
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return { 
      isValid: true,
      user: {
        username: decoded.username
      }
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { isValid: false, message: 'Token has expired' };
    }
    
    if (error.name === 'JsonWebTokenError') {
      return { isValid: false, message: 'Invalid token' };
    }
    
    console.error('Error validating token:', error);
    return { isValid: false, message: 'Error validating token' };
  }
};

module.exports = {
  generateToken,
  validateToken
};