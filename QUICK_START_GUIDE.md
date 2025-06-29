# Quick Start Guide - Authentication API Testing

## Prerequisites
- Postman installed on your machine
- Access to the authentication service at `http://34.68.47.215:8081`

## Setup Instructions

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Select the `auth-api.postman_collection.json` file
4. The collection will be imported with all endpoints

### 2. Import Environment
1. In Postman, click "Import" again
2. Select the `auth-api-environment.json` file
3. Select the "Learning Platform Auth API Environment" from the dropdown

### 3. Verify Base URL
The environment is pre-configured with:
- Base URL: `http://34.68.47.215:8081/api/auth`
- All other variables will be auto-populated during testing

## Testing Flow

### Step 1: Register a New User
1. Open the "Authentication" folder in the collection
2. Select "Register User" request
3. Update the request body with your test data:
```json
{
  "username": "testuser123",
  "email": "your-email@example.com",
  "password": "password123",
  "fullName": "Test User",
  "role": "STUDENT"
}
```
4. Click "Send"
5. You should receive a success response

### Step 2: Login
1. Select the "Login" request
2. Update the request body with your credentials:
```json
{
  "usernameOrEmail": "testuser123",
  "password": "password123"
}
```
3. Click "Send"
4. **Important**: The response will automatically extract and store:
   - `access_token` in environment variables
   - `refresh_token` in environment variables
   - `temp_token` (if 2FA is enabled)

### Step 3: Test Protected Endpoints
1. Select "Get Current User" request
2. Click "Send" - it should work automatically with the stored access token
3. You should see your user profile information

### Step 4: Test Other Endpoints
Now you can test other endpoints:
- **Update Profile**: Modify your profile information
- **Change Password**: Update your password
- **Logout**: Invalidate your tokens

## Two-Factor Authentication Testing

### Enable 2FA
1. Login first to get an access token
2. Use "Enable 2FA" endpoint
3. Scan the QR code with Google Authenticator or similar app
4. Use "Confirm 2FA" with the 6-digit code

### Test 2FA Login Flow
1. Login with 2FA enabled user
2. You'll receive a `temp_token` instead of access token
3. Use "Verify 2FA" endpoint with the temp token and 6-digit code
4. You'll receive the actual access token

## Admin Endpoints Testing

### Prerequisites
- You need an admin user account
- Login with admin credentials first

### Test Admin Functions
1. **Get All Users**: View all registered users
2. **Update User Role**: Change user roles (STUDENT, QUESTION_SETTER, ADMIN)
3. **Update User Status**: Enable/disable user accounts

## OAuth2 Testing

### Google OAuth2 Flow
1. Use "Google OAuth2 Login" endpoint
2. This will redirect to Google's authorization page
3. After authorization, you'll be redirected back with a token
4. The token will be in the URL parameters

## Common Issues and Solutions

### Issue: 401 Unauthorized
- **Solution**: Make sure you're logged in and have a valid access token
- **Check**: Look at the Authorization header in your request

### Issue: 400 Bad Request
- **Solution**: Check your request body format
- **Common causes**: Missing required fields, invalid email format, weak password

### Issue: 403 Forbidden
- **Solution**: Check if you have the required role/permissions
- **Admin endpoints**: Require ADMIN role

### Issue: Tokens not auto-extracting
- **Solution**: Check the "Tests" tab in Postman
- **Verify**: The collection has automatic token extraction scripts

## Environment Variables

The collection automatically manages these variables:
- `access_token`: JWT access token for API calls
- `refresh_token`: JWT refresh token for renewing access
- `temp_token`: Temporary token for 2FA verification
- `base_url`: API base URL (pre-configured)

## Testing Checklist

- [ ] Register a new user
- [ ] Login and verify token extraction
- [ ] Test protected endpoints
- [ ] Update user profile
- [ ] Test password change
- [ ] Test logout
- [ ] Test email verification (if email service is configured)
- [ ] Test password reset flow
- [ ] Test 2FA (if enabled)
- [ ] Test admin endpoints (with admin user)
- [ ] Test OAuth2 flow (if configured)

## API Response Examples

### Successful Login Response
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
    "role": "STUDENT",
    "verified": false,
    "twoFactorEnabled": false,
    "createdAt": "2024-01-01T10:00:00"
  },
  "requiresTwoFactor": false,
  "tempToken": null
}
```

### Error Response Example
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

## Support

If you encounter issues:
1. Check the API documentation in `API_DOCUMENTATION.md`
2. Verify your request format matches the examples
3. Ensure the service is running and accessible
4. Check the server logs for detailed error information 