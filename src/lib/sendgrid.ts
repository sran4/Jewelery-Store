import sgMail from "@sendgrid/mail";

// Configure SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email via SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn("SendGrid API key not configured");
    return false;
  }

  try {
    const msg = {
      to: options.to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "noreply@luxuryjewelry.com",
        name: process.env.SENDGRID_FROM_NAME || "SherGill Official",
      },
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", options.to);
    return true;
  } catch (error: any) {
    console.error("❌ SendGrid Error:", error.response?.body || error);
    return false;
  }
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!adminEmail) {
    console.warn("Admin notification email not configured");
    return false;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #1e40af; display: block; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #3b82f6; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">💎 New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You have received a new inquiry from your jewelry store website</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">From:</span>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <span class="label">Email:</span>
            <div class="value"><a href="mailto:${
              data.email
            }" style="color: #1e40af;">${data.email}</a></div>
          </div>
          
          <div class="field">
            <span class="label">Phone:</span>
            <div class="value"><a href="tel:${
              data.phone
            }" style="color: #1e40af;">${data.phone}</a></div>
          </div>
          
          <div class="field">
            <span class="label">Inquiry Type:</span>
            <div class="value">${data.inquiryType}</div>
          </div>
          
          <div class="field">
            <span class="label">Message:</span>
            <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #dbeafe; border-radius: 5px; border-left: 3px solid #1e40af;">
            <strong>Quick Actions:</strong><br>
            <a href="mailto:${
              data.email
            }" style="color: #1e40af; margin-right: 15px;">Reply via Email</a> |
            <a href="tel:${
              data.phone
            }" style="color: #1e40af; margin-left: 15px;">Call Customer</a>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from your SherGill Official contact form</p>
          <p>Login to your admin panel to manage inquiries</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New ${data.inquiryType} - ${data.name}`,
    html,
  });
}

export default sgMail;
