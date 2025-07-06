package com.learningplatform.auth.service;

import com.learningplatform.auth.dto.ApiResponse;
import com.learningplatform.auth.dto.TwoFactorSetupResponse;
import com.learningplatform.auth.entity.AuthProvider;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.entity.UserRole;
import com.learningplatform.auth.exception.BadRequestException;
import com.learningplatform.auth.exception.ResourceNotFoundException;
import com.learningplatform.auth.repository.UserRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TwoFactorAuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private GoogleAuthenticator googleAuthenticator;

    @Mock
    private GoogleAuthenticatorKey googleAuthenticatorKey;

    @InjectMocks
    private TwoFactorAuthService twoFactorAuthService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .fullName("Test User")
                .role(UserRole.STUDENT)
                .enabled(true)
                .verified(true)
                .provider(AuthProvider.LOCAL)
                .twoFactorEnabled(false)
                .twoFactorSecret(null)
                .build();

        ReflectionTestUtils.setField(twoFactorAuthService, "issuer", "Learning Platform");
        ReflectionTestUtils.setField(twoFactorAuthService, "qrCodeWidth", 200);
        ReflectionTestUtils.setField(twoFactorAuthService, "qrCodeHeight", 200);
        ReflectionTestUtils.setField(twoFactorAuthService, "googleAuthenticator", googleAuthenticator);
    }

    @Test
    void enableTwoFactorAuth_ShouldReturnSetupResponse_WhenValidUser() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(googleAuthenticator.createCredentials()).thenReturn(googleAuthenticatorKey);
        when(googleAuthenticatorKey.getKey()).thenReturn("TESTKEY123456789");

        TwoFactorSetupResponse response = twoFactorAuthService.enableTwoFactorAuth("testuser");

        assertNotNull(response);
        assertEquals("TESTKEY123456789", response.getSecret());
        assertNotNull(response.getQrCodeUrl());
        assertTrue(response.getQrCodeUrl().startsWith("data:image/png;base64,"));
        assertNotNull(response.getManualEntryKey());
        verify(userRepository).save(testUser);
    }

    @Test
    void enableTwoFactorAuth_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
                () -> twoFactorAuthService.enableTwoFactorAuth("nonexistent"));
    }

    @Test
    void enableTwoFactorAuth_ShouldThrowException_WhenTwoFactorAlreadyEnabled() {
        testUser.setTwoFactorEnabled(true);
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, 
                () -> twoFactorAuthService.enableTwoFactorAuth("testuser"));
    }

    @Test
    void confirmTwoFactorAuth_ShouldEnableTwoFactor_WhenValidCode() {
        testUser.setTwoFactorSecret("TESTKEY123456789");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(googleAuthenticator.authorize(anyString(), anyInt())).thenReturn(true);

        ApiResponse response = twoFactorAuthService.confirmTwoFactorAuth("testuser", "123456");

        assertTrue(response.isSuccess());
        assertEquals("Two-factor authentication enabled successfully", response.getMessage());
        assertTrue(testUser.isTwoFactorEnabled());
        verify(userRepository).save(testUser);
    }

    @Test
    void confirmTwoFactorAuth_ShouldThrowException_WhenInvalidCode() {
        testUser.setTwoFactorSecret("TESTKEY123456789");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(googleAuthenticator.authorize(anyString(), anyInt())).thenReturn(false);

        assertThrows(BadRequestException.class, 
                () -> twoFactorAuthService.confirmTwoFactorAuth("testuser", "123456"));
    }

    @Test
    void confirmTwoFactorAuth_ShouldThrowException_WhenTwoFactorAlreadyEnabled() {
        testUser.setTwoFactorEnabled(true);
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, 
                () -> twoFactorAuthService.confirmTwoFactorAuth("testuser", "123456"));
    }

    @Test
    void confirmTwoFactorAuth_ShouldThrowException_WhenSecretNotSet() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, 
                () -> twoFactorAuthService.confirmTwoFactorAuth("testuser", "123456"));
    }

    @Test
    void disableTwoFactorAuth_ShouldDisableTwoFactor_WhenValidPassword() {
        testUser.setTwoFactorEnabled(true);
        testUser.setTwoFactorSecret("TESTKEY123456789");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        ApiResponse response = twoFactorAuthService.disableTwoFactorAuth("testuser", "password123");

        assertTrue(response.isSuccess());
        assertEquals("Two-factor authentication disabled successfully", response.getMessage());
        assertFalse(testUser.isTwoFactorEnabled());
        assertNull(testUser.getTwoFactorSecret());
        verify(userRepository).save(testUser);
    }

    @Test
    void disableTwoFactorAuth_ShouldThrowException_WhenInvalidPassword() {
        testUser.setTwoFactorEnabled(true);
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(BadRequestException.class, 
                () -> twoFactorAuthService.disableTwoFactorAuth("testuser", "wrongpassword"));
    }

    @Test
    void disableTwoFactorAuth_ShouldThrowException_WhenTwoFactorNotEnabled() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, 
                () -> twoFactorAuthService.disableTwoFactorAuth("testuser", "password123"));
    }

    @Test
    void verifyTwoFactorCode_ShouldReturnTrue_WhenValidCode() {
        testUser.setTwoFactorEnabled(true);
        testUser.setTwoFactorSecret("TESTKEY123456789");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(googleAuthenticator.authorize(anyString(), anyInt())).thenReturn(true);

        boolean result = twoFactorAuthService.verifyTwoFactorCode("testuser", "123456");

        assertTrue(result);
    }

    @Test
    void verifyTwoFactorCode_ShouldReturnFalse_WhenInvalidCode() {
        testUser.setTwoFactorEnabled(true);
        testUser.setTwoFactorSecret("TESTKEY123456789");
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(googleAuthenticator.authorize(anyString(), anyInt())).thenReturn(false);

        boolean result = twoFactorAuthService.verifyTwoFactorCode("testuser", "123456");

        assertFalse(result);
    }

    @Test
    void verifyTwoFactorCode_ShouldReturnFalse_WhenTwoFactorNotEnabled() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        boolean result = twoFactorAuthService.verifyTwoFactorCode("testuser", "123456");

        assertFalse(result);
    }

    @Test
    void verifyTwoFactorCode_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
                () -> twoFactorAuthService.verifyTwoFactorCode("nonexistent", "123456"));
    }
}