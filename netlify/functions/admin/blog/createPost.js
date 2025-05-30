const { connectToDatabase, getModels } = require('../../utils/db');
const { validateToken } = require('../../utils/auth');

/**
 * Create a new blog post
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

  // Ensure method is POST
  if (event.httpMethod !== 'POST') {
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
    const postData = JSON.parse(event.body);
    
    // Basic validation
    if (!postData.title || !postData.slug || !postData.content || !postData.excerpt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Missing required fields', 
          required: ['title', 'slug', 'content', 'excerpt']
        }),
      };
    }

    await connectToDatabase();
    const { BlogPost } = getModels();
    
    // Check for duplicate slug
    const existingPost = await BlogPost.findOne({ slug: postData.slug });
    if (existingPost) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'A post with this slug already exists' }),
      };
    }
    
    // Create new blog post
    const newPost = new BlogPost({
      ...postData,
      publishedAt: new Date()
    });
    
    await newPost.save();
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Blog post created successfully',
        post: newPost
      }),
    };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating blog post', error: error.message }),
    };
  }
};