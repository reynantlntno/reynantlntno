const { db } = require('./lib/db')
const { utils } = require('./lib/utils')
const { validation } = require('./lib/validation')
const { rateLimit } = require('./lib/rate-limit')
const { email } = require('./lib/email')
const { auth } = require('./lib/auth')

exports.handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = utils.handleCORS(event)
  if (corsResponse) return corsResponse

  // Rate limiting - stricter for contact form to prevent spam
  const rateLimitResult = rateLimit.middleware(10, 60000)(event)
  if (!rateLimitResult.allowed) return rateLimitResult

  const startTime = Date.now()
  
  try {
    const method = event.httpMethod
    const path = event.path.replace('/.netlify/functions/contact', '') || '/'
    const queryParams = utils.getQueryParams(event)
    
    let response
    
    switch (method) {
      case 'POST':
        if (path === '/' || path === '') {
          // Public endpoint - submit contact form
          response = await submitContactForm(utils.parseRequestBody(event), event)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'GET':
        if (path === '/messages' || path === '/') {
          // Admin endpoint - get contact messages
          const authResult = await auth.verifyMasterApiKey(event)
          if (!authResult.valid) {
            return utils.errorResponse(authResult.error, 401)
          }
          response = await getMessages(queryParams)
        } else if (path.match(/^\/messages\/\d+$/)) {
          // Admin endpoint - get single message
          const authResult = await auth.verifyMasterApiKey(event)
          if (!authResult.valid) {
            return utils.errorResponse(authResult.error, 401)
          }
          const messageId = path.split('/')[2]
          response = await getMessageById(messageId)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'PUT':
        // Admin endpoint - update message (mark as read/unread)
        const authResultPut = await auth.verifyMasterApiKey(event)
        if (!authResultPut.valid) {
          return utils.errorResponse(authResultPut.error, 401)
        }
        
        if (path.match(/^\/messages\/\d+$/)) {
          const messageId = path.split('/')[2]
          response = await updateMessage(messageId, utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'DELETE':
        // Admin endpoint - delete message
        const authResultDelete = await auth.verifyMasterApiKey(event)
        if (!authResultDelete.valid) {
          return utils.errorResponse(authResultDelete.error, 401)
        }
        
        if (path.match(/^\/messages\/\d+$/)) {
          const messageId = path.split('/')[2]
          response = await deleteMessage(messageId)
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
    console.log(`Contact function executed in ${endTime - startTime}ms`)
    
    return response
    
  } catch (error) {
    console.error('Contact function error:', error)
    return utils.errorResponse('Internal server error', 500)
  }
}

async function submitContactForm(contactData, event) {
  try {
    // Validate contact data
    const validationResult = validation.validateContact(contactData)
    if (!validationResult.isValid) {
      return utils.errorResponse('Validation failed', 400, validationResult.errors)
    }
    
    const { name, email: contactEmail, subject, message } = contactData
    
    // Get client IP for tracking
    const ipAddress = utils.getClientIP(event)
    
    // Check for recent submissions from same IP to prevent spam
    const recentSubmission = await db.queryOne(
      'SELECT id FROM t_contact_messages WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)',
      [ipAddress]
    )
    
    if (recentSubmission) {
      return utils.errorResponse('Too many submissions. Please wait before sending another message.', 429)
    }
    
    // Check for duplicate messages (same email, subject, and message content)
    const duplicateMessage = await db.queryOne(
      'SELECT id FROM t_contact_messages WHERE email = ? AND subject = ? AND message = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)',
      [contactEmail, subject, message]
    )
    
    if (duplicateMessage) {
      return utils.errorResponse('This message appears to be a duplicate. Please wait 24 hours before sending the same message again.', 409)
    }
    
    // Store message in database
    const messageId = await db.insert('t_contact_messages', {
      name: validation.sanitizeString(name),
      email: validation.sanitizeString(contactEmail),
      subject: validation.sanitizeString(subject),
      message: validation.sanitizeString(message),
      ip_address: ipAddress,
      read: false,
      created_at: new Date()
    })
    
    // Send email notification
    try {
      await email.sendContactEmail({
        name: validation.sanitizeString(name),
        email: validation.sanitizeString(contactEmail),
        subject: validation.sanitizeString(subject),
        message: validation.sanitizeString(message)
      })
    } catch (emailError) {
      console.error('Failed to send contact email notification:', emailError)
      // Don't fail the request if email fails - message is still stored
    }
    
    return utils.successResponse({
      id: messageId,
      message: 'Your message has been sent successfully. I will get back to you soon!',
      timestamp: new Date().toISOString(),
      reference: `MSG-${messageId.toString().padStart(6, '0')}`
    }, 201)
    
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return utils.errorResponse('Failed to submit message', 500)
  }
}

async function getMessages(params) {
  try {
    const {
      page = 1,
      limit = 20,
      read = null,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = params
    
    const pageNum = parseInt(page)
    const limitNum = Math.min(parseInt(limit), 100) // Cap at 100
    
    let whereConditions = []
    let queryParams = []
    
    // Filter by read status
    if (read !== null) {
      whereConditions.push('read = ?')
      queryParams.push(read === 'true' ? 1 : 0)
    }
    
    // Search functionality
    if (search) {
      whereConditions.push('(name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)')
      const searchTerm = `%${search}%`
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    // Validate sort parameters
    const validSortFields = ['id', 'name', 'email', 'subject', 'read', 'created_at']
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC'
    
    const orderClause = `ORDER BY ${validSortBy} ${validSortOrder}`
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM t_contact_messages ${whereClause}`
    const [{ total }] = await db.query(countQuery, queryParams)
    
    // Get messages
    const offset = (pageNum - 1) * limitNum
    const messagesQuery = `
      SELECT id, name, email, subject, message, ip_address, read, created_at
      FROM t_contact_messages 
      ${whereClause} 
      ${orderClause} 
      LIMIT ? OFFSET ?
    `
    
    const messages = await db.query(messagesQuery, [...queryParams, limitNum, offset])
    
    // Get message statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN read = 0 THEN 1 ELSE 0 END) as unread_count,
        SUM(CASE WHEN read = 1 THEN 1 ELSE 0 END) as read_count,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 END) as today_count,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as week_count
      FROM t_contact_messages
    `
    const [statistics] = await db.query(statsQuery)
    
    const pagination = utils.generatePagination(pageNum, limitNum, total)
    
    return utils.successResponse({
      messages,
      pagination,
      statistics
    })
    
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return utils.errorResponse('Failed to fetch messages', 500)
  }
}

async function getMessageById(messageId) {
  try {
    if (!messageId) {
      return utils.errorResponse('Message ID is required', 400)
    }
    
    const message = await db.queryOne(
      'SELECT id, name, email, subject, message, ip_address, read, created_at FROM t_contact_messages WHERE id = ?',
      [messageId]
    )
    
    if (!message) {
      return utils.errorResponse('Message not found', 404)
    }
    
    return utils.successResponse(message)
    
  } catch (error) {
    console.error('Error fetching message:', error)
    return utils.errorResponse('Failed to fetch message', 500)
  }
}

async function updateMessage(messageId, updateData) {
  try {
    if (!messageId) {
      return utils.errorResponse('Message ID is required', 400)
    }
    
    // Check if message exists
    const existingMessage = await db.queryOne(
      'SELECT id, read FROM t_contact_messages WHERE id = ?',
      [messageId]
    )
    
    if (!existingMessage) {
      return utils.errorResponse('Message not found', 404)
    }
    
    // Validate update data
    const allowedFields = ['read']
    const sanitizedData = utils.sanitizeData(updateData, allowedFields)
    
    if (Object.keys(sanitizedData).length === 0) {
      return utils.errorResponse('No valid fields to update', 400)
    }
    
    // Validate read status if provided
    if (sanitizedData.read !== undefined) {
      sanitizedData.read = Boolean(sanitizedData.read)
    }
    
    // Update message
    await db.update('t_contact_messages', sanitizedData, 'id = ?', [messageId])
    
    // Fetch updated message
    const updatedMessage = await db.queryOne(
      'SELECT id, name, email, subject, message, ip_address, read, created_at FROM t_contact_messages WHERE id = ?',
      [messageId]
    )
    
    return utils.successResponse({
      message: 'Message updated successfully',
      updated_message: updatedMessage
    })
    
  } catch (error) {
    console.error('Error updating message:', error)
    return utils.errorResponse('Failed to update message', 500)
  }
}

async function deleteMessage(messageId) {
  try {
    if (!messageId) {
      return utils.errorResponse('Message ID is required', 400)
    }
    
    // Check if message exists
    const message = await db.queryOne(
      'SELECT id, name, email, subject FROM t_contact_messages WHERE id = ?',
      [messageId]
    )
    
    if (!message) {
      return utils.errorResponse('Message not found', 404)
    }
    
    // Delete message
    const deleteResult = await db.delete('t_contact_messages', 'id = ?', [messageId])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete message', 500)
    }
    
    return utils.successResponse({
      message: 'Contact message deleted successfully',
      deleted_message: {
        id: message.id,
        name: message.name,
        email: message.email,
        subject: message.subject
      }
    })
    
  } catch (error) {
    console.error('Error deleting message:', error)
    return utils.errorResponse('Failed to delete message', 500)
  }
}