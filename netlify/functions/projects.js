import axios from 'axios';

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

// Main function handler - using ES module export
export const handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
      ? '*' 
      : 'https://reynantlntno.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-KEY',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
  
  // Only allow GET method for projects
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        ...headers,
        'Allow': 'GET, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  
  try {
    const apiClient = createApiClient();
    
    // Determine if this is a request for a specific project or for a list
    const path = event.path;
    const isSingleProject = path.match(/\/projects\/([^\/]+)$/);
    
    if (isSingleProject) {
      // Get a single project
      const slug = path.split('/').pop();
      const response = await apiClient.get(`/projects/${slug}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.data)
      };
    } else {
      // Get a list of projects with query params
      const params = new URLSearchParams(event.queryStringParameters);
      const response = await apiClient.get(`/projects?${params.toString()}`);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.data)
      };
    }
  } catch (error) {
    console.error('Projects API Error:', error);
    
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: error.response?.data?.error || 'Failed to fetch projects',
        details: error.message
      })
    };
  }
};