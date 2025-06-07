import { getMany, getOne, insertRecord, executeQuery, updateRecord, deleteRecord } from './lib/db.js'
import { asyncHandler, successResponse, errorResponse, parseBody, getQueryParams, getPathParams, formatDateForDB } from './lib/utils.js'
import { validateData, schemas, generateReferenceCode } from './lib/validation.js'
import { rateLimitMiddleware } from './lib/rate-limit.js'
import { requireAuth } from './lib/auth.js'
import { sendEmail } from './lib/email.js'

function formatDateForInput(date) {
  if (!date) return null
  const d = new Date(date)
  return d.toISOString().split('T')[0] // Returns YYYY-MM-DD format
}

const handler = asyncHandler(async (event, context) => {
  // Apply rate limiting
  const rateLimit = await rateLimitMiddleware('contact')(event)
  if (rateLimit.statusCode) return rateLimit

  const { httpMethod } = event
  const pathParams = getPathParams(event)
  const queryParams = getQueryParams(event)

  try {
    // PUBLIC GET OPERATIONS (No authentication required)
    if (httpMethod === 'GET') {
      // Track appointment by reference code via /appointments/track?reference=CODE
      if (pathParams.pathParam === 'track') {
        const { reference } = queryParams;

        if (!reference) {
          return errorResponse('Reference code is required', 400);
        }

        const appointmentQuery = `
          SELECT a.*, s.start_time, s.end_time
          FROM t_appointments a
          JOIN t_appointment_slots s ON a.slot_id = s.id
          WHERE a.reference_code = ?
        `;

        const result = await executeQuery(appointmentQuery, [reference]);

        if (!result.success || result.data.length === 0) {
          return errorResponse('Appointment not found', 404);
        }

        const appointment = result.data[0];

        // Remove sensitive information for public access
        delete appointment.email;
        delete appointment.phone;

        return successResponse(appointment, 'Appointment retrieved successfully', rateLimit.rateLimitHeaders);
      }

      // Get available slots for a specific date
      if (queryParams.date) {
        const { date } = queryParams
        const requestedDate = new Date(date)
        const dayOfWeek = requestedDate.getDay()

        const slotsQuery = `
          SELECT s.*, 
                 COALESCE(SUM(CASE WHEN a.status NOT IN ('cancelled') THEN 1 ELSE 0 END), 0) as booked_count
          FROM t_appointment_slots s
          LEFT JOIN t_appointments a ON s.id = a.slot_id AND a.appointment_date = ?
          WHERE s.is_active = 1 
            AND (
              (s.recurring = 1 AND s.day_of_week = ?) 
              OR (s.recurring = 0 AND s.specific_date = ?)
            )
          GROUP BY s.id
          HAVING booked_count < s.capacity
          ORDER BY s.start_time ASC
        `

        const slotsResult = await executeQuery(slotsQuery, [date, dayOfWeek, date])
        
        if (!slotsResult.success) {
          return errorResponse('Failed to fetch available slots', 500)
        }

        const availableSlots = slotsResult.data.map(slot => ({
          id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          capacity: slot.capacity,
          available: slot.capacity - slot.booked_count
        }))

        return successResponse({ 
          date, 
          slots: availableSlots 
        }, 'Available slots retrieved successfully', rateLimit.rateLimitHeaders)
      }

      // Add this new handler for date range
      if (queryParams.startDate && queryParams.endDate) {
        try {
          console.log('Date range request:', { startDate: queryParams.startDate, endDate: queryParams.endDate })
          const { startDate, endDate } = queryParams
          
          // Query to get dates with available slots in the date range
          const availableDatesQuery = `
            SELECT DISTINCT availability.appointment_date
            FROM (
              SELECT dates.appointment_date, s.id as slot_id, 
                     COUNT(CASE WHEN a.status NOT IN ('cancelled') THEN 1 ELSE NULL END) as booked_count,
                     s.capacity
              FROM (
                SELECT DATE(CAST(? AS DATE) + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY) as appointment_date
                FROM (SELECT 0 as a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) as a
                CROSS JOIN (SELECT 0 as a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) as b
                CROSS JOIN (SELECT 0 as a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) as c
                WHERE DATE(CAST(? AS DATE) + INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY) <= CAST(? AS DATE)
              ) as dates
              INNER JOIN t_appointment_slots s ON 
                s.is_active = 1 AND (
                  (s.recurring = 1 AND s.day_of_week = WEEKDAY(dates.appointment_date) + 1) 
                  OR (s.recurring = 0 AND s.specific_date = dates.appointment_date)
                )
              LEFT JOIN t_appointments a ON s.id = a.slot_id AND a.appointment_date = dates.appointment_date
              GROUP BY dates.appointment_date, s.id, s.capacity
            ) as availability
            WHERE availability.booked_count < availability.capacity
            ORDER BY availability.appointment_date ASC
          `
          
          const datesResult = await executeQuery(availableDatesQuery, [startDate, startDate, endDate])
          
          console.log('Query result count:', datesResult?.data?.length || 0)
          console.log('First date in result:', datesResult?.data?.[0]?.appointment_date)
          
          if (!datesResult.success) {
            return errorResponse('Failed to fetch available dates', 500)
          }
          
          // Format dates in YYYY-MM-DD format
          const availableDates = datesResult.data.map(item => 
            formatDateForInput(new Date(item.appointment_date))
          )
          
          return successResponse({ 
            startDate,
            endDate, 
            dates: availableDates 
          }, 'Available dates retrieved successfully', rateLimit.rateLimitHeaders)
        } catch (error) {
          console.error('Date range error details:', error)
          return errorResponse('Failed to fetch available dates', 500, error.message)
        }
      }

      // Default: Get all appointment slots (public view)
      const slots = await getMany('t_appointment_slots', { is_active: 1 }, {
        orderBy: 'day_of_week ASC, start_time ASC'
      })

      return successResponse(slots, 'Appointment slots retrieved successfully', rateLimit.rateLimitHeaders)
    }

    // PUBLIC POST OPERATION - Book appointment (No authentication required)
    if (httpMethod === 'POST' && !queryParams.admin) {
      const body = parseBody(event)
      
      // Validate appointment data
      const validation = validateData(body, schemas.appointment)
      
      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      const { name, email, phone, subject, message, appointment_date, slot_id } = validation.data

      // Check if slot is available
      const slotCheckQuery = `
        SELECT s.*, 
               COALESCE(SUM(CASE WHEN a.status NOT IN ('cancelled') THEN 1 ELSE 0 END), 0) as booked_count
        FROM t_appointment_slots s
        LEFT JOIN t_appointments a ON s.id = a.slot_id AND a.appointment_date = ?
        WHERE s.id = ? AND s.is_active = 1
        GROUP BY s.id
      `

      const slotResult = await executeQuery(slotCheckQuery, [appointment_date, slot_id])
      
      if (!slotResult.success || slotResult.data.length === 0) {
        return errorResponse('Invalid or unavailable slot', 400)
      }

      const slot = slotResult.data[0]
      
      if (slot.booked_count >= slot.capacity) {
        return errorResponse('Slot is fully booked', 400)
      }

      // Generate unique reference code
      let referenceCode
      let isUnique = false
      let attempts = 0

      while (!isUnique && attempts < 10) {
        referenceCode = generateReferenceCode()
        const existing = await getOne('t_appointments', { reference_code: referenceCode })
        isUnique = !existing
        attempts++
      }

      if (!isUnique) {
        return errorResponse('Failed to generate unique reference code', 500)
      }

      // Create appointment
      const appointmentId = await insertRecord('t_appointments', {
        slot_id,
        appointment_date: formatDateForDB(appointment_date),
        name,
        email,
        phone: phone || null,
        subject,
        message: message || null,
        reference_code: referenceCode,
        status: 'pending'
      })

      if (!appointmentId) {
        return errorResponse('Failed to create appointment', 500)
      }

      // Send confirmation email
      const emailData = {
        name,
        email,
        date: new Date(appointment_date).toLocaleDateString(),
        time: `${slot.start_time} - ${slot.end_time}`,
        subject,
        referenceCode
      }

      await sendEmail('appointmentConfirmation', emailData, email)

      const responseData = {
        id: appointmentId,
        reference_code: referenceCode,
        status: 'pending',
        appointment_date,
        slot: {
          start_time: slot.start_time,
          end_time: slot.end_time
        }
      }

      return successResponse(responseData, 'Appointment booked successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN OPERATIONS - Require API key with 'appointments' scope
    if (['POST', 'PUT', 'DELETE'].includes(httpMethod) && queryParams.admin) {
      const authResult = await requireAuth('appointments')(event)
      if (authResult.statusCode) return authResult
    }

    // ADMIN GET OPERATIONS - Require API key with 'appointments' scope
    if (httpMethod === 'GET' && queryParams.admin) {
      const authResult = await requireAuth('appointments')(event)
      if (authResult.statusCode) return authResult

      const { type, status, date, limit, offset } = queryParams
      
      if (type === 'appointments') {
        // Get appointments with filtering
        let conditions = {}
        if (status) conditions.status = status
        if (date) conditions.appointment_date = date

        const appointments = await getMany('t_appointments', conditions, {
          orderBy: 'created_at DESC',
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0
        })

        return successResponse(appointments, 'Appointments retrieved successfully', rateLimit.rateLimitHeaders)
      }

      if (type === 'slots') {
        // Get all appointment slots (admin view)
        const slots = await getMany('t_appointment_slots', {}, {
          orderBy: 'day_of_week ASC, start_time ASC'
        })

        return successResponse(slots, 'Appointment slots retrieved successfully', rateLimit.rateLimitHeaders)
      }

      return errorResponse('Invalid admin operation type', 400)
    }

    // ADMIN POST - Create appointment slot
    if (httpMethod === 'POST' && queryParams.admin && queryParams.type === 'slot') {
      const body = parseBody(event)
      
      // Validate slot data
      const validation = validateData(body, {
        day_of_week: { required: false, validator: (val) => val === null || (Number.isInteger(val) && val >= 0 && val <= 6) },
        specific_date: { required: false, validator: (val) => val === null || !isNaN(new Date(val).getTime()) },
        start_time: { required: true, validator: (val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val) },
        end_time: { required: true, validator: (val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val) },
        capacity: { required: true, validator: (val) => Number.isInteger(val) && val > 0 },
        recurring: { required: false, validator: (val) => typeof val === 'boolean' },
        is_active: { required: false, validator: (val) => typeof val === 'boolean' }
      })

      if (!validation.isValid) {
        return errorResponse('Validation failed', 400, validation.errors)
      }

      const slotId = await insertRecord('t_appointment_slots', {
        ...validation.data,
        recurring: validation.data.recurring || false,
        is_active: validation.data.is_active !== false
      })

      if (!slotId) {
        return errorResponse('Failed to create appointment slot', 500)
      }

      const newSlot = await getOne('t_appointment_slots', { id: slotId })
      return successResponse(newSlot, 'Appointment slot created successfully', rateLimit.rateLimitHeaders)
    }

    // ADMIN PUT - Update appointment or slot
    if (httpMethod === 'PUT') {
      const { id } = pathParams
      const body = parseBody(event)
      const { type } = queryParams

      if (!id) {
        return errorResponse('ID parameter required in path', 400)
      }

      if (type === 'appointment') {
        // Update appointment (mainly status updates)
        const allowedUpdates = ['status', 'message']
        const updates = {}
        
        Object.keys(body).forEach(key => {
          if (allowedUpdates.includes(key)) {
            updates[key] = body[key]
          }
        })

        if (Object.keys(updates).length === 0) {
          return errorResponse('No valid update fields provided', 400)
        }

        updates.updated_at = new Date()

        const updated = await updateRecord('t_appointments', updates, { id })

        if (!updated) {
          return errorResponse('Appointment not found or update failed', 404)
        }

        // Send status update email if status changed
        if (updates.status) {
          const appointment = await getOne('t_appointments', { id })
          const slot = await getOne('t_appointment_slots', { id: appointment.slot_id })
          
          const emailData = {
            name: appointment.name,
            referenceCode: appointment.reference_code,
            oldStatus: body.oldStatus || 'pending',
            newStatus: updates.status,
            date: new Date(appointment.appointment_date).toLocaleDateString(),
            time: `${slot.start_time} - ${slot.end_time}`
          }

          await sendEmail('appointmentStatusUpdate', emailData, appointment.email)
        }

        const updatedAppointment = await getOne('t_appointments', { id })
        return successResponse(updatedAppointment, 'Appointment updated successfully', rateLimit.rateLimitHeaders)
      }

      if (type === 'slot') {
        // Update appointment slot
        const validation = validateData(body, {
          day_of_week: { required: false, validator: (val) => val === null || (Number.isInteger(val) && val >= 0 && val <= 6) },
          specific_date: { required: false, validator: (val) => val === null || !isNaN(new Date(val).getTime()) },
          start_time: { required: false, validator: (val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val) },
          end_time: { required: false, validator: (val) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val) },
          capacity: { required: false, validator: (val) => Number.isInteger(val) && val > 0 },
          recurring: { required: false, validator: (val) => typeof val === 'boolean' },
          is_active: { required: false, validator: (val) => typeof val === 'boolean' }
        })

        if (!validation.isValid) {
          return errorResponse('Validation failed', 400, validation.errors)
        }

        const updated = await updateRecord('t_appointment_slots', {
          ...validation.data,
          updated_at: new Date()
        }, { id })

        if (!updated) {
          return errorResponse('Appointment slot not found or update failed', 404)
        }

        const updatedSlot = await getOne('t_appointment_slots', { id })
        return successResponse(updatedSlot, 'Appointment slot updated successfully', rateLimit.rateLimitHeaders)
      }

      return errorResponse('Invalid type parameter. Use "appointment" or "slot"', 400)
    }

    // ADMIN DELETE - Remove appointment or slot
    if (httpMethod === 'DELETE') {
      const { id } = pathParams
      const { type } = queryParams

      if (!id) {
        return errorResponse('ID parameter required in path', 400)
      }

      if (type === 'appointment') {
        const deleted = await deleteRecord('t_appointments', { id })
        if (!deleted) {
          return errorResponse('Appointment not found', 404)
        }
        return successResponse(null, 'Appointment deleted successfully', rateLimit.rateLimitHeaders)
      }

      if (type === 'slot') {
        // Check if slot has existing appointments
        const existingAppointments = await getMany('t_appointments', { slot_id: id })
        if (existingAppointments.length > 0) {
          return errorResponse('Cannot delete slot with existing appointments', 400)
        }

        const deleted = await deleteRecord('t_appointment_slots', { id })
        if (!deleted) {
          return errorResponse('Appointment slot not found', 404)
        }
        return successResponse(null, 'Appointment slot deleted successfully', rateLimit.rateLimitHeaders)
      }

      return errorResponse('Invalid type parameter. Use "appointment" or "slot"', 400)
    }

    return errorResponse('Method not allowed', 405)
  } catch (error) {
    console.error('Appointments function error:', error)
    return errorResponse('Internal server error', 500)
  }
})

export { handler }