import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Define email template CSS and layout helper for consistent branding
const COMPANY_NAME = 'DESHWAL WEB TECHNOLOGIES PVT LTD';
const ACCENT_COLOR = '#2563eb'; // Blue 600
const DARK_ACCENT = '#030014'; // Theme deep background
const BODY_BG = '#f8fafc';
const CARD_BG = '#ffffff';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// In-memory array to track simulated emails for dev inspection
export interface SimulatedEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  timestamp: string;
  from: string;
}

export const simulatedEmails: SimulatedEmail[] = [];

// Lazy initialization of transporter
let transporterInstance: nodemailer.Transporter | null = null;
let isMockMode = false;

function getTransporter(): nodemailer.Transporter {
  if (transporterInstance) {
    return transporterInstance;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If no user or password, or if they are placeholders, fall back to mock mode
  if (!user || !pass || user.includes('your-smtp-username') || pass.includes('your-smtp-app-password')) {
    console.warn('⚠️ SMTP credentials not fully configured. Email service starting in SIMULATION (MOCK) MODE.');
    isMockMode = true;
    
    // Create a dummy transporter that doesn't send real emails
    transporterInstance = nodemailer.createTransport({
      jsonTransport: true
    });
    return transporterInstance;
  }

  try {
    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
    isMockMode = false;
    console.log(`📧 Nodemailer initialized successfully. Real emails will be routed through: ${host}:${port}`);
    return transporterInstance;
  } catch (error) {
    console.error('❌ Failed to initialize standard SMTP transporter. Falling back to SIMULATION MODE.', error);
    isMockMode = true;
    transporterInstance = nodemailer.createTransport({
      jsonTransport: true
    });
    return transporterInstance;
  }
}

/**
 * Base template to wrap all HTML email bodies
 */
function wrapHtmlTemplate(title: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: ${BODY_BG};
            color: #1e293b;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: ${BODY_BG};
            padding: 40px 20px;
            box-sizing: border-box;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${CARD_BG};
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: ${DARK_ACCENT};
            padding: 32px;
            text-align: center;
            border-bottom: 3px solid ${ACCENT_COLOR};
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: -0.5px;
            text-transform: uppercase;
          }
          .header p {
            color: #94a3b8;
            margin: 4px 0 0 0;
            font-size: 11px;
            font-family: monospace;
            letter-spacing: 1px;
          }
          .content {
            padding: 32px;
            line-height: 1.6;
          }
          .content h2 {
            font-size: 18px;
            color: #0f172a;
            margin-top: 0;
            margin-bottom: 16px;
            font-weight: 700;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background-color: #f8fafc;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #f1f5f9;
          }
          .data-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
          }
          .data-table td.label {
            font-weight: 600;
            color: #64748b;
            width: 35%;
            font-family: monospace;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
          }
          .data-table td.value {
            color: #0f172a;
          }
          .data-table tr:last-child td {
            border-bottom: none;
          }
          .message-box {
            background-color: #f1f5f9;
            border-left: 4px solid ${ACCENT_COLOR};
            padding: 16px;
            border-radius: 4px 12px 12px 4px;
            font-size: 13px;
            color: #334155;
            margin: 20px 0;
            white-space: pre-wrap;
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px 32px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 11px;
            color: #64748b;
          }
          .footer p {
            margin: 4px 0;
          }
          .footer a {
            color: ${ACCENT_COLOR};
            text-decoration: none;
            font-weight: 500;
          }
          .button {
            display: inline-block;
            background-color: ${ACCENT_COLOR};
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 600;
            font-size: 13px;
            margin: 16px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>${COMPANY_NAME}</h1>
              <p>SECURE SYSTEMS ENGINE</p>
            </div>
            <div class="content">
              ${contentHtml}
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
              <p>Uttarakhand, India • <a href="https://deshwal.com">Visit Our Website</a></p>
              <p style="font-size: 9px; color: #94a3b8; margin-top: 12px;">This is an automated system email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Sends an email using the initialized transporter
 */
async function sendMail(payload: EmailPayload): Promise<boolean> {
  const transporter = getTransporter();
  const fromName = process.env.SMTP_FROM_NAME || 'DESHWAL WEB TECHNOLOGIES';
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'deshwal.mohit81@gmail.com';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'deshwal.mohit81@gmail.com';

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // Log and capture email in simulation array
    const simulatedItem: SimulatedEmail = {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
      timestamp: new Date().toISOString()
    };
    
    simulatedEmails.unshift(simulatedItem);
    if (simulatedEmails.length > 30) {
      simulatedEmails.pop();
    }

    if (isMockMode) {
      console.log('========================================================================');
      console.log(`📧 [EMAIL SIMULATION] Message Routed Successfully`);
      console.log(`   TO:       ${payload.to}`);
      console.log(`   SUBJECT:  ${payload.subject}`);
      console.log(`   MOCK RES: http://localhost:3000/api/view-simulated-emails (captured internally)`);
      console.log('------------------------------------------------------------------------');
      console.log(payload.text);
      console.log('========================================================================');
    } else {
      console.log(`📧 Real Email Delivered Successfully. MessageId: ${info.messageId} to ${payload.to}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ Nodemailer failed to deliver email to ${payload.to}:`, error);
    return false;
  }
}

/**
 * 1. Contact Form Submission Emails
 */
export async function sendContactFormEmails(lead: {
  name: string;
  email: string;
  phone: string;
  service: string;
  plan?: string;
  message: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'deshwal.mohit81@gmail.com';

  // A. CONFIRMATION TO USER
  const userSubject = `We've received your request - ${COMPANY_NAME}`;
  const userHtml = wrapHtmlTemplate(
    'Inquiry Received',
    `
      <h2>Hello ${lead.name},</h2>
      <p>Thank you for reaching out to <strong>${COMPANY_NAME}</strong>. Our expert technical consultants have received your inquiry and are currently evaluating your requirements.</p>
      <p>Here is a summary of the parameters you submitted to our terminal:</p>
      
      <table class="data-table">
        <tr>
          <td class="label">Consultant Service</td>
          <td class="value"><strong>${lead.service}</strong></td>
        </tr>
        ${lead.plan ? `
        <tr>
          <td class="label">SLA Tier / Plan</td>
          <td class="value">${lead.plan}</td>
        </tr>
        ` : ''}
        <tr>
          <td class="label">Phone Contact</td>
          <td class="value">${lead.phone}</td>
        </tr>
        <tr>
          <td class="label">Reference Status</td>
          <td class="value"><span style="color: #2563eb; font-weight: bold;">QUEUED / PENDING</span></td>
        </tr>
      </table>

      ${lead.message ? `
        <p><strong>Your Message:</strong></p>
        <div class="message-box">${lead.message}</div>
      ` : ''}

      <p>A corporate relationship engineer will connect with you via email or phone at <strong>${lead.phone}</strong> within the next 12 to 24 business hours to deliver a comprehensive analysis and project blueprint details.</p>
      
      <p>If you have any urgent files, requirements docs, or code mockups to share with us, feel free to contact us directly at <a href="mailto:deshwalmohit.81@gmail.com">deshwalmohit.81@gmail.com</a>.</p>
      
      <p>Best regards,<br><strong>System Engineering Desk</strong><br>${COMPANY_NAME}</p>
    `
  );

  const userText = `
Hello ${lead.name},

Thank you for reaching out to ${COMPANY_NAME}. We have successfully received your inquiry for:
Service Required: ${lead.service}
${lead.plan ? `Plan Tier: ${lead.plan}` : ''}
Your Contact Phone: ${lead.phone}

Your message:
"${lead.message}"

Our technical consultants will review your request and reach out to you within 12-24 business hours.

Best regards,
System Engineering Desk
${COMPANY_NAME}
  `.trim();

  // Send User Confirmation
  await sendMail({
    to: lead.email,
    subject: userSubject,
    html: userHtml,
    text: userText
  });

  // B. NOTIFICATION TO ADMIN
  const adminSubject = `🚨 New Corporate Lead: ${lead.name} (${lead.service})`;
  const adminHtml = wrapHtmlTemplate(
    'New Lead Notification',
    `
      <h2 style="color: #dc2626;">🚨 SYSTEM ALERT: New Corporate Inquiry</h2>
      <p>A new prospect has submitted their technical requirements. Please find the lead data payload summarized below for immediate contact routing:</p>
      
      <table class="data-table">
        <tr>
          <td class="label">Prospect Name</td>
          <td class="value"><strong>${lead.name}</strong></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td class="value"><a href="tel:${lead.phone}">${lead.phone}</a></td>
        </tr>
        <tr>
          <td class="label">Service Focus</td>
          <td class="value" style="color: #2563eb; font-weight: bold;">${lead.service}</td>
        </tr>
        ${lead.plan ? `
        <tr>
          <td class="label">Selected Tier</td>
          <td class="value">${lead.plan}</td>
        </tr>
        ` : ''}
        <tr>
          <td class="label">Timestamp</td>
          <td class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>

      <p><strong>Prospect Message Payload:</strong></p>
      <div class="message-box" style="background-color: #fffbeb; border-left-color: #f59e0b;">${lead.message || 'No additional message provided.'}</div>

      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'https://deshwal.com'}/admin" class="button">Access Admin Console Headquarters</a>
      </p>
    `
  );

  const adminText = `
🚨 SYSTEM ALERT: New Lead Received
----------------------------------------
Prospect Name: ${lead.name}
Email Address: ${lead.email}
Phone Number:  ${lead.phone}
Service Focus: ${lead.service}
Plan Selected: ${lead.plan || 'None'}
Timestamp:     ${new Date().toLocaleString()}

Prospect Message:
"${lead.message || 'No message.'}"

Action Required: Please login to the HQ Admin Console to process this lead.
  `.trim();

  // Send Admin Notification
  await sendMail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml,
    text: adminText
  });
}

/**
 * 2. Newsletter Subscription Emails
 */
export async function sendNewsletterEmails(subscriberEmail: string): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'deshwal.mohit81@gmail.com';

  // A. CONFIRMATION TO SUBSCRIBER
  const userSubject = `Subscription Activated - ${COMPANY_NAME}`;
  const userHtml = wrapHtmlTemplate(
    'Newsletter Activated',
    `
      <h2>Subscription Active!</h2>
      <p>Hello,</p>
      <p>Your subscription to the <strong>${COMPANY_NAME} Insights newsletter</strong> has been registered and initialized successfully.</p>
      <p>You have joined an elite roster of technology leaders, startup founders, and enterprise executives who receive our technical reports, web development insights, and product engineering blueprints.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <div style="display: inline-block; padding: 16px 24px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; text-align: left;">
          <p style="margin: 0; font-size: 14px; color: #166534; font-weight: bold;">✓ Verification Standard Passed</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #1e3a8a;">Subscriber: <strong>${subscriberEmail}</strong></p>
        </div>
      </div>

      <p><strong>What you will receive:</strong></p>
      <ul>
        <li>Monthly breakdowns of enterprise system designs and high-performance Web-Tech architectures.</li>
        <li>Early invitations to webinars, tech stacks guides, and software deployment checklists.</li>
        <li>Special case studies detailing how we build scalable digital frameworks.</li>
      </ul>

      <p>Welcome on board. We respect your attention and security, so we promise to deliver only high-signal knowledge reports.</p>
      
      <p>Best regards,<br><strong>Editorial & Technical Insights Desk</strong><br>${COMPANY_NAME}</p>
    `
  );

  const userText = `
Hello,

Your subscription to the ${COMPANY_NAME} Insights newsletter is now active!
Registered Subscriber Email: ${subscriberEmail}

Welcome to our tech publication. You'll receive high-signal technology reports, case studies, and engineering blueprints from our team.

Best regards,
Editorial Desk
${COMPANY_NAME}
  `.trim();

  // Send Subscriber Confirmation
  await sendMail({
    to: subscriberEmail,
    subject: userSubject,
    html: userHtml,
    text: userText
  });

  // B. NOTIFICATION TO ADMIN
  const adminSubject = `📩 New Subscriber Joined Newsletter`;
  const adminHtml = wrapHtmlTemplate(
    'New Subscriber Alert',
    `
      <h2>📩 SYSTEM ALERT: New Newsletter Subscription</h2>
      <p>An user has subscribed to the corporate Insights bulletin via the homepage entry portal:</p>
      
      <table class="data-table">
        <tr>
          <td class="label">Subscriber Email</td>
          <td class="value"><strong>${subscriberEmail}</strong></td>
        </tr>
        <tr>
          <td class="label">Status</td>
          <td class="value" style="color: #166534; font-weight: bold;">ACTIVATED / VERIFIED</td>
        </tr>
        <tr>
          <td class="label">Registered At</td>
          <td class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>

      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'https://deshwal.com'}/admin" class="button">Access Admin Subscriber List</a>
      </p>
    `
  );

  const adminText = `
📩 SYSTEM ALERT: New Newsletter Subscriber
---------------------------------------------
Subscriber Email: ${subscriberEmail}
Status:           ACTIVATED
Timestamp:        ${new Date().toLocaleString()}

Action Required: No action needed. Subscriber added to mailing list database.
  `.trim();

  // Send Admin Notification
  await sendMail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml,
    text: adminText
  });
}

/**
 * 3. Job Application Emails
 */
export async function sendJobApplicationEmails(application: {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  coverLetter: string;
  portfolioUrl?: string;
}): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'deshwal.mohit81@gmail.com';

  // A. CONFIRMATION TO APPLICANT
  const userSubject = `Application Received: ${application.jobTitle} - ${COMPANY_NAME}`;
  const userHtml = wrapHtmlTemplate(
    'Application Filed Successfully',
    `
      <h2>Hello ${application.name},</h2>
      <p>Thank you for applying to the <strong>${application.jobTitle}</strong> position at <strong>${COMPANY_NAME}</strong>. We are thrilled that you're interested in joining our professional engineering team.</p>
      <p>Our talent acquisition team has received your packet. Here is a transmission summary of your application parameters:</p>
      
      <table class="data-table">
        <tr>
          <td class="label">Target Role</td>
          <td class="value" style="color: #2563eb; font-weight: bold;">${application.jobTitle}</td>
        </tr>
        <tr>
          <td class="label">Candidate Name</td>
          <td class="value">${application.name}</td>
        </tr>
        <tr>
          <td class="label">Contact Phone</td>
          <td class="value">${application.phone}</td>
        </tr>
        ${application.portfolioUrl ? `
        <tr>
          <td class="label">CV / Portfolio Link</td>
          <td class="value"><a href="${application.portfolioUrl}" target="_blank">${application.portfolioUrl}</a></td>
        </tr>
        ` : ''}
        <tr>
          <td class="label">File Status</td>
          <td class="value"><span style="color: #2563eb; font-weight: bold;">RECEIVED & UNDER REVIEW</span></td>
        </tr>
      </table>

      <p><strong>Your Submitted Cover Letter:</strong></p>
      <div class="message-box">${application.coverLetter}</div>

      <p><strong>What happens next?</strong></p>
      <ol>
        <li>Our hiring managers will review your experience, portfolio projects, and technical background.</li>
        <li>If your credentials align with our standards, a recruiter will reach out to schedule an initial technical screening conversation.</li>
        <li>Expect updates on your application status within 3 to 5 business days.</li>
      </ol>

      <p>Thank you again for your time, interest, and effort. We appreciate your ambition to build next-generation technologies with us.</p>
      
      <p>Best regards,<br><strong>Talent Acquisition Desk</strong><br>${COMPANY_NAME}</p>
    `
  );

  const userText = `
Hello ${application.name},

Thank you for applying to the ${application.jobTitle} position at ${COMPANY_NAME}. We have successfully received your application packet!

Target Position: ${application.jobTitle}
Your Contact:    ${application.phone}
CV URL:          ${application.portfolioUrl || 'Not provided'}

Your Cover Letter:
"${application.coverLetter}"

Next Steps:
Our engineering recruiters will evaluate your application. If selected for next stages, we will contact you within 3-5 business days.

Best regards,
Talent Acquisition Desk
${COMPANY_NAME}
  `.trim();

  // Send Candidate Confirmation
  await sendMail({
    to: application.email,
    subject: userSubject,
    html: userHtml,
    text: userText
  });

  // B. NOTIFICATION TO ADMIN / HR
  const adminSubject = `💼 New Job Application: ${application.name} for ${application.jobTitle}`;
  const adminHtml = wrapHtmlTemplate(
    'New Job Application Alert',
    `
      <h2 style="color: #9333ea;">💼 SYSTEM ALERT: New Career Application Received</h2>
      <p>A new candidate has submitted their credentials through the DESHWAL Careers portal. Here are the application details:</p>
      
      <table class="data-table">
        <tr>
          <td class="label">Candidate Name</td>
          <td class="value"><strong>${application.name}</strong></td>
        </tr>
        <tr>
          <td class="label">Applied Position</td>
          <td class="value" style="color: #9333ea; font-weight: bold;">${application.jobTitle}</td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${application.email}">${application.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone Number</td>
          <td class="value"><a href="tel:${application.phone}">${application.phone}</a></td>
        </tr>
        ${application.portfolioUrl ? `
        <tr>
          <td class="label">CV / Portfolio Link</td>
          <td class="value"><a href="${application.portfolioUrl}" target="_blank" style="font-family: monospace; font-size: 11px;">${application.portfolioUrl}</a></td>
        </tr>
        ` : ''}
        <tr>
          <td class="label">Timestamp</td>
          <td class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</td>
        </tr>
      </table>

      <p><strong>Candidate's Cover Letter Excerpt:</strong></p>
      <div class="message-box" style="background-color: #faf5ff; border-left-color: #a855f7;">${application.coverLetter}</div>

      <p style="text-align: center;">
        <a href="${process.env.APP_URL || 'https://deshwal.com'}/admin" class="button" style="background-color: #9333ea;">Evaluate Application in Admin HQ</a>
      </p>
    `
  );

  const adminText = `
💼 SYSTEM ALERT: New Job Application Received
----------------------------------------------
Candidate Name:   ${application.name}
Applied Position: ${application.jobTitle}
Candidate Email:  ${application.email}
Candidate Phone:  ${application.phone}
CV/Portfolio URL: ${application.portfolioUrl || 'None'}
Timestamp:        ${new Date().toLocaleString()}

Candidate Cover Letter:
"${application.coverLetter}"

Action Required: Please evaluate this candidate's profile on the Admin Console and schedule a screening call.
  `.trim();

  // Send Admin Notification
  await sendMail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml,
    text: adminText
  });
}

/**
 * Sends a password reset email to client or admin
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetLink: string,
  role: 'client' | 'admin'
): Promise<boolean> {
  const subject = `Reset Your Password - ${COMPANY_NAME}`;
  const html = wrapHtmlTemplate(
    'Password Reset Request',
    `
      <h2>Hello ${name},</h2>
      <p>A request was received to reset the secure login credentials associated with your <strong>${role === 'admin' ? 'Administrator' : 'Client'} Account</strong> at ${COMPANY_NAME}.</p>
      <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      
      <p style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" class="button" style="background-color: ${ACCENT_COLOR}; color: #ffffff !important; display: inline-block; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 14px;">Reset My Password</a>
      </p>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 24px;">
        For security reasons, this secure reset link will expire in <strong>1 hour</strong>.
      </p>
      
      <p style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
        If you are having trouble clicking the button, copy and paste the following URL into your web browser:<br>
        <a href="${resetLink}" style="color: ${ACCENT_COLOR}; word-break: break-all;">${resetLink}</a>
      </p>

      <p>Best regards,<br><strong>Secure Authentication Desk</strong><br>${COMPANY_NAME}</p>
    `
  );

  const text = `
🔒 PASSWORD RESET REQUEST
-------------------------
Hello ${name},

A request was received to reset your password for your ${role === 'admin' ? 'Administrator' : 'Client'} Account at ${COMPANY_NAME}.

Please use the following secure link to reset your password. This link is active for 1 hour:
${resetLink}

If you did not request this, you can safely ignore this email.

Best regards,
Secure Authentication Desk
${COMPANY_NAME}
  `.trim();

  return await sendMail({
    to,
    subject,
    html,
    text
  });
}

/**
 * Sends an email verification link to client or admin using Firebase Auth generated link
 */
export async function sendEmailVerificationEmail(
  to: string,
  name: string,
  verificationLink: string,
  role: 'client' | 'admin'
): Promise<boolean> {
  const subject = `Verify Your Email Address - ${COMPANY_NAME}`;
  const html = wrapHtmlTemplate(
    'Verify Your Account',
    `
      <h2>Hello ${name},</h2>
      <p>Thank you for signing up for a <strong>${role === 'admin' ? 'Administrator' : 'Client'} Account</strong> at ${COMPANY_NAME}.</p>
      <p>To finalize your registration and secure your account, please verify your email address using Firebase Auth:</p>
      
      <p style="text-align: center; margin: 32px 0;">
        <a href="${verificationLink}" class="button" style="background-color: ${ACCENT_COLOR}; color: #ffffff !important; display: inline-block; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: 600; font-size: 14px;">Verify Email Address</a>
      </p>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 24px;">
        Once verified, you will be able to log in to the secure workspace portal.
      </p>
      
      <p style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
        If you are having trouble clicking the button, copy and paste the following URL into your web browser:<br>
        <a href="${verificationLink}" style="color: ${ACCENT_COLOR}; word-break: break-all;">${verificationLink}</a>
      </p>

      <p>Best regards,<br><strong>Secure Authentication Desk</strong><br>${COMPANY_NAME}</p>
    `
  );

  const text = `
📧 VERIFY YOUR EMAIL ADDRESS
----------------------------
Hello ${name},

Thank you for signing up for a ${role === 'admin' ? 'Administrator' : 'Client'} Account at ${COMPANY_NAME}.

Please use the following Firebase Auth link to verify your email address and secure your account:
${verificationLink}

Once verified, you will be able to log in to the secure workspace portal.

Best regards,
Secure Authentication Desk
${COMPANY_NAME}
  `.trim();

  return await sendMail({
    to,
    subject,
    html,
    text
  });
}
