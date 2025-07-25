# Authentication API

This document describes the authentication system for the Q-Builder application, including JWT-based authentication and OAuth integration with Google, Apple, and Microsoft.

## Overview

The Q-Builder authentication system supports multiple authentication methods:
- **Email/Password**: Traditional authentication with JWT tokens
- **Google OAuth**: OAuth 2.0 integration with Google accounts
- **Apple OAuth**: Sign in with Apple integration
- **Microsoft OAuth**: OAuth 2.0 integration with Microsoft accounts

All authentication methods result in JWT tokens for subsequent API requests.

## Base URL

All authentication endpoints are available at:
```
http://localhost:3001/api/v1/auth
```

## JWT Token Format

All authenticated requests require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

JWT tokens contain:
- User ID
- Email address
- Expiration time (24 hours by default)

## Email/Password Authentication

### POST /api/v1/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "businessName": "My Construction Business",
  "contactName": "John Doe",
  "phone": "+972-50-123-4567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "businessName": "My Construction Business",
      "contactName": "John Doe",
      "phone": "+972-50-123-4567",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Error Responses:**
- `400`: Missing required fields or invalid email format
- `409`: Email already exists

### POST /api/v1/auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "businessName": "My Construction Business",
      "contactName": "John Doe",
      "phone": "+972-50-123-4567"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `429`: Too many login attempts (rate limited)

## OAuth Authentication

### Google OAuth

#### GET /api/v1/auth/google

Redirect to Google OAuth authorization page.

**Query Parameters:**
- `redirect_uri` (optional): Custom redirect URI after authentication

**Response:**
Redirects to Google OAuth consent screen.

#### GET /api/v1/auth/google/callback

Handle Google OAuth callback.

**Query Parameters:**
- `code`: Authorization code from Google
- `state` (optional): State parameter for CSRF protection

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@gmail.com",
      "businessName": "Google User Business",
      "contactName": "Google User",
      "oauthProvider": "google",
      "oauthId": "google_user_id_123"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isNewUser": false
  },
  "message": "Google authentication successful"
}
```

### Apple OAuth

#### GET /api/v1/auth/apple

Redirect to Apple OAuth authorization page.

**Query Parameters:**
- `redirect_uri` (optional): Custom redirect URI after authentication

**Response:**
Redirects to Apple OAuth consent screen.

#### POST /api/v1/auth/apple/callback

Handle Apple OAuth callback.

**Request Body:**
```json
{
  "code": "authorization_code_from_apple",
  "id_token": "apple_id_token",
  "user": {
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "user@privaterelay.appleid.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@privaterelay.appleid.com",
      "businessName": "Apple User Business",
      "contactName": "John Doe",
      "oauthProvider": "apple",
      "oauthId": "apple_user_id_123"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isNewUser": true
  },
  "message": "Apple authentication successful"
}
```

### Microsoft OAuth

#### GET /api/v1/auth/microsoft

Redirect to Microsoft OAuth authorization page.

**Query Parameters:**
- `redirect_uri` (optional): Custom redirect URI after authentication
- `state` (optional): State parameter for CSRF protection

**Response:**
Redirects to Microsoft OAuth consent screen.

#### GET /api/v1/auth/microsoft/callback

Handle Microsoft OAuth callback.

**Query Parameters:**
- `code`: Authorization code from Microsoft
- `state` (optional): State parameter for CSRF protection

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@outlook.com",
      "businessName": "Microsoft User Business",
      "contactName": "Microsoft User",
      "oauthProvider": "microsoft",
      "oauthId": "microsoft_user_id_123"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isNewUser": false
  },
  "message": "Microsoft authentication successful"
}
```

## User Profile Management

### GET /api/v1/auth/profile

Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "businessName": "My Construction Business",
    "contactName": "John Doe",
    "phone": "+972-50-123-4567",
    "address": "123 Main St, Tel Aviv",
    "businessLogo": "/uploads/logos/business-logo.png",
    "professions": ["electrical", "plumbing"],
    "vatRate": 0.18,
    "oauthProvider": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile retrieved successfully"
}
```

### PUT /api/v1/auth/profile

Update user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "businessName": "Updated Business Name",
  "contactName": "Updated Contact Name",
  "phone": "+972-50-987-6543",
  "address": "456 New St, Jerusalem",
  "professions": ["electrical", "plumbing", "painting"],
  "vatRate": 0.17
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "businessName": "Updated Business Name",
    "contactName": "Updated Contact Name",
    "phone": "+972-50-987-6543",
    "address": "456 New St, Jerusalem",
    "professions": ["electrical", "plumbing", "painting"],
    "vatRate": 0.17,
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

## Password Management

### POST /api/v1/auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /api/v1/auth/reset-password

Reset password with token.

**Request Body:**
```json
{
  "token": "password_reset_token",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### POST /api/v1/auth/change-password

Change password for authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "currentPassword123",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Token Management

### POST /api/v1/auth/refresh

Refresh JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  },
  "message": "Token refreshed successfully"
}
```

### POST /api/v1/auth/logout

Logout and invalidate token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Error Codes

- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ERROR`: Resource already exists
- `RATE_LIMITED`: Too many requests
- `OAUTH_ERROR`: OAuth authentication failed
- `TOKEN_EXPIRED`: JWT token has expired
- `TOKEN_INVALID`: JWT token is invalid
- `INTERNAL_ERROR`: Server error

## OAuth Configuration

### Environment Variables

The following environment variables are required for OAuth integration:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/v1/auth/google/callback

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key
APPLE_REDIRECT_URI=http://localhost:3001/api/v1/auth/apple/callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_TENANT_ID=your_microsoft_tenant_id
MICROSOFT_REDIRECT_URI=http://localhost:3001/api/v1/auth/microsoft/callback

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

### OAuth Scopes

#### Google OAuth Scopes
- `openid`: OpenID Connect authentication
- `profile`: Basic profile information
- `email`: Email address

#### Apple OAuth Scopes
- `name`: User's name
- `email`: Email address

#### Microsoft OAuth Scopes
- `openid`: OpenID Connect authentication
- `profile`: Basic profile information
- `email`: Email address
- `User.Read`: Read user profile from Microsoft Graph

## Security Features

### Rate Limiting
- Login attempts: 5 attempts per 15 minutes per IP
- Registration: 3 attempts per hour per IP
- Password reset: 3 attempts per hour per email

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### JWT Security
- Tokens expire after 24 hours by default
- Secure HTTP-only cookies in production
- CSRF protection for OAuth flows
- Token blacklisting on logout

### OAuth Security
- State parameter for CSRF protection
- Secure redirect URI validation
- Token exchange over HTTPS only
- Proper scope validation

## Usage Examples

### Email/Password Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contractor@example.com",
    "password": "SecurePass123!",
    "businessName": "ABC Construction",
    "contactName": "John Smith",
    "phone": "+972-50-123-4567"
  }'
```

### Email/Password Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contractor@example.com",
    "password": "SecurePass123!"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:3001/api/v1/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Google OAuth Flow
1. Redirect user to: `http://localhost:3001/api/v1/auth/google`
2. User completes Google authentication
3. Google redirects to callback with authorization code
4. Server exchanges code for tokens and returns JWT

### Microsoft OAuth Flow
1. Redirect user to: `http://localhost:3001/api/v1/auth/microsoft`
2. User completes Microsoft authentication
3. Microsoft redirects to callback with authorization code
4. Server exchanges code for tokens and returns JWT

## Integration with Frontend

The frontend should handle OAuth flows by:
1. Opening OAuth URLs in popup windows or redirecting
2. Handling callback responses with JWT tokens
3. Storing JWT tokens securely (localStorage or secure cookies)
4. Including JWT tokens in all API requests
5. Handling token expiration and refresh

For detailed frontend integration examples, see the client-side authentication documentation.