import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

/**
 * Creates and returns the nodemailer transporter instance
 */
const getTransporter = () => {
  if (!config.SMTP.HOST || !config.SMTP.USER) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.SMTP.HOST,
    port: config.SMTP.PORT,
    secure: config.SMTP.PORT === 465,
    auth: {
      user: config.SMTP.USER,
      pass: config.SMTP.PASSWORD
    },
    tls: {
      rejectUnauthorized: config.NODE_ENV === 'production'
    }
  });
};

/**
 * Common HTML wrapper with Dayflow enterprise branding
 */
const wrapEmailTemplate = ({ title, preheader, bodyHtml, actionButton }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 32px 40px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 36px 40px; line-height: 1.6; }
    .footer { padding: 24px 40px; background-color: #f1f5f9; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .badge { display: inline-block; padding: 4px 12px; font-size: 12px; font-weight: 600; border-radius: 9999px; background-color: #e0e7ff; color: #4338ca; }
    .code-box { background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; font-family: monospace; }
    .btn { display: inline-block; padding: 12px 28px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 16px; }
    .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details-table th, .details-table td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; text-align: left; }
    .details-table th { color: #64748b; font-weight: 500; width: 35%; }
  </style>
</head>
<body>
  <div style="display: none; font-size: 1px; color: #fff; max-height: 0;">${preheader || title}</div>
  <div class="container">
    <div class="header">
      <h1>⚡ Dayflow HRMS</h1>
      <p>Every workday, perfectly aligned</p>
    </div>
    <div class="content">
      ${bodyHtml}
      ${actionButton ? `<div style="text-align: center; margin: 28px 0 10px;">${actionButton}</div>` : ''}
    </div>
    <div class="footer">
      <p>This is an automated system notification sent from Dayflow Enterprise HRMS.</p>
      <p>© ${new Date().getFullYear()} Dayflow HRMS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generic internal dispatcher
 */
const sendMail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[Dayflow Mail Dispatcher (Dev/Mock Mode)]`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    if (text) console.log(`  Content Preview: ${text.slice(0, 120)}...`);
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from: config.SMTP.FROM,
      to,
      subject,
      text: text || subject,
      html
    });

    console.log(`[Dayflow Mail] Email sent successfully to ${to}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Dayflow Mail Error] Failed sending email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 1. Send OTP Email for Account Verification / Login
 */
export const sendVerificationOTP = async (toEmail, name, otp) => {
  const title = 'Verify Your Dayflow Account';
  const html = wrapEmailTemplate({
    title,
    preheader: `Your Dayflow HRMS verification code is ${otp}`,
    bodyHtml: `
      <h2>Hello ${name || 'Dayflow Colleague'},</h2>
      <p>Welcome to Dayflow HRMS! Please use the 6-digit verification code below to verify your account and complete your sign-in.</p>
      <div class="code-box">${otp}</div>
      <p style="color: #64748b; font-size: 13px;">This verification code will expire in <strong>15 minutes</strong>. If you did not initiate this request, please contact your HR department or system administrator immediately.</p>
    `
  });

  return sendMail({
    to: toEmail,
    subject: `[Dayflow] Your Verification Code: ${otp}`,
    text: `Your Dayflow verification code is ${otp}. Valid for 15 minutes.`,
    html
  });
};

/**
 * 2. Send Password Reset Email
 */
export const sendPasswordResetEmail = async (toEmail, name, resetUrl, token) => {
  const title = 'Reset Your Dayflow Password';
  const actionUrl = resetUrl || `${config.CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(toEmail)}`;

  const html = wrapEmailTemplate({
    title,
    preheader: 'Instructions to reset your Dayflow HRMS password',
    bodyHtml: `
      <h2>Hello ${name || 'Dayflow Colleague'},</h2>
      <p>We received a request to reset your password for your Dayflow HRMS account.</p>
      <p>Click the button below to choose a new secure password. This link is valid for <strong>1 hour</strong>.</p>
    `,
    actionButton: `<a href="${actionUrl}" class="btn">Reset Password</a>`
  });

  return sendMail({
    to: toEmail,
    subject: '[Dayflow] Password Reset Request',
    text: `To reset your Dayflow password, please visit: ${actionUrl}`,
    html
  });
};

/**
 * 3. Send Leave Request Status Update
 */
export const sendLeaveStatusEmail = async (toEmail, { employeeName, leaveType, startDate, endDate, days, status, reason, reviewerName }) => {
  const statusColor = status === 'Approved' ? '#16a34a' : status === 'Rejected' ? '#dc2626' : '#d97706';
  const title = `Leave Request ${status}`;

  const html = wrapEmailTemplate({
    title,
    preheader: `Your ${leaveType} leave request has been ${status.toLowerCase()}`,
    bodyHtml: `
      <h2>Hello ${employeeName},</h2>
      <p>Your leave request has been reviewed by <strong>${reviewerName || 'HR Management'}</strong>.</p>
      
      <div style="margin: 20px 0; padding: 14px 18px; border-radius: 8px; background-color: #f8fafc; border-left: 4px solid ${statusColor};">
        <div style="font-size: 16px; font-weight: 700; color: ${statusColor}; margin-bottom: 4px;">Status: ${status}</div>
        <div style="font-size: 13px; color: #64748b;">Reviewed on ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</div>
      </div>

      <table class="details-table">
        <tr>
          <th>Leave Type</th>
          <td><strong>${leaveType}</strong></td>
        </tr>
        <tr>
          <th>Duration</th>
          <td>${startDate} to ${endDate} (${days} days)</td>
        </tr>
        ${reason ? `<tr><th>Reason/Remarks</th><td>${reason}</td></tr>` : ''}
      </table>
    `,
    actionButton: `<a href="${config.CLIENT_URL}/leaves" class="btn">View Leave Dashboard</a>`
  });

  return sendMail({
    to: toEmail,
    subject: `[Dayflow] Leave Request ${status}: ${leaveType} (${startDate} - ${endDate})`,
    text: `Your ${leaveType} leave request (${startDate} - ${endDate}) has been ${status}.`,
    html
  });
};

/**
 * 4. Send Welcome Email to Newly Onboarded Employee
 */
export const sendWelcomeEmployeeEmail = async (toEmail, { name, employeeId, tempPassword, role, designation }) => {
  const title = 'Welcome to Dayflow HRMS!';
  const html = wrapEmailTemplate({
    title,
    preheader: `Your Dayflow HRMS employee account (${employeeId}) is ready`,
    bodyHtml: `
      <h2>Welcome aboard, ${name}! 🎉</h2>
      <p>Your official employee profile has been created in Dayflow HRMS as <strong>${designation || role}</strong>.</p>
      
      <p>Here are your initial sign-in credentials:</p>
      <table class="details-table">
        <tr>
          <th>Employee ID</th>
          <td><code>${employeeId}</code></td>
        </tr>
        <tr>
          <th>Registered Email</th>
          <td>${toEmail}</td>
        </tr>
        ${tempPassword ? `<tr><th>Temporary Password</th><td><code>${tempPassword}</code></td></tr>` : ''}
        <tr>
          <th>Portal URL</th>
          <td><a href="${config.CLIENT_URL}">${config.CLIENT_URL}</a></td>
        </tr>
      </table>

      <p style="color: #64748b; font-size: 13px;">Please sign in and change your password during your first session.</p>
    `,
    actionButton: `<a href="${config.CLIENT_URL}/login" class="btn">Sign In to Dayflow</a>`
  });

  return sendMail({
    to: toEmail,
    subject: `[Dayflow] Welcome to the Team! Your HRMS Account Details (${employeeId})`,
    text: `Welcome to Dayflow, ${name}! Your Employee ID is ${employeeId}. Sign in at ${config.CLIENT_URL}/login.`,
    html
  });
};

/**
 * 5. Send Payroll / Payslip Notification
 */
export const sendPayrollNotificationEmail = async (toEmail, { employeeName, monthYear, netSalary, currency = 'USD' }) => {
  const title = `Payslip Ready: ${monthYear}`;
  const html = wrapEmailTemplate({
    title,
    preheader: `Your payslip for ${monthYear} is now available in Dayflow`,
    bodyHtml: `
      <h2>Hello ${employeeName},</h2>
      <p>Your payslip for <strong>${monthYear}</strong> has been generated and processed by Finance & HR.</p>
      
      <div class="code-box" style="font-size: 26px; letter-spacing: 0; color: #16a34a; background-color: #f0fdf4; border-color: #86efac;">
        ${currency} ${Number(netSalary).toLocaleString()}
        <div style="font-size: 12px; font-weight: 500; color: #15803d; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Net Disbursed Amount</div>
      </div>

      <p>You can review the full breakdown of your earnings, allowances, deductions, and tax computations in the portal.</p>
    `,
    actionButton: `<a href="${config.CLIENT_URL}/payroll" class="btn">Download Payslip</a>`
  });

  return sendMail({
    to: toEmail,
    subject: `[Dayflow] Payslip Released for ${monthYear}`,
    text: `Your payslip for ${monthYear} is ready. Net amount: ${currency} ${netSalary}. View in Dayflow portal.`,
    html
  });
};

export default {
  sendVerificationOTP,
  sendPasswordResetEmail,
  sendLeaveStatusEmail,
  sendWelcomeEmployeeEmail,
  sendPayrollNotificationEmail
};
