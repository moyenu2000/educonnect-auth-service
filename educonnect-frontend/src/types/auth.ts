export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole;
  verified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  QUESTION_SETTER = 'QUESTION_SETTER',
  ADMIN = 'ADMIN'
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
  requiresTwoFactor?: boolean;
  tempToken?: string;
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

export interface TwoFactorVerificationRequest {
  tempToken: string;
  code: string;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
}