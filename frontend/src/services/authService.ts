import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  TwoFactorSetupResponse,
  UsersPageResponse
} from '../types/auth';

// Re-export types for convenience
export type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  TwoFactorSetupResponse,
  UsersPageResponse
};

const BASE_URL = 'http://localhost:8081/api/v1';

// Force module refresh
export const CACHE_BUSTER = Date.now();

class AuthService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(data: RegisterRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async createAdmin(data: RegisterRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/create-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async createQuestionSetter(data: RegisterRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/create-question-setter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    
    if (result.accessToken) {
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
    }
    
    return result;
  }

  async logout(): Promise<ApiResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ refreshToken })
    });
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    return response.json();
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    const result = await response.json();
    if (result.accessToken) {
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
    }
    
    return result;
  }

  async verify2FA(tempToken: string, code: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken, code })
    });
    
    const result = await response.json();
    if (result.accessToken) {
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
    }
    
    return result;
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/verify-email?token=${token}`, {
      method: 'GET'
    });
    return response.json();
  }

  async resendVerification(email: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return response.json();
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    return response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    return response.json();
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async enable2FA(): Promise<TwoFactorSetupResponse> {
    const response = await fetch(`${BASE_URL}/auth/2fa/enable`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async confirm2FA(code: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/2fa/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ code })
    });
    return response.json();
  }

  async disable2FA(password: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/2fa/disable`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ password })
    });
    return response.json();
  }

  async getAllUsers(page: number = 0, size: number = 10): Promise<UsersPageResponse> {
    const response = await fetch(`${BASE_URL}/auth/admin/users?page=${page}&size=${size}`, {
      headers: this.getAuthHeaders()
    });
    return response.json();
  }

  async updateUserRole(userId: number, role: string): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ role })
    });
    return response.json();
  }

  async updateUserStatus(userId: number, enabled: boolean): Promise<ApiResponse> {
    const response = await fetch(`${BASE_URL}/auth/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({ enabled })
    });
    return response.json();
  }

  async healthCheck(): Promise<{
    status: string;
    components?: Record<string, {
      status: string;
      details?: Record<string, unknown>;
    }>;
  }> {
    const response = await fetch(`${BASE_URL}/actuator/health`);
    return response.json();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export const authService = new AuthService();
export default AuthService;