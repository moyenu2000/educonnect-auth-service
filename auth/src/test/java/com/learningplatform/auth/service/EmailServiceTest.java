package com.learningplatform.auth.service;

import com.learningplatform.auth.entity.AuthProvider;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.entity.UserRole;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.test.util.ReflectionTestUtils;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .role(UserRole.STUDENT)
                .provider(AuthProvider.LOCAL)
                .verificationToken("verification-token-123")
                .resetToken("reset-token-123")
                .build();

        ReflectionTestUtils.setField(emailService, "fromEmail", "noreply@learningplatform.com");
        ReflectionTestUtils.setField(emailService, "baseUrl", "http://localhost:8080/api");
        ReflectionTestUtils.setField(emailService, "frontendUrl", "http://localhost:3000");
    }

    @Test
    void sendVerificationEmail_ShouldSendEmail_WhenValidUser() throws MessagingException {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendVerificationEmail(testUser);

        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendVerificationEmail_ShouldHandleException_WhenMessagingFails() throws MessagingException {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new MessagingException("Email failed")).when(mailSender).send(any(MimeMessage.class));

        emailService.sendVerificationEmail(testUser);

        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendPasswordResetEmail_ShouldSendEmail_WhenValidUser() throws MessagingException {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendPasswordResetEmail(testUser);

        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendPasswordResetEmail_ShouldHandleException_WhenMessagingFails() throws MessagingException {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new MessagingException("Email failed")).when(mailSender).send(any(MimeMessage.class));

        emailService.sendPasswordResetEmail(testUser);

        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendWelcomeEmail_ShouldSendEmail_WhenValidUser() throws MessagingException {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendWelcomeEmail(testUser);

        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void sendWelcomeEmail_ShouldHandleException_WhenMessagingFails() throws MessagingException {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        doThrow(new MessagingException("Email failed")).when(mailSender).send(any(MimeMessage.class));

        emailService.sendWelcomeEmail(testUser);

        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }
}