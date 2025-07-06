package com.learningplatform.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningplatform.auth.dto.*;
import com.learningplatform.auth.service.AuthService;
import com.learningplatform.auth.service.TwoFactorAuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private AuthService authService;

        @MockitoBean
        private TwoFactorAuthService twoFactorAuthService;

        @Autowired
        private ObjectMapper objectMapper;

        private RegisterRequest registerRequest;
        private LoginRequest loginRequest;
        private AuthResponse authResponse;
        private ApiResponse apiResponse;
        private UserResponse userResponse;

        @BeforeEach
        void setUp() {
                registerRequest = new RegisterRequest();
                registerRequest.setUsername("testuser");
                registerRequest.setEmail("test@example.com");
                registerRequest.setPassword("password123");
                registerRequest.setFullName("Test User");

                loginRequest = new LoginRequest();
                loginRequest.setUsernameOrEmail("testuser");
                loginRequest.setPassword("password123");

                userResponse = UserResponse.builder()
                                .id(1L)
                                .username("testuser")
                                .email("test@example.com")
                                .fullName("Test User")
                                .role("STUDENT")
                                .verified(true)
                                .twoFactorEnabled(false)
                                .build();

                authResponse = AuthResponse.builder()
                                .success(true)
                                .message("Login successful")
                                .accessToken("mock-token")
                                .refreshToken("mock-refresh-token")
                                .tokenType("Bearer")
                                .expiresIn(86400L)
                                .user(userResponse)
                                .build();

                apiResponse = new ApiResponse(true, "Operation successful");
        }

        @Test
        void register_ShouldReturnCreated_WhenValidRequest() throws Exception {
                when(authService.register(any(RegisterRequest.class))).thenReturn(apiResponse);

                mockMvc.perform(post("/auth/register")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.message").value("Operation successful"));
        }

        @Test
        void register_ShouldReturnBadRequest_WhenInvalidRequest() throws Exception {
                RegisterRequest invalidRequest = new RegisterRequest();
                invalidRequest.setUsername("");
                invalidRequest.setEmail("invalid-email");
                invalidRequest.setPassword("123");

                mockMvc.perform(post("/auth/register")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidRequest)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        void login_ShouldReturnOk_WhenValidCredentials() throws Exception {
                when(authService.login(any(LoginRequest.class), any())).thenReturn(authResponse);

                mockMvc.perform(post("/auth/login")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true))
                                .andExpect(jsonPath("$.accessToken").value("mock-token"))
                                .andExpect(jsonPath("$.user.username").value("testuser"));
        }

        @Test
        void login_ShouldReturn2FARequired_WhenUserHas2FAEnabled() throws Exception {
                AuthResponse twoFactorResponse = AuthResponse.builder()
                                .success(true)
                                .message("2FA verification required")
                                .requiresTwoFactor(true)
                                .tempToken("temp-token")
                                .build();

                when(authService.login(any(LoginRequest.class), any())).thenReturn(twoFactorResponse);

                mockMvc.perform(post("/auth/login")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.requiresTwoFactor").value(true))
                                .andExpect(jsonPath("$.tempToken").value("temp-token"));
        }

        @Test
        void refreshToken_ShouldReturnOk_WhenValidRefreshToken() throws Exception {
                RefreshTokenRequest refreshRequest = new RefreshTokenRequest();
                refreshRequest.setRefreshToken("valid-refresh-token");
                when(authService.refreshToken(any(RefreshTokenRequest.class))).thenReturn(authResponse);

                mockMvc.perform(post("/auth/refresh-token")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(refreshRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").value("mock-token"));
        }

        @Test
        @WithMockUser(username = "testuser")
        void logout_ShouldReturnOk_WhenAuthenticated() throws Exception {
                LogoutRequest logoutRequest = new LogoutRequest();
                logoutRequest.setRefreshToken("refresh-token");
                when(authService.logout(anyString(), anyString())).thenReturn(apiResponse);

                mockMvc.perform(post("/auth/logout")
                                .with(csrf())
                                .header("Authorization", "Bearer mock-token")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(logoutRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        void verifyEmail_ShouldReturnOk_WhenValidToken() throws Exception {
                when(authService.verifyEmail(anyString())).thenReturn(apiResponse);

                mockMvc.perform(get("/auth/verify-email")
                                .param("token", "valid-token"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        void forgotPassword_ShouldReturnOk_WhenValidEmail() throws Exception {
                ForgotPasswordRequest forgotRequest = new ForgotPasswordRequest();
                forgotRequest.setEmail("test@example.com");
                when(authService.forgotPassword(anyString())).thenReturn(apiResponse);

                mockMvc.perform(post("/auth/forgot-password")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(forgotRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        void resetPassword_ShouldReturnOk_WhenValidRequest() throws Exception {
                ResetPasswordRequest resetRequest = new ResetPasswordRequest();
                resetRequest.setToken("valid-token");
                resetRequest.setNewPassword("newPassword123");
                when(authService.resetPassword(any(ResetPasswordRequest.class))).thenReturn(apiResponse);

                mockMvc.perform(post("/auth/reset-password")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(resetRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @WithMockUser(username = "testuser")
        void changePassword_ShouldReturnOk_WhenAuthenticated() throws Exception {
                ChangePasswordRequest changeRequest = new ChangePasswordRequest();
                changeRequest.setCurrentPassword("oldPassword");
                changeRequest.setNewPassword("newPassword123");
                when(authService.changePassword(anyString(), any(ChangePasswordRequest.class))).thenReturn(apiResponse);

                mockMvc.perform(post("/auth/change-password")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(changeRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @WithMockUser(username = "testuser")
        void getCurrentUser_ShouldReturnOk_WhenAuthenticated() throws Exception {
                when(authService.getCurrentUser(anyString())).thenReturn(userResponse);

                mockMvc.perform(get("/auth/me"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.username").value("testuser"))
                                .andExpect(jsonPath("$.email").value("test@example.com"));
        }

        @Test
        @WithMockUser(username = "testuser")
        void updateProfile_ShouldReturnOk_WhenAuthenticated() throws Exception {
                UpdateProfileRequest updateRequest = new UpdateProfileRequest();
                updateRequest.setFullName("Updated Name");
                updateRequest.setBio("Updated bio");
                when(authService.updateProfile(anyString(), any(UpdateProfileRequest.class))).thenReturn(userResponse);

                mockMvc.perform(put("/auth/profile")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updateRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.username").value("testuser"));
        }

        @Test
        @WithMockUser(username = "testuser")
        void enable2FA_ShouldReturnOk_WhenAuthenticated() throws Exception {
                TwoFactorSetupResponse setupResponse = TwoFactorSetupResponse.builder()
                                .secret("test-secret")
                                .qrCodeUrl("data:image/png;base64,test")
                                .manualEntryKey("TEST SECR ET")
                                .build();
                when(twoFactorAuthService.enableTwoFactorAuth(anyString())).thenReturn(setupResponse);

                mockMvc.perform(post("/auth/2fa/enable")
                                .with(csrf()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.secret").value("test-secret"));
        }

        @Test
        @WithMockUser(username = "testuser")
        void confirm2FA_ShouldReturnOk_WhenValidCode() throws Exception {
                ConfirmTwoFactorRequest confirmRequest = new ConfirmTwoFactorRequest();
                confirmRequest.setCode("123456");
                when(twoFactorAuthService.confirmTwoFactorAuth(anyString(), anyString())).thenReturn(apiResponse);

                mockMvc.perform(post("/auth/2fa/confirm")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(confirmRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @WithMockUser(username = "testuser")
        void disable2FA_ShouldReturnOk_WhenValidPassword() throws Exception {
                DisableTwoFactorRequest disableRequest = new DisableTwoFactorRequest();
                disableRequest.setPassword("password123");
                when(twoFactorAuthService.disableTwoFactorAuth(anyString(), anyString())).thenReturn(apiResponse);

                mockMvc.perform(post("/auth/2fa/disable")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(disableRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @WithMockUser(username = "admin", roles = { "ADMIN" })
        void getAllUsers_ShouldReturnOk_WhenAdmin() throws Exception {
                mockMvc.perform(get("/auth/admin/users")
                                .param("page", "0")
                                .param("size", "10"))
                                .andExpect(status().isOk());
        }

        @Test
        @WithMockUser(username = "user", roles = { "USER" })
        void getAllUsers_ShouldReturnForbidden_WhenNotAdmin() throws Exception {
                mockMvc.perform(get("/auth/admin/users"))
                                .andExpect(status().isForbidden());
        }

        @Test
        @WithMockUser(username = "admin", roles = { "ADMIN" })
        void updateUserRole_ShouldReturnOk_WhenAdmin() throws Exception {
                UpdateRoleRequest roleRequest = new UpdateRoleRequest();
                roleRequest.setRole("QUESTION_SETTER");
                when(authService.updateUserRole(anyLong(), anyString())).thenReturn(apiResponse);

                mockMvc.perform(put("/auth/admin/users/1/role")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(roleRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @WithMockUser(username = "admin", roles = { "ADMIN" })
        void updateUserStatus_ShouldReturnOk_WhenAdmin() throws Exception {
                UpdateStatusRequest statusRequest = new UpdateStatusRequest();
                statusRequest.setEnabled(false);
                when(authService.updateUserStatus(anyLong(), anyBoolean())).thenReturn(apiResponse);

                mockMvc.perform(put("/auth/admin/users/1/status")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(statusRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }
}