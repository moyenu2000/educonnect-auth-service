# EduConnect Auth Service API Documentation

## Service Overview
- **Base URL**: `http://localhost:8081/api/v1`
- **Package**: `com.learningplatform.auth`
- **Authentication**: JWT Bearer Token
- **Database Schema**: `auth`

## Authentication & Authorization

### JWT Token Structure
```json
{
  "id": "number",
  "username": "string", 
  "email": "string",
  "role": "STUDENT|QUESTION_SETTER|ADMIN",
  "iat": "timestamp",
  "exp": "timestamp"
}
```

### Authorization Levels
- **Public**: No authentication required
- **Authenticated**: Valid JWT token required (`@PreAuthorize("isAuthenticated()")`)
- **Admin Only**: Admin role required (`@PreAuthorize("hasRole('ADMIN')")`)

## API Endpoints

### User Registration & Management

#### POST `/auth/register`
Register a new student user
- **Auth**: Public
- **Body**:
```json
{
  "username": "string (3-20 chars)",
  "email": "string",
  "password": "string (min 6 chars)",
  "fullName": "string"
}
```

#### POST `/auth/create-admin`
Create admin user (testing)
- **Auth**: Public
- **Body**: Same as register

#### POST `/auth/create-question-setter`
Create question setter user (testing)
- **Auth**: Public  
- **Body**: Same as register

### Authentication

#### POST `/auth/login`
User login
- **Auth**: Public
- **Body**:
```json
{
  "usernameOrEmail": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "accessToken": "string",
  "refreshToken": "string", 
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": "UserResponse",
  "requiresTwoFactor": "boolean",
  "tempToken": "string"
}
```

#### POST `/auth/verify-2fa`
Verify 2FA code during login
- **Auth**: Public
- **Body**:
```json
{
  "tempToken": "string",
  "code": "string (6 digits)"
}
```

#### POST `/auth/refresh-token`
Refresh access token
- **Auth**: Public
- **Body**:
```json
{
  "refreshToken": "string"
}
```

#### POST `/auth/logout`
Logout user
- **Auth**: Authenticated
- **Body**:
```json
{
  "refreshToken": "string"
}
```

### Email Verification & Password Recovery

#### GET `/auth/verify-email?token={token}`
Verify email address
- **Auth**: Public

#### POST `/auth/resend-verification`
Resend verification email
- **Auth**: Public
- **Body**:
```json
{
  "email": "string"
}
```

#### POST `/auth/forgot-password`
Request password reset
- **Auth**: Public
- **Body**:
```json
{
  "email": "string"
}
```

#### POST `/auth/reset-password`
Reset password with token
- **Auth**: Public
- **Body**:
```json
{
  "token": "string",
  "newPassword": "string (min 6 chars)"
}
```

### User Profile Management

#### GET `/auth/me`
Get current user profile
- **Auth**: Authenticated
- **Response**:
```json
{
  "id": "number",
  "username": "string",
  "email": "string", 
  "fullName": "string",
  "bio": "string",
  "avatarUrl": "string",
  "role": "string",
  "verified": "boolean",
  "twoFactorEnabled": "boolean",
  "createdAt": "datetime"
}
```

#### PUT `/auth/profile`
Update user profile
- **Auth**: Authenticated
- **Body**:
```json
{
  "fullName": "string",
  "bio": "string",
  "avatarUrl": "string"
}
```

#### POST `/auth/change-password`
Change user password
- **Auth**: Authenticated
- **Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 6 chars)"
}
```

### Two-Factor Authentication

#### POST `/auth/2fa/enable`
Enable 2FA for user
- **Auth**: Authenticated
- **Response**:
```json
{
  "secret": "string",
  "qrCodeUrl": "string",
  "manualEntryKey": "string"
}
```

#### POST `/auth/2fa/confirm`
Confirm 2FA setup
- **Auth**: Authenticated
- **Body**:
```json
{
  "code": "string (6 digits)"
}
```

#### POST `/auth/2fa/disable`
Disable 2FA
- **Auth**: Authenticated
- **Body**:
```json
{
  "password": "string"
}
```

### Admin Endpoints

#### GET `/auth/admin/users`
Get all users (paginated)
- **Auth**: Admin Only
- **Query**: `page=0&size=10`
- **Response**: Paginated user list

#### PUT `/auth/admin/users/{userId}/role`
Update user role
- **Auth**: Admin Only
- **Body**:
```json
{
  "role": "STUDENT|QUESTION_SETTER|ADMIN"
}
```

#### PUT `/auth/admin/users/{userId}/status`
Update user status
- **Auth**: Admin Only
- **Body**:
```json
{
  "enabled": "boolean"
}
```

## Data Models

### User Entity
```json
{
  "id": "Long",
  "username": "String (Unique)",
  "email": "String (Unique)",
  "fullName": "String",
  "bio": "String",
  "avatarUrl": "String",
  "role": "STUDENT|QUESTION_SETTER|ADMIN",
  "enabled": "Boolean",
  "verified": "Boolean",
  "twoFactorEnabled": "Boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime",
  "lastLogin": "LocalDateTime"
}
```

### Response Wrapper
All responses use `ApiResponse<T>`:
```json
{
  "success": "boolean",
  "data": "T",
  "message": "string", 
  "error": "string"
}
```

## Security Features

### Token Configuration
- **Access Token Expiration**: 24 hours
- **Refresh Token Expiration**: 7 days
- **Algorithm**: HMAC SHA-256

### Account Security
- **Password Encryption**: BCrypt
- **Account Locking**: 5 failed attempts → 30-minute lockout
- **2FA**: TOTP-based with QR codes

### OAuth2 Integration
- **Google OAuth2**: Supported
- **Authorization URL**: `/oauth2/authorize`
- **Callback URL**: `/oauth2/callback/*`

## Error Responses

### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "error message"
  }
}
```

### Authentication Errors
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### Authorization Errors  
```json
{
  "success": false,
  "error": "Access denied"
}
```