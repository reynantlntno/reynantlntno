const { connectToDatabase, getModels } = require('../utils/db');

/**
 * Get available appointment dates and time slots
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: JSON.stringify({ message: 'Preflight request successful' }),
    };
  }

  // Ensure method is GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    await connectToDatabase();
    const { Appointment } = getModels();
    
    const params = event.queryStringParameters || {};
    const { date } = params;

    // If a specific date is provided, get time slots for that date
    if (date) {
      const requestedDate = new Date(date);
      const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));
      
      // Get existing appointments for the date
      const existingAppointments = await Appointment.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'cancelled' }
      }).select('timeSlot').lean();
      
      // Define all possible time slots (9 AM to 5 PM)
      const allTimeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
      ];
      
      // Filter out booked slots
      const bookedSlots = existingAppointments.map(appt => appt.timeSlot);
      const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
      
      // Return available time slots for the requested date
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          date: date,
          timeSlots: availableSlots.map(slot => ({
            time: slot,
            status: 'available'
          })),
          message: 'Time slots retrieved successfully'
        }),
      };
    } 
    // If no date is provided, get available dates for the next 30 days
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      // Get dates with appointments in the next 30 days
      const bookedDates = await Appointment.find({
        date: { $gte: today, $lte: thirtyDaysFromNow },
        status: { $ne: 'cancelled' }
      }).distinct('date');
      
      // Generate array of all dates in the next 30 days
      const allDates = [];
      for (let d = new Date(today); d <= thirtyDaysFromNow; d.setDate(d.getDate() + 1)) {
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (d.getDay() !== 0 && d.getDay() !== 6) {
          allDates.push(new Date(d));
        }
      }
      
      // For each date, check if it has 9 appointments (fully booked)
      const availableDates = await Promise.all(allDates.map(async (date) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const count = await Appointment.countDocuments({
          date: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'cancelled' }
        });
        
        // If less than 9 appointments, it's available
        return {
          date: date.toISOString(),
          status: count >= 9 ? 'full' : 'available',
          availableSlots: 9 - count
        };
      }));
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          availableDates,
          message: 'Available dates retrieved successfully'
        }),
      };
    }
  } catch (error) {
    console.error('Error retrieving appointments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error retrieving appointments', error: error.message }),
    };
  }
};