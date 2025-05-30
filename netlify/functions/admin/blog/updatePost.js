const { connectToDatabase, getModels } = require('../../utils/db');
const { validateToken } = require('../../utils/auth');

/**
 * Update an existing blog post
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      },
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  // Ensure method is PUT
  if (event.httpMethod !== 'PUT') {
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
    const updates = JSON.parse(event.body);
    
    // Basic validation
    if (!updates.title || !updates.slug || !updates.content || !updates.excerpt) {
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
    
    // Check if post exists
    const existingPost = await BlogPost.findById(postId);
    if (!existingPost) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Blog post not found' }),
      };
    }
    
    // Check for duplicate slug (ignoring the current post)
    if (updates.slug !== existingPost.slug) {
      const duplicateSlug = await BlogPost.findOne({ 
        _id: { $ne: postId }, 
        slug: updates.slug 
      });
      
      if (duplicateSlug) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: 'A post with this slug already exists' }),
        };
      }
    }
    
    // Update the post
    updates.updatedAt = new Date();
    const updatedPost = await BlogPost.findByIdAndUpdate(
      postId,
      updates,
      { new: true }
    );
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Blog post updated successfully',
        post: updatedPost
      }),
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating blog post', error: error.message }),
    };
  }
};