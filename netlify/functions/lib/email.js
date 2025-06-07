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
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0c0c; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="padding: 32px 24px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #007acc, #569cd6); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: 600;">💬</span>
            </div>
            <h1 style="color: #007acc; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">
              New Contact Message
            </h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #007acc, #569cd6); margin: 16px auto 0;"></div>
          </div>

          <!-- Contact Details Card -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #007acc; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 80px; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #007acc; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Name:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #007acc; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Email:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #007acc; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Subject:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">${subject}</td>
              </tr>
            </table>
          </div>

          <!-- Message Card -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #007acc; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Message</h3>
            <div style="background-color: #0c0c0c; border: 1px solid #262626; border-radius: 8px; padding: 20px; border-left: 4px solid #007acc;">
              <p style="line-height: 1.6; color: #e5e5e5; margin: 0; font-size: 14px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; background-color: #262626; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #737373; font-family: 'JetBrains Mono', Monaco, Consolas, monospace;">
              // This message was sent from your portfolio contact form<br>
              // Timestamp: ${new Date().toISOString()}
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
NEW CONTACT MESSAGE
==================

Contact Details:
• Name: ${name}
• Email: ${email}  
• Subject: ${subject}

Message:
--------
${message}

This message was sent from your portfolio contact form.
Timestamp: ${new Date().toISOString()}
    `
  }),

  appointmentConfirmation: ({ name, email, date, time, subject, referenceCode }) => ({
    subject: `Appointment Confirmed - ${referenceCode}`,
    html: `
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0c0c; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="padding: 32px 24px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: 600;">✓</span>
            </div>
            <h1 style="color: #22c55e; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">
              Appointment Confirmed
            </h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #22c55e, #16a34a); margin: 16px auto 0;"></div>
          </div>

          <!-- Success Message -->
          <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05)); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: #22c55e; font-size: 18px; font-weight: 600;">
              Your appointment has been successfully confirmed!
            </p>
          </div>

          <!-- Reference Code -->
          <div style="background-color: #171717; border: 2px solid #007acc; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0 0 8px; color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Reference Code</p>
            <div style="background-color: #262626; border: 1px solid #007acc; border-radius: 8px; padding: 12px; display: inline-block;">
              <code style="font-family: 'JetBrains Mono', Monaco, Consolas, monospace; color: #007acc; font-size: 18px; font-weight: 700; letter-spacing: 0.1em;">${referenceCode}</code>
            </div>
          </div>

          <!-- Appointment Details -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #007acc; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; width: 100px; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #007acc; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Name:</strong>
                </td>
                <td style="padding: 12px 0; color: #e5e5e5; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Date:</strong>
                </td>
                <td style="padding: 12px 0; color: #e5e5e5; font-size: 14px; font-weight: 600;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Time:</strong>
                </td>
                <td style="padding: 12px 0; color: #e5e5e5; font-size: 14px; font-weight: 600;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #8b5cf6; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Subject:</strong>
                </td>
                <td style="padding: 12px 0; color: #e5e5e5; font-size: 14px;">${subject}</td>
              </tr>
            </table>
          </div>

          <!-- Track Appointment CTA -->
          <div style="background: linear-gradient(135deg, #007acc, #569cd6); border-radius: 12px; padding: 24px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0 0 16px; color: white; font-size: 16px; font-weight: 600;">
              Track Your Appointment
            </p>
            <p style="margin: 0 0 20px; color: rgba(255, 255, 255, 0.8); font-size: 14px; line-height: 1.5;">
              Use your reference code to check appointment status and updates
            </p>
            <a href="${process.env.SITE_URL}/appointments/track" style="display: inline-block; background-color: white; color: #007acc; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              Track Appointment →
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; background-color: #262626; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #737373; font-family: 'JetBrains Mono', Monaco, Consolas, monospace;">
              // Appointment confirmation sent<br>
              // Keep this email for your records
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
APPOINTMENT CONFIRMED
====================

✓ Your appointment has been successfully confirmed!

Reference Code: ${referenceCode}

Appointment Details:
• Name: ${name}
• Date: ${date}
• Time: ${time}
• Subject: ${subject}

Track your appointment status at: ${process.env.SITE_URL}/appointments/track

Keep this email for your records.
    `
  }),

  appointmentStatusUpdate: ({ name, referenceCode, oldStatus, newStatus, date, time }) => ({
    subject: `Appointment Update - ${referenceCode}`,
    html: `
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0c0c; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="padding: 32px 24px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: 600;">📋</span>
            </div>
            <h1 style="color: #f59e0b; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">
              Status Update
            </h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #f59e0b, #d97706); margin: 16px auto 0;"></div>
          </div>

          <!-- Update Notice -->
          <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05)); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: #f59e0b; font-size: 18px; font-weight: 600;">
              Your appointment status has been updated
            </p>
          </div>

          <!-- Reference Code -->
          <div style="background-color: #171717; border: 2px solid #007acc; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0 0 8px; color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Reference Code</p>
            <div style="background-color: #262626; border: 1px solid #007acc; border-radius: 8px; padding: 12px; display: inline-block;">
              <code style="font-family: 'JetBrains Mono', Monaco, Consolas, monospace; color: #007acc; font-size: 18px; font-weight: 700; letter-spacing: 0.1em;">${referenceCode}</code>
            </div>
          </div>

          <!-- Status Change -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #007acc; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Status Change</h3>
            <div style="display: flex; align-items: center; justify-content: center; margin: 20px 0;">
              <div style="text-align: center;">
                <div style="background-color: #262626; border: 1px solid #525252; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px;">
                  <span style="color: #737373; font-size: 14px; text-transform: capitalize;">${oldStatus}</span>
                </div>
                <p style="margin: 0; color: #525252; font-size: 12px;">Previous</p>
              </div>
              <div style="margin: 0 20px; color: #007acc; font-size: 20px;">→</div>
              <div style="text-align: center;">
                <div style="background: linear-gradient(135deg, #007acc, #569cd6); border-radius: 8px; padding: 12px 16px; margin-bottom: 8px;">
                  <span style="color: white; font-size: 14px; font-weight: 600; text-transform: capitalize;">${newStatus}</span>
                </div>
                <p style="margin: 0; color: #007acc; font-size: 12px; font-weight: 600;">Current</p>
              </div>
            </div>
          </div>

          <!-- Appointment Info -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #007acc; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Appointment Info</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; width: 80px; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #007acc; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Name:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Date:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Time:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">${time}</td>
              </tr>
            </table>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; background-color: #262626; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #737373; font-family: 'JetBrains Mono', Monaco, Consolas, monospace;">
              // Status updated: ${new Date().toISOString()}<br>
              // Track all updates at ${process.env.SITE_URL}/appointments/track
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
APPOINTMENT STATUS UPDATE
========================

Reference Code: ${referenceCode}
Name: ${name}
Date & Time: ${date} at ${time}

Status Change:
${oldStatus} → ${newStatus}

Track your appointment: ${process.env.SITE_URL}/appointments/track
    `
  }),

  newsletterUnsubscribe: ({ email, name }) => ({
    subject: 'Newsletter Unsubscribe Confirmed',
    html: `
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0c0c; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="padding: 32px 24px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: 600;">✕</span>
            </div>
            <h1 style="color: #ef4444; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">
              Unsubscribed
            </h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #ef4444, #dc2626); margin: 16px auto 0;"></div>
          </div>

          <!-- Confirmation Message -->
          <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0 0 8px; color: #ef4444; font-size: 18px; font-weight: 600;">
              You have been unsubscribed
            </p>
            <p style="margin: 0; color: #a3a3a3; font-size: 14px;">
              ${email} has been removed from our newsletter
            </p>
          </div>

          <!-- Message Content -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <p style="line-height: 1.6; color: #e5e5e5; margin: 0 0 16px 0; font-size: 16px;">
              Hi <strong style="color: #007acc;">${name || 'there'}</strong>,
            </p>
            <p style="line-height: 1.6; color: #a3a3a3; margin: 0 0 16px 0; font-size: 14px;">
              We've successfully removed your email address from our newsletter mailing list. You will no longer receive newsletter updates from us.
            </p>
            <p style="line-height: 1.6; color: #a3a3a3; margin: 0 0 16px 0; font-size: 14px;">
              If you change your mind, you can always resubscribe by visiting our website.
            </p>
            <div style="background-color: #262626; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin-top: 20px;">
              <p style="line-height: 1.5; color: #f59e0b; margin: 0; font-size: 13px; font-weight: 500;">
                ⚠️ If you didn't request this unsubscription, please contact us immediately.
              </p>
            </div>
          </div>

          <!-- Resubscribe Option -->
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${process.env.SITE_URL}#newsletter" style="display: inline-block; background: linear-gradient(135deg, #007acc, #569cd6); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              Resubscribe to Newsletter
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; background-color: #262626; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #737373; font-family: 'JetBrains Mono', Monaco, Consolas, monospace;">
              // Thank you for being part of our community<br>
              // ${process.env.SITE_NAME || 'Reynan Tolentino'}
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
NEWSLETTER UNSUBSCRIBE CONFIRMED
===============================

Hi ${name || 'there'},

We've successfully removed ${email} from our newsletter mailing list. 
You will no longer receive newsletter updates from us.

If you change your mind, you can always resubscribe by visiting our website.

⚠️ If you didn't request this unsubscription, please contact us immediately.

Thank you for being part of our community.
${process.env.SITE_NAME || 'Reynan Tolentino'}
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

// Send newsletter unsubscription confirmation
export const sendNewsletterUnsubscribe = async (email, name = null) => {
  const data = {
    name: name || 'Subscriber',
    email
  }

  try {
    const transporter = createTransporter()
    const template = templates.newsletterUnsubscribe(data)
    
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
    console.error('Newsletter unsubscribe confirmation email error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Send newsletter confirmation (if needed)
export const sendNewsletterConfirmation = async (email, name = null) => {
  const data = {
    name: name || 'Subscriber',
    email
  }

  const template = {
    subject: 'Welcome to the Newsletter! 🚀',
    html: `
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0c0c0c; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="padding: 32px 24px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: 600;">📧</span>
            </div>
            <h1 style="color: #22c55e; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.025em;">
              Welcome to the Newsletter!
            </h1>
            <div style="width: 60px; height: 2px; background: linear-gradient(90deg, #22c55e, #16a34a); margin: 16px auto 0;"></div>
          </div>

          <!-- Welcome Message -->
          <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05)); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: #22c55e; font-size: 18px; font-weight: 600;">
              Thank you for subscribing, ${data.name}! 🎉
            </p>
          </div>

          <!-- Code Block Welcome -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #007acc; margin: 0 0 16px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">Subscription Confirmed</h3>
            <div style="background-color: #0c0c0c; border: 1px solid #262626; border-radius: 8px; padding: 20px; border-left: 4px solid #22c55e; font-family: 'JetBrains Mono', Monaco, Consolas, monospace;">
              <div style="color: #737373; font-size: 12px; margin-bottom: 8px;">// newsletter-subscription.js</div>
              <div style="color: #569cd6; font-size: 14px; line-height: 1.5;">
                <span style="color: #c586c0;">const</span> <span style="color: #9cdcfe;">subscriber</span> <span style="color: #d4d4d4;">= {</span><br>
                <span style="color: #d4d4d4;">&nbsp;&nbsp;</span><span style="color: #9cdcfe;">email:</span> <span style="color: #ce9178;">'${data.email}'</span><span style="color: #d4d4d4;">,</span><br>
                <span style="color: #d4d4d4;">&nbsp;&nbsp;</span><span style="color: #9cdcfe;">name:</span> <span style="color: #ce9178;">'${data.name}'</span><span style="color: #d4d4d4;">,</span><br>
                <span style="color: #d4d4d4;">&nbsp;&nbsp;</span><span style="color: #9cdcfe;">status:</span> <span style="color: #ce9178;">'active'</span><span style="color: #d4d4d4;">,</span><br>
                <span style="color: #d4d4d4;">&nbsp;&nbsp;</span><span style="color: #9cdcfe;">subscribedAt:</span> <span style="color: #c586c0;">new</span> <span style="color: #4ec9b0;">Date</span><span style="color: #d4d4d4;">()</span><br>
                <span style="color: #d4d4d4;">}</span>
              </div>
            </div>
          </div>

          <!-- What to Expect -->
          <div style="background-color: #171717; border: 1px solid #262626; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <h3 style="color: #007acc; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em;">What to Expect</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #22c55e; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">New Projects:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">Latest web development work and case studies</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #f59e0b; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Tech Insights:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">Vue.js, Node.js tips and modern web development</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;">
                  <span style="display: inline-block; width: 8px; height: 8px; background-color: #8b5cf6; border-radius: 50%; margin-right: 8px;"></span>
                  <strong style="color: #a3a3a3; font-size: 14px;">Industry News:</strong>
                </td>
                <td style="padding: 8px 0; color: #e5e5e5; font-size: 14px;">Curated updates on web development trends</td>
              </tr>
            </table>
          </div>

          <!-- Fun Welcome Message -->
          <div style="background: linear-gradient(135deg, #007acc, #569cd6); border-radius: 12px; padding: 24px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0 0 16px; color: white; font-size: 16px; font-weight: 600;">
              Welcome to the Dev Community! 👨‍💻
            </p>
            <p style="margin: 0 0 20px; color: rgba(255, 255, 255, 0.8); font-size: 14px; line-height: 1.5;">
              You're now part of a community of developers who love clean code, modern web tech, and building amazing digital experiences.
            </p>
            <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 16px; font-family: 'JetBrains Mono', Monaco, Consolas, monospace; font-size: 13px; color: rgba(255, 255, 255, 0.9);">
              <span style="color: #90cdf4;">console</span><span style="color: white;">.log(</span><span style="color: #fbb6ce;">'Welcome aboard! 🚀'</span><span style="color: white;">)</span>
            </div>
          </div>

          <!-- Unsubscribe Notice -->
          <div style="background-color: #262626; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
            <p style="line-height: 1.5; color: #a3a3a3; margin: 0; font-size: 13px;">
              <strong style="color: #f59e0b;">Privacy First:</strong> You can unsubscribe at any time using the link below or by replying to any newsletter email. No hard feelings! 😊
            </p>
          </div>

          <!-- Unsubscribe CTA -->
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${process.env.SITE_URL}/.netlify/functions/newsletter?email=${encodeURIComponent(email)}" 
               style="display: inline-block; background-color: #262626; color: #a3a3a3; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; border: 1px solid #404040; font-family: 'JetBrains Mono', Monaco, Consolas, monospace;">
              unsubscribe()
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; background-color: #262626; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #737373; font-family: 'JetBrains Mono', Monaco, Consolas, monospace;">
              // Thanks for joining the newsletter!<br>
              // Happy coding! - ${process.env.SITE_NAME || 'Reynan Tolentino'}
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
WELCOME TO THE NEWSLETTER!
=========================

👋 Thank you for subscribing, ${data.name}!

What to expect:
• New Projects: Latest web development work and case studies
• Tech Insights: Vue.js, Node.js tips and modern web development  
• Industry News: Curated updates on web development trends

Welcome to the Dev Community! 👨‍💻

You're now part of a community of developers who love clean code, 
modern web tech, and building amazing digital experiences.

console.log('Welcome aboard! 🚀')

PRIVACY FIRST: You can unsubscribe at any time using this link:
${process.env.SITE_URL}/.netlify/functions/newsletter?email=${encodeURIComponent(email)}

Thanks for joining the newsletter!
Happy coding! - ${process.env.SITE_NAME || 'Reynan Tolentino'}
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

