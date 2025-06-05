const nodemailer = require('nodemailer')
require('dotenv').config()

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

const email = {
  // Send contact form email
  async sendContactEmail(contactData) {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: process.env.FROM_EMAIL,
      subject: `Contact Form: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Contact Form Message</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6;">${contactData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            This message was sent through the contact form on reynantlntno.dev
          </p>
        </div>
      `,
      text: `
        New Contact Form Message

        Name: ${contactData.name}
        Email: ${contactData.email}
        Subject: ${contactData.subject}

        Message:
        ${contactData.message}

        This message was sent through the contact form on reynantlntno.dev
      `
    }

    try {
      const result = await transporter.sendMail(mailOptions)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending contact email:', error)
      return { success: false, error: error.message }
    }
  },

  // Send appointment confirmation email
  async sendAppointmentConfirmation(appointmentData) {
    const transporter = createTransporter()
    
    const appointmentDate = new Date(appointmentData.appointment_date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: appointmentData.email,
      subject: `Appointment Confirmation - ${appointmentData.reference_code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Appointment Confirmation</h2>
          
          <p>Hello ${appointmentData.name},</p>
          
          <p>Thank you for booking an appointment. Here are the details:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Reference Code:</strong> ${appointmentData.reference_code}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Time:</strong> ${appointmentData.start_time} - ${appointmentData.end_time}</p>
            <p><strong>Subject:</strong> ${appointmentData.subject}</p>
          </div>
          
          ${appointmentData.message ? `
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Additional Message:</h3>
            <p style="line-height: 1.6;">${appointmentData.message.replace(/\n/g, '<br>')}</p>
          </div>
          ` : ''}
          
          <p>You can check your appointment status anytime using your reference code at:</p>
          <p><a href="${process.env.SITE_URL}/appointments/${appointmentData.reference_code}" style="color: #1e40af;">
            ${process.env.SITE_URL}/appointments/${appointmentData.reference_code}
          </a></p>
          
          <p>If you need to reschedule or cancel, please reply to this email.</p>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            Reynan Tolentino<br>
            ${process.env.FROM_EMAIL}
          </p>
        </div>
      `,
      text: `
        Appointment Confirmation

        Hello ${appointmentData.name},

        Thank you for booking an appointment. Here are the details:

        Reference Code: ${appointmentData.reference_code}
        Date: ${appointmentDate}
        Time: ${appointmentData.start_time} - ${appointmentData.end_time}
        Subject: ${appointmentData.subject}

        ${appointmentData.message ? `Additional Message:\n${appointmentData.message}\n\n` : ''}

        You can check your appointment status anytime using your reference code at:
        ${process.env.SITE_URL}/appointments/${appointmentData.reference_code}

        If you need to reschedule or cancel, please reply to this email.

        Best regards,
        Reynan Tolentino
        ${process.env.FROM_EMAIL}
      `
    }

    try {
      const result = await transporter.sendMail(mailOptions)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending appointment confirmation:', error)
      return { success: false, error: error.message }
    }
  },

  // Send appointment status update email
  async sendAppointmentStatusUpdate(appointmentData, oldStatus, newStatus) {
    const transporter = createTransporter()
    
    let statusMessage = ''
    let statusColor = '#1e40af'
    
    switch (newStatus) {
      case 'confirmed':
        statusMessage = 'Your appointment has been confirmed!'
        statusColor = '#059669'
        break
      case 'cancelled':
        statusMessage = 'Your appointment has been cancelled.'
        statusColor = '#dc2626'
        break
      case 'completed':
        statusMessage = 'Your appointment has been completed. Thank you!'
        statusColor = '#7c3aed'
        break
      default:
        statusMessage = `Your appointment status has been updated to: ${newStatus}`
    }

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: appointmentData.email,
      subject: `Appointment Update - ${appointmentData.reference_code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${statusColor};">Appointment Status Update</h2>
          
          <p>Hello ${appointmentData.name},</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
            <p style="font-size: 18px; margin: 0; color: ${statusColor}; font-weight: bold;">
              ${statusMessage}
            </p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <p><strong>Reference Code:</strong> ${appointmentData.reference_code}</p>
            <p><strong>Previous Status:</strong> ${oldStatus}</p>
            <p><strong>Current Status:</strong> ${newStatus}</p>
          </div>
          
          <p>You can view full appointment details at:</p>
          <p><a href="${process.env.SITE_URL}/appointments/${appointmentData.reference_code}" style="color: #1e40af;">
            ${process.env.SITE_URL}/appointments/${appointmentData.reference_code}
          </a></p>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            Reynan Tolentino<br>
            ${process.env.FROM_EMAIL}
          </p>
        </div>
      `,
      text: `
        Appointment Status Update

        Hello ${appointmentData.name},

        ${statusMessage}

        Reference Code: ${appointmentData.reference_code}
        Previous Status: ${oldStatus}
        Current Status: ${newStatus}

        You can view full appointment details at:
        ${process.env.SITE_URL}/appointments/${appointmentData.reference_code}

        Best regards,
        Reynan Tolentino
        ${process.env.FROM_EMAIL}
      `
    }

    try {
      const result = await transporter.sendMail(mailOptions)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending status update email:', error)
      return { success: false, error: error.message }
    }
  }
}

module.exports = { email }