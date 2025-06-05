const { db } = require('./lib/db')
const { utils } = require('./lib/utils')
const { validation } = require('./lib/validation')
const { rateLimit } = require('./lib/rate-limit')
const { auth } = require('./lib/auth')

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = utils.handleCORS(event)
  if (corsResponse) return corsResponse

  // Rate limiting - stricter for newsletter to prevent spam
  const rateLimitResult = rateLimit.middleware(20, 60000)(event)
  if (!rateLimitResult.allowed) return rateLimitResult

  const startTime = Date.now()
  
  try {
    const method = event.httpMethod
    const path = event.path.replace('/.netlify/functions/newsletter', '') || '/'
    const queryParams = utils.getQueryParams(event)
    
    let response

    switch (method) {
      case 'GET':
        if (path === '/status') {
          // Public endpoint - check subscription status
          response = await getSubscriptionStatus(queryParams)
        } else if (path === '/' || path === '') {
          // Admin endpoint - get subscribers list
          const authResult = await auth.verifyMasterApiKey(event)
          if (!authResult.valid) {
            return utils.errorResponse(authResult.error, 401)
          }
          response = await getSubscribers(queryParams)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'POST':
        if (path === '/subscribe' || path === '/') {
          // Public endpoint - subscribe to newsletter
          response = await subscribe(utils.parseRequestBody(event))
        } else if (path === '/unsubscribe') {
          // Public endpoint - unsubscribe from newsletter
          response = await unsubscribe(utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'PUT':
        // Admin endpoint - update subscriber
        const authResultPut = await auth.verifyMasterApiKey(event)
        if (!authResultPut.valid) {
          return utils.errorResponse(authResultPut.error, 401)
        }
        
        if (path.match(/^\/\d+$/)) {
          const subscriberId = path.substring(1)
          response = await updateSubscriber(subscriberId, utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'DELETE':
        // Admin endpoint - delete subscriber
        const authResultDelete = await auth.verifyMasterApiKey(event)
        if (!authResultDelete.valid) {
          return utils.errorResponse(authResultDelete.error, 401)
        }
        
        if (path.match(/^\/\d+$/)) {
          const subscriberId = path.substring(1)
          response = await deleteSubscriber(subscriberId)
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
    
    const endTime = Date.now()
    console.log(`Newsletter function executed in ${endTime - startTime}ms`)
    
    return response
    
  } catch (error) {
    console.error('Newsletter function error:', error)
    return utils.errorResponse('Internal server error', 500)
  }
}

async function subscribe(subscriptionData) {
  try {
    // Validate subscription data
    const validationResult = validation.validateNewsletter(subscriptionData)
    if (!validationResult.isValid) {
      return utils.errorResponse('Validation failed', 400, validationResult.errors)
    }
    
    const { email, name } = subscriptionData
    
    // Check if email already exists
    const existingSubscriber = await db.queryOne(
      'SELECT id, status, unsubscribed_at FROM t_newsletter_subscribers WHERE email = ?',
      [email]
    )
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return utils.errorResponse('Email is already subscribed to the newsletter', 409)
      } else {
        // Reactivate subscription
        await db.update('t_newsletter_subscribers', {
          status: 'active',
          subscribed_at: new Date(),
          unsubscribed_at: null,
          name: name ? validation.sanitizeString(name) : existingSubscriber.name
        }, 'id = ?', [existingSubscriber.id])
        
        return utils.successResponse({
          id: existingSubscriber.id,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
          email,
          status: 'active',
          reactivated: true
        })
      }
    }
    
    // Create new subscription
    const subscriberId = await db.insert('t_newsletter_subscribers', {
      email: validation.sanitizeString(email),
      name: name ? validation.sanitizeString(name) : null,
      subscribed_at: new Date(),
      status: 'active'
    })
    
    return utils.successResponse({
      id: subscriberId,
      message: 'Successfully subscribed to the newsletter! Thank you for joining.',
      email,
      status: 'active',
      welcome_message: 'You\'ll receive updates about new blog posts, project releases, and web development insights.'
    }, 201)
    
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return utils.errorResponse('Failed to subscribe to newsletter', 500)
  }
}

async function unsubscribe(unsubscribeData) {
  try {
    // Validate unsubscribe data
    if (!unsubscribeData.email) {
      return utils.errorResponse('Email address is required', 400)
    }
    
    if (!validation.isValidEmail(unsubscribeData.email)) {
      return utils.errorResponse('Please provide a valid email address', 400)
    }
    
    const { email } = unsubscribeData
    
    // Check if subscriber exists and is active
    const subscriber = await db.queryOne(
      'SELECT id, status, name FROM t_newsletter_subscribers WHERE email = ?',
      [email]
    )
    
    if (!subscriber) {
      return utils.errorResponse('Email address not found in our newsletter list', 404)
    }
    
    if (subscriber.status === 'unsubscribed') {
      return utils.errorResponse('Email is already unsubscribed from the newsletter', 409)
    }
    
    // Update subscription status
    await db.update('t_newsletter_subscribers', {
      status: 'unsubscribed',
      unsubscribed_at: new Date()
    }, 'id = ?', [subscriber.id])
    
    return utils.successResponse({
      message: 'Successfully unsubscribed from the newsletter. We\'re sorry to see you go!',
      email,
      status: 'unsubscribed',
      feedback_message: 'If you have any feedback about why you unsubscribed, please let us know.'
    })
    
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return utils.errorResponse('Failed to unsubscribe from newsletter', 500)
  }
}

async function getSubscriptionStatus(params) {
  try {
    const { email } = params
    
    if (!email) {
      return utils.errorResponse('Email address is required', 400)
    }
    
    if (!validation.isValidEmail(email)) {
      return utils.errorResponse('Please provide a valid email address', 400)
    }
    
    const subscriber = await db.queryOne(
      'SELECT id, email, name, status, subscribed_at, unsubscribed_at FROM t_newsletter_subscribers WHERE email = ?',
      [email]
    )
    
    if (!subscriber) {
      return utils.errorResponse('Email address not found in our newsletter list', 404)
    }
    
    return utils.successResponse({
      email: subscriber.email,
      name: subscriber.name,
      status: subscriber.status,
      subscribed_at: subscriber.subscribed_at,
      unsubscribed_at: subscriber.unsubscribed_at,
      is_active: subscriber.status === 'active'
    })
    
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return utils.errorResponse('Failed to get subscription status', 500)
  }
}

async function getSubscribers(params) {
  try {
    const {
      page = 1,
      limit = 50,
      status = '',
      search = '',
      sortBy = 'subscribed_at',
      sortOrder = 'desc'
    } = params
    
    const pageNum = parseInt(page)
    const limitNum = Math.min(parseInt(limit), 100) // Cap at 100
    
    let whereConditions = []
    let queryParams = []
    
    // Filter by status
    if (status && ['active', 'unsubscribed'].includes(status)) {
      whereConditions.push('status = ?')
      queryParams.push(status)
    }
    
    // Search functionality
    if (search) {
      whereConditions.push('(email LIKE ? OR name LIKE ?)')
      const searchTerm = `%${search}%`
      queryParams.push(searchTerm, searchTerm)
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    // Validate sort parameters
    const validSortFields = ['id', 'email', 'name', 'status', 'subscribed_at', 'unsubscribed_at']
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'subscribed_at'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC'
    
    const orderClause = `ORDER BY ${validSortBy} ${validSortOrder}`
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM t_newsletter_subscribers ${whereClause}`
    const [{ total }] = await db.query(countQuery, queryParams)
    
    // Get subscribers
    const offset = (pageNum - 1) * limitNum
    const subscribersQuery = `
      SELECT id, email, name, status, subscribed_at, unsubscribed_at
      FROM t_newsletter_subscribers 
      ${whereClause} 
      ${orderClause} 
      LIMIT ? OFFSET ?
    `
    
    const subscribers = await db.query(subscribersQuery, [...queryParams, limitNum, offset])
    
    // Get status statistics
    const statsQuery = `
      SELECT 
        status,
        COUNT(*) as count
      FROM t_newsletter_subscribers 
      GROUP BY status
    `
    const stats = await db.query(statsQuery)
    
    const statistics = {
      total: total,
      active: stats.find(s => s.status === 'active')?.count || 0,
      unsubscribed: stats.find(s => s.status === 'unsubscribed')?.count || 0
    }
    
    const pagination = utils.generatePagination(pageNum, limitNum, total)
    
    return utils.successResponse({
      subscribers,
      pagination,
      statistics
    })
    
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return utils.errorResponse('Failed to fetch subscribers', 500)
  }
}

async function updateSubscriber(subscriberId, updateData) {
  try {
    if (!subscriberId) {
      return utils.errorResponse('Subscriber ID is required', 400)
    }
    
    // Check if subscriber exists
    const existingSubscriber = await db.queryOne(
      'SELECT id, email, status FROM t_newsletter_subscribers WHERE id = ?',
      [subscriberId]
    )
    
    if (!existingSubscriber) {
      return utils.errorResponse('Subscriber not found', 404)
    }
    
    // Validate update data
    const allowedFields = ['name', 'status']
    const sanitizedData = utils.sanitizeData(updateData, allowedFields)
    
    if (Object.keys(sanitizedData).length === 0) {
      return utils.errorResponse('No valid fields to update', 400)
    }
    
    // Validate status if provided
    if (sanitizedData.status && !['active', 'unsubscribed'].includes(sanitizedData.status)) {
      return utils.errorResponse('Invalid status. Must be "active" or "unsubscribed"', 400)
    }
    
    // Handle status change timestamps
    if (sanitizedData.status) {
      if (sanitizedData.status === 'active' && existingSubscriber.status !== 'active') {
        sanitizedData.subscribed_at = new Date()
        sanitizedData.unsubscribed_at = null
      } else if (sanitizedData.status === 'unsubscribed' && existingSubscriber.status !== 'unsubscribed') {
        sanitizedData.unsubscribed_at = new Date()
      }
    }
    
    // Update subscriber
    await db.update('t_newsletter_subscribers', sanitizedData, 'id = ?', [subscriberId])
    
    // Fetch updated subscriber
    const updatedSubscriber = await db.queryOne(
      'SELECT id, email, name, status, subscribed_at, unsubscribed_at FROM t_newsletter_subscribers WHERE id = ?',
      [subscriberId]
    )
    
    return utils.successResponse({
      message: 'Subscriber updated successfully',
      subscriber: updatedSubscriber
    })
    
  } catch (error) {
    console.error('Error updating subscriber:', error)
    return utils.errorResponse('Failed to update subscriber', 500)
  }
}

async function deleteSubscriber(subscriberId) {
  try {
    if (!subscriberId) {
      return utils.errorResponse('Subscriber ID is required', 400)
    }
    
    // Check if subscriber exists
    const subscriber = await db.queryOne(
      'SELECT id, email, name FROM t_newsletter_subscribers WHERE id = ?',
      [subscriberId]
    )
    
    if (!subscriber) {
      return utils.errorResponse('Subscriber not found', 404)
    }
    
    // Delete subscriber
    const deleteResult = await db.delete('t_newsletter_subscribers', 'id = ?', [subscriberId])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete subscriber', 500)
    }
    
    return utils.successResponse({
      message: 'Subscriber deleted successfully',
      deleted_subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name
      }
    })
    
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return utils.errorResponse('Failed to delete subscriber', 500)
  }
}