# EduConnect API Documentation

## Overview

EduConnect is a comprehensive microservices-based educational platform providing authentication, discussion forums, and assessment capabilities.

## Architecture

### Microservices
- **Auth Service** (Port 8081): User authentication and management
- **Discussion Service** (Port 8082): Forums, groups, messaging, AI integration
- **Assessment Service** (Port 8083): Questions, exams, contests, analytics

### Shared Infrastructure
- **Database**: PostgreSQL with service-specific schemas
- **Authentication**: JWT tokens shared across services
- **Communication**: REST APIs + WebSocket for real-time features

## Quick Start

### Base URLs
```
Auth Service:       http://localhost:8081/api/v1
Discussion Service: http://localhost:8082/api/v1
Assessment Service: http://localhost:8083/api/v1
```

### Authentication Flow
1. Register/Login via Auth Service (`POST /auth/login`)
2. Receive JWT token
3. Use token in Authorization header: `Bearer <token>`
4. Access protected endpoints across all services

### Sample Authentication
```bash
# Login
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "student", "password": "password"}'

# Use token
curl -X GET http://localhost:8082/api/v1/discussions \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Service Documentation

### [Auth Service API](./auth-service-api.md)
- User registration and authentication
- Profile management
- Two-factor authentication
- Admin user management
- OAuth2 integration (Google)

**Key Endpoints:**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `POST /auth/2fa/enable` - Enable 2FA

### [Discussion Service API](./discussion-service-api.md)
- Q&A discussions with voting
- Study groups and messaging
- Real-time notifications
- AI-powered query assistance (Gemini)
- Search functionality

**Key Endpoints:**
- `GET /discussions` - List discussions
- `POST /discussions` - Create discussion
- `POST /groups` - Create study group
- `POST /ai/query` - AI assistance

### [Assessment Service API](./assessment-service-api.md)
- Question management and practice
- Live exams and contests
- Personalized assessments
- Daily questions and streaks
- Analytics and leaderboards

**Key Endpoints:**
- `GET /questions` - List questions
- `POST /contests` - Create contest
- `POST /live-exams/{id}/join` - Join exam
- `GET /analytics/dashboard` - User analytics

## Common Patterns

### Response Format
All APIs use standardized response wrapper:
```json
{
  "success": boolean,
  "data": T,
  "message": "string",
  "error": "string"
}
```

### Pagination
Paginated responses use consistent format:
```json
{
  "content": [T],
  "totalElements": number,
  "totalPages": number,
  "currentPage": number,
  "size": number,
  "first": boolean,
  "last": boolean,
  "empty": boolean
}
```

### Error Handling
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## User Roles

### STUDENT
- Access discussions, groups, messaging
- Take exams, submit answers
- View personal analytics
- Use AI assistance

### QUESTION_SETTER
- Create and manage questions
- Create contests and exams
- Access advanced analytics
- Moderate content

### ADMIN
- Full system access
- User management
- System configuration
- Administrative analytics

## Real-time Features

### WebSocket Endpoints
```
Discussion Service: ws://localhost:8082/ws
Assessment Service: ws://localhost:8083/ws
```

### Supported Features
- **Live Messaging**: Real-time chat and typing indicators
- **Group Activities**: Live group notifications
- **Live Exams**: Real-time exam updates
- **Voting**: Live vote counts
- **Leaderboards**: Real-time score updates

## Security

### JWT Tokens
- **Algorithm**: HMAC SHA-256
- **Access Token**: 24 hours
- **Refresh Token**: 7 days
- **Shared Secret**: Across all services

### CORS Configuration
- Development: All origins allowed
- Production: Configured specific origins
- Credentials: Supported

### Rate Limiting
- Service-level implementation
- User-based limiting
- Endpoint-specific limits

## Integration Examples

### Complete User Journey
```bash
# 1. Register user
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "student1", "email": "student@example.com", "password": "password123", "fullName": "John Doe"}'

# 2. Login
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "student1", "password": "password123"}'

# 3. Create discussion
curl -X POST http://localhost:8082/api/v1/discussions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Help with calculus", "content": "Need help understanding derivatives"}'

# 4. Join contest
curl -X POST http://localhost:8083/api/v1/contests/1/join \
  -H "Authorization: Bearer <token>"

# 5. Get analytics
curl -X GET http://localhost:8083/api/v1/analytics/dashboard \
  -H "Authorization: Bearer <token>"
```

### Cross-Service Data Flow
1. User authenticates via Auth Service
2. JWT token contains user info (id, username, email, role)
3. Discussion Service auto-creates user from JWT via UserSyncService
4. Assessment Service validates token and accesses user data
5. All services share consistent user context

## Development Setup

### Prerequisites
- Docker & Docker Compose
- Java 17+
- PostgreSQL
- Redis (optional)

### Running Services
```bash
# Start all services
docker-compose up -d

# Individual service (for development)
cd auth && ./mvnw spring-boot:run
cd discussion-service && ./mvnw spring-boot:run -Dspring.profiles.active=test
cd assessment-service && ./mvnw spring-boot:run -Dspring.profiles.active=test
```

### Testing
```bash
# Run all tests
./run-all-tests.sh

# Individual service tests
cd auth && ./mvnw test
cd discussion-service && ./mvnw test
cd assessment-service && ./mvnw test
```

## Postman Collections

Import these collections for testing:
- `auth-api.postman_collection.json` - Auth Service
- `discussion-service-postman-collection.json` - Discussion Service  
- `assessment-service-postman-collection.json` - Assessment Service

## Environment Variables

### Required
- `JWT_SECRET`: Shared JWT signing secret
- `DB_PASSWORD`: PostgreSQL password
- `DB_USER`: PostgreSQL username

### Optional
- `GOOGLE_CLIENT_ID`: OAuth2 Google integration
- `MAIL_USERNAME`: Email service credentials
- `FRONTEND_URL`: CORS configuration
- `RABBITMQ_PASSWORD`: Message queue (if enabled)

## Support

### Health Checks
```bash
curl http://localhost:8081/actuator/health  # Auth Service
curl http://localhost:8082/actuator/health  # Discussion Service
curl http://localhost:8083/actuator/health  # Assessment Service
```

### Logging
- All services use structured logging
- Log levels configurable via application properties
- Centralized error handling with detailed stack traces

### Monitoring
- Spring Actuator endpoints available
- Health checks for database connectivity
- Performance metrics collection ready