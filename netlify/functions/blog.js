const { db } = require('./lib/db')
const { utils } = require('./lib/utils')
const { validation } = require('./lib/validation')
const { rateLimit } = require('./lib/rate-limit')
const { auth } = require('./lib/auth')

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = utils.handleCORS(event)
  if (corsResponse) return corsResponse

  // Rate limiting
  const rateLimitResult = rateLimit.middleware(100, 60000)(event)
  if (!rateLimitResult.allowed) return rateLimitResult

  const startTime = Date.now()
  
  try {
    const method = event.httpMethod
    const path = event.path.replace('/.netlify/functions/blog', '') || '/'
    const queryParams = utils.getQueryParams(event)
    
    let response
    
    switch (method) {
      case 'GET':
        if (path === '/' || path === '') {
          // Public endpoint - get blog posts list
          response = await getBlogPosts(queryParams)
        } else if (path.match(/^\/[a-z0-9\-]+$/)) {
          // Public endpoint - get single blog post by slug
          const slug = path.substring(1)
          response = await getBlogPostBySlug(slug)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'POST':
        // Admin endpoint - create new blog post
        const authResultPost = await auth.verifyMasterApiKey(event)
        if (!authResultPost.valid) {
          return utils.errorResponse(authResultPost.error, 401)
        }
        
        if (path === '/' || path === '') {
          response = await createBlogPost(utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'PUT':
        // Admin endpoint - update blog post
        const authResultPut = await auth.verifyMasterApiKey(event)
        if (!authResultPut.valid) {
          return utils.errorResponse(authResultPut.error, 401)
        }
        
        if (path.match(/^\/[a-z0-9\-]+$/)) {
          const slug = path.substring(1)
          response = await updateBlogPost(slug, utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'DELETE':
        // Admin endpoint - delete blog post
        const authResultDelete = await auth.verifyMasterApiKey(event)
        if (!authResultDelete.valid) {
          return utils.errorResponse(authResultDelete.error, 401)
        }
        
        if (path.match(/^\/[a-z0-9\-]+$/)) {
          const slug = path.substring(1)
          response = await deleteBlogPost(slug)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      default:
        response = utils.errorResponse(`Method ${method} not allowed`, 405)
    }
    
    // Add rate limit headers
    if (rateLimitResult.headers) {
      Object.assign(response.headers, rateLimitResult.headers)
    }
    
    // Log execution time
    const endTime = Date.now()
    console.log(`Blog function executed in ${endTime - startTime}ms`)
    
    return response
    
  } catch (error) {
    console.error('Blog function error:', error)
    return utils.errorResponse('Internal server error', 500)
  }
}

async function getBlogPosts(params) {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      tags = '',
      published = 'true',
      sortBy = 'published_at',
      sortOrder = 'desc'
    } = params
    
    const pageNum = parseInt(page)
    const limitNum = Math.min(parseInt(limit), 50) // Cap at 50
    const isPublished = published === 'true'
    
    let whereConditions = []
    let queryParams = []
    
    // Filter by published status (public endpoint only shows published)
    whereConditions.push('published = ?')
    queryParams.push(isPublished ? 1 : 0)
    
    // If showing published posts, also check published_at is not null and not in future
    if (isPublished) {
      whereConditions.push('published_at IS NOT NULL')
      whereConditions.push('published_at <= NOW()')
    }
    
    // Search functionality
    if (search) {
      whereConditions.push('(title LIKE ? OR summary LIKE ? OR content LIKE ?)')
      const searchTerm = `%${search}%`
      queryParams.push(searchTerm, searchTerm, searchTerm)
    }
    
    // Filter by tags
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      if (tagList.length > 0) {
        const tagConditions = tagList.map(() => 'JSON_CONTAINS(tags, ?, \'$\')').join(' OR ')
        whereConditions.push(`(${tagConditions})`)
        tagList.forEach(tag => {
          queryParams.push(`"${tag}"`)
        })
      }
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    // Validate sort parameters
    const validSortFields = ['id', 'title', 'published_at', 'created_at', 'updated_at', 'read_time']
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'published_at'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC'
    
    const orderClause = `ORDER BY ${validSortBy} ${validSortOrder}`
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM t_blog_posts ${whereClause}`
    const [{ total }] = await db.query(countQuery, queryParams)
    
    // Get posts
    const offset = (pageNum - 1) * limitNum
    const postsQuery = `
      SELECT id, slug, title, summary, image_url, published, published_at, 
             meta_title, meta_description, tags, read_time, created_at, updated_at
      FROM t_blog_posts 
      ${whereClause} 
      ${orderClause} 
      LIMIT ? OFFSET ?
    `
    
    const posts = await db.query(postsQuery, [...queryParams, limitNum, offset])
    
    // Parse JSON tags and format data
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      published: Boolean(post.published),
      read_time: post.read_time || utils.calculateReadTime(post.content || post.summary || '')
    }))
    
    const pagination = utils.generatePagination(pageNum, limitNum, total)
    
    // Get popular tags for metadata
    const popularTagsQuery = `
      SELECT tags FROM t_blog_posts 
      WHERE published = 1 AND published_at IS NOT NULL AND published_at <= NOW()
      AND tags IS NOT NULL
    `
    const taggedPosts = await db.query(popularTagsQuery)
    
    const allTags = new Set()
    taggedPosts.forEach(post => {
      if (post.tags) {
        try {
          const postTags = JSON.parse(post.tags)
          postTags.forEach(tag => allTags.add(tag))
        } catch (e) {
          // Skip invalid JSON
        }
      }
    })
    
    return utils.successResponse({
      posts: formattedPosts,
      pagination,
      meta: {
        total_posts: total,
        available_tags: Array.from(allTags).sort()
      }
    })
    
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return utils.errorResponse('Failed to fetch blog posts', 500)
  }
}

async function getBlogPostBySlug(slug) {
  try {
    if (!slug) {
      return utils.errorResponse('Blog post slug is required', 400)
    }
    
    if (!validation.isValidSlug(slug)) {
      return utils.errorResponse('Invalid slug format', 400)
    }
    
    const query = `
      SELECT id, slug, title, summary, content, image_url, published, published_at, 
             meta_title, meta_description, tags, read_time, created_at, updated_at
      FROM t_blog_posts 
      WHERE slug = ? AND published = 1 AND published_at IS NOT NULL AND published_at <= NOW()
    `
    
    const post = await db.queryOne(query, [slug])
    
    if (!post) {
      return utils.errorResponse('Blog post not found', 404)
    }
    
    // Format the post data
    const formattedPost = {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      published: Boolean(post.published),
      read_time: post.read_time || utils.calculateReadTime(post.content)
    }
    
    // Get related posts (same tags, exclude current post)
    let relatedPosts = []
    if (formattedPost.tags.length > 0) {
      const tagConditions = formattedPost.tags.map(() => 'JSON_CONTAINS(tags, ?, \'$\')').join(' OR ')
      const relatedQuery = `
        SELECT id, slug, title, summary, image_url, tags, published_at, read_time
        FROM t_blog_posts 
        WHERE id != ? AND published = 1 AND published_at IS NOT NULL AND published_at <= NOW()
        AND (${tagConditions})
        ORDER BY published_at DESC 
        LIMIT 3
      `
      
      const relatedParams = [post.id, ...formattedPost.tags.map(tag => `"${tag}"`)]
      relatedPosts = await db.query(relatedQuery, relatedParams)
      
      // Format related posts
      relatedPosts = relatedPosts.map(relatedPost => ({
        ...relatedPost,
        tags: relatedPost.tags ? JSON.parse(relatedPost.tags) : [],
        read_time: relatedPost.read_time || utils.calculateReadTime('')
      }))
    }
    
    return utils.successResponse({
      post: formattedPost,
      related_posts: relatedPosts
    })
    
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return utils.errorResponse('Failed to fetch blog post', 500)
  }
}

async function createBlogPost(postData) {
  try {
    // Validate blog post data
    const validationResult = validation.validateBlogPost(postData)
    if (!validationResult.isValid) {
      return utils.errorResponse('Validation failed', 400, validationResult.errors)
    }
    
    const { title, slug, summary, content, image_url, published = false, meta_title, meta_description, tags = [] } = postData
    
    // Check if slug already exists
    const existingPost = await db.queryOne(
      'SELECT id FROM t_blog_posts WHERE slug = ?',
      [slug]
    )
    
    if (existingPost) {
      return utils.errorResponse('A blog post with this slug already exists', 409)
    }
    
    // Calculate read time
    const readTime = utils.calculateReadTime(content)
    
    // Prepare data for insertion
    const insertData = {
      title: validation.sanitizeString(title),
      slug: validation.sanitizeString(slug),
      summary: summary ? validation.sanitizeString(summary) : null,
      content: validation.sanitizeString(content),
      image_url: image_url || null,
      published: Boolean(published),
      published_at: published ? new Date() : null,
      meta_title: meta_title ? validation.sanitizeString(meta_title) : null,
      meta_description: meta_description ? validation.sanitizeString(meta_description) : null,
      tags: Array.isArray(tags) && tags.length > 0 ? JSON.stringify(tags) : null,
      read_time: readTime,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    // Insert blog post
    const postId = await db.insert('t_blog_posts', insertData)
    
    // Fetch the created post
    const createdPost = await db.queryOne(
      'SELECT * FROM t_blog_posts WHERE id = ?',
      [postId]
    )
    
    // Format response
    const formattedPost = {
      ...createdPost,
      tags: createdPost.tags ? JSON.parse(createdPost.tags) : [],
      published: Boolean(createdPost.published)
    }
    
    return utils.successResponse({
      message: 'Blog post created successfully',
      post: formattedPost
    }, 201)
    
  } catch (error) {
    console.error('Error creating blog post:', error)
    return utils.errorResponse('Failed to create blog post', 500)
  }
}

async function updateBlogPost(slug, updateData) {
  try {
    if (!slug) {
      return utils.errorResponse('Blog post slug is required', 400)
    }
    
    // Check if blog post exists
    const existingPost = await db.queryOne(
      'SELECT id, slug, published FROM t_blog_posts WHERE slug = ?',
      [slug]
    )
    
    if (!existingPost) {
      return utils.errorResponse('Blog post not found', 404)
    }
    
    // Validate allowed fields
    const allowedFields = ['title', 'slug', 'summary', 'content', 'image_url', 'published', 'meta_title', 'meta_description', 'tags']
    const sanitizedData = utils.sanitizeData(updateData, allowedFields)
    
    if (Object.keys(sanitizedData).length === 0) {
      return utils.errorResponse('No valid fields to update', 400)
    }
    
    // Validate the update data if provided
    if (sanitizedData.title || sanitizedData.slug || sanitizedData.content) {
      const validationData = {
        title: sanitizedData.title || 'existing',
        slug: sanitizedData.slug || existingPost.slug,
        content: sanitizedData.content || 'existing'
      }
      
      const validationResult = validation.validateBlogPost(validationData)
      if (!validationResult.isValid) {
        return utils.errorResponse('Validation failed', 400, validationResult.errors)
      }
    }
    
    // Check slug uniqueness if slug is being updated
    if (sanitizedData.slug && sanitizedData.slug !== existingPost.slug) {
      const slugExists = await db.queryOne(
        'SELECT id FROM t_blog_posts WHERE slug = ? AND id != ?',
        [sanitizedData.slug, existingPost.id]
      )
      
      if (slugExists) {
        return utils.errorResponse('A blog post with this slug already exists', 409)
      }
    }
    
    // Handle published status change
    if (sanitizedData.published !== undefined) {
      if (sanitizedData.published && !existingPost.published) {
        // Publishing the post - set published_at to now
        sanitizedData.published_at = new Date()
      } else if (!sanitizedData.published && existingPost.published) {
        // Unpublishing the post - clear published_at
        sanitizedData.published_at = null
      }
    }
    
    // Handle tags
    if (sanitizedData.tags !== undefined) {
      if (Array.isArray(sanitizedData.tags)) {
        sanitizedData.tags = sanitizedData.tags.length > 0 ? JSON.stringify(sanitizedData.tags) : null
      } else {
        delete sanitizedData.tags // Invalid format, ignore
      }
    }
    
    // Calculate new read time if content is updated
    if (sanitizedData.content) {
      sanitizedData.read_time = utils.calculateReadTime(sanitizedData.content)
    }
    
    // Set updated timestamp
    sanitizedData.updated_at = new Date()
    
    // Update blog post
    await db.update('t_blog_posts', sanitizedData, 'id = ?', [existingPost.id])
    
    // Fetch updated blog post
    const updatedPost = await db.queryOne(
      'SELECT * FROM t_blog_posts WHERE id = ?',
      [existingPost.id]
    )
    
    // Format response
    const formattedPost = {
      ...updatedPost,
      tags: updatedPost.tags ? JSON.parse(updatedPost.tags) : [],
      published: Boolean(updatedPost.published)
    }
    
    return utils.successResponse({
      message: 'Blog post updated successfully',
      post: formattedPost
    })
    
  } catch (error) {
    console.error('Error updating blog post:', error)
    return utils.errorResponse('Failed to update blog post', 500)
  }
}

async function deleteBlogPost(slug) {
  try {
    if (!slug) {
      return utils.errorResponse('Blog post slug is required', 400)
    }
    
    // Check if blog post exists
    const post = await db.queryOne(
      'SELECT id, title, slug FROM t_blog_posts WHERE slug = ?',
      [slug]
    )
    
    if (!post) {
      return utils.errorResponse('Blog post not found', 404)
    }
    
    // Delete blog post
    const deleteResult = await db.delete('t_blog_posts', 'id = ?', [post.id])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete blog post', 500)
    }
    
    return utils.successResponse({
      message: 'Blog post deleted successfully',
      deleted_post: {
        id: post.id,
        title: post.title,
        slug: post.slug
      }
    })
    
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return utils.errorResponse('Failed to delete blog post', 500)
  }
}