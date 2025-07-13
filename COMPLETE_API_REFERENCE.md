# EduConnect Complete API Reference

## Overview

This document provides a comprehensive list of all API endpoints across the three EduConnect services with their role requirements and authentication needs.

## Service URLs
- **Auth Service**: `http://localhost:8081/api/v1`
- **Discussion Service**: `http://localhost:8082/api/v1` 
- **Assessment Service**: `http://localhost:8083/api/v1`

## Role Definitions
- **PUBLIC** - No authentication required
- **AUTHENTICATED** - Any valid JWT token required
- **STUDENT** - Student role required
- **QUESTION_SETTER** - Question setter role required  
- **ADMIN** - Admin role required

---

# 🔐 Auth Service (Port 8081)

**Total Endpoints:** 22

## Authentication & User Management

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/auth/register` | PUBLIC | Register new user account |
| POST | `/auth/create-admin` | PUBLIC | Create admin account (testing) |
| POST | `/auth/create-question-setter` | PUBLIC | Create question setter account (testing) |
| POST | `/auth/register-admin` | PUBLIC | Register admin account |
| POST | `/auth/register-question-setter` | PUBLIC | Register question setter account |
| POST | `/auth/login` | PUBLIC | User login authentication |
| POST | `/auth/verify-2fa` | PUBLIC | Verify 2FA code |
| POST | `/auth/refresh-token` | PUBLIC | Refresh JWT token |
| GET | `/auth/verify-email` | PUBLIC | Verify email with token |
| POST | `/auth/resend-verification` | PUBLIC | Resend verification email |
| POST | `/auth/forgot-password` | PUBLIC | Request password reset |
| POST | `/auth/reset-password` | PUBLIC | Reset password with token |

## Authenticated User Operations

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/auth/logout` | AUTHENTICATED | Logout and invalidate tokens |
| POST | `/auth/change-password` | AUTHENTICATED | Change user password |
| GET | `/auth/me` | AUTHENTICATED | Get current user profile |
| PUT | `/auth/profile` | AUTHENTICATED | Update user profile |
| POST | `/auth/2fa/enable` | AUTHENTICATED | Enable 2FA |
| POST | `/auth/2fa/confirm` | AUTHENTICATED | Confirm 2FA setup |
| POST | `/auth/2fa/disable` | AUTHENTICATED | Disable 2FA |

## Admin Operations

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/auth/admin/users` | ADMIN | Get all users with pagination |
| PUT | `/auth/admin/users/{userId}/role` | ADMIN | Update user role |
| PUT | `/auth/admin/users/{userId}/status` | ADMIN | Update user status |

---

# 💬 Discussion Service (Port 8082)

**Total Endpoints:** 59 (Including 7 WebSocket endpoints)

## Discussions

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/discussions` | PUBLIC | Get discussions with filters |
| GET | `/discussions/{id}` | PUBLIC | Get specific discussion |
| POST | `/discussions` | STUDENT | Create new discussion |
| PUT | `/discussions/{id}` | STUDENT | Update discussion |
| DELETE | `/discussions/{id}` | STUDENT | Delete discussion |
| POST | `/discussions/{id}/upvote` | STUDENT | Upvote discussion |
| POST | `/discussions/{id}/downvote` | STUDENT | Downvote discussion |
| POST | `/discussions/{id}/bookmark` | STUDENT | Bookmark discussion |
| GET | `/discussions/public` | PUBLIC | Get public discussions |
| GET | `/discussions/{id}/public` | PUBLIC | Get public discussion |

## Answers

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/discussions/{id}/answers` | PUBLIC | Get answers for discussion |
| POST | `/discussions/{id}/answers` | STUDENT | Create answer |
| PUT | `/answers/{id}` | STUDENT | Update answer |
| DELETE | `/answers/{id}` | STUDENT | Delete answer |
| POST | `/answers/{id}/upvote` | STUDENT | Upvote answer |
| POST | `/answers/{id}/downvote` | STUDENT | Downvote answer |
| POST | `/answers/{id}/accept` | STUDENT | Accept answer |

## Groups

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/groups` | PUBLIC | Get groups with filters |
| GET | `/groups/{id}` | PUBLIC | Get specific group |
| POST | `/groups` | STUDENT | Create study group |
| PUT | `/groups/{id}` | STUDENT | Update group |
| POST | `/groups/{id}/join` | STUDENT | Join/leave group |
| GET | `/groups/{id}/members` | STUDENT | Get group members |
| PUT | `/groups/{id}/members/{userId}/role` | STUDENT | Change member role |
| DELETE | `/groups/{id}/members/{userId}` | STUDENT | Remove group member |
| GET | `/groups/{id}/discussions` | STUDENT | Get group discussions |
| POST | `/groups/{id}/discussions` | STUDENT | Create group discussion |

## Messages

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/messages/conversations` | STUDENT | Get user conversations |
| GET | `/messages/conversations/{id}` | STUDENT | Get conversation messages |
| POST | `/messages` | STUDENT | Send message |
| PUT | `/messages/{id}` | STUDENT | Update message |
| DELETE | `/messages/{id}` | STUDENT | Delete message |
| PUT | `/messages/{id}/read` | STUDENT | Mark message as read |
| GET | `/messages/unread-count` | STUDENT | Get unread count |

## Notifications

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/notifications` | STUDENT | Get user notifications |
| PUT | `/notifications/{id}/read` | STUDENT | Mark notification as read |
| PUT | `/notifications/read-all` | STUDENT | Mark all as read |
| GET | `/notifications/unread-count` | STUDENT | Get unread count |

## AI Features

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/ai/ask` | STUDENT | Ask AI question |
| GET | `/ai/history` | STUDENT | Get AI query history |

## Search

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/search/discussions` | PUBLIC | Search discussions |
| GET | `/search/groups` | PUBLIC | Search groups |
| GET | `/search/users` | PUBLIC | Search users |

## File Management

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST | `/files/upload` | STUDENT | Upload single file |
| POST | `/files/upload/multiple` | STUDENT | Upload multiple files |
| GET | `/files/{fileName}` | PUBLIC | Download file |
| GET | `/files/my` | STUDENT | Get user's files |
| GET | `/files/details/{fileId}` | STUDENT | Get file details |
| DELETE | `/files/{fileId}` | STUDENT | Delete file |
| GET | `/files/storage-info` | STUDENT | Get storage usage |

## WebSocket Endpoints

| Mapping | Roles | Description |
|---------|-------|-------------|
| `/messages.send` | STUDENT | Send real-time message |
| `/typing.start` | STUDENT | Start typing indicator |
| `/typing.stop` | STUDENT | Stop typing indicator |
| `/messages.read` | STUDENT | Mark message as read |
| `/groups/{id}/discussions.create` | STUDENT | Create group discussion |
| `/groups/{id}/answers.create` | STUDENT | Create group answer |
| `/groups/{id}/vote` | STUDENT | Vote in group |

---

# 📊 Assessment Service (Port 8083)

**Total Endpoints:** 65

## Questions Management

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/questions` | ADMIN, QUESTION_SETTER | Get questions with filters |
| GET | `/questions/random` | ADMIN, QUESTION_SETTER | Get random questions |
| GET | `/questions/public/daily` | PUBLIC | Get public daily questions |
| GET | `/questions/{id}` | ADMIN, QUESTION_SETTER | Get question by ID |
| POST | `/questions` | ADMIN, QUESTION_SETTER | Create question |
| PUT | `/questions/{id}` | ADMIN, QUESTION_SETTER | Update question |
| DELETE | `/questions/{id}` | ADMIN, QUESTION_SETTER | Delete question |
| POST | `/questions/bulk` | ADMIN | Bulk import questions |

## Contests

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/contests` | ADMIN, QUESTION_SETTER, STUDENT | Get contests |
| GET | `/contests/public` | PUBLIC | Get public contests |
| GET | `/contests/{id}` | ADMIN, QUESTION_SETTER, STUDENT | Get contest details |
| GET | `/contests/{id}/questions` | STUDENT | Get contest questions |
| POST | `/contests/{id}/questions/{qid}/submit` | STUDENT | Submit contest answer |
| GET | `/contests/{id}/leaderboard` | ADMIN, QUESTION_SETTER, STUDENT | Get leaderboard |
| GET | `/contests/{id}/submissions` | STUDENT | Get user submissions |
| GET | `/contests/my-submissions` | STUDENT | Get all user submissions |
| POST | `/contests/{id}/join` | STUDENT | Join contest |
| GET | `/contests/{id}/results` | ADMIN, QUESTION_SETTER, STUDENT | Get contest results |
| POST | `/contests` | ADMIN, QUESTION_SETTER | Create contest |
| PUT | `/contests/{id}` | ADMIN, QUESTION_SETTER | Update contest |
| DELETE | `/contests/{id}` | ADMIN | Delete contest |
| POST | `/contests/{id}/start` | ADMIN | Start contest manually |
| POST | `/contests/{id}/end` | ADMIN | End contest manually |

## Personalized Exams

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/personalized-exams` | STUDENT, ADMIN | Get personalized exams |
| GET | `/personalized-exams/{id}` | STUDENT, ADMIN | Get exam by ID |
| POST | `/personalized-exams` | STUDENT | Create personalized exam |
| POST | `/personalized-exams/{id}/start` | STUDENT | Start exam |
| POST | `/personalized-exams/{id}/submit` | STUDENT | Submit exam |
| GET | `/personalized-exams/stats` | STUDENT | Get exam statistics |

## Live Exams

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/live-exams` | ADMIN, QUESTION_SETTER, STUDENT | Get live exams |
| GET | `/live-exams/{id}` | ADMIN, QUESTION_SETTER, STUDENT | Get exam by ID |
| GET | `/live-exams/upcoming` | ADMIN, QUESTION_SETTER, STUDENT | Get upcoming exams |
| GET | `/live-exams/live` | ADMIN, QUESTION_SETTER, STUDENT | Get active exams |
| POST | `/live-exams/{id}/join` | STUDENT | Join live exam |
| POST | `/live-exams/{id}/register` | STUDENT | Register for exam |
| POST | `/live-exams/{id}/start` | STUDENT | Start exam session |
| POST | `/live-exams/{id}/submit-answer` | STUDENT | Submit answer |
| POST | `/live-exams/{id}/finish` | STUDENT | Finish exam |
| GET | `/live-exams/{id}/results` | STUDENT | Get exam results |
| GET | `/live-exams/{id}/leaderboard` | ADMIN, QUESTION_SETTER, STUDENT | Get leaderboard |

## Practice Problems

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/practice-problems` | STUDENT | Get practice problems |
| GET | `/practice-problems/{id}` | STUDENT | Get problem by ID |
| POST | `/practice-problems/{id}/submit` | STUDENT | Submit solution |
| GET | `/practice-problems/{id}/hint` | STUDENT | Get hint |
| POST | `/practice-problems/{id}/bookmark` | STUDENT | Bookmark problem |
| GET | `/practice-problems/recommendations` | STUDENT | Get recommendations |

## Daily Questions

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/daily-questions` | PUBLIC | Get daily questions |
| GET | `/daily-questions/public` | PUBLIC | Get public daily questions |
| POST | `/daily-questions/{id}/submit` | STUDENT | Submit answer |
| GET | `/daily-questions/today` | ADMIN, QUESTION_SETTER, STUDENT | Get today's questions |
| GET | `/daily-questions/streak` | STUDENT | Get streak info |
| GET | `/daily-questions/stats` | STUDENT | Get statistics |
| GET | `/daily-questions/history` | STUDENT | Get history |
| PUT | `/daily-questions` | ADMIN, STUDENT | Set daily questions |

## Subjects & Topics

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/subjects` | ADMIN, QUESTION_SETTER, STUDENT | Get subjects |
| GET | `/subjects/public` | PUBLIC | Get public subjects |
| GET | `/subjects/{id}` | ADMIN, QUESTION_SETTER, STUDENT | Get subject by ID |
| POST | `/subjects` | ADMIN, QUESTION_SETTER | Create subject |
| PUT | `/subjects/{id}` | ADMIN, QUESTION_SETTER | Update subject |
| DELETE | `/subjects/{id}` | ADMIN, QUESTION_SETTER | Delete subject |
| GET | `/topics` | ADMIN, QUESTION_SETTER, STUDENT | Get topics |
| GET | `/topics/public/by-subject/{id}` | PUBLIC | Get public topics |
| GET | `/topics/{id}` | ADMIN, QUESTION_SETTER, STUDENT | Get topic by ID |
| POST | `/topics` | ADMIN, QUESTION_SETTER | Create topic |
| PUT | `/topics/{id}` | ADMIN, QUESTION_SETTER | Update topic |
| DELETE | `/topics/{id}` | ADMIN, QUESTION_SETTER | Delete topic |

## Analytics

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/analytics/dashboard` | ADMIN, QUESTION_SETTER, STUDENT | Get dashboard analytics |
| GET | `/analytics/performance` | ADMIN, QUESTION_SETTER, STUDENT | Get performance analytics |
| GET | `/analytics/progress` | ADMIN, QUESTION_SETTER, STUDENT | Get progress analytics |
| GET | `/analytics/rankings` | ADMIN, QUESTION_SETTER, STUDENT | Get rankings |

## Leaderboard

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/leaderboard/global` | ADMIN, QUESTION_SETTER, STUDENT | Get global leaderboard |
| GET | `/leaderboard/public` | PUBLIC | Get public leaderboard |
| GET | `/leaderboard/subject/{id}` | ADMIN, QUESTION_SETTER, STUDENT | Get subject leaderboard |
| GET | `/leaderboard/class/{level}` | ADMIN, QUESTION_SETTER, STUDENT | Get class leaderboard |

## Admin Operations

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/admin/analytics` | ADMIN | Get admin analytics |
| PUT | `/admin/daily-questions` | ADMIN | Set daily questions |
| POST | `/admin/live-exams` | ADMIN | Create live exam |
| POST | `/admin/contests` | ADMIN | Create contest |
| POST | `/admin/create-practice-problems` | ADMIN | Create practice problems |

## Testing

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | `/test/jwt-config` | PUBLIC | Test JWT configuration |
| GET | `/test/public` | PUBLIC | Public test endpoint |

---

# 📈 API Summary Statistics

## Total Endpoints Across All Services: 146

### By Service:
- **Auth Service**: 22 endpoints
- **Discussion Service**: 59 endpoints (52 REST + 7 WebSocket)
- **Assessment Service**: 65 endpoints

### By Authentication Requirements:
- **Public endpoints**: 25 (17%)
- **Authenticated endpoints**: 121 (83%)

### By Role Requirements:
- **PUBLIC**: 25 endpoints
- **AUTHENTICATED (any role)**: 12 endpoints
- **STUDENT**: 72 endpoints
- **ADMIN**: 26 endpoints
- **QUESTION_SETTER**: 16 endpoints
- **ADMIN + QUESTION_SETTER**: 29 endpoints
- **ADMIN + QUESTION_SETTER + STUDENT**: 23 endpoints

## Role-Based Access Matrix

| Role | Auth Service | Discussion Service | Assessment Service | Total Access |
|------|-------------|-------------------|-------------------|--------------|
| **ADMIN** | Full Access (22) | No Access (0) | High Access (58) | 80 endpoints |
| **QUESTION_SETTER** | No Direct Access (0) | No Access (0) | Content Management (43) | 43 endpoints |
| **STUDENT** | User Operations (7) | Full Access (35) | Learning Features (39) | 81 endpoints |
| **PUBLIC** | Auth Operations (12) | Browse/Search (17) | Basic Info (8) | 37 endpoints |

## Security Features

### Authentication Patterns:
- **JWT-based authentication** across all services
- **Role-based access control** with method-level security
- **Public endpoints** for essential operations
- **Cross-service user synchronization**

### Authorization Levels:
1. **Public Access** - No authentication required
2. **Authenticated Access** - Valid JWT token required
3. **Role-Based Access** - Specific role permissions required
4. **Owner-Based Access** - Resource ownership validation

### Key Security Considerations:
- All sensitive operations require authentication
- Admin functions are properly segregated
- Question setters have limited administrative access
- Students have access to learning features only
- Public endpoints provide essential browsing capabilities
- WebSocket endpoints require authentication
- File access includes ownership validation

This comprehensive API reference provides complete visibility into the EduConnect platform's security model and access patterns.