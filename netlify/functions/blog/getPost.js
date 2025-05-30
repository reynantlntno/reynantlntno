const { connectToDatabase, getModels } = require('../utils/db');

/**
 * Get a single blog post by slug
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
    const params = event.queryStringParameters || {};
    const { slug } = params;
    
    if (!slug) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Slug parameter is required' }),
      };
    }

    // Connect to database
    await connectToDatabase();
    const { BlogPost } = getModels();
    
    // Find the post
    const post = await BlogPost.findOne({
      slug,
      published: true
    }).lean();
    
    if (!post) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Blog post not found' }),
      };
    }
    
    // Get related posts by tags
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id }, // Exclude current post
      tags: { $in: post.tags },
      published: true
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title slug excerpt coverImage publishedAt')
      .lean();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify({
        post,
        relatedPosts
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