import nodemailer from 'nodemailer'

// Create transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({  // Changed from createTransporter to createTransport
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: true, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

// Email templates
const templates = {
  contact: ({ name, email, subject, message }) => ({
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          New Contact Message
        </h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #334155; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; color: #475569;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #0f172a; color: #e2e8f0; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      </div>
    `,
    text: `
Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `
  }),

  appointmentConfirmation: ({ name, email, date, time, subject, referenceCode }) => ({
    subject: `Appointment Confirmation - ${referenceCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #065f46; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          Appointment Confirmed
        </h2>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #065f46;">
          <p style="margin: 0; color: #065f46; font-size: 18px;">
            <strong>Your appointment has been confirmed!</strong>
          </p>
        </div>
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #334155; margin-top: 0;">Appointment Details:</h3>
          <p><strong>Reference Code:</strong> <span style="font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${referenceCode}</span></p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #1e40af; color: #e2e8f0; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px;">
            You can track your appointment status using the reference code above.
            Visit: ${process.env.SITE_URL}/appointments/track
          </p>
        </div>
      </div>
    `,
    text: `
Appointment Confirmation

Your appointment has been confirmed!

Reference Code: ${referenceCode}
Name: ${name}
Date: ${date}
Time: ${time}
Subject: ${subject}

You can track your appointment status at: ${process.env.SITE_URL}/appointments/track
    `
  }),

  appointmentStatusUpdate: ({ name, referenceCode, oldStatus, newStatus, date, time }) => ({
    subject: `Appointment Status Update - ${referenceCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          Appointment Status Update
        </h2>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e40af;">
          <p style="margin: 0; color: #1e40af; font-size: 18px;">
            <strong>Your appointment status has been updated</strong>
          </p>
        </div>
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <p><strong>Reference Code:</strong> <span style="font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${referenceCode}</span></p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Date & Time:</strong> ${date} at ${time}</p>
          <p><strong>Previous Status:</strong> <span style="text-transform: capitalize;">${oldStatus}</span></p>
          <p><strong>New Status:</strong> <span style="text-transform: capitalize; color: #065f46; font-weight: bold;">${newStatus}</span></p>
        </div>
      </div>
    `,
    text: `
Appointment Status Update

Reference Code: ${referenceCode}
Name: ${name}
Date & Time: ${date} at ${time}
Previous Status: ${oldStatus}
New Status: ${newStatus}
    `
  })
}

// Send email function
export const sendEmail = async (templateName, data, recipientEmail = null) => {
  try {
    const transporter = createTransporter()
    const template = templates[templateName]
    
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`)
    }

    const emailContent = template(data)
    const recipient = recipientEmail || process.env.CONTACT_EMAIL

    const mailOptions = {
      from: `"${process.env.SITE_NAME}" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
      replyTo: data.email || process.env.CONTACT_EMAIL
    }

    const result = await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    return { success: true, message: 'Email configuration verified' }
  } catch (error) {
    console.error('Email verification error:', error)
    return { success: false, error: error.message }
  }
}

// Send newsletter confirmation (if needed)
export const sendNewsletterConfirmation = async (email, name = null) => {
  const data = {
    name: name || 'Subscriber',
    email
  }

  const template = {
    subject: 'Newsletter Subscription Confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          Welcome to the Newsletter!
        </h2>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af; font-size: 18px;">
            Thank you for subscribing, ${data.name}!
          </p>
        </div>
        <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <p>You'll receive updates about new blog posts, projects, and development insights.</p>
          <p>If you didn't subscribe to this newsletter, you can safely ignore this email.</p>
        </div>
      </div>
    `,
    text: `
Welcome to the Newsletter!

Thank you for subscribing, ${data.name}!

You'll receive updates about new blog posts, projects, and development insights.
If you didn't subscribe to this newsletter, you can safely ignore this email.
    `
  }

  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"${process.env.SITE_NAME}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html
    }

    const result = await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      messageId: result.messageId
    }
  } catch (error) {
    console.error('Newsletter confirmation email error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}