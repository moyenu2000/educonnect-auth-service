# EduConnect Local Testing Guide

## Overview
This guide provides comprehensive information for testing the EduConnect microservices locally. The system consists of three main services that work together to provide a complete educational platform.

## Services and Ports

### 1. Auth Service
- **Port**: 8081
- **Base URL**: `http://localhost:8081/api`
- **Context Path**: `/api`
- **Health Check**: `http://localhost:8081/actuator/health`

### 2. Assessment Service
- **Port**: 8084
- **Base URL**: `http://localhost:8084/api/v1`
- **Context Path**: `/api/v1`
- **Health Check**: `http://localhost:8084/actuator/health`

### 3. Discussion Service
- **Port**: 8083
- **Base URL**: `http://localhost:8083/api/v1`
- **Context Path**: `/api/v1`
- **Health Check**: `http://localhost:8083/actuator/health`
- **WebSocket**: `ws://localhost:8083/ws`

## Prerequisites

### Database Setup
1. **PostgreSQL**: Running on port 5432
   - Database names:
     - `learning_platform` (Auth Service)
     - `educonnect_assessment` (Assessment Service)
     - `educonnect_discussions` (Discussion Service)
   - Username: `educonnect`
   - Password: `educonnect123`

2. **Redis**: Running on port 6379 (for caching)

3. **RabbitMQ**: Running on port 5672 (for messaging)
   - Management UI: `http://localhost:15672`
   - Username: `educonnect`
   - Password: `educonnect123`

## Starting Services

### Option 1: Using Docker Compose
```bash
# Start all services with dependencies
docker-compose up -d

# Start specific services
docker-compose up -d postgres redis rabbitmq
docker-compose up -d auth-service
docker-compose up -d assessment-service
docker-compose up -d discussion-service
```

### Option 2: Running Individually
```bash
# Start Auth Service
cd auth
./mvnw spring-boot:run

# Start Assessment Service
cd assessment-service
./mvnw spring-boot:run

# Start Discussion Service
cd discussion-service
./mvnw spring-boot:run
```

## Testing with Postman

### 1. Import Collections
Import the following Postman collections:
- `local-testing-auth-service.postman_collection.json`
- `local-testing-assessment-service.postman_collection.json`
- `local-testing-discussion-service.postman_collection.json`

### 2. Testing Workflow

#### Step 1: Authentication Flow
1. **Register a new user** (Auth Service)
   ```json
   POST http://localhost:8081/api/auth/register
   {
     "username": "student1",
     "email": "student1@example.com",
     "password": "Password123!",
     "fullName": "John Doe",
     "role": "STUDENT",
     "classLevel": "HIGH_SCHOOL"
   }
   ```

2. **Login** (Auth Service)
   ```json
   POST http://localhost:8081/api/auth/login
   {
     "usernameOrEmail": "student1",
     "password": "Password123!"
   }
   ```
   
   **Response**: Copy the `accessToken` from the response and use it for subsequent requests.

3. **Set Authorization Header**
   For all other service calls, use: `Bearer <accessToken>`

#### Step 2: Assessment Service Testing
1. **Get Subjects**
   ```
   GET http://localhost:8084/api/v1/subjects
   ```

2. **Get Daily Questions**
   ```
   GET http://localhost:8084/api/v1/daily-questions
   ```

3. **Submit Answer**
   ```json
   POST http://localhost:8084/api/v1/daily-questions/1/submit
   {
     "selectedOptions": ["4"],
     "timeSpent": 30
   }
   ```

#### Step 3: Discussion Service Testing
1. **Create Discussion**
   ```json
   POST http://localhost:8083/api/v1/discussions
   {
     "title": "Help with Calculus",
     "content": "Need help with integration",
     "type": "QUESTION",
     "subjectId": 1,
     "tags": ["calculus", "help"]
   }
   ```

2. **Get Discussions**
   ```
   GET http://localhost:8083/api/v1/discussions?page=0&size=10
   ```

3. **Create Answer**
   ```json
   POST http://localhost:8083/api/v1/discussions/1/answers
   {
     "content": "Here's how to solve integration problems...",
     "isAnonymous": false
   }
   ```

## API Endpoints Summary

### Auth Service (`localhost:8081/api`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/2fa/enable` - Enable 2FA
- `POST /auth/2fa/verify` - Verify 2FA code

### Assessment Service (`localhost:8084/api/v1`)
- `GET /subjects` - Get all subjects
- `GET /topics` - Get topics by subject
- `GET /questions` - Get questions with filters
- `GET /daily-questions` - Get daily questions
- `POST /daily-questions/{id}/submit` - Submit daily question answer
- `GET /practice-problems` - Get practice problems
- `POST /practice-problems/{id}/submit` - Submit practice answer
- `GET /live-exams` - Get live exams
- `POST /live-exams/{id}/register` - Register for live exam
- `GET /contests` - Get contests
- `POST /contests/{id}/join` - Join contest
- `GET /analytics/dashboard` - Get user analytics
- `GET /leaderboard/global` - Get global leaderboard

### Discussion Service (`localhost:8083/api/v1`)
- `GET /discussions` - Get discussions with filters
- `POST /discussions` - Create new discussion
- `GET /discussions/{id}` - Get discussion by ID
- `PUT /discussions/{id}` - Update discussion
- `DELETE /discussions/{id}` - Delete discussion
- `POST /discussions/{id}/upvote` - Upvote discussion
- `POST /discussions/{id}/downvote` - Downvote discussion
- `GET /discussions/{id}/answers` - Get answers for discussion
- `POST /discussions/{id}/answers` - Create answer
- `POST /answers/{id}/accept` - Accept answer
- `GET /groups` - Get study groups
- `POST /groups` - Create study group
- `POST /groups/{id}/join` - Join study group
- `GET /messages/conversations` - Get conversations
- `POST /messages` - Send message
- `POST /ai/ask` - Ask AI assistant
- `GET /search/discussions` - Search discussions
- `GET /notifications` - Get notifications

## Testing Scenarios

### 1. Complete User Journey
1. Register new user
2. Login and get access token
3. Get available subjects
4. Attempt daily questions
5. Create a discussion
6. Answer someone's question
7. Join a study group
8. Send direct messages
9. Check notifications

### 2. Authentication Testing
1. Valid registration
2. Invalid email format
3. Duplicate username/email
4. Valid login
5. Invalid credentials
6. Token refresh
7. Logout
8. Password reset flow
9. 2FA setup and verification

### 3. Assessment Testing
1. Daily questions flow
2. Practice problems
3. Live exam registration and participation
4. Contest participation
5. Analytics and progress tracking
6. Leaderboard functionality

### 4. Discussion Testing
1. Create and manage discussions
2. Answer and vote on discussions
3. Study group creation and management
4. Direct messaging
5. AI assistant queries
6. Search functionality
7. Notification system

## WebSocket Testing
For real-time features (messages, notifications), use WebSocket clients:
- Base URL: `ws://localhost:8083/ws`
- Endpoints:
  - `/ws/messages` - Real-time messages
  - `/ws/notifications` - Real-time notifications
  - `/ws/groups/{groupId}` - Group-specific updates

## Common Issues and Solutions

### 1. CORS Issues
If you encounter CORS errors:
- Ensure frontend is running on `http://localhost:3000`
- Check CORS configuration in `application.yml`

### 2. Database Connection
- Verify PostgreSQL is running
- Check database credentials in configuration files
- Ensure databases exist with correct names

### 3. Redis Connection
- Verify Redis is running on port 6379
- Check Redis configuration in services

### 4. Authentication Issues
- Ensure JWT tokens are properly formatted
- Check token expiration (24 hours by default)
- Verify Bearer token format: `Bearer <token>`

### 5. Service Communication
- Ensure all required services are running
- Check service URLs in configuration
- Verify network connectivity between services

## Environment Variables
For production-like testing, you can override these environment variables:

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/your_db
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password

# Redis
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=86400000

# Email (for testing email features)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## Monitoring and Debugging

### Health Checks
- Auth Service: `http://localhost:8081/actuator/health`
- Assessment Service: `http://localhost:8084/actuator/health`
- Discussion Service: `http://localhost:8083/actuator/health`

### Logs
Monitor application logs for debugging:
- Check console output when running with Maven
- Look for error messages in Docker logs: `docker logs <container_name>`

### Database Queries
Enable SQL logging in `application.yml`:
```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

This comprehensive guide should help you effectively test all three services locally. Make sure to follow the authentication flow first, then proceed with testing the other services using the obtained access tokens.
