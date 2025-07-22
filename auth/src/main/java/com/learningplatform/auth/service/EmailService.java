package com.learningplatform.auth.service;

import com.learningplatform.auth.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Verify Your Email - Learning Platform");

            String verificationUrl = baseUrl + "/api/v1/auth/verify-email?token=" + user.getVerificationToken();

            String htmlContent = buildVerificationEmailContent(user.getFullName(), verificationUrl);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent to: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}", user.getEmail(), e);
        }
    }

    @Async
    public void sendPasswordResetEmail(User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Reset Your Password - Learning Platform");

            String resetUrl = frontendUrl + "/reset-password?token=" + user.getResetToken();

            String htmlContent = buildPasswordResetEmailContent(user.getFullName(), resetUrl);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {}", user.getEmail(), e);
        }
    }

    @Async
    public void sendWelcomeEmail(User user) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to Learning Platform!");

            String htmlContent = buildWelcomeEmailContent(user.getFullName());
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }

    private String buildVerificationEmailContent(String name, String verificationUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50;
                                 color: white; text-decoration: none; border-radius: 5px; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Learning Platform</h1>
                        </div>
                        <div class="content">
                            <h2>Hi %s,</h2>
                            <p>Thank you for registering with Learning Platform!</p>
                            <p>Please click the button below to verify your email address:</p>
                            <div style="text-align: center;">
                                <a href="%s" class="button">Verify Email</a>
                            </div>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all;">%s</p>
                            <p>This link will expire in 24 hours.</p>
                            <p>If you didn't create an account, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Learning Platform. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(name, verificationUrl, verificationUrl);
    }

    private String buildPasswordResetEmailContent(String name, String resetUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .button { display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #FF9800;
                                 color: white; text-decoration: none; border-radius: 5px; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <h2>Hi %s,</h2>
                            <p>We received a request to reset your password.</p>
                            <p>Click the button below to reset your password:</p>
                            <div style="text-align: center;">
                                <a href="%s" class="button">Reset Password</a>
                            </div>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all;">%s</p>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Learning Platform. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(name, resetUrl, resetUrl);
    }

    private String buildWelcomeEmailContent(String name) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background-color: #f9f9f9; }
                        .feature { margin: 15px 0; padding: 10px; background-color: white; border-left: 4px solid #2196F3; }
                        .footer { text-align: center; padding: 10px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome to Learning Platform!</h1>
                        </div>
                        <div class="content">
                            <h2>Hi %s,</h2>
                            <p>Welcome aboard! Your account has been successfully verified.</p>
                            <p>Here's what you can do on our platform:</p>
                            <div class="feature">
                                <strong>📚 Daily Challenges</strong>
                                <p>Participate in daily question contests to test your knowledge</p>
                            </div>
                            <div class="feature">
                                <strong>🤝 Social Learning</strong>
                                <p>Connect with other learners, share posts, and engage in discussions</p>
                            </div>
                            <div class="feature">
                                <strong>📈 Track Progress</strong>
                                <p>Monitor your learning journey and see your improvements</p>
                            </div>
                            <p>Ready to start learning? Log in to your account and explore!</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Learning Platform. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(name);
    }
}