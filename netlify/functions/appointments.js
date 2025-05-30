const axios = require('axios');

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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
  
  try {
    const apiClient = createApiClient();
    
    if (event.httpMethod === 'GET') {
      // Forward GET request for appointments availability
      const params = new URLSearchParams(event.queryStringParameters);
      const response = await apiClient.get(`/appointments?${params.toString()}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.data)
      };
    } else if (event.httpMethod === 'POST') {
      // Forward POST request for booking appointments
      const body = JSON.parse(event.body);
      const response = await apiClient.post('/appointments', body);
      
      return {
        statusCode: response.status || 201,
        headers,
        body: JSON.stringify(response.data)
      };
    }
    
    // Handle unsupported methods
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Allow': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
    
  } catch (error) {
    console.error('API Error:', error);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: error.response?.data?.error || 'Internal Server Error',
        details: error.message
      })
    };
  }
};