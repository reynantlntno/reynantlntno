const nodemailer = require('nodemailer');
const axios = require('axios');

// Input validation
const validateInput = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name is too long (max 100 characters)');
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }
  
  if (!data.subject || data.subject.trim() === '') {
    errors.push('Subject is required');
  } else if (data.subject.length > 200) {
    errors.push('Subject is too long (max 200 characters)');
  }
  
  if (!data.message || data.message.trim() === '') {
    errors.push('Message is required');
  } else if (data.message.length > 5000) {
    errors.push('Message is too long (max 5000 characters)');
  }
  
  return errors;
};

// Sanitize inputs to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeData = (data) => {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
  };
};

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Rate limiting helper with in-memory storage (for demo purposes)
// In production, consider using a more robust solution like Redis
const RATE_LIMIT = 5; // 5 requests per IP
const RATE_WINDOW = 3600000; // 1 hour in milliseconds
const ipRequests = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  
  // Clean up old entries
  ipRequests.forEach((data, storedIp) => {
    if (now - data.timestamp > RATE_WINDOW) {
      ipRequests.delete(storedIp);
    }
  });
  
  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  const data = ipRequests.get(ip);
  if (data.count >= RATE_LIMIT) {
    return true;
  }
  
  // Increment count
  data.count += 1;
  return false;
};

// Create an axios instance for external API calls
const createApiClient = () => {
  if (!process.env.API_KEY) {
    console.error("Missing required environment variable: API_KEY");
  }
  
  return axios.create({
    baseURL: 'https://mabinianelamp.net/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.API_KEY
    }
  });
};

// Main function handler
exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
      ? '*' 
      : 'https://reynantlntno.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-KEY',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call successful' })
    };
  }
  
  // Only allow POST method for contact form
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Allow': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  
  try {
    const apiClient = createApiClient();
    const body = JSON.parse(event.body);
    
    // Forward the contact form submission to the API
    const response = await apiClient.post('/contact', body);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
    
  } catch (error) {
    console.error('Contact API Error:', error);
    
    // Handle validation errors separately
    if (error.response?.status === 400 && error.response?.data?.errors) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          errors: error.response.data.errors
        })
      };
    }
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: error.response?.data?.error || 'Failed to send message',
        details: error.message
      })
    };
  }
};