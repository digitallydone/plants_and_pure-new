import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const FROM_EMAIL = process.env.FROM_EMAIL || "Plants & Pure <plantsandpure@gmail.com>"
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"

export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error: error.message }
  }
}

export async function sendPasswordResetEmail(email, token, name) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: #2d5a27; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Plants & Pure</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6;">Hi ${name || "there"},</p>
          <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #2d5a27; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
          </div>
          <p style="color: #666; line-height: 1.6; font-size: 14px;">This link will expire in 1 hour for security reasons.</p>
          <p style="color: #666; line-height: 1.6; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">Plants & Pure Limited, Accra, Ghana</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Reset Your Password
    
    Hi ${name || "there"},
    
    We received a request to reset your password. Visit the link below to create a new password:
    
    ${resetUrl}
    
    This link will expire in 1 hour for security reasons.
    
    If you didn't request this, you can safely ignore this email.
    
    Plants & Pure Limited, Accra, Ghana
  `

  return sendEmail({
    to: email,
    subject: "Reset Your Password - Plants & Pure",
    html,
    text,
  })
}

export async function sendWelcomeEmail(email, name) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: #2d5a27; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Plants & Pure</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin-top: 0;">Welcome to Plants & Pure!</h2>
          <p style="color: #666; line-height: 1.6;">Hi ${name},</p>
          <p style="color: #666; line-height: 1.6;">Thank you for joining our community! We're thrilled to have you with us.</p>
          <p style="color: #666; line-height: 1.6;">At Plants & Pure, we're passionate about bringing you the finest natural spices, herbs, and essential oils - all carefully selected and ethically sourced.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/products" style="display: inline-block; background: #2d5a27; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">Start Shopping</a>
          </div>
          <p style="color: #666; line-height: 1.6;">If you have any questions, feel free to reach out to us at plantsandpure@gmail.com</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">Plants & Pure Limited, Accra, Ghana</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: "Welcome to Plants & Pure!",
    html,
    text: `Welcome to Plants & Pure!\n\nHi ${name},\n\nThank you for joining our community! We're thrilled to have you with us.\n\nVisit ${APP_URL}/products to start shopping.\n\nPlants & Pure Limited, Accra, Ghana`,
  })
}

export async function sendOrderConfirmationEmail(email, name, order) {
  const orderUrl = `${APP_URL}/dashboard/orders/${order._id}`

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">GH₵${item.price.toFixed(2)}</td>
    </tr>
  `,
    )
    .join("")

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: #2d5a27; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Plants & Pure</h1>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #333; margin-top: 0;">Order Confirmed!</h2>
          <p style="color: #666; line-height: 1.6;">Hi ${name},</p>
          <p style="color: #666; line-height: 1.6;">Thank you for your order! We've received it and will begin processing it shortly.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px; color: #333;"><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p style="margin: 0; color: #333;"><strong>Total:</strong> GH₵${order.total.toFixed(2)}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left;">Item</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${orderUrl}" style="display: inline-block; background: #2d5a27; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Order</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; margin: 0;">Plants & Pure Limited, Accra, Ghana</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html,
    text: `Order Confirmed!\n\nHi ${name},\n\nThank you for your order #${order.orderNumber}!\n\nTotal: GH₵${order.total.toFixed(2)}\n\nView your order: ${orderUrl}\n\nPlants & Pure Limited, Accra, Ghana`,
  })
}

export async function sendContactFormEmail(data) {
  const { name, email, subject, message, phone } = data

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    </body>
    </html>
  `

  return sendEmail({
    to: process.env.CONTACT_EMAIL || "plantsandpure@gmail.com",
    subject: `Contact Form: ${subject}`,
    html,
    text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ""}Subject: ${subject}\n\nMessage:\n${message}`,
  })
}
