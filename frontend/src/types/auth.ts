export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  verified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user?: User;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

export interface UsersPageResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}