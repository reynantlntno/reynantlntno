const { connectToDatabase, getModels } = require('../utils/db');
const { sendAppointmentConfirmation } = require('../utils/mailer');

/**
 * Create a new appointment
 * @param {Object} event - Netlify Function event
 * @returns {Promise<Object>} HTTP response
 */
exports.handler = async (event, context) => {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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

  try {
    const { name, email, phone, date, timeSlot, purpose, notes } = JSON.parse(event.body);
    
    // Basic validation
    if (!name || !email || !date || !timeSlot || !purpose) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Missing required fields',
          required: ['name', 'email', 'date', 'timeSlot', 'purpose']
        }),
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid email format' }),
      };
    }

    await connectToDatabase();
    const { Appointment } = getModels();
    
    // Check if the time slot is available
    const appointmentDate = new Date(date);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingAppointment = await Appointment.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      timeSlot,
      status: { $ne: 'cancelled' }
    });
    
    if (existingAppointment) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'This time slot is already booked' }),
      };
    }
    
    // Create the appointment
    const newAppointment = new Appointment({
      name,
      email,
      phone,
      date: appointmentDate,
      timeSlot,
      purpose,
      notes,
      status: 'pending'
    });
    
    await newAppointment.save();
    
    // Send confirmation email
    try {
      await sendAppointmentConfirmation({
        name,
        email,
        date: appointmentDate,
        timeSlot,
        purpose
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with the response even if email fails
    }
    
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Appointment created successfully',
        appointment: {
          id: newAppointment._id,
          name,
          date: appointmentDate,
          timeSlot,
          status: 'pending'
        }
      }),
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating appointment', error: error.message }),
    };
  }
};