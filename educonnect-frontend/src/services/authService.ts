import { authApiClient, replacePath } from './api';
import { API_CONFIG } from '../constants/api';
import {
  type User,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
  type TwoFactorVerificationRequest,
  type TwoFactorSetupResponse,
  type RefreshTokenRequest,
  type ChangePasswordRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  type UpdateProfileRequest,
  type ApiResponse
} from '../types/auth';

class AuthService {
  async register(data: RegisterRequest): Promise<ApiResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.REGISTER, data);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await authApiClient.post<AuthResponse>(
      API_CONFIG.AUTH_SERVICE.ENDPOINTS.LOGIN,
      data
    );

    if (response.accessToken && response.refreshToken) {
      authApiClient.setAuthTokens(response.accessToken, response.refreshToken);
      this.setUser(response.user);
    }

    return response;
  }

  async verifyTwoFactor(data: TwoFactorVerificationRequest): Promise<AuthResponse> {
    const response = await authApiClient.post<AuthResponse>(
      API_CONFIG.AUTH_SERVICE.ENDPOINTS.VERIFY_2FA,
      data
    );

    if (response.accessToken && response.refreshToken) {
      authApiClient.setAuthTokens(response.accessToken, response.refreshToken);
      this.setUser(response.user);
    }

    return response;
  }

  async refreshToken(data: RefreshTokenRequest): Promise<{ accessToken: string; refreshToken: string }> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.REFRESH_TOKEN, data);
  }

  async logout(refreshToken: string): Promise<ApiResponse> {
    try {
      const response = await authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.LOGOUT, {
        refreshToken
      });
      return response;
    } finally {
      this.clearAuth();
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return authApiClient.get(`${API_CONFIG.AUTH_SERVICE.ENDPOINTS.VERIFY_EMAIL}?token=${token}`);
  }

  async resendVerification(email: string): Promise<ApiResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.RESEND_VERIFICATION, { email });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.FORGOT_PASSWORD, data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.RESET_PASSWORD, data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.CHANGE_PASSWORD, data);
  }

  async getCurrentUser(): Promise<User> {
    return authApiClient.get(API_CONFIG.AUTH_SERVICE.ENDPOINTS.ME);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const response = await authApiClient.put<ApiResponse<User>>(
      API_CONFIG.AUTH_SERVICE.ENDPOINTS.UPDATE_PROFILE,
      data
    );

    if (response.data) {
      this.setUser(response.data);
    }

    return response;
  }

  async enableTwoFactor(): Promise<TwoFactorSetupResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.ENABLE_2FA);
  }

  async confirmTwoFactor(code: string): Promise<ApiResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.CONFIRM_2FA, { code });
  }

  async disableTwoFactor(password: string): Promise<ApiResponse> {
    return authApiClient.post(API_CONFIG.AUTH_SERVICE.ENDPOINTS.DISABLE_2FA, { password });
  }

  async getGoogleAuthUrl(redirectUri: string): Promise<string> {
    const response = await authApiClient.get<{ url: string }>(
      `${API_CONFIG.AUTH_SERVICE.ENDPOINTS.OAUTH_GOOGLE}?redirect_uri=${encodeURIComponent(redirectUri)}`
    );
    return response.url;
  }

  // Admin endpoints
  async getUsers(page = 0, size = 20): Promise<{ data: User[]; totalElements: number; totalPages: number; }> {
    return authApiClient.get(
      `${API_CONFIG.AUTH_SERVICE.ENDPOINTS.ADMIN_USERS}?page=${page}&size=${size}`
    );
  }

  async updateUserRole(userId: number, role: string): Promise<ApiResponse> {
    return authApiClient.put(
      replacePath(API_CONFIG.AUTH_SERVICE.ENDPOINTS.ADMIN_UPDATE_ROLE, { userId: String(userId) }),
      { role }
    );
  }

  async updateUserStatus(userId: number, enabled: boolean): Promise<ApiResponse> {
    return authApiClient.put(
      replacePath(API_CONFIG.AUTH_SERVICE.ENDPOINTS.ADMIN_UPDATE_STATUS, { userId: String(userId) }),
      { enabled }
    );
  }

  // Utility methods
  isAuthenticated(): boolean {
    return authApiClient.isAuthenticated() && !!this.getUser();
  }

  getUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuth(): void {
    authApiClient.clearAuthTokens();
    localStorage.removeItem('user');
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isQuestionSetter(): boolean {
    return this.hasRole('QUESTION_SETTER') || this.isAdmin();
  }

  isStudent(): boolean {
    return this.hasRole('STUDENT');
  }
}

export const authService = new AuthService();