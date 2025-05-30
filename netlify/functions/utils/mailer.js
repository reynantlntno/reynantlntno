const nodemailer = require('nodemailer');
require('dotenv').config();

// Cache the transporter to reuse connection
let cachedTransporter = null;

/**
 * Create and configure a nodemailer transporter
 * @returns {nodemailer.Transporter} Configured mail transporter
 */
const createTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  // Check if required environment variables are defined
  const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`${varName} is not defined in environment variables`);
    }
  });

  // Create transporter with configuration from environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  // Cache for future reuse
  cachedTransporter = transporter;
  return transporter;
};

/**
 * Send email with provided options
 * @param {Object} options - Email options (to, subject, text, html)
 * @returns {Promise<Object>} Information about the sent message
 */
const sendMail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Set default from address if not provided
    const from = options.from || process.env.EMAIL_FROM;
    
    const mailOptions = {
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      ...options
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send a contact form submission notification
 * @param {Object} data - Contact form data 
 * @returns {Promise<Object>} Email send result
 */
const sendContactNotification = async (data) => {
  const { name, email, message, phone = 'Not provided' } = data;

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <h3>Message:</h3>
    <p>${message}</p>
    <hr>
    <p>This message was sent from the contact form on ${process.env.SITE_URL}</p>
  `;

  const textContent = `
    New Contact Form Submission\n
    Name: ${name}\n
    Email: ${email}\n
    Phone: ${phone}\n
    Message: ${message}\n\n
    This message was sent from the contact form on ${process.env.SITE_URL}
  `;

  return sendMail({
    to: process.env.EMAIL_FROM,
    subject: `New Contact Form Submission from ${name}`,
    text: textContent,
    html: htmlContent,
  });
};

/**
 * Send appointment confirmation email
 * @param {Object} data - Appointment data
 * @returns {Promise<Object>} Email send result
 */
const sendAppointmentConfirmation = async (data) => {
  const { name, email, date, timeSlot, purpose } = data;
  
  // Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <h2>Appointment Confirmation</h2>
    <p>Hello ${name},</p>
    <p>Your appointment has been scheduled successfully.</p>
    <h3>Appointment Details:</h3>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Time:</strong> ${timeSlot}</p>
    <p><strong>Purpose:</strong> ${purpose}</p>
    <hr>
    <p>If you need to reschedule or cancel, please reply to this email or use the contact form on ${process.env.SITE_URL}.</p>
    <p>Looking forward to our meeting!</p>
  `;

  const textContent = `
    Appointment Confirmation\n\n
    Hello ${name},\n
    Your appointment has been scheduled successfully.\n\n
    Appointment Details:\n
    Date: ${formattedDate}\n
    Time: ${timeSlot}\n
    Purpose: ${purpose}\n\n
    If you need to reschedule or cancel, please reply to this email or use the contact form on ${process.env.SITE_URL}.\n
    Looking forward to our meeting!\n
  `;

  return sendMail({
    to: email,
    subject: `Appointment Confirmation - ${formattedDate}`,
    text: textContent,
    html: htmlContent,
  });
};

module.exports = {
  sendMail,
  sendContactNotification,
  sendAppointmentConfirmation,
};