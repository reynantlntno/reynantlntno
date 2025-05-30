const { connectToDatabase, getModels } = require('../utils/db');
const { sendContactNotification } = require('../utils/mailer');

/**
 * Handle contact form submissions
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
    const { name, email, message, phone } = JSON.parse(event.body);
    
    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Missing required fields',
          required: ['name', 'email', 'message']
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

    // Connect to database
    await connectToDatabase();
    const { Message } = getModels();
    
    // Save message to database
    const newMessage = new Message({
      name,
      email,
      phone: phone || '',
      message,
      status: 'new'
    });
    
    await newMessage.save();
    
    // Send email notification
    try {
      await sendContactNotification({ name, email, message, phone });
    } catch (emailError) {
      console.error('Error sending contact notification:', emailError);
      // Continue with the response even if email fails
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Contact form submitted successfully',
        id: newMessage._id
      }),
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error submitting contact form', error: error.message }),
    };
  }
};