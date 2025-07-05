# EduConnect Project Structure

## Complete Project Architecture

```
educonnect/
├── README.md                              # Main project documentation
├── MICROSERVICES_PLAN.md                  # Detailed implementation plan
├── docker-compose.yml                     # Docker orchestration
├── docker-compose.prod.yml                # Production Docker setup
├── .env                                   # Environment variables
├── .gitignore                             # Git ignore rules
├── LICENSE                                # Project license
│
├── api-docs/                              # API Documentation
│   ├── api.json                          # Auth Service API
│   ├── social-feed-service-api.json      # Social Feed API
│   ├── discussion-service-api.json       # Discussion API
│   └── assessment-service-api.json       # Assessment API (includes Question Bank)
│
├── postman-collections/                   # API Testing Collections
│   ├── auth-api.postman_collection.json
│   ├── social-feed-api.postman_collection.json
│   ├── discussion-api.postman_collection.json
│   └── assessment-api.postman_collection.json
│
├── nginx/                                 # Reverse Proxy Configuration
│   └── nginx.conf
│
├── monitoring/                            # Monitoring Configuration
│   ├── prometheus.yml
│   └── grafana-dashboards/
│
├── k8s/                                   # Kubernetes Manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   └── deployments/
│
├── scripts/                               # Utility Scripts
│   ├── setup.sh
│   ├── build-all.sh
│   └── deploy.sh
│
├── auth/                                  # Authentication Service
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/learningplatform/auth/
│   │   │   │   ├── AuthApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── AppProperties.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── SwaggerConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   └── AdminController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   └── ...
│   │   │   │   ├── entity/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   └── RefreshToken.java
│   │   │   │   ├── exception/
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── CustomExceptions.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   └── RefreshTokenRepository.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   └── UserPrincipal.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   └── EmailService.java
│   │   │   │   └── util/
│   │   │   │       ├── DateUtils.java
│   │   │   │       └── ValidationUtils.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-docker.yml
│   │   │       └── application-prod.yml
│   │   └── test/
│   │       └── java/com/learningplatform/auth/
│   │           ├── AuthApplicationTests.java
│   │           ├── controller/
│   │           ├── service/
│   │           └── integration/
│   └── target/
│
├── question-bank/                         # Question Bank Service
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/learningplatform/questionbank/
│   │   │   │   ├── QuestionBankApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   └── CacheConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── SubjectController.java
│   │   │   │   │   ├── TopicController.java
│   │   │   │   │   ├── QuestionController.java
│   │   │   │   │   └── DailyQuestionController.java
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Subject.java
│   │   │   │   │   ├── Topic.java
│   │   │   │   │   ├── Question.java
│   │   │   │   │   └── DailyQuestion.java
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── util/
│   │   │   └── resources/
│   │   └── test/
│   └── target/
│
├── question-bank/                         # Question Bank Service
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/learningplatform/questionbank/
│   │   │   │   ├── QuestionBankApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   └── CacheConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── SubjectController.java
│   │   │   │   │   ├── TopicController.java
│   │   │   │   │   ├── QuestionController.java
│   │   │   │   │   └── DailyQuestionController.java
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Subject.java
│   │   │   │   │   ├── Topic.java
│   │   │   │   │   ├── Question.java
│   │   │   │   │   └── DailyQuestion.java
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── util/
│   │   │   └── resources/
│   │   └── test/
│   └── target/
│
├── social-feed/                           # Social Feed Service
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/learningplatform/socialfeed/
│   │   │   │   ├── SocialFeedApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   ├── WebSocketConfig.java
│   │   │   │   │   └── RabbitConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── PostController.java
│   │   │   │   │   ├── CommentController.java
│   │   │   │   │   ├── FollowController.java
│   │   │   │   │   ├── BookmarkController.java
│   │   │   │   │   └── TagController.java
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Post.java
│   │   │   │   │   ├── Comment.java
│   │   │   │   │   ├── Follow.java
│   │   │   │   │   ├── Bookmark.java
│   │   │   │   │   └── Tag.java
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   │   ├── PostService.java
│   │   │   │   │   ├── CommentService.java
│   │   │   │   │   ├── FollowService.java
│   │   │   │   │   ├── BookmarkService.java
│   │   │   │   │   └── FeedService.java
│   │   │   │   └── websocket/
│   │   │   │       └── FeedWebSocketHandler.java
│   │   │   └── resources/
│   │   └── test/
│   └── target/
│
├── discussion/                            # Discussion Service
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/learningplatform/discussion/
│   │   │   │   ├── DiscussionApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   ├── WebSocketConfig.java
│   │   │   │   │   └── RabbitConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── DiscussionController.java
│   │   │   │   │   ├── AnswerController.java
│   │   │   │   │   ├── GroupController.java
│   │   │   │   │   ├── MessageController.java
│   │   │   │   │   ├── AIController.java
│   │   │   │   │   └── SearchController.java
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Discussion.java
│   │   │   │   │   ├── Answer.java
│   │   │   │   │   ├── Group.java
│   │   │   │   │   ├── Message.java
│   │   │   │   │   └── AIQuery.java
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   │   ├── DiscussionService.java
│   │   │   │   │   ├── AnswerService.java
│   │   │   │   │   ├── GroupService.java
│   │   │   │   │   ├── MessageService.java
│   │   │   │   │   ├── AIService.java
│   │   │   │   │   └── NotificationService.java
│   │   │   │   └── websocket/
│   │   │   │       ├── MessageWebSocketHandler.java
│   │   │   │       └── NotificationWebSocketHandler.java
│   │   │   └── resources/
│   │   └── test/
│   └── target/
│
├── assessment/                            # Assessment Service (includes Question Bank)
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/learningplatform/assessment/
│   │   │   │   ├── AssessmentApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   ├── WebSocketConfig.java
│   │   │   │   │   ├── RabbitConfig.java
│   │   │   │   │   └── SchedulingConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── SubjectController.java
│   │   │   │   │   ├── TopicController.java
│   │   │   │   │   ├── QuestionController.java
│   │   │   │   │   ├── DailyQuestionController.java
│   │   │   │   │   ├── PracticeProblemController.java
│   │   │   │   │   ├── LiveExamController.java
│   │   │   │   │   ├── ContestController.java
│   │   │   │   │   ├── PersonalizedExamController.java
│   │   │   │   │   ├── AnalyticsController.java
│   │   │   │   │   └── LeaderboardController.java
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Subject.java
│   │   │   │   │   ├── Topic.java
│   │   │   │   │   ├── Question.java
│   │   │   │   │   ├── DailyQuestion.java
│   │   │   │   │   ├── PracticeProblem.java
│   │   │   │   │   ├── LiveExam.java
│   │   │   │   │   ├── Contest.java
│   │   │   │   │   ├── ExamResult.java
│   │   │   │   │   ├── Streak.java
│   │   │   │   │   └── Analytics.java
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   │   ├── SubjectService.java
│   │   │   │   │   ├── TopicService.java
│   │   │   │   │   ├── QuestionService.java
│   │   │   │   │   ├── DailyQuestionService.java
│   │   │   │   │   ├── PracticeProblemService.java
│   │   │   │   │   ├── LiveExamService.java
│   │   │   │   │   ├── ContestService.java
│   │   │   │   │   ├── AnalyticsService.java
│   │   │   │   │   ├── LeaderboardService.java
│   │   │   │   │   └── RecommendationService.java
│   │   │   │   ├── scheduler/
│   │   │   │   │   ├── DailyQuestionScheduler.java
│   │   │   │   │   └── StreakScheduler.java
│   │   │   │   └── websocket/
│   │   │   │       ├── ExamWebSocketHandler.java
│   │   │   │       └── LeaderboardWebSocketHandler.java
│   │   │   └── resources/
│   │   └── test/
│   └── target/
│
├── shared/                                # Shared Libraries
│   ├── common/
│   │   ├── pom.xml
│   │   └── src/main/java/com/learningplatform/common/
│   │       ├── dto/
│   │       │   ├── ApiResponse.java
│   │       │   ├── PagedResponse.java
│   │       │   └── ErrorResponse.java
│   │       ├── exception/
│   │       │   ├── BaseException.java
│   │       │   └── ExceptionHandler.java
│   │       ├── security/
│   │       │   ├── JwtUtils.java
│   │       │   └── SecurityUtils.java
│   │       └── util/
│   │           ├── DateUtils.java
│   │           └── ValidationUtils.java
│   └── messaging/
│       ├── pom.xml
│       └── src/main/java/com/learningplatform/messaging/
│           ├── config/
│           │   └── RabbitConfig.java
│           ├── publisher/
│           │   └── EventPublisher.java
│           └── listener/
│               └── EventListener.java
│
└── docs/                                  # Documentation
    ├── architecture/
    │   ├── system-architecture.md
    │   ├── database-design.md
    │   └── api-design.md
    ├── deployment/
    │   ├── docker-deployment.md
    │   ├── kubernetes-deployment.md
    │   └── production-setup.md
    ├── development/
    │   ├── development-setup.md
    │   ├── coding-standards.md
    │   └── testing-guide.md
    └── user-guide/
        ├── getting-started.md
        ├── api-usage.md
        └── troubleshooting.md
```

## Service Port Mapping

| Service | Port | Purpose |
|---------|------|---------|
| Auth Service | 8081 | Authentication & User Management |
| Social Feed Service | 8082 | Social Features & Content |
| Discussion Service | 8083 | Q&A & Messaging |
| Assessment Service | 8084 | Subjects, Questions, Exams & Analytics |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & Session Store |
| RabbitMQ | 5672 | Message Queue |
| RabbitMQ Management | 15672 | Queue Management UI |
| Nginx | 80/443 | API Gateway |
| Prometheus | 9090 | Metrics Collection |
| Grafana | 3000 | Monitoring Dashboard |

## Database Schema Distribution

### Auth Service Database
- users
- roles
- refresh_tokens
- password_reset_tokens
- email_verification_tokens
- user_profiles
- oauth2_authorizations

### Question Bank Service Database
- subjects
- topics
- questions
- question_options
- question_tags
- difficulty_levels
- question_categories

### Social Feed Service Database
- posts
- comments
- follows
- bookmarks
- tags
- post_tags
- post_likes
- comment_likes
- reports

### Discussion Service Database
- discussions
- answers
- groups
- group_members
- messages
- conversations
- notifications
- ai_queries
- discussion_votes
- answer_votes

### Assessment Service Database
- subjects
- topics
- questions
- question_options
- question_tags
- daily_questions
- practice_problems
- live_exams
- contests
- exam_results
- contest_submissions
- user_streaks
- analytics_data
- leaderboards
- personalized_exams

## Key Configuration Files

### Application Configuration
- `application.yml` - Main configuration
- `application-docker.yml` - Docker environment
- `application-prod.yml` - Production environment

### Infrastructure Configuration
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment
- `nginx.conf` - Reverse proxy configuration
- `prometheus.yml` - Monitoring configuration

### Build Configuration
- `pom.xml` - Maven dependencies
- `Dockerfile` - Container build instructions
- `.env` - Environment variables
- `.gitignore` - Git ignore rules

This structure provides a comprehensive, scalable, and maintainable architecture for the complete EduConnect educational platform.
