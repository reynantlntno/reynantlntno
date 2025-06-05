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

  // Rate limiting
  const rateLimitResult = rateLimit.middleware(50, 60000)(event)
  if (!rateLimitResult.allowed) return rateLimitResult

  const startTime = Date.now()
  
  try {
    const method = event.httpMethod
    const path = event.path.replace('/.netlify/functions/appointments', '') || '/'
    const queryParams = utils.getQueryParams(event)
    
    let response
    
    switch (method) {
      case 'GET':
        if (path === '/slots' || path === '/slots/') {
          // Public endpoint - get available slots
          response = await getSlots(queryParams)
        } else if (path.match(/^\/[A-Z0-9\-]+$/)) {
          // Public endpoint - get appointment by reference code
          const referenceCode = path.substring(1)
          response = await getAppointmentByReference(referenceCode)
        } else if (path === '/' || path === '') {
          // Admin endpoint - get all appointments
          const authResult = await auth.verifyMasterApiKey(event)
          if (!authResult.valid) {
            return utils.errorResponse(authResult.error, 401)
          }
          response = await getAppointments(queryParams)
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'POST':
        if (path === '/' || path === '') {
          // Public endpoint - create new appointment
          response = await createAppointment(utils.parseRequestBody(event), event)
        } else if (path === '/slots' || path === '/slots/') {
          // Admin endpoint - create appointment slot
          const authResult = await auth.verifyMasterApiKey(event)
          if (!authResult.valid) {
            return utils.errorResponse(authResult.error, 401)
          }
          response = await createSlot(utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'PUT':
        // Admin endpoint - update appointment or slot
        const authResultPut = await auth.verifyMasterApiKey(event)
        if (!authResultPut.valid) {
          return utils.errorResponse(authResultPut.error, 401)
        }
        
        if (path.match(/^\/[A-Z0-9\-]+$/)) {
          const referenceCode = path.substring(1)
          response = await updateAppointment(referenceCode, utils.parseRequestBody(event))
        } else if (path.match(/^\/slots\/\d+$/)) {
          const slotId = path.split('/')[2]
          response = await updateSlot(slotId, utils.parseRequestBody(event))
        } else {
          response = utils.errorResponse('Endpoint not found', 404)
        }
        break

      case 'DELETE':
        // Admin endpoint - delete appointment or slot
        const authResultDelete = await auth.verifyMasterApiKey(event)
        if (!authResultDelete.valid) {
          return utils.errorResponse(authResultDelete.error, 401)
        }
        
        if (path.match(/^\/[A-Z0-9\-]+$/)) {
          const referenceCode = path.substring(1)
          response = await deleteAppointment(referenceCode)
        } else if (path.match(/^\/slots\/\d+$/)) {
          const slotId = path.split('/')[2]
          response = await deleteSlot(slotId)
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
    console.log(`Appointments function executed in ${endTime - startTime}ms`)
    
    return response
    
  } catch (error) {
    console.error('Appointments function error:', error)
    return utils.errorResponse('Internal server error', 500)
  }
}

async function getSlots(params) {
  try {
    const {
      date,
      start_date,
      end_date,
      recurring,
      available = 'true'
    } = params
    
    let whereConditions = ['is_active = ?']
    let queryParams = [true]
    
    // Filter by specific date
    if (date) {
      const targetDate = new Date(date)
      const dayOfWeek = targetDate.getDay()
      
      whereConditions.push('(specific_date = ? OR (recurring = 1 AND day_of_week = ?))')
      queryParams.push(date, dayOfWeek)
    }
    
    // Filter by date range
    if (start_date && end_date) {
      whereConditions.push('(specific_date BETWEEN ? AND ? OR recurring = 1)')
      queryParams.push(start_date, end_date)
    }
    
    // Filter by recurring status
    if (recurring !== undefined) {
      whereConditions.push('recurring = ?')
      queryParams.push(recurring === 'true' ? 1 : 0)
    }
    
    const whereClause = `WHERE ${whereConditions.join(' AND ')}`
    
    const slotsQuery = `
      SELECT id, day_of_week, specific_date, start_time, end_time, capacity, is_active, recurring, created_at, updated_at
      FROM t_appointment_slots 
      ${whereClause}
      ORDER BY specific_date, day_of_week, start_time
    `
    
    const slots = await db.query(slotsQuery, queryParams)
    
    // If available filter is requested, check booking counts for each slot
    if (available === 'true') {
      const slotsWithAvailability = await Promise.all(slots.map(async (slot) => {
        let bookedCount = 0
        
        if (date) {
          // Check bookings for specific date
          const bookingQuery = `
            SELECT COUNT(*) as count 
            FROM t_appointments 
            WHERE slot_id = ? AND appointment_date = ? AND status NOT IN ('cancelled')
          `
          const [{ count }] = await db.query(bookingQuery, [slot.id, date])
          bookedCount = count
        }
        
        return {
          ...slot,
          booked_count: bookedCount,
          available: bookedCount < slot.capacity
        }
      }))
      
      // Filter only available slots
      return utils.successResponse(slotsWithAvailability.filter(slot => slot.available))
    }
    
    return utils.successResponse(slots)
    
  } catch (error) {
    console.error('Error fetching slots:', error)
    return utils.errorResponse('Failed to fetch slots', 500)
  }
}

async function createAppointment(appointmentData, event) {
  try {
    // Validate appointment data
    const validationResult = validation.validateAppointment(appointmentData)
    if (!validationResult.isValid) {
      return utils.errorResponse('Validation failed', 400, validationResult.errors)
    }
    
    const { slot_id, appointment_date, name, email, phone, subject, message } = appointmentData
    
    // Check if slot exists and is active
    const slot = await db.queryOne(
      'SELECT * FROM t_appointment_slots WHERE id = ? AND is_active = ?',
      [slot_id, true]
    )
    
    if (!slot) {
      return utils.errorResponse('Appointment slot not found or inactive', 404)
    }
    
    // Check if the appointment date is valid for the slot
    const appointmentDateObj = new Date(appointment_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Don't allow past dates
    if (appointmentDateObj < today) {
      return utils.errorResponse('Cannot book appointments for past dates', 400)
    }
    
    // Don't allow too far in the future (6 months)
    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + 6)
    if (appointmentDateObj > maxDate) {
      return utils.errorResponse('Cannot book appointments more than 6 months in advance', 400)
    }
    
    const dayOfWeek = appointmentDateObj.getDay()
    
    let isValidDate = false
    
    if (slot.specific_date) {
      // Slot is for a specific date
      isValidDate = slot.specific_date === appointment_date
    } else if (slot.recurring) {
      // Slot is recurring on specific day of week
      isValidDate = slot.day_of_week === dayOfWeek
    }
    
    if (!isValidDate) {
      return utils.errorResponse('Selected date is not valid for this time slot', 400)
    }
    
    // Check slot availability
    const bookingCountQuery = `
      SELECT COUNT(*) as count 
      FROM t_appointments 
      WHERE slot_id = ? AND appointment_date = ? AND status NOT IN ('cancelled')
    `
    const [{ count: bookedCount }] = await db.query(bookingCountQuery, [slot_id, appointment_date])
    
    if (bookedCount >= slot.capacity) {
      return utils.errorResponse('This time slot is fully booked', 409)
    }
    
    // Check for duplicate appointments (same email, same date)
    const duplicateQuery = `
      SELECT id FROM t_appointments 
      WHERE email = ? AND appointment_date = ? AND status NOT IN ('cancelled')
    `
    const existingAppointment = await db.queryOne(duplicateQuery, [email, appointment_date])
    
    if (existingAppointment) {
      return utils.errorResponse('You already have an appointment booked for this date', 409)
    }
    
    // Generate unique reference code
    const referenceCode = utils.generateReferenceCode()
    
    // Create appointment
    const appointmentId = await db.insert('t_appointments', {
      slot_id,
      appointment_date,
      name: validation.sanitizeString(name),
      email: validation.sanitizeString(email),
      phone: phone ? validation.sanitizeString(phone) : null,
      subject: validation.sanitizeString(subject),
      message: message ? validation.sanitizeString(message) : null,
      reference_code: referenceCode,
      status: 'pending',
      created_at: new Date()
    })
    
    // Fetch the created appointment with slot details
    const createdAppointment = await db.queryOne(`
      SELECT a.*, s.start_time, s.end_time, s.day_of_week, s.specific_date
      FROM t_appointments a
      JOIN t_appointment_slots s ON a.slot_id = s.id
      WHERE a.id = ?
    `, [appointmentId])
    
    // Send confirmation email
    try {
      await email.sendAppointmentConfirmation({
        ...createdAppointment,
        slot: {
          start_time: createdAppointment.start_time,
          end_time: createdAppointment.end_time,
          day_of_week: createdAppointment.day_of_week,
          specific_date: createdAppointment.specific_date
        }
      })
    } catch (emailError) {
      console.error('Failed to send appointment confirmation email:', emailError)
      // Don't fail the request if email fails - appointment is still created
    }
    
    return utils.successResponse({
      id: appointmentId,
      reference_code: referenceCode,
      message: 'Appointment booked successfully! A confirmation email has been sent.',
      appointment: {
        reference_code: referenceCode,
        date: appointment_date,
        time: `${createdAppointment.start_time} - ${createdAppointment.end_time}`,
        status: 'pending'
      },
      tracking_url: `${process.env.SITE_URL}/appointments/${referenceCode}`
    }, 201)
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    return utils.errorResponse('Failed to create appointment', 500)
  }
}

async function getAppointmentByReference(referenceCode) {
  try {
    if (!referenceCode) {
      return utils.errorResponse('Reference code is required', 400)
    }
    
    const appointmentQuery = `
      SELECT a.*, s.start_time, s.end_time, s.day_of_week, s.specific_date, s.capacity
      FROM t_appointments a
      JOIN t_appointment_slots s ON a.slot_id = s.id
      WHERE a.reference_code = ?
    `
    
    const appointment = await db.queryOne(appointmentQuery, [referenceCode])
    
    if (!appointment) {
      return utils.errorResponse('Appointment not found', 404)
    }
    
    // Format response
    const formattedAppointment = {
      ...appointment,
      slot: {
        id: appointment.slot_id,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        day_of_week: appointment.day_of_week,
        specific_date: appointment.specific_date,
        capacity: appointment.capacity
      }
    }
    
    // Remove redundant fields
    delete formattedAppointment.start_time
    delete formattedAppointment.end_time
    delete formattedAppointment.day_of_week
    delete formattedAppointment.specific_date
    delete formattedAppointment.capacity
    
    return utils.successResponse(formattedAppointment)
    
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return utils.errorResponse('Failed to fetch appointment', 500)
  }
}

async function getAppointments(params) {
  try {
    const {
      page = 1,
      limit = 20,
      status = '',
      date = '',
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = params
    
    const pageNum = parseInt(page)
    const limitNum = Math.min(parseInt(limit), 100) // Cap at 100
    
    let whereConditions = []
    let queryParams = []
    
    // Filter by status
    if (status) {
      whereConditions.push('a.status = ?')
      queryParams.push(status)
    }
    
    // Filter by appointment date
    if (date) {
      whereConditions.push('a.appointment_date = ?')
      queryParams.push(date)
    }
    
    // Search functionality
    if (search) {
      whereConditions.push('(a.name LIKE ? OR a.email LIKE ? OR a.subject LIKE ? OR a.reference_code LIKE ?)')
      const searchTerm = `%${search}%`
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''
    
    // Validate sort parameters
    const validSortFields = ['id', 'name', 'email', 'appointment_date', 'status', 'created_at', 'updated_at']
    const validSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toUpperCase() : 'DESC'
    
    const orderClause = `ORDER BY a.${validSortBy} ${validSortOrder}`
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM t_appointments a 
      JOIN t_appointment_slots s ON a.slot_id = s.id 
      ${whereClause}
    `
    const [{ total }] = await db.query(countQuery, queryParams)
    
    // Get appointments
    const offset = (pageNum - 1) * limitNum
    const appointmentsQuery = `
      SELECT a.*, s.start_time, s.end_time, s.day_of_week, s.specific_date
      FROM t_appointments a
      JOIN t_appointment_slots s ON a.slot_id = s.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `
    
    const appointments = await db.query(appointmentsQuery, [...queryParams, limitNum, offset])
    
    // Format appointments with slot details
    const formattedAppointments = appointments.map(appointment => ({
      ...appointment,
      slot: {
        id: appointment.slot_id,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        day_of_week: appointment.day_of_week,
        specific_date: appointment.specific_date
      }
    }))
    
    // Get appointment statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_appointments,
        SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN a.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_count,
        SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN a.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count,
        COUNT(CASE WHEN a.appointment_date >= CURDATE() THEN 1 END) as upcoming_count,
        COUNT(CASE WHEN a.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as week_count
      FROM t_appointments a
      JOIN t_appointment_slots s ON a.slot_id = s.id
    `
    const [statistics] = await db.query(statsQuery)
    
    const pagination = utils.generatePagination(pageNum, limitNum, total)
    
    return utils.successResponse({
      appointments: formattedAppointments,
      pagination,
      statistics
    })
    
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return utils.errorResponse('Failed to fetch appointments', 500)
  }
}

async function updateAppointment(referenceCode, updateData) {
  try {
    if (!referenceCode) {
      return utils.errorResponse('Reference code is required', 400)
    }
    
    // Check if appointment exists
    const existingAppointment = await db.queryOne(
      'SELECT * FROM t_appointments WHERE reference_code = ?',
      [referenceCode]
    )
    
    if (!existingAppointment) {
      return utils.errorResponse('Appointment not found', 404)
    }
    
    // Validate allowed fields for updates
    const allowedFields = ['status', 'notes']
    const sanitizedData = utils.sanitizeData(updateData, allowedFields)
    
    if (Object.keys(sanitizedData).length === 0) {
      return utils.errorResponse('No valid fields to update', 400)
    }
    
    // Validate status if provided
    if (sanitizedData.status) {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed']
      if (!validStatuses.includes(sanitizedData.status)) {
        return utils.errorResponse('Invalid status value', 400)
      }
    }
    
    // Set updated timestamp
    sanitizedData.updated_at = new Date()
    
    // Update appointment
    await db.update('t_appointments', sanitizedData, 'reference_code = ?', [referenceCode])
    
    // Fetch updated appointment
    const updatedAppointment = await db.queryOne(`
      SELECT a.*, s.start_time, s.end_time, s.day_of_week, s.specific_date
      FROM t_appointments a
      JOIN t_appointment_slots s ON a.slot_id = s.id
      WHERE a.reference_code = ?
    `, [referenceCode])
    
    // Send status update email if status changed
    if (sanitizedData.status && sanitizedData.status !== existingAppointment.status) {
      try {
        await email.sendAppointmentStatusUpdate(
          updatedAppointment,
          existingAppointment.status,
          sanitizedData.status
        )
      } catch (emailError) {
        console.error('Failed to send appointment status update email:', emailError)
      }
    }
    
    return utils.successResponse({
      message: 'Appointment updated successfully',
      appointment: {
        ...updatedAppointment,
        slot: {
          start_time: updatedAppointment.start_time,
          end_time: updatedAppointment.end_time,
          day_of_week: updatedAppointment.day_of_week,
          specific_date: updatedAppointment.specific_date
        }
      }
    })
    
  } catch (error) {
    console.error('Error updating appointment:', error)
    return utils.errorResponse('Failed to update appointment', 500)
  }
}

async function deleteAppointment(referenceCode) {
  try {
    if (!referenceCode) {
      return utils.errorResponse('Reference code is required', 400)
    }
    
    // Check if appointment exists
    const appointment = await db.queryOne(
      'SELECT * FROM t_appointments WHERE reference_code = ?',
      [referenceCode]
    )
    
    if (!appointment) {
      return utils.errorResponse('Appointment not found', 404)
    }
    
    // Delete appointment
    const deleteResult = await db.delete('t_appointments', 'reference_code = ?', [referenceCode])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete appointment', 500)
    }
    
    return utils.successResponse({
      message: 'Appointment deleted successfully',
      deleted_appointment: {
        reference_code: appointment.reference_code,
        name: appointment.name,
        email: appointment.email,
        appointment_date: appointment.appointment_date
      }
    })
    
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return utils.errorResponse('Failed to delete appointment', 500)
  }
}

async function createSlot(slotData) {
  try {
    const {
      day_of_week,
      specific_date,
      start_time,
      end_time,
      capacity = 1,
      recurring = false
    } = slotData
    
    // Validation
    if (!start_time || !end_time) {
      return utils.errorResponse('Start time and end time are required', 400)
    }
    
    if (!recurring && !specific_date) {
      return utils.errorResponse('Either specific_date or recurring must be specified', 400)
    }
    
    if (recurring && (day_of_week === undefined || day_of_week === null)) {
      return utils.errorResponse('day_of_week is required for recurring slots', 400)
    }
    
    if (capacity < 1 || capacity > 10) {
      return utils.errorResponse('Capacity must be between 1 and 10', 400)
    }
    
    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return utils.errorResponse('Invalid time format. Use HH:MM format', 400)
    }
    
    // Validate that end time is after start time
    const startMinutes = timeToMinutes(start_time)
    const endMinutes = timeToMinutes(end_time)
    
    if (endMinutes <= startMinutes) {
      return utils.errorResponse('End time must be after start time', 400)
    }
    
    // Create slot
    const slotId = await db.insert('t_appointment_slots', {
      day_of_week: recurring ? day_of_week : null,
      specific_date: recurring ? null : specific_date,
      start_time,
      end_time,
      capacity,
      is_active: true,
      recurring,
      created_at: new Date()
    })
    
    // Fetch created slot
    const createdSlot = await db.queryOne(
      'SELECT * FROM t_appointment_slots WHERE id = ?',
      [slotId]
    )
    
    return utils.successResponse({
      message: 'Appointment slot created successfully',
      slot: createdSlot
    }, 201)
    
  } catch (error) {
    console.error('Error creating slot:', error)
    return utils.errorResponse('Failed to create slot', 500)
  }
}

async function updateSlot(slotId, updateData) {
  try {
    if (!slotId) {
      return utils.errorResponse('Slot ID is required', 400)
    }
    
    // Check if slot exists
    const existingSlot = await db.queryOne(
      'SELECT * FROM t_appointment_slots WHERE id = ?',
      [slotId]
    )
    
    if (!existingSlot) {
      return utils.errorResponse('Slot not found', 404)
    }
    
    // Validate allowed fields
    const allowedFields = ['start_time', 'end_time', 'capacity', 'is_active']
    const sanitizedData = utils.sanitizeData(updateData, allowedFields)
    
    if (Object.keys(sanitizedData).length === 0) {
      return utils.errorResponse('No valid fields to update', 400)
    }
    
    // Validate capacity if provided
    if (sanitizedData.capacity !== undefined) {
      if (sanitizedData.capacity < 1 || sanitizedData.capacity > 10) {
        return utils.errorResponse('Capacity must be between 1 and 10', 400)
      }
    }
    
    // Validate time format if provided
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (sanitizedData.start_time && !timeRegex.test(sanitizedData.start_time)) {
      return utils.errorResponse('Invalid start time format. Use HH:MM format', 400)
    }
    
    if (sanitizedData.end_time && !timeRegex.test(sanitizedData.end_time)) {
      return utils.errorResponse('Invalid end time format. Use HH:MM format', 400)
    }
    
    // Set updated timestamp
    sanitizedData.updated_at = new Date()
    
    // Update slot
    await db.update('t_appointment_slots', sanitizedData, 'id = ?', [slotId])
    
    // Fetch updated slot
    const updatedSlot = await db.queryOne(
      'SELECT * FROM t_appointment_slots WHERE id = ?',
      [slotId]
    )
    
    return utils.successResponse({
      message: 'Appointment slot updated successfully',
      slot: updatedSlot
    })
    
  } catch (error) {
    console.error('Error updating slot:', error)
    return utils.errorResponse('Failed to update slot', 500)
  }
}

async function deleteSlot(slotId) {
  try {
    if (!slotId) {
      return utils.errorResponse('Slot ID is required', 400)
    }
    
    // Check if slot exists
    const slot = await db.queryOne(
      'SELECT * FROM t_appointment_slots WHERE id = ?',
      [slotId]
    )
    
    if (!slot) {
      return utils.errorResponse('Slot not found', 404)
    }
    
    // Check if slot has active appointments
    const activeAppointments = await db.queryOne(
      'SELECT COUNT(*) as count FROM t_appointments WHERE slot_id = ? AND status NOT IN ("cancelled", "completed")',
      [slotId]
    )
    
    if (activeAppointments.count > 0) {
      return utils.errorResponse('Cannot delete slot with active appointments', 409)
    }
    
    // Delete slot
    const deleteResult = await db.delete('t_appointment_slots', 'id = ?', [slotId])
    
    if (deleteResult.affectedRows === 0) {
      return utils.errorResponse('Failed to delete slot', 500)
    }
    
    return utils.successResponse({
      message: 'Appointment slot deleted successfully',
      deleted_slot: {
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        specific_date: slot.specific_date,
        day_of_week: slot.day_of_week
      }
    })
    
  } catch (error) {
    console.error('Error deleting slot:', error)
    return utils.errorResponse('Failed to delete slot', 500)
  }
}

// Helper function to convert time string to minutes
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}