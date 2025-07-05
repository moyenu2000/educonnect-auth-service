package com.learningplatform.auth.controller;

import com.learningplatform.auth.dto.*;
import com.learningplatform.auth.service.AuthService;
import com.learningplatform.auth.service.TwoFactorAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TwoFactorAuthService twoFactorAuthService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        ApiResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {
        AuthResponse response = authService.login(loginRequest, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<AuthResponse> verify2FA(@Valid @RequestBody TwoFactorVerificationRequest request) {
        AuthResponse response = authService.verify2FA(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> logout(@RequestHeader("Authorization") String token,
            @Valid @RequestBody LogoutRequest logoutRequest) {
        String jwt = token.substring(7);
        ApiResponse response = authService.logout(jwt, logoutRequest.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) {
        ApiResponse response = authService.verifyEmail(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        ApiResponse response = authService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ApiResponse response = authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        ApiResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> changePassword(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        ApiResponse response = authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = authService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    // 2FA Endpoints
    @PostMapping("/2fa/enable")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TwoFactorSetupResponse> enable2FA(@AuthenticationPrincipal UserDetails userDetails) {
        TwoFactorSetupResponse response = twoFactorAuthService.enableTwoFactorAuth(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/confirm")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> confirm2FA(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ConfirmTwoFactorRequest request) {
        ApiResponse response = twoFactorAuthService.confirmTwoFactorAuth(userDetails.getUsername(), request.getCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/disable")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse> disable2FA(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DisableTwoFactorRequest request) {
        ApiResponse response = twoFactorAuthService.disableTwoFactorAuth(userDetails.getUsername(),
                request.getPassword());
        return ResponseEntity.ok(response);
    }

    // Admin endpoints
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(authService.getAllUsers(page, size));
    }

    @PutMapping("/admin/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUserRole(@PathVariable Long userId,
            @Valid @RequestBody UpdateRoleRequest request) {
        ApiResponse response = authService.updateUserRole(userId, request.getRole());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateUserStatus(@PathVariable Long userId,
            @Valid @RequestBody UpdateStatusRequest request) {
        ApiResponse response = authService.updateUserStatus(userId, request.isEnabled());
        return ResponseEntity.ok(response);
    }
}