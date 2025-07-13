# EduConnect Assessment Service API Documentation

## Service Overview
- **Base URL**: `http://localhost:8083/api/v1`
- **Package**: `com.learningplatform.assessment`
- **Authentication**: JWT Bearer Token
- **Database Schema**: `assessment`

## Authentication & Authorization

### JWT Token Validation
- Header: `Authorization: Bearer <token>`
- Shared JWT secret across microservices
- Role-based access control

### Authorization Roles
- **ADMIN**: Full access to all endpoints
- **QUESTION_SETTER**: Can manage questions, subjects, topics, contests
- **STUDENT**: Can access exams, submit answers, view results

### Public Endpoints (No Auth Required)
- `/subjects/public`
- `/topics/public/by-subject/{subjectId}`
- `/daily-questions/public`
- `/leaderboard/public`
- `/test/**`
- `/actuator/**`
- `/ws/**`

## API Endpoints

### Questions Management

#### GET `/questions`
Get paginated questions with filters
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20&subjectId={id}&topicId={id}&difficulty=EASY|MEDIUM|HARD|EXPERT&type=MCQ|TRUE_FALSE|FILL_BLANK|NUMERIC|ESSAY&search={term}`
- **Response**: `ApiResponse<Map<String, Object>>`

#### GET `/questions/random`
Get random questions
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT  
- **Query**: `subjectId={id}&difficulty={level}&count=10`
- **Response**: `ApiResponse<List<Question>>`

#### GET `/questions/{questionId}`
Get question by ID
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Response**: `ApiResponse<Question>`

#### POST `/questions`
Create new question
- **Auth**: ADMIN, QUESTION_SETTER
- **Body**:
```json
{
  "text": "string (required)",
  "type": "MCQ|TRUE_FALSE|FILL_BLANK|NUMERIC|ESSAY",
  "subjectId": "number (required)",
  "topicId": "number",
  "difficulty": "EASY|MEDIUM|HARD|EXPERT",
  "options": ["string"],
  "correctAnswer": "string (required)",
  "explanation": "string",
  "points": "number",
  "tags": ["string"],
  "attachments": ["string"]
}
```

#### PUT `/questions/{questionId}`
Update question
- **Auth**: ADMIN, QUESTION_SETTER
- **Body**: Same as create

#### DELETE `/questions/{questionId}`
Delete question
- **Auth**: ADMIN, QUESTION_SETTER

#### POST `/questions/bulk`
Bulk import questions
- **Auth**: ADMIN
- **Body**:
```json
{
  "questions": ["QuestionRequest"],
  "subjectId": "number",
  "topicId": "number"
}
```

### Subjects Management

#### GET `/subjects`
Get paginated subjects
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20&classLevel={level}`
- **Response**: `ApiResponse<PagedResponse<Subject>>`

#### GET `/subjects/public`
Get public subjects
- **Auth**: Public
- **Query**: `classLevel={level}`
- **Response**: `ApiResponse<List<Subject>>`

#### GET `/subjects/{subjectId}`
Get subject by ID
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT

#### POST `/subjects`
Create subject
- **Auth**: ADMIN, QUESTION_SETTER
- **Body**:
```json
{
  "name": "string (required)",
  "description": "string",
  "classLevel": "string",
  "code": "string"
}
```

#### PUT `/subjects/{subjectId}`
Update subject
- **Auth**: ADMIN, QUESTION_SETTER

#### DELETE `/subjects/{subjectId}`
Delete subject
- **Auth**: ADMIN, QUESTION_SETTER

### Topics Management

#### GET `/topics`
Get paginated topics
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20&subjectId={id}`
- **Response**: `ApiResponse<PagedResponse<Topic>>`

#### GET `/topics/public/by-subject/{subjectId}`
Get public topics by subject
- **Auth**: Public
- **Response**: `ApiResponse<List<Topic>>`

#### GET `/topics/{topicId}`
Get topic by ID
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT

#### POST `/topics`
Create topic
- **Auth**: ADMIN, QUESTION_SETTER
- **Body**:
```json
{
  "name": "string (required)",
  "description": "string",
  "subjectId": "number (required)"
}
```

#### PUT `/topics/{topicId}`
Update topic
- **Auth**: ADMIN, QUESTION_SETTER

#### DELETE `/topics/{topicId}`
Delete topic
- **Auth**: ADMIN, QUESTION_SETTER

### Contests Management

#### GET `/contests`
Get paginated contests with filters
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20&status=UPCOMING|ACTIVE|RUNNING|COMPLETED|FINISHED|CANCELLED&type={type}`
- **Response**: `ApiResponse<PagedResponse<Contest>>`

#### GET `/contests/{contestId}`
Get contest details
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Response**: `ApiResponse<Map<String, Object>>`

#### GET `/contests/{contestId}/questions`
Get contest questions (only when active)
- **Auth**: STUDENT
- **Response**: `ApiResponse<List<Question>>`

#### POST `/contests/{contestId}/questions/{questionId}/submit`
Submit contest answer
- **Auth**: STUDENT
- **Body**:
```json
{
  "answer": "string (required)",
  "timeTaken": "number",
  "explanation": "string"
}
```

#### GET `/contests/{contestId}/leaderboard`
Get contest leaderboard
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20`
- **Response**: `ApiResponse<Map<String, Object>>`

#### POST `/contests/{contestId}/join`
Join contest
- **Auth**: STUDENT

#### GET `/contests/{contestId}/results`
Get contest results
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT

#### POST `/contests`
Create contest
- **Auth**: ADMIN, QUESTION_SETTER
- **Body**:
```json
{
  "title": "string (required)",
  "description": "string",
  "startTime": "datetime (required)",
  "endTime": "datetime (required)",
  "duration": "number",
  "maxParticipants": "number",
  "questionIds": ["number"],
  "rules": "string"
}
```

#### PUT `/contests/{contestId}`
Update contest
- **Auth**: ADMIN, QUESTION_SETTER

#### DELETE `/contests/{contestId}`
Delete contest
- **Auth**: ADMIN

#### POST `/contests/{contestId}/start`
Start contest manually
- **Auth**: ADMIN

#### POST `/contests/{contestId}/end`
End contest manually
- **Auth**: ADMIN

### Live Exams Management

#### GET `/live-exams`
Get paginated live exams
- **Auth**: STUDENT, ADMIN, QUESTION_SETTER
- **Query**: `page=0&size=20&status={status}&classLevel={level}&subjectId={id}&upcoming={boolean}`
- **Response**: `ApiResponse<Page<LiveExam>>`

#### GET `/live-exams/{examId}`
Get live exam by ID
- **Auth**: STUDENT, ADMIN, QUESTION_SETTER

#### GET `/live-exams/upcoming`
Get upcoming exams
- **Auth**: STUDENT, ADMIN, QUESTION_SETTER
- **Query**: `page=0&size=20`

#### GET `/live-exams/live`
Get currently live exams
- **Auth**: STUDENT, ADMIN, QUESTION_SETTER
- **Query**: `page=0&size=20`

#### POST `/live-exams/{examId}/join`
Join live exam
- **Auth**: STUDENT
- **Response**: `ApiResponse<Map<String, Object>>`

#### POST `/live-exams/{examId}/register`
Register for exam
- **Auth**: STUDENT

#### POST `/live-exams/{examId}/start`
Start exam session
- **Auth**: STUDENT
- **Response**: `ApiResponse<ExamSessionResponse>`

#### POST `/live-exams/{examId}/submit-answer`
Submit exam answer
- **Auth**: STUDENT
- **Body**:
```json
{
  "sessionId": "string (required)",
  "questionId": "number (required)",
  "answer": "string (required)",
  "timeTaken": "number"
}
```

#### POST `/live-exams/{examId}/finish`
Finish exam
- **Auth**: STUDENT
- **Body**: `ExamFinishRequest`

#### GET `/live-exams/{examId}/results`
Get exam results
- **Auth**: STUDENT

#### GET `/live-exams/{examId}/leaderboard`
Get exam leaderboard
- **Auth**: STUDENT, ADMIN, QUESTION_SETTER
- **Query**: `page=0&size=10`

### Personalized Exams

#### GET `/personalized-exams`
Get user's personalized exams
- **Auth**: STUDENT, ADMIN
- **Query**: `page=0&size=20&status={status}&classLevel={level}&subjectId={id}`
- **Response**: `ApiResponse<Page<PersonalizedExam>>`

#### GET `/personalized-exams/{examId}`
Get personalized exam by ID
- **Auth**: STUDENT, ADMIN

#### POST `/personalized-exams`
Create personalized exam
- **Auth**: STUDENT
- **Body**: `CreatePersonalizedExamRequest`

#### POST `/personalized-exams/{examId}/start`
Start personalized exam
- **Auth**: STUDENT

#### POST `/personalized-exams/{examId}/submit`
Submit personalized exam
- **Auth**: STUDENT
- **Body**: `SubmitExamRequest`

#### GET `/personalized-exams/stats`
Get user's exam statistics
- **Auth**: STUDENT

### Daily Questions

#### GET `/daily-questions`
Get daily questions with filters
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `date={ISO-date}&subjectId={id}&classLevel={level}&difficulty={level}`
- **Response**: `ApiResponse<Map<String, Object>>`

#### GET `/daily-questions/public`
Get public daily questions
- **Auth**: Public
- **Response**: `ApiResponse<List<DailyQuestion>>`

#### POST `/daily-questions/{questionId}/submit`
Submit daily question answer
- **Auth**: STUDENT
- **Body**:
```json
{
  "answer": "string (required)",
  "timeTaken": "number",
  "explanation": "string"
}
```

#### GET `/daily-questions/today`
Get today's daily questions
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `subjectId={id}&classLevel={level}&difficulty={level}`

#### GET `/daily-questions/streak`
Get user's streak information
- **Auth**: STUDENT
- **Query**: `subjectId={id}&period={period}`

#### GET `/daily-questions/stats`
Get user's daily question statistics
- **Auth**: STUDENT
- **Query**: `period={period}&subjectId={id}`

#### GET `/daily-questions/history`
Get user's daily question history
- **Auth**: STUDENT
- **Query**: `page=0&size=20&subjectId={id}&status={boolean}&difficulty={level}`
- **Response**: `ApiResponse<PagedResponse<UserSubmission>>`

### Practice Problems

#### GET `/practice-problems`
Get practice problems with filters
- **Auth**: Optional authentication
- **Query**: `page=0&size=10&subjectId={id}&topicId={id}&difficulty={level}&type={type}&status={status}&search={term}`
- **Response**: `ApiResponse<Map<String, Object>>`

#### GET `/practice-problems/{problemId}`
Get practice problem by ID
- **Auth**: Optional authentication

#### POST `/practice-problems/{problemId}/submit`
Submit solution
- **Auth**: STUDENT
- **Body**: `ProblemSubmissionRequest`

#### GET `/practice-problems/{problemId}/hint`
Get hint for problem
- **Auth**: STUDENT
- **Query**: `hintLevel={level}`

#### POST `/practice-problems/{problemId}/bookmark`
Toggle bookmark for problem
- **Auth**: STUDENT

#### GET `/practice-problems/recommendations`
Get recommended problems
- **Auth**: STUDENT
- **Query**: `count=5&subjectId={id}&difficulty={level}`

### Analytics

#### GET `/analytics/dashboard`
Get user dashboard analytics
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `period={period}&subjectId={id}`

#### GET `/analytics/performance`
Get user performance analytics
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `period={period}&subjectId={id}&type={type}`

#### GET `/analytics/progress`
Get user progress analytics
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `subjectId={id}&period={period}`

#### GET `/analytics/rankings`
Get user rankings
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `type={type}&subjectId={id}&period={period}`

### Leaderboard

#### GET `/leaderboard/global`
Get global leaderboard
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20&period={period}&subjectId={id}`

#### GET `/leaderboard/public`
Get public leaderboard
- **Auth**: Public
- **Query**: `page=0&size=20`

#### GET `/leaderboard/subject/{subjectId}`
Get subject-specific leaderboard
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20&period={period}`

#### GET `/leaderboard/class/{classLevel}`
Get class-specific leaderboard
- **Auth**: ADMIN, QUESTION_SETTER, STUDENT
- **Query**: `page=0&size=20&period={period}&subjectId={id}`

### Admin Operations

#### GET `/admin/analytics`
Get admin analytics
- **Auth**: ADMIN
- **Query**: `period={period}&type={type}`

#### PUT `/admin/daily-questions`
Set daily questions (admin)
- **Auth**: ADMIN
- **Body**: `SetDailyQuestionsRequest`

#### POST `/admin/live-exams`
Create live exam (mock implementation)
- **Auth**: ADMIN

#### POST `/admin/contests`
Create contest (mock implementation)
- **Auth**: ADMIN

## WebSocket Endpoints

### Configuration
- **Endpoint**: `/ws`
- **Message Broker**: Simple in-memory broker
- **Destinations**: `/topic`, `/queue`, `/user`
- **Application Prefix**: `/app`

### STOMP Endpoints
1. `/ws/live-exams` - Live exam real-time updates
2. `/ws/contests` - Contest real-time updates
3. `/ws/leaderboard` - Leaderboard real-time updates

## Data Models

### Question
```json
{
  "id": "number",
  "text": "string",
  "type": "MCQ|TRUE_FALSE|FILL_BLANK|NUMERIC|ESSAY",
  "subjectId": "number",
  "topicId": "number",
  "difficulty": "EASY|MEDIUM|HARD|EXPERT",
  "options": ["string"],
  "correctAnswer": "string",
  "explanation": "string",
  "points": "number",
  "tags": ["string"],
  "attachments": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Contest
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "startTime": "datetime",
  "endTime": "datetime",
  "duration": "number",
  "maxParticipants": "number",
  "currentParticipants": "number",
  "status": "UPCOMING|ACTIVE|RUNNING|COMPLETED|FINISHED|CANCELLED",
  "questions": ["Question"],
  "rules": "string",
  "createdAt": "datetime"
}
```

### Live Exam
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "subjectId": "number",
  "startTime": "datetime",
  "endTime": "datetime",
  "duration": "number",
  "maxParticipants": "number",
  "classLevel": "string",
  "status": "SCHEDULED|ACTIVE|COMPLETED|CANCELLED",
  "questions": ["Question"],
  "instructions": "string"
}
```

### Subject
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "classLevel": "string",
  "code": "string",
  "createdAt": "datetime"
}
```

### Topic
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "subjectId": "number",
  "subject": "Subject",
  "createdAt": "datetime"
}
```

## Response Wrappers

### API Response
```json
{
  "success": "boolean",
  "data": "T",
  "message": "string",
  "error": "string"
}
```

### Paged Response
```json
{
  "content": ["T"],
  "totalElements": "number",
  "totalPages": "number",
  "currentPage": "number",
  "size": "number",
  "first": "boolean",
  "last": "boolean",
  "empty": "boolean"
}
```

## Enums

### Difficulty Levels
- `EASY`
- `MEDIUM`
- `HARD`
- `EXPERT`

### Question Types
- `MCQ` - Multiple Choice Question
- `TRUE_FALSE` - True/False Question
- `FILL_BLANK` - Fill in the Blank
- `NUMERIC` - Numeric Answer
- `ESSAY` - Essay Question

### Contest Status
- `UPCOMING` - Not yet started
- `ACTIVE` - Registration open
- `RUNNING` - Contest in progress
- `COMPLETED` - Contest finished
- `FINISHED` - Results published
- `CANCELLED` - Contest cancelled

### Exam Status
- `SCHEDULED` - Scheduled for future
- `ACTIVE` - Currently active
- `COMPLETED` - Completed
- `CANCELLED` - Cancelled

## Security Features

### CORS Configuration
- **Allowed Origins**: All origins (`*`)
- **Allow Credentials**: true
- **Allowed Methods**: All standard HTTP methods

### Rate Limiting
- Implemented at service layer
- User-based rate limiting for submissions

### Authentication Security
- JWT token validation
- Role-based method security
- Public endpoint access control

## Error Handling

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```