import { insertRecord, getOne, getMany, updateRecord, deleteRecord, executeQuery } from './lib/db.js'
import { asyncHandler, successResponse, errorResponse, parseBody, getQueryParams, getPathParams, getPaginationMeta, validatePagination } from './lib/utils.js'
import { validateData, schemas } from './lib/validation.js'
import { rateLimitMiddleware } from './lib/rate-limit.js'
import { requireAuth } from './lib/auth.js'
import { sendNewsletterConfirmation } from './lib/email.js'

const handler = asyncHandler(async (event, context) => {
  // Apply newsletter-specific rate limiting
  const rateLimit = await rateLimitMiddleware('newsletter')(event)
  if (rateLimit.statusCode) return rateLimit

  const { httpMethod } = event
  const pathParams = getPathParams(event)
  const queryParams = getQueryParams(event)

  try {
    // PUBLIC POST - Subscribe to newsletter (No authentication required)
    if (httpMethod === 'POST' && !queryParams.admin) {
      const body = parseBody(event)
      
      // Validate newsletter data
      const validation = validateData(body, schemas.newsletter)
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      const { email, name } = validation.data

      // Check if email already exists
      const existingSubscriber = await getOne('t_newsletter_subscribers', { email })

      if (existingSubscriber) {
        if (existingSubscriber.status === 'active') {
          return errorResponse('Email is already subscribed', 400)
        } else {
          // Reactivate subscription
          await updateRecord('t_newsletter_subscribers', 
            { 
              status: 'active',
              name: name || existingSubscriber.name,
              unsubscribed_at: null 
            }, 
            { id: existingSubscriber.id }
          )

          // Send confirmation email for reactivation
          await sendNewsletterConfirmation(email, name || existingSubscriber.name)

          const responseData = {
            email,
            status: 'reactivated',
            message: 'Your subscription has been reactivated!'
          }

          return successResponse(responseData, 'Subscription reactivated successfully', rateLimit.rateLimitHeaders)
        }
      }

      // Create new subscription
      const subscriberId = await insertRecord('t_newsletter_subscribers', {
        email,
        name: name || null,
        status: 'active'
      })

      if (!subscriberId) {
        return errorResponse('Failed to create subscription', 500)
      }

      // Send confirmation email
      const emailResult = await sendNewsletterConfirmation(email, name)

      if (!emailResult.success) {
        console.error('Failed to send newsletter confirmation:', emailResult.error)
        // Don't fail the request if email fails, subscription is still created
      }

      const responseData = {
        id: subscriberId,
        email,
        status: 'active',
        message: 'Thank you for subscribing to the newsletter!'
      }

      return successResponse(responseData, 'Subscription created successfully', rateLimit.rateLimitHeaders)
    }

    // PUBLIC DELETE - Unsubscribe from newsletter (No authentication required)
    if (httpMethod === 'DELETE' && !queryParams.admin) {
      const { email } = queryParams
      
      if (!email) {
        return errorResponse('Email parameter is required', 400)
      }

      // Validate email format
      const validation = validateData({ email }, { email: schemas.newsletter.email })
      if (!validation.isValid) {
        return errorResponse('Invalid email format', 400, validation.errors)
      }

      const subscriber = await getOne('t_newsletter_subscribers', { email })
      
      if (!subscriber) {
        return errorResponse('Email not found in subscribers list', 404)
      }

      if (subscriber.status === 'unsubscribed') {
        return errorResponse('Email is already unsubscribed', 400)
      }

      // Unsubscribe (soft delete)
      await updateRecord('t_newsletter_subscribers', {
        status: 'unsubscribed',
        unsubscribed_at: new Date()
      }, { id: subscriber.id })

      return successResponse({
        email,
        status: 'unsubscribed',
        message: 'You have been successfully unsubscribed from the newsletter.'
      }, 'Unsubscribed successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN OPERATIONS - Require API key with 'newsletter' scope
    if (['GET', 'POST', 'PUT', 'DELETE'].includes(httpMethod) && queryParams.admin) {
      const authResult = await requireAuth('newsletter')(event)
      if (authResult.statusCode) return authResult
    }

    // ADMIN GET - Retrieve newsletter subscribers
    if (httpMethod === 'GET' && queryParams.admin) {
      const { page = 1, limit = 50, status, search } = queryParams
      const { page: validPage, limit: validLimit } = validatePagination(page, limit)
      const offset = (validPage - 1) * validLimit

      // Build conditions
      let conditions = {}
      if (status && ['active', 'unsubscribed'].includes(status)) {
        conditions.status = status
      }

      // If searching, we need to use a more complex query
      if (search) {
        const searchQuery = `
          SELECT * FROM t_newsletter_subscribers 
          WHERE (name LIKE ? OR email LIKE ?)
          ${status ? 'AND status = ?' : ''}
          ORDER BY subscribed_at DESC 
          LIMIT ${validLimit} OFFSET ${offset}
        `
        
        const searchParams = [`%${search}%`, `%${search}%`]
        if (status) {
          searchParams.push(status)
        }

        const result = await executeQuery(searchQuery, searchParams)
        
        if (!result.success) {
          return errorResponse('Failed to fetch newsletter subscribers', 500)
        }

        // Get total count for search
        const countQuery = `
          SELECT COUNT(*) as count FROM t_newsletter_subscribers 
          WHERE (name LIKE ? OR email LIKE ?)
          ${status ? 'AND status = ?' : ''}
        `
        
        const countResult = await executeQuery(countQuery, searchParams)
        const totalSubscribers = countResult.success ? countResult.data[0].count : 0

        const pagination = getPaginationMeta(validPage, totalSubscribers, validLimit)

        return successResponse({
          subscribers: result.data,
          pagination,
          filters: { status, search }
        }, 'Newsletter subscribers retrieved successfully', rateLimit.rateLimitHeaders)
      }

      // Regular query without search
      const subscribers = await getMany('t_newsletter_subscribers', conditions, {
        orderBy: 'subscribed_at DESC',
        limit: validLimit,
        offset
      })

      // Get total count
      const { getCount } = await import('./lib/db.js')
      const totalSubscribers = await getCount('t_newsletter_subscribers', conditions)
      const pagination = getPaginationMeta(validPage, totalSubscribers, validLimit)

      // Get statistics
      const stats = {
        total: await getCount('t_newsletter_subscribers'),
        active: await getCount('t_newsletter_subscribers', { status: 'active' }),
        unsubscribed: await getCount('t_newsletter_subscribers', { status: 'unsubscribed' })
      }

      return successResponse({
        subscribers,
        pagination,
        stats,
        filters: { status }
      }, 'Newsletter subscribers retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN GET - Get specific subscriber by ID
    if (httpMethod === 'GET' && pathParams.id) {
      const { id } = pathParams
      
      const subscriber = await getOne('t_newsletter_subscribers', { id })
      
      if (!subscriber) {
        return errorResponse('Newsletter subscriber not found', 404)
      }

      return successResponse(subscriber, 'Newsletter subscriber retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN POST - Manually add subscriber
    if (httpMethod === 'POST' && queryParams.admin) {
      const body = parseBody(event)
      
      // Validate newsletter data
      const validation = validateData(body, schemas.newsletter)
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      const { email, name } = validation.data

      // Check if email already exists
      const existingSubscriber = await getOne('t_newsletter_subscribers', { email })

      if (existingSubscriber) {
        return errorResponse('Email already exists in newsletter list', 400)
      }

      // Create new subscription
      const subscriberId = await insertRecord('t_newsletter_subscribers', {
        email,
        name: name || null,
        status: 'active'
      })

      if (!subscriberId) {
        return errorResponse('Failed to add subscriber', 500)
      }

      const newSubscriber = await getOne('t_newsletter_subscribers', { id: subscriberId })
      return successResponse(newSubscriber, 'Subscriber added successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN PUT - Update subscriber
    if (httpMethod === 'PUT') {
      const { id } = pathParams
      const body = parseBody(event)
      
      if (!id) {
        return errorResponse('Subscriber ID required in path', 400)
      }

      // Check if subscriber exists
      const existingSubscriber = await getOne('t_newsletter_subscribers', { id })
      if (!existingSubscriber) {
        return errorResponse('Newsletter subscriber not found', 404)
      }

      // Only allow updating certain fields
      const allowedUpdates = ['name', 'status']
      const updates = {}
      
      Object.keys(body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = body[key]
        }
      })

      if (Object.keys(updates).length === 0) {
        return errorResponse('No valid update fields provided. Allowed fields: name, status', 400)
      }

      // Validate status if provided
      if (updates.status && !['active', 'unsubscribed'].includes(updates.status)) {
        return errorResponse('Status must be either "active" or "unsubscribed"', 400)
      }

      // Set unsubscribed_at when changing to unsubscribed status
      if (updates.status === 'unsubscribed' && existingSubscriber.status !== 'unsubscribed') {
        updates.unsubscribed_at = new Date()
      }

      // Clear unsubscribed_at when reactivating
      if (updates.status === 'active' && existingSubscriber.status === 'unsubscribed') {
        updates.unsubscribed_at = null
      }

      const updated = await updateRecord('t_newsletter_subscribers', updates, { id })

      if (!updated) {
        return errorResponse('Failed to update subscriber', 500)
      }

      const updatedSubscriber = await getOne('t_newsletter_subscribers', { id })
      return successResponse(updatedSubscriber, 'Subscriber updated successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN DELETE - Permanently remove subscriber
    if (httpMethod === 'DELETE' && queryParams.admin) {
      const { id } = pathParams
      
      if (!id) {
        return errorResponse('Subscriber ID required in path', 400)
      }

      const deleted = await deleteRecord('t_newsletter_subscribers', { id })
      
      if (!deleted) {
        return errorResponse('Newsletter subscriber not found', 404)
      }

      return successResponse(null, 'Subscriber permanently deleted', rateLimit.rateLimitHeaders)
    }

    // ADMIN POST - Send newsletter to all active subscribers
    if (httpMethod === 'POST' && queryParams.admin && queryParams.action === 'send') {
      const body = parseBody(event)
      const { subject, content, sendToTest = false, testEmail = null } = body

      if (!subject || !content) {
        return errorResponse('Subject and content are required', 400)
      }

      try {
        let recipients = []

        if (sendToTest && testEmail) {
          // Send test email
          const validation = validateData({ email: testEmail }, { email: schemas.newsletter.email })
          if (!validation.isValid) {
            return errorResponse('Invalid test email format', 400)
          }
          recipients = [{ email: testEmail, name: 'Test User' }]
        } else {
          // Get all active subscribers
          const activeSubscribers = await getMany('t_newsletter_subscribers', { status: 'active' })
          recipients = activeSubscribers.map(sub => ({ email: sub.email, name: sub.name }))
        }

        if (recipients.length === 0) {
          return errorResponse('No recipients found', 400)
        }

        // Create email template
        const { createTransporter } = await import('./lib/email.js')
        const transporter = createTransporter()

        const emailTemplate = {
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                ${process.env.SITE_NAME || 'Newsletter'}
              </h2>
              <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
                ${content.replace(/\n/g, '<br>')}
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #64748b;">
                <p style="margin: 0;">
                  You received this email because you subscribed to our newsletter.
                  <a href="${process.env.SITE_URL}/newsletter/unsubscribe?email={{EMAIL}}" style="color: #1e40af;">
                    Unsubscribe here
                  </a>
                </p>
              </div>
            </div>
          `,
          text: `${content}\n\nYou can unsubscribe at: ${process.env.SITE_URL}/newsletter/unsubscribe`
        }

        // Send emails (in batches to avoid overwhelming SMTP)
        const batchSize = 10
        let sentCount = 0
        let failedCount = 0

        for (let i = 0; i < recipients.length; i += batchSize) {
          const batch = recipients.slice(i, i + batchSize)
          
          const promises = batch.map(async (recipient) => {
            try {
              const personalizedHtml = emailTemplate.html.replace('{{EMAIL}}', encodeURIComponent(recipient.email))
              
              const mailOptions = {
                from: `"${process.env.SITE_NAME}" <${process.env.SMTP_USER}>`,
                to: recipient.email,
                subject: emailTemplate.subject,
                text: emailTemplate.text,
                html: personalizedHtml
              }

              await transporter.sendMail(mailOptions)
              sentCount++
            } catch (error) {
              console.error(`Failed to send newsletter to ${recipient.email}:`, error)
              failedCount++
            }
          })

          await Promise.all(promises)
          
          // Small delay between batches
          if (i + batchSize < recipients.length) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }

        return successResponse({
          totalRecipients: recipients.length,
          sentCount,
          failedCount,
          testMode: sendToTest
        }, `Newsletter ${sendToTest ? 'test' : 'campaign'} completed`, rateLimit.rateLimitHeaders)

      } catch (error) {
        console.error('Newsletter sending error:', error)
        return errorResponse('Failed to send newsletter', 500)
      }
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    console.error('Newsletter function error:', error)
    return errorResponse('Internal server error', 500)
  }
})

export { handler }