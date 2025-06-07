import { getMany, getOne, getCount, executeQuery, insertRecord, updateRecord, deleteRecord } from './lib/db.js'
import { asyncHandler, successResponse, errorResponse, getQueryParams, getPathParams, parseBody, getPaginationMeta, validatePagination, JSONToTags, tagsToJSON, generateSlug } from './lib/utils.js'
import { rateLimitMiddleware } from './lib/rate-limit.js'
import { requireAuth } from './lib/auth.js'
import { validateData, schemas, calculateReadingTime } from './lib/validation.js'

const handler = asyncHandler(async (event, context) => {
  // Apply rate limiting
  const rateLimit = await rateLimitMiddleware('default')(event)
  if (rateLimit.statusCode) return rateLimit

  const { httpMethod } = event
  const pathParams = getPathParams(event)
  const queryParams = getQueryParams(event)

  try {
    // PUBLIC GET OPERATIONS (No authentication required)
    if (httpMethod === 'GET') {
      const { admin } = queryParams

      // Admin get operations require authentication
      if (admin) {
        const authResult = await requireAuth('blog')(event)
        if (authResult.statusCode) return authResult

        const { status, limit, offset } = queryParams
        
        // Get all posts including drafts (admin view)
        let conditions = {}
        if (status === 'published') conditions.published = 1
        if (status === 'draft') conditions.published = 0

        const posts = await getMany('t_blog_posts', conditions, {
          orderBy: 'created_at DESC',
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0
        })

        // Parse tags for each post
        const postsWithTags = posts.map(post => ({
          ...post,
          tags: JSONToTags(post.tags)
        }))

        return successResponse(postsWithTags, 'Blog posts retrieved successfully (admin)', rateLimit.rateLimitHeaders)
      }

      // Check if requesting specific post by slug
      if (pathParams.slug) {
        const slug = pathParams.slug
        
        const post = await getOne('t_blog_posts', { 
          slug, 
          published: 1 
        })
        
        if (!post) {
          return errorResponse('Blog post not found', 404)
        }

        // Parse tags from JSON
        post.tags = JSONToTags(post.tags)
        
        return successResponse(post, 'Blog post retrieved successfully', rateLimit.rateLimitHeaders)
      }

      // Get blog list with pagination (public view)
      const { page = 1, limit = 10, tag, search } = queryParams
      const { page: validPage, limit: validLimit } = validatePagination(page, limit)
      const offset = (validPage - 1) * validLimit

      // Build query conditions
      let whereConditions = ['published = 1']
      let sqlParams = [] // Changed from queryParams to avoid conflict

      if (tag) {
        whereConditions.push('JSON_SEARCH(tags, "one", ?) IS NOT NULL')
        sqlParams.push(tag) // Changed from queryParams to sqlParams
      }

      if (search) {
        whereConditions.push('(title LIKE ? OR summary LIKE ? OR content LIKE ?)')
        sqlParams.push(`%${search}%`, `%${search}%`, `%${search}%`) // Changed from queryParams
      }

      const whereClause = whereConditions.length > 0 ? 
        'WHERE ' + whereConditions.join(' AND ') : ''

      // Get posts
      const postsQuery = `
        SELECT id, slug, title, summary, image_url, published_at, read_time, tags,
               meta_title, meta_description
        FROM t_blog_posts 
        ${whereClause}
        ORDER BY published_at DESC 
        LIMIT ${validLimit} OFFSET ${offset}
      `

      const postsResult = await executeQuery(postsQuery, sqlParams) // Changed from queryParams

      if (!postsResult.success) {
        return errorResponse('Failed to fetch blog posts', 500)
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) as count FROM t_blog_posts ${whereClause}`
      const countResult = await executeQuery(countQuery, sqlParams) // Changed from queryParams
      const totalPosts = countResult.success ? countResult.data[0].count : 0

      // Parse tags for each post
      const posts = postsResult.data.map(post => ({
        ...post,
        tags: JSONToTags(post.tags)
      }))

      // Get all unique tags for filter options
      const tagsQuery = `
        SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(tags, CONCAT('$[', numbers.n, ']'))) as tag
        FROM t_blog_posts
        CROSS JOIN (
          SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
          UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
        ) numbers
        WHERE published = 1 
          AND JSON_EXTRACT(tags, CONCAT('$[', numbers.n, ']')) IS NOT NULL
        ORDER BY tag
      `
      
      const tagsResult = await executeQuery(tagsQuery)
      const availableTags = tagsResult.success ? 
        tagsResult.data.map(row => row.tag).filter(Boolean) : []

      const pagination = getPaginationMeta(validPage, totalPosts, validLimit)

      const responseData = {
        posts,
        pagination,
        availableTags,
        filters: {
          tag: tag || null,
          search: search || null
        }
      }

      return successResponse(responseData, 'Blog posts retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // All write operations require API key with 'blog' scope
    if (['POST', 'PUT', 'DELETE'].includes(httpMethod)) {
      const authResult = await requireAuth('blog')(event)
      if (authResult.statusCode) return authResult
    }

    // POST - Create new blog post
    if (httpMethod === 'POST') {
      const body = parseBody(event)
      
      // Validate blog post data
      const validation = validateData(body, schemas.blogPost)
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      const { title, slug, summary, content, image_url, published, meta_title, meta_description, tags } = validation.data

      // Check if slug already exists
      const existingPost = await getOne('t_blog_posts', { slug })
      if (existingPost) {
        return errorResponse('Slug already exists', 400)
      }

      // Calculate reading time
      const readTime = calculateReadingTime(content)

      // Prepare data for insertion
      const postData = {
        title,
        slug,
        summary: summary || null,
        content,
        image_url: image_url || null,
        published: published || false,
        published_at: published ? new Date() : null,
        meta_title: meta_title || title,
        meta_description: meta_description || summary,
        tags: tagsToJSON(tags),
        read_time: readTime,
        created_at: new Date(),
        updated_at: new Date()
      }

      const postId = await insertRecord('t_blog_posts', postData)

      if (!postId) {
        return errorResponse('Failed to create blog post', 500)
      }

      const newPost = await getOne('t_blog_posts', { id: postId })
      newPost.tags = JSONToTags(newPost.tags)

      return successResponse(newPost, 'Blog post created successfully', rateLimit.rateLimitHeaders)
    }

    // PUT - Update existing blog post
    if (httpMethod === 'PUT') {
      const { id } = pathParams
      
      if (!id) {
        return errorResponse('Post ID required in path', 400)
      }

      const body = parseBody(event)
      
      // Validate blog post data
      const validation = validateData(body, schemas.blogPost)
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      // Check if post exists
      const existingPost = await getOne('t_blog_posts', { id })
      if (!existingPost) {
        return errorResponse('Blog post not found', 404)
      }

      const { title, slug, summary, content, image_url, published, meta_title, meta_description, tags } = validation.data

      // Check if slug conflicts with another post
      if (slug && slug !== existingPost.slug) {
        const conflictingPost = await getOne('t_blog_posts', { slug })
        if (conflictingPost && conflictingPost.id != id) {
          return errorResponse('Slug already exists', 400)
        }
      }

      // Calculate reading time if content changed
      const readTime = content ? calculateReadingTime(content) : existingPost.read_time

      // Prepare update data
      const updateData = {
        updated_at: new Date()
      }

      if (title) updateData.title = title
      if (slug) updateData.slug = slug
      if (summary !== undefined) updateData.summary = summary
      if (content) {
        updateData.content = content
        updateData.read_time = readTime
      }
      if (image_url !== undefined) updateData.image_url = image_url
      if (meta_title) updateData.meta_title = meta_title
      if (meta_description !== undefined) updateData.meta_description = meta_description
      if (tags !== undefined) updateData.tags = tagsToJSON(tags)

      // Handle published status
      if (published !== undefined) {
        updateData.published = published
        // Set published_at when publishing for first time
        if (published && !existingPost.published_at) {
          updateData.published_at = new Date()
        }
        // Clear published_at when unpublishing
        if (!published) {
          updateData.published_at = null
        }
      }

      const updated = await updateRecord('t_blog_posts', updateData, { id })

      if (!updated) {
        return errorResponse('Failed to update blog post', 500)
      }

      const updatedPost = await getOne('t_blog_posts', { id })
      updatedPost.tags = JSONToTags(updatedPost.tags)

      return successResponse(updatedPost, 'Blog post updated successfully', rateLimit.rateLimitHeaders)
    }

    // DELETE - Remove blog post
    if (httpMethod === 'DELETE') {
      const { id } = pathParams
      
      if (!id) {
        return errorResponse('Post ID required in path', 400)
      }

      const deleted = await deleteRecord('t_blog_posts', { id })
      
      if (!deleted) {
        return errorResponse('Blog post not found', 404)
      }

      return successResponse(null, 'Blog post deleted successfully', rateLimit.rateLimitHeaders)
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    console.error('Blog function error:', error)
    return errorResponse('Internal server error', 500)
  }
})

export { handler }