const { connectToDatabase, getModels } = require('../utils/db');
const { sendMail } = require('../utils/mailer');

/**
 * Update an existing appointment
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

  try {
    const params = event.queryStringParameters || {};
    const { id } = params;
    
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Appointment ID is required' }),
      };
    }
    
    const updates = JSON.parse(event.body);
    
    // Connect to database
    await connectToDatabase();
    const { Appointment } = getModels();
    
    // Find the appointment
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Appointment not found' }),
      };
    }
    
    // Check if trying to update to a conflicting time slot
    if (updates.date && updates.timeSlot) {
      const appointmentDate = new Date(updates.date);
      const startOfDay = new Date(appointmentDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(appointmentDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: id }, // Exclude current appointment
        date: { $gte: startOfDay, $lte: endOfDay },
        timeSlot: updates.timeSlot,
        status: { $ne: 'cancelled' }
      });
      
      if (existingAppointment) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: 'This time slot is already booked' }),
        };
      }
    }
    
    // Update the appointment
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        appointment[key] = updates[key];
      }
    });
    
    await appointment.save();
    
    // If status changed to confirmed or cancelled, send notification email
    if (updates.status && (updates.status === 'confirmed' || updates.status === 'cancelled')) {
      const statusText = updates.status === 'confirmed' ? 'Confirmed' : 'Cancelled';
      
      try {
        await sendMail({
          to: appointment.email,
          subject: `Appointment ${statusText}`,
          html: `
            <h2>Appointment ${statusText}</h2>
            <p>Hello ${appointment.name},</p>
            <p>Your appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot} has been ${updates.status}.</p>
            ${updates.status === 'cancelled' ? '<p>If you would like to reschedule, please visit our website or contact us directly.</p>' : ''}
            <p>Thank you for your understanding.</p>
          `,
          text: `
            Appointment ${statusText}\n\n
            Hello ${appointment.name},\n
            Your appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.timeSlot} has been ${updates.status}.\n
            ${updates.status === 'cancelled' ? 'If you would like to reschedule, please visit our website or contact us directly.\n' : ''}
            Thank you for your understanding.
          `
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Continue with the response even if email fails
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Appointment updated successfully',
        appointment: {
          id: appointment._id,
          name: appointment.name,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          status: appointment.status
        }
      }),
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating appointment', error: error.message }),
    };
  }
};