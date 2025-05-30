const { connectToDatabase, getModels } = require('../utils/db');

/**
 * Get all published blog posts
 * @param {Object} event - Netlify Function event
 * @returns {Promise<Object>} HTTP response
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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
    // Connect to database
    await connectToDatabase();
    const { BlogPost } = getModels();
    
    // Get query parameters
    const params = event.queryStringParameters || {};
    const { featured, limit = 10, page = 1, tag } = params;
    
    // Build query
    const query = { published: true };
    
    // Add filters
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title slug excerpt author coverImage tags publishedAt featured')
      .lean();
    
    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify({
        posts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }),
    };
  } catch (error) {
    console.error('Error retrieving blog posts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving blog posts', error: error.message }),
    };
  }
};