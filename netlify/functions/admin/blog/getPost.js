const { connectToDatabase, getModels } = require('../../utils/db');
const { validateToken } = require('../../utils/auth');

/**
 * Get a single blog post by ID for admin editing
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

  // Verify authentication
  const authResult = validateToken(event.headers);
  if (!authResult.isValid) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: authResult.message || 'Unauthorized' }),
    };
  }

  try {
    const postId = event.path.split('/').pop();

    await connectToDatabase();
    const { BlogPost } = getModels();
    
    // Find the post by ID
    const post = await BlogPost.findById(postId);
    
    if (!post) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Blog post not found' }),
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        post
      }),
    };
  } catch (error) {
    console.error('Error retrieving blog post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving blog post', error: error.message }),
    };
  }
};