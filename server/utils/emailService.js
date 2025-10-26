
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send verification email
async function sendVerificationEmail(email, name, token) {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${token}`;
  
  const mailOptions = {
    from: `"University Admission Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - University Admission Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Welcome to University Admission Portal!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #667eea;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">University Admission Portal</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Send password reset email
async function sendPasswordResetEmail(email, name, token) {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}`;
  
  const mailOptions = {
    from: `"University Admission Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - University Admission Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #667eea;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">University Admission Portal</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Send application status update email
async function sendApplicationStatusEmail(email, name, applicationNumber, status, remarks = '') {
  let statusMessage = '';
  let statusColor = '#667eea';
  
  switch(status) {
    case 'Verified':
      statusMessage = 'Your application has been verified and is under review.';
      statusColor = '#3b82f6';
      break;
    case 'Approved':
      statusMessage = 'Congratulations! Your application has been approved.';
      statusColor = '#10b981';
      break;
    case 'Rejected':
      statusMessage = 'Unfortunately, your application has been rejected.';
      statusColor = '#ef4444';
      break;
    default:
      statusMessage = `Your application status has been updated to: ${status}`;
  }
  
  const mailOptions = {
    from: `"University Admission Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Application Status Update - ${applicationNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Application Status Update</h2>
        <p>Hi ${name},</p>
        <p>${statusMessage}</p>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Application Number:</strong> ${applicationNumber}</p>
          <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
          ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
        </div>
        <p>You can view your application details by logging into your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Application
          </a>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">University Admission Portal</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Send welcome email after verification
async function sendWelcomeEmail(email, name) {
  const mailOptions = {
    from: `"University Admission Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to University Admission Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Welcome to University Admission Portal!</h2>
        <p>Hi ${name},</p>
        <p>Your email has been successfully verified. You can now submit your admission application.</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Complete your profile information</li>
          <li>Fill out the admission application form</li>
          <li>Upload required documents</li>
          <li>Submit your application</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/applicant" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">University Admission Portal</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendApplicationStatusEmail,
  sendWelcomeEmail
};
