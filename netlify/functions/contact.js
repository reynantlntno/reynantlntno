import { insertRecord, getMany, getOne, updateRecord, deleteRecord } from './lib/db.js'
import { asyncHandler, successResponse, errorResponse, parseBody, getQueryParams, getPathParams, getPaginationMeta, validatePagination } from './lib/utils.js'
import { validateData, schemas } from './lib/validation.js'
import { rateLimitMiddleware, getClientIP } from './lib/rate-limit.js'
import { requireAuth } from './lib/auth.js'
import { sendEmail } from './lib/email.js'

const handler = asyncHandler(async (event, context) => {
  // Apply rate limiting
  const rateLimit = await rateLimitMiddleware('contact')(event)
  if (rateLimit.statusCode) return rateLimit

  const { httpMethod } = event
  const pathParams = getPathParams(event)
  const queryParams = getQueryParams(event)

  try {
    // PUBLIC POST - Submit contact message (No authentication required)
    if (httpMethod === 'POST' && !queryParams.admin) {
      const body = parseBody(event)
      
      // Validate contact data
      const validation = validateData(body, schemas.contact)
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      const { name, email, subject, message } = validation.data
      const clientIP = getClientIP(event)

      // Store message in database
      const messageId = await insertRecord('t_contact_messages', {
        name,
        email,
        subject,
        message,
        ip_address: clientIP,
        read: false,
        created_at: new Date()
      })

      if (!messageId) {
        return errorResponse('Failed to store message', 500)
      }

      // Send email notification
      const emailData = {
        name,
        email,
        subject,
        message
      }

      const emailResult = await sendEmail('contact', emailData)

      if (!emailResult.success) {
        console.error('Failed to send contact email:', emailResult.error)
        // Don't fail the request if email fails, message is still stored
      }

      const responseData = {
        id: messageId,
        status: 'received',
        message: 'Your message has been received. I will get back to you soon!'
      }

      return successResponse(responseData, 'Message sent successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN OPERATIONS - Require API key with 'contact' scope
    if (['GET', 'POST', 'PUT', 'DELETE'].includes(httpMethod) && queryParams.admin) {
      const authResult = await requireAuth('contact')(event)
      if (authResult.statusCode) return authResult
    }

    // ADMIN GET - Retrieve contact messages
    if (httpMethod === 'GET' && queryParams.admin) {
      const { page = 1, limit = 50, read, email, search } = queryParams
      const { page: validPage, limit: validLimit } = validatePagination(page, limit)
      const offset = (validPage - 1) * validLimit

      // Build conditions
      let conditions = {}
      if (read !== undefined) {
        conditions.read = read === 'true' ? 1 : 0
      }
      if (email) {
        conditions.email = email
      }

      // If searching, we need to use a more complex query
      if (search) {
        const searchQuery = `
          SELECT * FROM t_contact_messages 
          WHERE (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)
          ${read !== undefined ? 'AND read = ?' : ''}
          ${email ? 'AND email = ?' : ''}
          ORDER BY created_at DESC 
          LIMIT ${validLimit} OFFSET ${offset}
        `
        
        const searchParams = [
          `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`
        ]
        
        if (read !== undefined) {
          searchParams.push(read === 'true' ? 1 : 0)
        }
        if (email) {
          searchParams.push(email)
        }

        const { executeQuery } = await import('./lib/db.js')
        const result = await executeQuery(searchQuery, searchParams)
        
        if (!result.success) {
          return errorResponse('Failed to fetch contact messages', 500)
        }

        // Get total count for search
        const countQuery = `
          SELECT COUNT(*) as count FROM t_contact_messages 
          WHERE (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)
          ${read !== undefined ? 'AND read = ?' : ''}
          ${email ? 'AND email = ?' : ''}
        `
        
        const countResult = await executeQuery(countQuery, searchParams)
        const totalMessages = countResult.success ? countResult.data[0].count : 0

        const pagination = getPaginationMeta(validPage, totalMessages, validLimit)

        return successResponse({
          messages: result.data,
          pagination,
          filters: { read, email, search }
        }, 'Contact messages retrieved successfully', rateLimit.rateLimitHeaders)
      }

      // Regular query without search
      const messages = await getMany('t_contact_messages', conditions, {
        orderBy: 'created_at DESC',
        limit: validLimit,
        offset
      })

      // Get total count
      const totalMessages = await import('./lib/db.js').then(db => db.getCount('t_contact_messages', conditions))
      const pagination = getPaginationMeta(validPage, totalMessages, validLimit)

      return successResponse({
        messages,
        pagination,
        filters: { read, email }
      }, 'Contact messages retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN GET - Get specific contact message by ID
    if (httpMethod === 'GET' && pathParams.id) {
      const { id } = pathParams
      
      const message = await getOne('t_contact_messages', { id })
      
      if (!message) {
        return errorResponse('Contact message not found', 404)
      }

      return successResponse(message, 'Contact message retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN PUT - Update contact message (mainly mark as read/unread)
    if (httpMethod === 'PUT') {
      const { id } = pathParams
      const body = parseBody(event)
      
      if (!id) {
        return errorResponse('Message ID required in path', 400)
      }

      // Check if message exists
      const existingMessage = await getOne('t_contact_messages', { id })
      if (!existingMessage) {
        return errorResponse('Contact message not found', 404)
      }

      // Only allow updating read status
      const allowedUpdates = ['read']
      const updates = {}
      
      Object.keys(body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = body[key]
        }
      })

      if (Object.keys(updates).length === 0) {
        return errorResponse('No valid update fields provided. Only "read" field can be updated.', 400)
      }

      // Validate read field
      if (updates.read !== undefined && typeof updates.read !== 'boolean') {
        return errorResponse('Read field must be a boolean', 400)
      }

      const updated = await updateRecord('t_contact_messages', updates, { id })

      if (!updated) {
        return errorResponse('Failed to update contact message', 500)
      }

      const updatedMessage = await getOne('t_contact_messages', { id })
      return successResponse(updatedMessage, 'Contact message updated successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN DELETE - Remove contact message
    if (httpMethod === 'DELETE') {
      const { id } = pathParams
      
      if (!id) {
        return errorResponse('Message ID required in path', 400)
      }

      const deleted = await deleteRecord('t_contact_messages', { id })
      
      if (!deleted) {
        return errorResponse('Contact message not found', 404)
      }

      return successResponse(null, 'Contact message deleted successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN POST - Reply to contact message (send email reply)
    if (httpMethod === 'POST' && queryParams.admin && queryParams.action === 'reply') {
      const { id } = pathParams
      const body = parseBody(event)
      
      if (!id) {
        return errorResponse('Message ID required in path', 400)
      }

      const { replyMessage, replySubject } = body
      
      if (!replyMessage || !replySubject) {
        return errorResponse('Reply message and subject are required', 400)
      }

      // Get original message
      const originalMessage = await getOne('t_contact_messages', { id })
      if (!originalMessage) {
        return errorResponse('Original contact message not found', 404)
      }

      // Send reply email
      const emailData = {
        name: originalMessage.name,
        originalSubject: originalMessage.subject,
        replySubject,
        replyMessage,
        originalMessage: originalMessage.message
      }

      // Create custom email template for reply
      const replyTemplate = {
        subject: replySubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #065f46; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
              Reply to Your Message
            </h2>
            <p>Hi ${originalMessage.name},</p>
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
              ${replyMessage.replace(/\n/g, '<br>')}
            </div>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h4 style="margin-top: 0; color: #475569;">Original Message:</h4>
              <p><strong>Subject:</strong> ${originalMessage.subject}</p>
              <p style="font-style: italic; color: #64748b;">${originalMessage.message.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #0f172a; color: #e2e8f0; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px;">
                Best regards,<br>
                ${process.env.SITE_NAME || 'Reynan Tolentino'}
              </p>
            </div>
          </div>
        `,
        text: `
Hi ${originalMessage.name},

${replyMessage}

---
Original Message:
Subject: ${originalMessage.subject}
${originalMessage.message}

Best regards,
${process.env.SITE_NAME || 'Reynan Tolentino'}
        `
      }

      try {
        const { createTransporter } = await import('./lib/email.js')
        const transporter = createTransporter()
        
        const mailOptions = {
          from: `"${process.env.SITE_NAME}" <${process.env.SMTP_USER}>`,
          to: originalMessage.email,
          subject: replyTemplate.subject,
          text: replyTemplate.text,
          html: replyTemplate.html,
          replyTo: process.env.CONTACT_EMAIL
        }

        const result = await transporter.sendMail(mailOptions)
        
        // Mark original message as read
        await updateRecord('t_contact_messages', { read: true }, { id })

        return successResponse({
          messageId: result.messageId,
          status: 'sent',
          recipient: originalMessage.email
        }, 'Reply sent successfully', rateLimit.rateLimitHeaders)
      } catch (error) {
        console.error('Failed to send reply email:', error)
        return errorResponse('Failed to send reply email', 500)
      }
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    console.error('Contact function error:', error)
    return errorResponse('Internal server error', 500)
  }
})

export { handler }