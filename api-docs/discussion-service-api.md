# EduConnect Discussion Service API Documentation

## Service Overview
- **Base URL**: `http://localhost:8082/api/v1`
- **Package**: `com.educonnect.discussion`
- **Authentication**: JWT Bearer Token
- **Database Schema**: `discussion`

## Authentication & Authorization

### JWT Token Validation
- Header: `Authorization: Bearer <token>`
- Role Required: `STUDENT` for most endpoints
- Public endpoints don't require authentication

### User Auto-Creation
Users are automatically created from JWT token data via `UserSyncService` if they don't exist.

## API Endpoints

### Discussion Management

#### GET `/discussions`
Get paginated discussions
- **Auth**: Public (optional user context)
- **Query**: `page=0&size=10&subjectId={id}&topicId={id}&search={term}&sortBy=createdAt&sortDir=desc`
- **Response**: `PagedResponse<DiscussionResponse>`

#### GET `/discussions/{discussionId}`
Get discussion by ID
- **Auth**: Public (optional user context)
- **Response**: `DiscussionResponse`

#### POST `/discussions`
Create new discussion
- **Auth**: STUDENT
- **Body**:
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "subjectId": "number",
  "topicId": "number",
  "tags": ["string"],
  "attachments": ["string"]
}
```

#### PUT `/discussions/{discussionId}`
Update discussion
- **Auth**: STUDENT (owner only)
- **Body**: Same as create

#### DELETE `/discussions/{discussionId}`
Delete discussion
- **Auth**: STUDENT (owner only)

#### POST `/discussions/{discussionId}/vote`
Vote on discussion
- **Auth**: STUDENT
- **Body**:
```json
{
  "type": "UPVOTE|DOWNVOTE"
}
```

#### DELETE `/discussions/{discussionId}/vote`
Remove vote from discussion
- **Auth**: STUDENT

#### POST `/discussions/{discussionId}/bookmark`
Toggle bookmark for discussion
- **Auth**: STUDENT
- **Response**: `boolean` (bookmark status)

### Answer Management

#### GET `/discussions/{discussionId}/answers`
Get answers for discussion
- **Auth**: Public (optional user context)
- **Query**: `page=0&size=10&sortBy=createdAt&sortDir=desc`
- **Response**: `PagedResponse<AnswerResponse>`

#### POST `/discussions/{discussionId}/answers`
Create answer for discussion
- **Auth**: STUDENT
- **Body**:
```json
{
  "content": "string (required)",
  "attachments": ["string"]
}
```

#### PUT `/answers/{answerId}`
Update answer
- **Auth**: STUDENT (owner only)
- **Body**:
```json
{
  "content": "string (required)",
  "attachments": ["string"]
}
```

#### DELETE `/answers/{answerId}`
Delete answer
- **Auth**: STUDENT (owner only)

#### POST `/answers/{answerId}/vote`
Vote on answer
- **Auth**: STUDENT
- **Body**:
```json
{
  "type": "UPVOTE|DOWNVOTE"
}
```

#### POST `/answers/{answerId}/accept`
Accept answer (discussion owner only)
- **Auth**: STUDENT (discussion owner)

### Group Management

#### GET `/groups`
Get paginated groups
- **Auth**: Public (optional user context)
- **Query**: `page=0&size=10&name={name}&description={desc}&isPublic={boolean}&sortBy=createdAt`
- **Response**: `PagedResponse<GroupResponse>`

#### GET `/groups/{groupId}`
Get group by ID
- **Auth**: Public (optional user context)
- **Response**: `GroupResponse`

#### POST `/groups`
Create new group
- **Auth**: STUDENT
- **Body**:
```json
{
  "name": "string (required)",
  "description": "string",
  "isPublic": "boolean (default: true)",
  "maxMembers": "number",
  "tags": ["string"]
}
```

#### PUT `/groups/{groupId}`
Update group
- **Auth**: STUDENT (admin only)
- **Body**: Same as create

#### DELETE `/groups/{groupId}`
Delete group
- **Auth**: STUDENT (admin only)

#### POST `/groups/{groupId}/join`
Join group
- **Auth**: STUDENT
- **Response**: `boolean` (success status)

#### POST `/groups/{groupId}/leave`
Leave group
- **Auth**: STUDENT
- **Response**: `boolean` (success status)

#### GET `/groups/{groupId}/members`
Get group members
- **Auth**: STUDENT (member only)
- **Query**: `page=0&size=10`
- **Response**: `PagedResponse<UserResponse>`

#### GET `/groups/{groupId}/discussions`
Get group discussions
- **Auth**: STUDENT (member only)
- **Query**: `page=0&size=10&sortBy=createdAt&sortDir=desc`
- **Response**: `PagedResponse<DiscussionResponse>`

#### POST `/groups/{groupId}/discussions`
Create group discussion
- **Auth**: STUDENT (member only)
- **Body**:
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "tags": ["string"],
  "attachments": ["string"]
}
```

### Messaging System

#### GET `/messages/conversations`
Get user's conversations
- **Auth**: STUDENT
- **Query**: `page=0&size=10`
- **Response**: `PagedResponse<ConversationResponse>`

#### GET `/messages/conversations/{conversationId}`
Get conversation messages
- **Auth**: STUDENT (participant only)
- **Query**: `page=0&size=20&before={messageId}`
- **Response**: `PagedResponse<MessageResponse>`

#### POST `/messages/conversations/{conversationId}/messages`
Send message
- **Auth**: STUDENT (participant only)
- **Body**:
```json
{
  "content": "string (required)",
  "attachments": ["string"]
}
```

#### POST `/messages/conversations`
Start new conversation
- **Auth**: STUDENT
- **Body**:
```json
{
  "recipientId": "number (required)",
  "content": "string (required)",
  "attachments": ["string"]
}
```

#### PUT `/messages/{messageId}/read`
Mark message as read
- **Auth**: STUDENT (recipient only)

#### DELETE `/messages/{messageId}`
Delete message
- **Auth**: STUDENT (sender only)

### Notifications

#### GET `/notifications`
Get user notifications
- **Auth**: STUDENT
- **Query**: `page=0&size=10&unreadOnly={boolean}&type={type}`
- **Response**: `PagedResponse<NotificationResponse>`

#### PUT `/notifications/{notificationId}/read`
Mark notification as read
- **Auth**: STUDENT (owner only)

#### PUT `/notifications/mark-all-read`
Mark all notifications as read
- **Auth**: STUDENT

#### DELETE `/notifications/{notificationId}`
Delete notification
- **Auth**: STUDENT (owner only)

### Search Functionality

#### GET `/search/discussions`
Search discussions
- **Auth**: Public (optional user context)
- **Query**: `query={term}&subjectId={id}&topicId={id}&page=0&size=10`
- **Response**: `PagedResponse<DiscussionResponse>`

#### GET `/search/groups`
Search groups
- **Auth**: Public (optional user context)
- **Query**: `query={term}&isPublic={boolean}&page=0&size=10`
- **Response**: `PagedResponse<GroupResponse>`

#### GET `/search/users`
Search users
- **Auth**: STUDENT
- **Query**: `query={term}&page=0&size=10`
- **Response**: `PagedResponse<UserResponse>`

### AI Integration (Gemini)

#### POST `/ai/query`
Submit AI query
- **Auth**: STUDENT
- **Body**:
```json
{
  "question": "string (required)",
  "context": "string",
  "subject": "string"
}
```
- **Response**:
```json
{
  "answer": "string",
  "sources": ["string"],
  "confidence": "number"
}
```

#### GET `/ai/history`
Get AI query history
- **Auth**: STUDENT
- **Query**: `page=0&size=10&search={term}`
- **Response**: `PagedResponse<AiQueryResponse>`

## WebSocket Endpoints

### Configuration
- **Endpoint**: `/ws`
- **Message Destinations**: `/topic`, `/user`, `/app`
- **Client Library**: SockJS + STOMP

### Real-Time Features

#### Messaging
- **Subscribe**: `/user/queue/messages`
- **Send**: `/app/chat.sendMessage`
- **Typing**: `/app/chat.typing`

#### Group Activities
- **Subscribe**: `/topic/groups/{groupId}`
- **Events**: Member join/leave, new discussions

#### Live Voting
- **Subscribe**: `/topic/discussions/{discussionId}/votes`
- **Events**: Vote updates, score changes

## Data Models

### Discussion Response
```json
{
  "id": "number",
  "title": "string",
  "content": "string",
  "author": "UserResponse",
  "subjectId": "number",
  "topicId": "number",
  "tags": ["string"],
  "attachments": ["string"],
  "upvotes": "number",
  "downvotes": "number",
  "answerCount": "number",
  "hasAcceptedAnswer": "boolean",
  "isBookmarked": "boolean",
  "userVote": "UPVOTE|DOWNVOTE|null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Answer Response
```json
{
  "id": "number",
  "content": "string",
  "author": "UserResponse",
  "discussionId": "number",
  "attachments": ["string"],
  "upvotes": "number",
  "downvotes": "number",
  "isAccepted": "boolean",
  "userVote": "UPVOTE|DOWNVOTE|null",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Group Response
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "admin": "UserResponse",
  "isPublic": "boolean",
  "memberCount": "number",
  "maxMembers": "number",
  "tags": ["string"],
  "isMember": "boolean",
  "createdAt": "datetime"
}
```

### User Response
```json
{
  "id": "number",
  "username": "string",
  "email": "string",
  "fullName": "string",
  "bio": "string",
  "avatarUrl": "string",
  "role": "string"
}
```

### Message Response
```json
{
  "id": "number",
  "content": "string",
  "sender": "UserResponse",
  "recipient": "UserResponse",
  "conversationId": "number",
  "attachments": ["string"],
  "isRead": "boolean",
  "createdAt": "datetime"
}
```

### Notification Response
```json
{
  "id": "number",
  "type": "NEW_ANSWER|VOTE|MENTION|GROUP_INVITE|MESSAGE",
  "title": "string",
  "message": "string",
  "relatedId": "number",
  "relatedType": "DISCUSSION|ANSWER|GROUP|MESSAGE",
  "isRead": "boolean",
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

## Security Features

### CORS Configuration
- **Allowed Origins**: `*` (development)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allow Credentials**: true

### Rate Limiting
- Implemented at service layer
- Default limits per user/endpoint

### Content Validation
- XSS protection via input sanitization
- File upload validation
- Content length limits

## Error Handling

### Common Errors
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details"
}
```