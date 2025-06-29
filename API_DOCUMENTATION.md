# Learning Platform Authentication API Documentation

## Overview
This document provides comprehensive documentation for the Learning Platform Authentication Microservice API. The service handles user authentication, authorization, profile management, and two-factor authentication.

## Base URL
```
http://34.68.47.215:8081/api/auth
```

## Authentication Flow

### 1. User Registration Flow
1. **Register User** → Creates account, sends verification email
2. **Verify Email** → Confirms email address
3. **Login** → Authenticates user and returns JWT tokens

### 2. Standard Login Flow
1. **Login** → Authenticates with username/email and password
2. **Get Current User** → Retrieves user profile
3. **Refresh Token** → Renews access token when expired
4. **Logout** → Invalidates tokens

### 3. Two-Factor Authentication Flow
1. **Login** → If 2FA is enabled, returns temp token
2. **Verify 2FA** → Submit 6-digit code with temp token
3. **Get Current User** → Access protected resources

### 4. Password Reset Flow
1. **Forgot Password** → Request reset email
2. **Reset Password** → Set new password with token

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification."
}
```

**Available Roles:** `STUDENT`, `QUESTION_SETTER`, `ADMIN`

#### POST /auth/login
Authenticate user with username/email and password.

**Request Body:**
```json
{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "bio": null,
    "avatarUrl": null,
    "role": "STUDENT",
    "verified": false,
    "twoFactorEnabled": false,
    "createdAt": "2024-01-01T10:00:00"
  },
  "requiresTwoFactor": false,
  "tempToken": null
}
```

#### POST /auth/verify-2fa
Verify two-factor authentication code.

**Request Body:**
```json
{
  "tempToken": "temp_token_from_login",
  "code": "123456"
}
```

#### POST /auth/refresh-token
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### Email Verification Endpoints

#### GET /auth/verify-email
Verify email address using token from email.

**Query Parameters:**
- `token`: Verification token from email

#### POST /auth/resend-verification
Resend email verification link.

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

### Password Management Endpoints

#### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

#### POST /auth/reset-password
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### POST /auth/change-password
Change password for authenticated user.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### User Profile Endpoints

#### GET /auth/me
Get current authenticated user profile.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "bio": "Software Developer",
  "avatarUrl": "https://example.com/avatar.jpg",
  "role": "STUDENT",
  "verified": true,
  "twoFactorEnabled": false,
  "createdAt": "2024-01-01T10:00:00"
}
```

#### PUT /auth/profile
Update user profile information.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "bio": "Updated bio",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

### Two-Factor Authentication Endpoints

#### POST /auth/2fa/enable
Enable two-factor authentication and get QR code.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "manualEntryKey": "otpauth://totp/Learning%20Platform:testuser?secret=JBSWY3DPEHPK3PXP&issuer=Learning%20Platform"
}
```

#### POST /auth/2fa/confirm
Confirm 2FA setup with verification code.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "code": "123456"
}
```

#### POST /auth/2fa/disable
Disable two-factor authentication.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "password": "password123"
}
```

### OAuth2 Endpoints

#### GET /oauth2/authorize/google
Initiate Google OAuth2 login flow.

**Query Parameters:**
- `redirect_uri`: OAuth2 redirect URI

#### GET /oauth2/callback/google
OAuth2 callback endpoint (handled automatically by browser).

**Query Parameters:**
- `code`: Authorization code from Google
- `state`: State parameter for security

### Admin Endpoints

#### GET /auth/admin/users
Get all users (Admin only).

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)

#### PUT /auth/admin/users/{userId}/role
Update user role (Admin only).

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "role": "QUESTION_SETTER"
}
```

#### PUT /auth/admin/users/{userId}/status
Enable/disable user account (Admin only).

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "enabled": false
}
```

## Error Responses

### Common Error Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Using Postman Collection

### Setup Instructions
1. Import the `auth-api.postman_collection.json` file into Postman
2. Import the `auth-api-environment.json` file as an environment
3. Select the "Learning Platform Auth API Environment" environment

### Testing Flow
1. **Register a new user** using the "Register User" endpoint
2. **Login** with the registered credentials
3. The collection automatically extracts tokens from responses
4. Use the "Get Current User" endpoint to verify authentication
5. Test other endpoints as needed

### Environment Variables
- `base_url`: API base URL (http://34.68.47.215:8081/api/auth)
- `access_token`: JWT access token (auto-extracted)
- `refresh_token`: JWT refresh token (auto-extracted)
- `temp_token`: Temporary token for 2FA (auto-extracted)
- `redirect_uri`: OAuth2 redirect URI

## Security Features

### JWT Tokens
- Access tokens expire in 24 hours
- Refresh tokens expire in 7 days
- Tokens are automatically extracted and stored in environment variables

### Two-Factor Authentication
- TOTP-based 2FA using Google Authenticator or similar apps
- QR code generation for easy setup
- Manual entry key provided as backup

### OAuth2 Integration
- Google OAuth2 support
- Secure redirect URI validation
- JWT token generation after OAuth2 authentication

### Password Security
- Password reset via email tokens
- Secure password change for authenticated users
- Email verification required for account activation

## Rate Limiting
The API implements rate limiting to prevent abuse:
- Login attempts: 5 per minute per IP
- Registration: 3 per hour per IP
- Password reset: 3 per hour per email

## CORS Configuration
The API supports CORS for web applications:
- Allowed origins: Configurable
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: All
- Credentials: Supported

## Database Schema
The service uses PostgreSQL with the following main entities:
- `users`: User accounts and profiles
- `refresh_tokens`: JWT refresh token storage
- `user_roles`: Role-based access control

## Deployment
The service is deployed using Docker and can be run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables
Required environment variables:
- `SPRING_DATASOURCE_URL`: PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `MAIL_USERNAME`: Email service username
- `MAIL_PASSWORD`: Email service password
- `GOOGLE_CLIENT_ID`: Google OAuth2 client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth2 client secret 