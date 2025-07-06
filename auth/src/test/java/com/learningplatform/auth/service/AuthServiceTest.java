package com.learningplatform.auth.service;

import com.learningplatform.auth.dto.*;
import com.learningplatform.auth.entity.AuthProvider;
import com.learningplatform.auth.entity.RefreshToken;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.entity.UserRole;
import com.learningplatform.auth.exception.BadRequestException;
import com.learningplatform.auth.repository.RefreshTokenRepository;
import com.learningplatform.auth.repository.UserRepository;
import com.learningplatform.auth.security.CustomUserPrincipal;
import com.learningplatform.auth.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @Mock
    private HttpServletRequest httpServletRequest;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private RefreshToken refreshToken;

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
                .failedLoginAttempts(0)
                .build();

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("Test User");

        loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("testuser");
        loginRequest.setPassword("password123");

        refreshToken = RefreshToken.builder()
                .id(1L)
                .token("refreshToken123")
                .user(testUser)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo("Mozilla/5.0")
                .ipAddress("127.0.0.1")
                .build();
    }

    @Test
    void register_ShouldCreateUser_WhenValidRequest() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ApiResponse response = authService.register(registerRequest);

        assertTrue(response.isSuccess());
        assertEquals("User registered successfully. Please check your email to verify your account.",
                response.getMessage());
        verify(userRepository).save(any(User.class));
        verify(emailService).sendVerificationEmail(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenUsernameExists() {
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailExists() {
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ShouldReturnAuthResponse_WhenValidCredentials() {
        CustomUserPrincipal userPrincipal = CustomUserPrincipal.create(testUser);

        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(jwtUtils.generateAccessToken(any(CustomUserPrincipal.class))).thenReturn("accessToken");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);
        when(httpServletRequest.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        when(httpServletRequest.getRemoteAddr()).thenReturn("127.0.0.1");

        AuthResponse response = authService.login(loginRequest, httpServletRequest);

        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertEquals("accessToken", response.getAccessToken());
        assertNotNull(response.getUser());
        verify(userRepository).save(testUser);
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> authService.login(loginRequest, httpServletRequest));
    }

    @Test
    void login_ShouldThrowException_WhenAccountLocked() {
        testUser.setLockedUntil(LocalDateTime.now().plusMinutes(30));
        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> authService.login(loginRequest, httpServletRequest));
    }

    @Test
    void login_ShouldThrowException_WhenEmailNotVerified() {
        testUser.setVerified(false);
        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> authService.login(loginRequest, httpServletRequest));
    }

    @Test
    void login_ShouldReturnTwoFactorRequired_WhenTwoFactorEnabled() {
        testUser.setTwoFactorEnabled(true);
        CustomUserPrincipal userPrincipal = CustomUserPrincipal.create(testUser);

        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);

        AuthResponse response = authService.login(loginRequest, httpServletRequest);

        assertTrue(response.isSuccess());
        assertTrue(response.isRequiresTwoFactor());
        assertNotNull(response.getTempToken());
        verify(userRepository).save(testUser);
    }

    @Test
    void login_ShouldIncrementFailedAttempts_WhenBadCredentials() {
        when(userRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadRequestException.class, () -> authService.login(loginRequest, httpServletRequest));
        verify(userRepository, times(2)).save(testUser);
    }

    @Test
    void refreshToken_ShouldReturnNewToken_WhenValidRefreshToken() {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("refreshToken123");

        when(refreshTokenRepository.findByToken(anyString())).thenReturn(Optional.of(refreshToken));
        when(jwtUtils.generateAccessToken(any(CustomUserPrincipal.class))).thenReturn("newAccessToken");

        AuthResponse response = authService.refreshToken(request);

        assertTrue(response.isSuccess());
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("refreshToken123", response.getRefreshToken());
    }

    @Test
    void refreshToken_ShouldThrowException_WhenTokenNotFound() {
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("invalidToken");
        when(refreshTokenRepository.findByToken(anyString())).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> authService.refreshToken(request));
    }

    @Test
    void refreshToken_ShouldThrowException_WhenTokenExpired() {
        refreshToken.setExpiryDate(Instant.now().minus(1, ChronoUnit.DAYS));
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("refreshToken123");

        when(refreshTokenRepository.findByToken(anyString())).thenReturn(Optional.of(refreshToken));

        assertThrows(BadRequestException.class, () -> authService.refreshToken(request));
        verify(refreshTokenRepository).delete(refreshToken);
    }

    @Test
    void logout_ShouldInvalidateRefreshToken() {
        when(refreshTokenRepository.findByToken(anyString())).thenReturn(Optional.of(refreshToken));

        ApiResponse response = authService.logout("accessToken", "refreshToken123");

        assertTrue(response.isSuccess());
        assertEquals("Logged out successfully", response.getMessage());
        verify(refreshTokenRepository).delete(refreshToken);
    }

    @Test
    void verifyEmail_ShouldVerifyUser_WhenValidToken() {
        testUser.setVerified(false);
        testUser.setVerificationToken("validToken");
        testUser.setVerificationTokenExpiry(LocalDateTime.now().plusHours(1));

        when(userRepository.findByVerificationToken(anyString())).thenReturn(Optional.of(testUser));

        ApiResponse response = authService.verifyEmail("validToken");

        assertTrue(response.isSuccess());
        assertEquals("Email verified successfully", response.getMessage());
        assertTrue(testUser.isVerified());
        assertNull(testUser.getVerificationToken());
        verify(userRepository).save(testUser);
    }

    @Test
    void verifyEmail_ShouldThrowException_WhenTokenExpired() {
        testUser.setVerificationToken("expiredToken");
        testUser.setVerificationTokenExpiry(LocalDateTime.now().minusHours(1));

        when(userRepository.findByVerificationToken(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> authService.verifyEmail("expiredToken"));
    }

    @Test
    void forgotPassword_ShouldSendResetEmail_WhenValidEmail() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        ApiResponse response = authService.forgotPassword("test@example.com");

        assertTrue(response.isSuccess());
        assertEquals("Password reset email sent successfully", response.getMessage());
        assertNotNull(testUser.getResetToken());
        verify(emailService).sendPasswordResetEmail(testUser);
        verify(userRepository).save(testUser);
    }

    @Test
    void resetPassword_ShouldResetPassword_WhenValidToken() {
        testUser.setResetToken("validResetToken");
        testUser.setResetTokenExpiry(LocalDateTime.now().plusHours(1));

        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setToken("validResetToken");
        request.setNewPassword("newPassword123");

        when(userRepository.findByResetToken(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedNewPassword");

        ApiResponse response = authService.resetPassword(request);

        assertTrue(response.isSuccess());
        assertEquals("Password reset successfully", response.getMessage());
        assertNull(testUser.getResetToken());
        verify(userRepository).save(testUser);
    }

    @Test
    void changePassword_ShouldChangePassword_WhenCurrentPasswordValid() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("currentPassword");
        request.setNewPassword("newPassword123");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedNewPassword");

        ApiResponse response = authService.changePassword("testuser", request);

        assertTrue(response.isSuccess());
        assertEquals("Password changed successfully", response.getMessage());
        verify(userRepository).save(testUser);
    }

    @Test
    void changePassword_ShouldThrowException_WhenCurrentPasswordInvalid() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrongPassword");
        request.setNewPassword("newPassword123");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authService.changePassword("testuser", request));
    }

    @Test
    void getCurrentUser_ShouldReturnUserResponse_WhenUserExists() {
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));

        UserResponse response = authService.getCurrentUser("testuser");

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
    }

    @Test
    void updateProfile_ShouldUpdateUser_WhenValidRequest() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Updated Name");
        request.setBio("Updated bio");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserResponse response = authService.updateProfile("testuser", request);

        assertNotNull(response);
        assertEquals("Updated Name", testUser.getFullName());
        assertEquals("Updated bio", testUser.getBio());
        verify(userRepository).save(testUser);
    }

    @Test
    void getAllUsers_ShouldReturnPagedUsers() {
        Page<User> userPage = new PageImpl<>(Arrays.asList(testUser));
        when(userRepository.findAll(any(PageRequest.class))).thenReturn(userPage);

        Page<UserResponse> response = authService.getAllUsers(0, 10);

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals("testuser", response.getContent().get(0).getUsername());
    }

    @Test
    void updateUserRole_ShouldUpdateRole_WhenValidRequest() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));

        ApiResponse response = authService.updateUserRole(1L, "QUESTION_SETTER");

        assertTrue(response.isSuccess());
        assertEquals(UserRole.QUESTION_SETTER, testUser.getRole());
        verify(userRepository).save(testUser);
    }

    @Test
    void updateUserStatus_ShouldUpdateStatus_WhenValidRequest() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));

        ApiResponse response = authService.updateUserStatus(1L, false);

        assertTrue(response.isSuccess());
        assertFalse(testUser.isEnabled());
        verify(userRepository).save(testUser);
    }

    @Test
    void resendVerificationEmail_ShouldSendEmail_WhenUserNotVerified() {
        testUser.setVerified(false);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        ApiResponse response = authService.resendVerificationEmail("test@example.com");

        assertTrue(response.isSuccess());
        assertEquals("Verification email sent successfully", response.getMessage());
        assertNotNull(testUser.getVerificationToken());
        verify(emailService).sendVerificationEmail(testUser);
        verify(userRepository).save(testUser);
    }

    @Test
    void resendVerificationEmail_ShouldThrowException_WhenEmailAlreadyVerified() {
        testUser.setVerified(true);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> authService.resendVerificationEmail("test@example.com"));
    }
}