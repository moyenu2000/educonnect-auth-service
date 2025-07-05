# EduConnect Microservices Development Plan

## Project Overview
EduConnect is a comprehensive educational platform with 4 microservices working together to provide a complete learning experience for students.

## Architecture Overview

### Microservices Structure
```
EduConnect Platform
├── Auth Service (Port 8081) - ✅ IMPLEMENTED
├── Social Feed Service (Port 8082) - 🔄 TO IMPLEMENT
├── Discussion Service (Port 8083) - 🔄 TO IMPLEMENT
└── Assessment Service (Port 8084) - 🔄 TO IMPLEMENT
```

### Technology Stack
- **Backend**: Java Spring Boot
- **Database**: PostgreSQL (or MySQL)
- **Message Queue**: RabbitMQ (for service communication)
- **Cache**: Redis
- **File Storage**: AWS S3 or local storage
- **WebSocket**: For real-time features
- **Documentation**: Swagger/OpenAPI

## Service Responsibilities

### 1. Social Feed Service (Port 8082)
**Purpose**: Handle social interactions, posts, follows, and user engagement

**Key Features**:
- User posts and content sharing
- Follow/unfollow functionality
- Comments and likes
- Content sharing and bookmarking
- Tag-based organization
- Content moderation and reporting
- Admin content management

**Core Entities**:
- Posts, Comments, Follows, Bookmarks, Tags, Reports

### 2. Discussion Service (Port 8083)
**Purpose**: Facilitate academic discussions, Q&A, messaging, and group interactions

**Key Features**:
- Q&A discussion forums
- Direct messaging system
- Group discussions and management
- AI-powered academic assistance
- Real-time notifications
- Search functionality
- Anonymous posting options

**Core Entities**:
- Discussions, Answers, Groups, Messages, Conversations, AI Queries

### 3. Assessment Service (Port 8084)
**Purpose**: Manage all types of assessments, questions, subjects, tracking, and analytics

**Key Features**:
- Subject and topic management
- Question creation and management
- Daily questions with streak tracking
- Practice problems with recommendations
- Live exams with real-time participation
- Contests and competitions
- Personalized exam creation
- Performance analytics and progress tracking
- Leaderboards and rankings
- Admin question and exam management

**Core Entities**:
- Subjects, Topics, Questions, Daily Questions, Practice Problems, Live Exams, Contests, Results, Analytics

## Implementation Plan

### Phase 1: Core Infrastructure Setup (Week 1-2)

#### For Each Service:
1. **Project Structure Setup**
   ```
   service-name/
   ├── src/
   │   ├── main/
   │   │   ├── java/com/learningplatform/servicename/
   │   │   │   ├── ServiceNameApplication.java
   │   │   │   ├── config/
   │   │   │   ├── controller/
   │   │   │   ├── dto/
   │   │   │   ├── entity/
   │   │   │   ├── repository/
   │   │   │   ├── service/
   │   │   │   └── util/
   │   │   └── resources/
   │   │       ├── application.yml
   │   │       └── application-local.yml
   │   └── test/
   ├── Dockerfile
   ├── pom.xml
   └── README.md
   ```

2. **Dependencies to Add** (pom.xml):
   ```xml
   <dependencies>
       <!-- Spring Boot Starters -->
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-web</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-data-jpa</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-security</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-validation</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-websocket</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-amqp</artifactId>
       </dependency>
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-data-redis</artifactId>
       </dependency>
       
       <!-- Database -->
       <dependency>
           <groupId>org.postgresql</groupId>
           <artifactId>postgresql</artifactId>
       </dependency>
       
       <!-- JWT -->
       <dependency>
           <groupId>io.jsonwebtoken</groupId>
           <artifactId>jjwt-api</artifactId>
           <version>0.11.5</version>
       </dependency>
       <dependency>
           <groupId>io.jsonwebtoken</groupId>
           <artifactId>jjwt-impl</artifactId>
           <version>0.11.5</version>
       </dependency>
       <dependency>
           <groupId>io.jsonwebtoken</groupId>
           <artifactId>jjwt-jackson</artifactId>
           <version>0.11.5</version>
       </dependency>
       
       <!-- Swagger -->
       <dependency>
           <groupId>org.springdoc</groupId>
           <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
           <version>2.2.0</version>
       </dependency>
       
       <!-- Other utilities -->
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-test</artifactId>
           <scope>test</scope>
       </dependency>
   </dependencies>
   ```

### Phase 2: Service Implementation Priority

#### Priority 1: Social Feed Service (Week 3-4)
- **Reason**: Foundation for user engagement and content sharing
- **Implementation Order**:
  1. User posts and content management
  2. Follow/unfollow system
  3. Comments and likes
  4. Content sharing and bookmarking
  5. Admin moderation features

#### Priority 2: Discussion Service (Week 5-6)
- **Reason**: Core educational feature for Q&A and messaging
- **Implementation Order**:
  1. Discussion forums and Q&A
  2. Direct messaging system
  3. Group management
  4. Real-time notifications
  5. AI integration

#### Priority 3: Assessment Service (Week 7-8)
- **Reason**: Complex analytics and real-time exam features
- **Implementation Order**:
  1. Daily questions and streak tracking
  2. Practice problems
  3. Live exams system
  4. Contest management
  5. Analytics and leaderboards

### Phase 3: Integration & Testing (Week 9-10)

#### Service Communication Setup
1. **RabbitMQ Message Queues**:
   - User events (registration, profile updates)
   - Notification events
   - Analytics events
   - Real-time updates

2. **Service-to-Service Communication**:
   - Auth service validation
   - User profile sharing
   - Subject/topic data sharing
   - Cross-service notifications

#### Integration Points
```
Auth Service → All Services (User validation)
Assessment Service → Social Feed Service (Achievement sharing)
Assessment Service → Discussion Service (AI assistance & subject data)
Social Feed → Discussion Service (Cross-posting)
Discussion → Assessment Service (Study group analytics)
```

### Phase 4: Advanced Features (Week 11-12)

#### Real-time Features
1. **WebSocket Implementation**:
   - Live exam updates
   - Real-time messaging
   - Live leaderboards
   - Instant notifications

2. **Advanced Analytics**:
   - Performance tracking
   - Learning path recommendations
   - Adaptive question difficulty
   - Personalized content

## Database Schema Design

### Social Feed Service Tables
```sql
-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    author_id INTEGER NOT NULL,
    subject_id INTEGER,
    topic_id INTEGER,
    is_anonymous BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments, Follows, Bookmarks, Tags tables...
```

### Discussion Service Tables
```sql
-- Discussions table
CREATE TABLE discussions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    author_id INTEGER NOT NULL,
    subject_id INTEGER,
    topic_id INTEGER,
    is_anonymous BOOLEAN DEFAULT false,
    upvotes_count INTEGER DEFAULT 0,
    downvotes_count INTEGER DEFAULT 0,
    answers_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    has_accepted_answer BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Answers, Groups, Messages tables...
```

### Assessment Service Tables
```sql
-- Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    class_level VARCHAR(20) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    topic_id INTEGER REFERENCES topics(id),
    difficulty VARCHAR(20) NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Live Exams table
CREATE TABLE live_exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    class_level VARCHAR(20) NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    instructions TEXT,
    passing_score INTEGER,
    total_participants INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Questions, Practice Problems, Contests tables...
```

## Deployment Strategy

### Docker Configuration
Each service will have its own Dockerfile and docker-compose configuration:

```dockerfile
# Dockerfile for each service
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 808X

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose Setup
```yaml
version: '3.8'
services:
  # Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: educonnect
      POSTGRES_USER: educonnect
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3.12-management
    ports:
      - "5672:5672"
      - "15672:15672"

  # Services
  auth-service:
    build: ./auth
    ports:
      - "8081:8081"
    depends_on:
      - postgres
      - redis
      - rabbitmq

  social-feed-service:
    build: ./social-feed
    ports:
      - "8082:8082"
    depends_on:
      - postgres
      - redis
      - rabbitmq

  discussion-service:
    build: ./discussion
    ports:
      - "8083:8083"
    depends_on:
      - postgres
      - redis
      - rabbitmq

  assessment-service:
    build: ./assessment
    ports:
      - "8084:8084"
    depends_on:
      - postgres
      - redis
      - rabbitmq

  # ... other services
```

## Security Considerations

### JWT Token Validation
All services will validate JWT tokens from the auth service:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }
}
```

## API Documentation

Each service will have comprehensive API documentation:
- Swagger UI at `http://localhost:808X/swagger-ui.html`
- OpenAPI JSON at `http://localhost:808X/v3/api-docs`
- Postman collections for testing

## Testing Strategy

### Unit Testing
- JUnit 5 for unit tests
- Mockito for mocking
- TestContainers for integration testing

### Integration Testing
- Test service-to-service communication
- Test message queue interactions
- Test real-time features

### Load Testing
- JMeter for load testing
- Test live exam scenarios
- Test concurrent user handling

## Monitoring & Observability

### Health Checks
```java
@RestController
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "social-feed-service");
        return ResponseEntity.ok(status);
    }
}
```

### Metrics
- Spring Boot Actuator
- Micrometer for metrics
- Prometheus for monitoring
- Grafana for visualization

## Development Timeline

| Week | Task | Deliverable |
|------|------|-------------|
| 1-2 | Infrastructure Setup | Project structure, dependencies |
| 3-4 | Social Feed Service | Posts, follows, comments |
| 5-6 | Discussion Service | Q&A, messaging, groups |
| 7-8 | Assessment Service | Exams, contests, analytics |
| 9-10 | Integration & Testing | Service communication |
| 11-12 | Advanced Features | Real-time, analytics |

## Success Metrics

### Technical Metrics
- API response time < 200ms
- 99.9% uptime
- Support for 10,000+ concurrent users
- Real-time message delivery < 100ms

### Business Metrics
- User engagement rates
- Daily active users
- Question completion rates
- Exam participation rates

## Next Steps

1. **Create Service Skeletons**: Set up basic Spring Boot projects for each service
2. **Database Design**: Create detailed database schemas
3. **API Implementation**: Implement RESTful APIs following the documentation
4. **Service Integration**: Set up inter-service communication
5. **Testing**: Comprehensive testing strategy
6. **Deployment**: Containerization and orchestration
7. **Documentation**: Complete API documentation and user guides

This plan provides a comprehensive roadmap for implementing the remaining three microservices to complete the EduConnect platform.
