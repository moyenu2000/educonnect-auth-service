# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

EduConnect is a microservices-based educational platform with three main services:

### Service Architecture
- **Auth Service** (Port 8081): Handles authentication, user management, OAuth2, 2FA
- **Discussion Service** (Port 8082): Manages discussions, groups, answers, AI queries, messaging
- **Assessment Service** (Port 8083): Handles questions, exams, contests, analytics

All services use `/api/v1` as their context path and share a PostgreSQL database with separate schemas.

### Shared Infrastructure
- **PostgreSQL**: Single database with schemas (auth, discussion, assessment, social_feed)
- **Redis**: Caching and session storage
- **RabbitMQ**: Message queuing (disabled in discussion service)
- **Docker Compose**: Container orchestration

## Key Development Commands

### Running the Full Stack
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild specific service (e.g., after code changes)
docker-compose build --no-cache discussion-service
docker-compose up -d discussion-service
```

### Testing
```bash
# Run auth service tests (only service with comprehensive tests)
./run-all-tests.sh

# Run with specific profile
./run-all-tests.sh --profile integration-test

# Individual service tests
cd auth && ./mvnw test
cd assessment-service && ./mvnw test
cd discussion-service && ./mvnw test
```

### Building Services
```bash
# Build individual service
cd auth && ./mvnw clean package
cd assessment-service && ./mvnw clean package
cd discussion-service && ./mvnw clean package

# Build with specific profile
./mvnw clean package -Dspring.profiles.active=docker

# Build and run locally (without Docker)
cd auth && ./mvnw spring-boot:run
cd assessment-service && ./mvnw spring-boot:run -Dspring.profiles.active=test
cd discussion-service && ./mvnw spring-boot:run -Dspring.profiles.active=test
```

## Service-Specific Details

### Auth Service
- **Technology**: Spring Boot, Spring Security, OAuth2, JWT
- **Key Features**: User registration/login, 2FA, OAuth2 (Google), JWT token management
- **Database Schema**: `auth` (users, refresh_tokens)
- **Security**: Role-based access control (ADMIN, STUDENT, QUESTION_SETTER)
- **Configuration**: CORS enabled, extensive security configuration

### Discussion Service  
- **Technology**: Spring Boot, WebSocket, JWT validation
- **Key Features**: Q&A discussions, study groups, messaging, AI integration, notifications
- **Database Schema**: `discussion` (discussions, answers, groups, messages, notifications, users)
- **Security**: JWT validation with role `STUDENT` (recently updated from `USER`)
- **Important**: Has `UserSyncService` that auto-creates users from JWT tokens

### Assessment Service
- **Technology**: Spring Boot, Redis caching, WebSocket
- **Key Features**: Questions, personalized exams, contests, analytics, daily questions
- **Database Schema**: `assessment` (questions, subjects, topics, exams, contests)
- **Special Features**: Rate limiting, WebSocket for live exams

## Critical Implementation Details

### JWT Token Flow
1. User authenticates via Auth Service (`/api/v1/auth/login`)
2. Receives JWT token with user info (id, username, email, role)
3. Other services validate JWT and auto-create users via `UserSyncService` (Discussion Service)

### Role System
- Auth Service uses: `ADMIN`, `STUDENT`, `QUESTION_SETTER`
- Discussion Service expects: `STUDENT` role for authenticated endpoints
- Assessment Service uses: Various roles for different operations

### Database Schema Strategy
- Each service has its own schema in the same PostgreSQL database
- Mock data is initialized via `init-db.sql`
- Hibernate auto-generates tables with `ddl-auto=update`

### API Testing
- Postman collections available for each service:
  - `auth-api.postman_collection.json` (Auth Service)
  - `discussion-service-postman-collection.json` (Discussion Service)
  - `assessment-service-postman-collection.json` (Assessment Service)
- API test scripts: `discussion-service-api-tests.sh`
- All services expect JWT Bearer tokens for protected endpoints
- Update JWT tokens in test scripts after logging in via Auth Service

## Common Development Patterns

### Error Handling
All services use `GlobalExceptionHandler` with standardized `ApiResponse<T>` wrapper:
```json
{
  "success": true|false,
  "data": T,
  "message": "string",
  "error": "string"
}
```

### Pagination
Consistent pagination across services using `PagedResponse<T>`:
```json
{
  "content": [],
  "totalElements": 0,
  "totalPages": 0,
  "currentPage": 0,
  "size": 10,
  "first": true,
  "last": true,
  "empty": true
}
```

### Security Configuration
- JWT secret shared across services via `JWT_SECRET` environment variable
- CORS configured for frontend URLs
- Role-based access control using `@PreAuthorize`

## Environment Configuration

### Required Environment Variables
- `DB_PASSWORD`: PostgreSQL password
- `DB_USER`: PostgreSQL username (defaults to 'educonnect')
- `JWT_SECRET`: JWT signing secret (base64 encoded)
- `MAIL_USERNAME` & `MAIL_PASSWORD`: SMTP credentials
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth2 credentials
- `RABBITMQ_PASSWORD`: RabbitMQ password
- `RABBITMQ_USER`: RabbitMQ username (defaults to 'educonnect')
- `FRONTEND_URL`: Frontend application URL (defaults to 'http://localhost:3000')

### Development vs Production
- Use `SPRING_PROFILES_ACTIVE=docker` for container deployment
- Different `application-*.properties` files for various environments
- Health checks enabled via Spring Actuator

## Known Issues & Considerations

### Discussion Service
- Some endpoints have Hibernate serialization errors (Groups, AI history)
- User synchronization works via JWT token data extraction
- WebSocket functionality available but may need additional configuration

### Testing Coverage
- Auth Service has comprehensive unit tests
- Other services lack extensive test coverage
- Integration tests available but limited

### Performance
- Redis caching enabled for Assessment Service
- Database connection pooling configured via Hikari
- Rate limiting implemented in Assessment Service
- WebSocket support for real-time features in Discussion and Assessment services

## API Endpoints Structure

### Auth Service (`localhost:8081/api/v1`)
- `/auth/*` - Authentication endpoints
- `/actuator/health` - Health checks

### Discussion Service (`localhost:8082/api/v1`)
- `/discussions/*` - Discussion management
- `/groups/*` - Study groups
- `/messages/*` - Messaging system
- `/notifications/*` - User notifications
- `/search/*` - Search functionality
- `/ai/*` - AI query system

### Assessment Service (`localhost:8083/api/v1`)
- `/questions/*` - Question management
- `/subjects/*` & `/topics/*` - Subject organization
- `/contests/*` - Programming contests
- `/exams/*` - Live and personalized exams
- `/analytics/*` - Performance analytics

Remember to restart Docker services after code changes to apply updates, especially for role permission modifications.

## Using Gemini CLI for Large Codebase Analysis

When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

### File and Directory Inclusion Syntax

Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the gemini command:

#### Examples:

**Single file analysis:**
```bash
gemini -p "@src/main.py Explain this file's purpose and structure"
```

**Multiple files:**
```bash
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"
```

**Entire directory:**
```bash
gemini -p "@src/ Summarize the architecture of this codebase"
```

**Multiple directories:**
```bash
gemini -p "@src/ @tests/ Analyze test coverage for the source code"
```

**Current directory and subdirectories:**
```bash
gemini -p "@./ Give me an overview of this entire project"
# Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"
```

### Implementation Verification Examples

**Check if a feature is implemented:**
```bash
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"
```

**Verify authentication implementation:**
```bash
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"
```

**Check for specific patterns:**
```bash
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"
```

**Verify error handling:**
```bash
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"
```

**Check for rate limiting:**
```bash
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"
```

**Verify caching strategy:**
```bash
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"
```

**Check for specific security measures:**
```bash
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"
```

**Verify test coverage for features:**
```bash
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"
```

### EduConnect-Specific Analysis Commands

**Analyze entire microservice:**
```bash
gemini -p "@auth/ Analyze the authentication service implementation and security measures"
gemini -p "@discussion-service/ Review the discussion service architecture and API design"
gemini -p "@assessment-service/ Examine the assessment service features and data structures"
```

**Cross-service analysis:**
```bash
gemini -p "@auth/ @discussion-service/ @assessment-service/ How is JWT authentication implemented across all services?"
gemini -p "@*/src/main/java/ Analyze the consistency of error handling patterns across all Spring Boot services"
```

**Security audit:**
```bash
gemini -p "@*/src/main/java/ @*/src/main/resources/ Is proper input validation and SQL injection protection implemented across all services?"
```

**Database schema analysis:**
```bash
gemini -p "@init-db.sql @*/src/main/java/*/entity/ Analyze the database schema design and entity relationships"
```

### When to Use Gemini CLI

Use `gemini -p` when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase
- Performing comprehensive security audits
- Analyzing microservice interactions and consistency

### Important Notes

- Paths in `@` syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for `--yolo` flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results
- For EduConnect, consider analyzing one service at a time for focused results, or all services for architectural consistency

### Code Generation Review with Gemini

**IMPORTANT**: Whenever Claude Code generates new code or makes significant modifications, always review the changes with Gemini CLI to ensure quality, consistency, and adherence to project patterns.

#### Review Generated Code

**Single file review:**
```bash
gemini -p "@path/to/generated/file.java Review this generated code for quality, security, and consistency with Spring Boot best practices"
```

**Multiple files review:**
```bash
gemini -p "@src/new/feature/ @src/existing/related/ Review the new feature implementation for consistency with existing code patterns"
```

**Service-wide impact review:**
```bash
gemini -p "@discussion-service/ The UserSyncService was recently added. Review how this impacts the overall service architecture and identify any potential issues"
```

**Security review of generated code:**
```bash
gemini -p "@path/to/new/controller.java @*/security/ Review this new controller for security vulnerabilities and consistency with existing security patterns"
```

**Database changes review:**
```bash
gemini -p "@*/entity/ @init-db.sql New entities were added. Review for proper relationships, constraints, and potential migration issues"
```

#### Integration Review Examples

**API consistency check:**
```bash
gemini -p "@*/controller/ @*/dto/ New API endpoints were added. Check for consistency with existing API patterns, error handling, and response structures"
```

**Service layer review:**
```bash
gemini -p "@*/service/ @*/service/impl/ Review new service implementations for proper separation of concerns and consistency with existing patterns"
```

**Configuration review:**
```bash
gemini -p "@*/resources/application*.properties @*/config/ Review configuration changes for compatibility and security implications"
```

#### Quality Assurance Workflow

1. **Generate Code** with Claude Code
2. **Review with Gemini** using appropriate commands above
3. **Apply Feedback** - Make necessary adjustments based on Gemini's review
4. **Test Changes** - Run tests and verify functionality
5. **Final Review** - Do a final Gemini review if significant changes were made

#### EduConnect-Specific Review Patterns

**Role and Security Changes:**
```bash
gemini -p "@*/controller/ @*/security/ Role permissions were changed from USER to STUDENT. Review all security annotations and access controls for consistency"
```

**JWT Token Handling:**
```bash
gemini -p "@*/security/ @*/service/UserSyncService* JWT token handling was modified. Review for security implications and proper token validation"
```

**Cross-Service Impact:**
```bash
gemini -p "@auth/ @discussion-service/ @assessment-service/ Changes were made to authentication. Review impact across all services and their integration"
```

**Database Schema Changes:**
```bash
gemini -p "@*/entity/ @init-db.sql Database entities were modified. Review for proper relationships, foreign keys, and data integrity"
```

This review process ensures that generated code maintains the high quality and consistency standards of the EduConnect platform.