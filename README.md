# EduConnect - Complete Educational Platform

A comprehensive microservices-based educational platform built with Spring Boot, featuring authentication, question banks, social feeds, discussions, and assessments.

## 🏗️ Architecture Overview

EduConnect consists of 4 microservices:

```
┌─────────────────────────────────────────────────────────────────┐
│                        EduConnect Platform                      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Auth      │  │ Social Feed │  │ Discussion  │  │ Assessment  │  │
│  │ Service     │  │ Service     │  │ Service     │  │ Service     │  │
│  │ (8081)      │  │ (8082)      │  │ (8083)      │  │ (8084)      │  │
│  │             │  │             │  │             │  │             │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ PostgreSQL  │  │   Redis     │  │ RabbitMQ    │  │   Nginx     │  │
│  │ Database    │  │   Cache     │  │ Message     │  │ Gateway     │  │
│  │             │  │             │  │ Queue       │  │             │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Features

### 🔐 Authentication Service (Port 8081)
- User registration and login
- JWT token management
- Two-factor authentication (2FA)
- OAuth2 integration (Google)
- Email verification
- Password reset functionality
- Role-based access control

###  Social Feed Service (Port 8082)
- User posts and content sharing
- Follow/unfollow functionality
- Comments and likes
- Content sharing and bookmarking
- Tag-based organization
- Content moderation and reporting
- Real-time feed updates

### 💬 Discussion Service (Port 8083)
- Q&A discussion forums
- Direct messaging system
- Group discussions and management
- AI-powered academic assistance
- Real-time notifications
- Anonymous posting options
- Advanced search functionality

### 📊 Assessment Service (Port 8084)
- Subject and topic management
- Question creation and management
- Daily questions with streak tracking
- Practice problems with recommendations
- Live exams with real-time participation
- Contests and competitions
- Personalized exam creation
- Performance analytics and progress tracking
- Leaderboards and rankings

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Message Queue**: RabbitMQ 3.12
- **Authentication**: JWT + OAuth2
- **Documentation**: OpenAPI 3.0 (Swagger)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus & Grafana
- **Real-time**: WebSocket

### Development Tools
- **Build Tool**: Maven
- **Testing**: JUnit 5, Mockito, TestContainers
- **Code Quality**: SonarQube (optional)
- **API Testing**: Postman Collections

## 🏃‍♂️ Quick Start

### Prerequisites
- Java 17 or higher
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/educonnect.git
cd educonnect
```

### 2. Start with Docker Compose
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f [service-name]
```

### 3. Access the Services
- **Auth Service**: http://localhost:8081
- **Social Feed Service**: http://localhost:8082
- **Discussion Service**: http://localhost:8083
- **Assessment Service**: http://localhost:8084
- **API Gateway**: http://localhost:80
- **RabbitMQ Management**: http://localhost:15672 (user: educonnect, pass: educonnect123)
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

## 📋 API Documentation

Each service provides comprehensive API documentation:

### Swagger UI Endpoints
- Auth Service: http://localhost:8081/swagger-ui.html
- Social Feed: http://localhost:8082/swagger-ui.html
- Discussion: http://localhost:8083/swagger-ui.html
- Assessment: http://localhost:8084/swagger-ui.html

### API Documentation Files
- [Auth Service API](./api.json)
- [Social Feed Service API](./social-feed-service-api.json)
- [Discussion Service API](./discussion-service-api.json)
- [Assessment Service API](./assessment-service-api.json)

### Postman Collections
Each service includes a Postman collection for API testing:
- `auth/auth-api.postman_collection.json`
- `social-feed/social-feed-api.postman_collection.json`
- `discussion/discussion-api.postman_collection.json`
- `assessment/assessment-api.postman_collection.json`

## 🔧 Development Setup

### Running Individual Services

#### 1. Auth Service
```bash
cd auth
./mvnw spring-boot:run
```

#### 2. Social Feed Service
```bash
cd social-feed
./mvnw spring-boot:run
```

#### 3. Discussion Service
```bash
cd discussion
./mvnw spring-boot:run
```

#### 4. Assessment Service
```bash
cd assessment
./mvnw spring-boot:run
```

### Environment Configuration

Create `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educonnect
DB_USERNAME=educonnect
DB_PASSWORD=educonnect123

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=educonnect
RABBITMQ_PASSWORD=educonnect123

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000

# OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🗄️ Database Schema

### Key Tables

#### Users (Auth Service)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT',
    verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Posts (Social Feed Service)
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    author_id INTEGER NOT NULL,
    subject_id INTEGER,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Discussions (Discussion Service)
```sql
CREATE TABLE discussions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    subject_id INTEGER,
    upvotes_count INTEGER DEFAULT 0,
    answers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Live Exams (Assessment Service)
```sql
CREATE TABLE live_exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject_id INTEGER NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    total_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔗 Service Communication

### Message Queue Topics
- `user.created` - User registration events
- `user.updated` - User profile updates
- `post.created` - New post notifications
- `exam.started` - Live exam events
- `message.sent` - Real-time messaging
- `notification.send` - Cross-service notifications

### REST API Calls
Services communicate via REST APIs for:
- User authentication validation
- Profile information sharing
- Subject and topic data
- Cross-service operations

## 🧪 Testing Strategy

Currently implementing a **focused testing approach** starting with the Auth Service.

### 🏗️ CI/CD Testing Pipeline

The project implements testing for critical services:

1. **Auth Service Testing** - Comprehensive unit tests with coverage reports
2. **Other Services** - Will be added as development progresses
3. **Fast Docker builds** - Tests are separated from Docker builds for performance

#### Current Pipeline Flow:
```
Validation → Auth Tests → Build All Services → Deployment
     ↓           ↓              ↓                ↓
   Secrets    Unit Tests    Docker Images    Cloud Deploy
   Check      Coverage      (Auth Tested)    
```

### 🔬 Test Profiles (Auth Service Only)

The Auth Service supports multiple testing environments:

#### Test Profile (`-Dspring.profiles.active=test`)
- **Database**: H2 in-memory database
- **Cache**: Embedded Redis
- **Speed**: Fast execution for unit tests
- **Purpose**: Quick feedback during development

### 🚀 Running Tests Locally

#### Auth Service Unit Tests (Currently Available)
```bash
# Run unit tests for Auth service
cd auth
./mvnw clean test -Dspring.profiles.active=test

# With coverage report
./mvnw clean test jacoco:report

# Run specific test class
./mvnw test -Dtest=AuthServiceTest

# Run specific test method
./mvnw test -Dtest=AuthServiceTest#login_ShouldReturnAuthResponse_WhenValidCredentials
```

#### Other Services (No Tests Yet)
```bash
# Discussion and Assessment services
# Tests will be added in future development phases
cd discussion-service
./mvnw clean package -DskipTests

cd assessment-service  
./mvnw clean package -DskipTests
```

### 📊 Test Coverage & Reports

Auth Service coverage reports are available at:
- Local: `auth/target/site/jacoco/index.html`
- CI/CD: GitHub Actions artifacts

### 🎯 Quality Gates

The CI/CD pipeline enforces quality gates for the Auth Service:

- ✅ **Auth Service unit tests must pass**
- ✅ **Code coverage reporting enabled**
- ✅ **No critical security vulnerabilities**
- ❌ **Deployment blocked if Auth tests fail**

### 🔧 Test Configuration

#### Auth Service Dependencies:
```xml
<!-- Unit Testing -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- H2 Database for Testing -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

### 🐛 Debugging Failed Tests

#### View Auth Service Test Results:
```bash
# View detailed test output
cd auth
./mvnw test -X

# View coverage report
open target/site/jacoco/index.html  # macOS
start target/site/jacoco/index.html # Windows
```

#### View CI/CD Test Results:
1. Go to GitHub Actions tab
2. Click on the failed workflow run  
3. Download `auth-test-results` and `auth-coverage-report` artifacts

### � Future Development

**Planned Testing Additions:**
- Discussion Service unit tests
- Assessment Service unit tests  
- Integration tests for service communication
- End-to-end API testing
- Load testing for all services

**Current Status:**
- ✅ Auth Service: Full unit testing
- 🚧 Discussion Service: Tests pending
- 🚧 Assessment Service: Tests pending

## 📊 Monitoring & Observability

### Health Checks
Each service provides health endpoints:
- `/actuator/health` - Service health
- `/actuator/info` - Service information
- `/actuator/metrics` - Service metrics

### Monitoring Stack
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Spring Boot Actuator**: Service monitoring
- **Custom dashboards**: Service-specific metrics

### Key Metrics
- Response time percentiles
- Error rates
- Active users
- Database connection pool
- Memory and CPU usage

## 🚢 Deployment

### Docker Deployment
```bash
# Build all services
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale social-feed-service=3
```

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n educonnect
```

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Two-factor authentication (2FA)
- OAuth2 integration
- Session management

### Data Protection
- Password hashing with BCrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Rate Limiting
- API rate limiting per endpoint
- User-based rate limiting
- IP-based rate limiting
- Distributed rate limiting with Redis

## 📈 Performance Optimization

### Caching Strategy
- Redis caching for frequently accessed data
- Database query optimization
- Connection pooling
- CDN for static assets

### Database Optimization
- Proper indexing strategy
- Query optimization
- Database partitioning
- Read replicas for scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow Java coding conventions
- Use meaningful variable names
- Add comprehensive comments
- Write unit tests for new features

### Pull Request Process
1. Ensure all tests pass
2. Update documentation if needed
3. Add appropriate labels
4. Request code review

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- PostgreSQL community for the robust database
- Redis team for the fast caching solution
- RabbitMQ team for reliable messaging
- All contributors and testers

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@educonnect.com
- Documentation: [Wiki](https://github.com/yourusername/educonnect/wiki)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Authentication Service
- 🔄 Social Feed Service
- 🔄 Discussion Service
- 🔄 Assessment Service (includes Question Bank)

### Phase 2 (Future)
- Mobile app development
- Advanced AI features
- Video conferencing integration
- Advanced analytics dashboard
- Multi-language support

---

**EduConnect** - Connecting students through technology and education! 🎓✨
