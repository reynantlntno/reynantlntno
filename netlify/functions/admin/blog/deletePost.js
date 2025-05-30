const { connectToDatabase, getModels } = require('../../utils/db');
const { validateToken } = require('../../utils/auth');

/**
 * Delete a blog post
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  // Ensure method is DELETE
  if (event.httpMethod !== 'DELETE') {
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
    
    // Check if post exists
    const existingPost = await BlogPost.findById(postId);
    if (!existingPost) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Blog post not found' }),
      };
    }
    
    // Delete the post
    await BlogPost.findByIdAndDelete(postId);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Blog post deleted successfully'
      }),
    };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error deleting blog post', error: error.message }),
    };
  }
};