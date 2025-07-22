package com.learningplatform.auth.service;

import com.learningplatform.auth.dto.*;
import com.learningplatform.auth.entity.*;
import com.learningplatform.auth.exception.*;
import com.learningplatform.auth.repository.*;
import com.learningplatform.auth.security.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final UserEventPublisher userEventPublisher;

    @Transactional
    public ApiResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        // Create new user - always register as STUDENT
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(UserRole.STUDENT) // Always register as STUDENT
                .enabled(true)
                .verified(false)
                .provider(AuthProvider.LOCAL)
                .build();

        // Generate verification token
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

        user = userRepository.save(user);

        // Publish user created event
        userEventPublisher.publishUserCreated(user);

        // Send verification email
        emailService.sendVerificationEmail(user);

        return new ApiResponse(true, "User registered successfully. Please check your email to verify your account.");
    }

    @Transactional
    public ApiResponse registerAdmin(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        // Create new admin user - NO EMAIL VERIFICATION REQUIRED
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(UserRole.ADMIN) // Register as ADMIN
                .enabled(true)
                .verified(true) // Auto-verified
                .provider(AuthProvider.LOCAL)
                .build();

        user = userRepository.save(user);

        // Publish user created event
        userEventPublisher.publishUserCreated(user);

        log.info("Admin user registered successfully: {}", user.getUsername());

        return new ApiResponse(true, "Admin user registered successfully. No email verification required.");
    }

    @Transactional
    public ApiResponse registerQuestionSetter(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        // Create new question setter user - NO EMAIL VERIFICATION REQUIRED
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(UserRole.QUESTION_SETTER) // Register as QUESTION_SETTER
                .enabled(true)
                .verified(true) // Auto-verified
                .provider(AuthProvider.LOCAL)
                .build();

        user = userRepository.save(user);

        // Publish user created event
        userEventPublisher.publishUserCreated(user);

        log.info("Question setter user registered successfully: {}", user.getUsername());

        return new ApiResponse(true, "Question setter user registered successfully. No email verification required.");
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Check if account is locked
        if (user.isAccountLocked()) {
            throw new BadRequestException(
                    "Account is locked due to too many failed login attempts. Please try again later.");
        }

        // Check if email is verified
        if (!user.isVerified() && user.getProvider() == AuthProvider.LOCAL) {
            throw new BadRequestException("Please verify your email before logging in.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword()));

            // Reset failed attempts on successful login
            user.resetFailedAttempts();
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Check if 2FA is enabled
            if (user.isTwoFactorEnabled()) {
                // Generate temporary token for 2FA verification
                String tempToken = UUID.randomUUID().toString();
                // Store temp token in cache/session (implement based on your needs)

                return AuthResponse.builder()
                        .success(true)
                        .message("2FA verification required")
                        .requiresTwoFactor(true)
                        .tempToken(tempToken)
                        .build();
            }

            // Generate tokens
            CustomUserPrincipal userPrincipal = (CustomUserPrincipal) authentication.getPrincipal();
            String accessToken = jwtUtils.generateAccessToken(userPrincipal);
            String refreshToken = createRefreshToken(user, httpRequest);

            return AuthResponse.builder()
                    .success(true)
                    .message("Login successful")
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(86400L) // 24 hours
                    .user(mapUserToResponse(user))
                    .build();

        } catch (AuthenticationException e) {
            // Increment failed attempts
            user.incrementFailedAttempts();
            userRepository.save(user);

            throw new BadRequestException("Invalid username/email or password");
        }
    }

    @Transactional
    public AuthResponse verify2FA(TwoFactorVerificationRequest request) {
        // Implement 2FA verification logic
        // This is a placeholder - integrate with your 2FA service
        throw new UnsupportedOperationException("2FA verification not implemented yet");
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token has expired");
        }

        User user = refreshToken.getUser();
        CustomUserPrincipal userPrincipal = CustomUserPrincipal.create(user);
        String newAccessToken = jwtUtils.generateAccessToken(userPrincipal);

        return AuthResponse.builder()
                .success(true)
                .message("Token refreshed successfully")
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .expiresIn(86400L)
                .user(mapUserToResponse(user))
                .build();
    }

    @Transactional
    public ApiResponse logout(String accessToken, String refreshToken) {
        // Invalidate refresh token
        refreshTokenRepository.findByToken(refreshToken)
                .ifPresent(refreshTokenRepository::delete);

        // Add access token to blacklist (implement if needed)

        return new ApiResponse(true, "Logged out successfully");
    }

    @Transactional
    public ApiResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
        }

        user.setVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        return new ApiResponse(true, "Email verified successfully");
    }

    @Transactional
    public ApiResponse resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        // Generate new verification token
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user);

        return new ApiResponse(true, "Verification email sent successfully");
    }

    @Transactional
    public ApiResponse forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate reset token
        user.setResetToken(UUID.randomUUID().toString());
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Send reset email
        emailService.sendPasswordResetEmail(user);

        return new ApiResponse(true, "Password reset email sent successfully");
    }

    @Transactional
    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return new ApiResponse(true, "Password reset successfully");
    }

    @Transactional
    public ApiResponse changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new ApiResponse(true, "Password changed successfully");
    }

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapUserToResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        user = userRepository.save(user);

        // Publish user updated event
        userEventPublisher.publishUserUpdated(user);

        return mapUserToResponse(user);
    }

    public Page<UserResponse> getAllUsers(int page, int size) {
        Page<User> users = userRepository.findAll(PageRequest.of(page, size));
        return users.map(this::mapUserToResponse);
    }

    @Transactional
    public ApiResponse updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String oldRole = user.getRole().name();
        user.setRole(UserRole.valueOf(role.toUpperCase()));
        user = userRepository.save(user);

        // Publish user role changed event
        userEventPublisher.publishUserRoleChanged(user, oldRole);

        return new ApiResponse(true, "User role updated successfully");
    }

    @Transactional
    public ApiResponse updateUserStatus(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEnabled(enabled);
        user = userRepository.save(user);

        // Publish user updated event for status change
        userEventPublisher.publishUserUpdated(user);

        return new ApiResponse(true, "User status updated successfully");
    }

    private String createRefreshToken(User user, HttpServletRequest request) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .deviceInfo(request.getHeader("User-Agent"))
                .ipAddress(request.getRemoteAddr())
                .build();

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .verified(user.isVerified())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}