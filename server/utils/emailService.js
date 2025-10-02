/**
 * Unified Email Service
 * Consolidates all email sending functionality into one place
 * Replaces multiple separate email functions with a template-based approach
 */

const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_ID,
		pass: process.env.EMAIL_PASSWORD
	},
	secure: true
});

/**
 * Email Templates
 * All email templates in one place for easy maintenance
 */
const emailTemplates = {
	verification: (otp) => ({
		subject: 'Verify Your Email - Placemento',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
				<div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<h2 style="color: #333; text-align: center;">Email Verification</h2>
					<p style="color: #666; font-size: 16px;">Your OTP for email verification is:</p>
					<div style="text-align: center; margin: 30px 0;">
						<span style="display: inline-block; padding: 15px 30px; background-color: #4CAF50; color: white; font-size: 32px; font-weight: bold; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
					</div>
					<p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
					<p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
				</div>
			</div>
		`
	}),

	passwordReset: (resetLink) => ({
		subject: 'Reset Your Password - Placemento',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
				<div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<h2 style="color: #333; text-align: center;">Password Reset Request</h2>
					<p style="color: #666; font-size: 16px;">We received a request to reset your password.</p>
					<p style="color: #666; font-size: 16px;">Click the button below to reset your password:</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="${resetLink}" style="display: inline-block; padding: 15px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
					</div>
					<p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
					<p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
				</div>
			</div>
		`
	}),

	welcome: (name) => ({
		subject: 'Welcome to Placemento! 🎓',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
				<div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<h2 style="color: #333; text-align: center;">Welcome to Placemento! 🎉</h2>
					<p style="color: #666; font-size: 16px;">Hi ${name},</p>
					<p style="color: #666; font-size: 16px;">Your account has been successfully created and verified!</p>
					<p style="color: #666; font-size: 16px;">Start exploring placement opportunities and manage your profile.</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 15px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
					</div>
				</div>
			</div>
		`
	}),

	placementUpdate: (data) => ({
		subject: `New Placement Opportunity - ${data.companyName}`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
				<div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<h2 style="color: #333; text-align: center;">New Placement Opportunity! 🚀</h2>
					<h3 style="color: #4CAF50;">${data.companyName}</h3>
					<p style="color: #666; font-size: 16px;">${data.details}</p>
					<div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
						<p style="margin: 5px 0;"><strong>CTC:</strong> ${data.ctc} LPA</p>
						<p style="margin: 5px 0;"><strong>Profile:</strong> ${data.profile}</p>
						<p style="margin: 5px 0;"><strong>Location:</strong> ${data.location}</p>
					</div>
					<div style="text-align: center; margin: 30px 0;">
						<a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/companies" style="display: inline-block; padding: 15px 30px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View Details</a>
					</div>
				</div>
			</div>
		`
	}),

	accountVerified: (name) => ({
		subject: 'Account Verified - Placemento',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
				<div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
					<h2 style="color: #333; text-align: center;">Account Verified! ✅</h2>
					<p style="color: #666; font-size: 16px;">Hi ${name},</p>
					<p style="color: #666; font-size: 16px;">Great news! Your account has been verified by the admin.</p>
					<p style="color: #666; font-size: 16px;">You can now log in and access all features.</p>
					<div style="text-align: center; margin: 30px 0;">
						<a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/auth?mode=signin" style="display: inline-block; padding: 15px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign In</a>
					</div>
				</div>
			</div>
		`
	})
};

/**
 * Unified email sending function
 *
 * @param {string} to - Recipient email address
 * @param {string} templateName - Name of the email template to use
 * @param {*} data - Data to pass to the template
 * @returns {Promise<Object>} - Result of email sending
 *
 * @example
 * await sendEmail('user@example.com', 'verification', '123456');
 * await sendEmail('user@example.com', 'passwordReset', 'https://reset-link.com');
 * await sendEmail('user@example.com', 'welcome', 'John Doe');
 */
const sendEmail = async (to, templateName, data) => {
	try {
		const template = emailTemplates[templateName];

		if (!template) {
			throw new Error(`Email template '${templateName}' not found`);
		}

		const emailContent = template(data);

		const info = await transporter.sendMail({
			from: `"Placemento - NIT Warangal" <${process.env.EMAIL_ID}>`,
			to,
			subject: emailContent.subject,
			html: emailContent.html
		});

		logger.info(`Email sent successfully to ${to} (${templateName}), messageId: ${info.messageId}`);

		return { success: true, messageId: info.messageId };
	} catch (error) {
		logger.error(`Failed to send email to ${to} (${templateName}): ${error.message}`);
		throw error;
	}
};

module.exports = { sendEmail, emailTemplates };
