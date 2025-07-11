#!/bin/bash

# Discussion Service API Testing Script
# Base URL for discussion service
BASE_URL="http://localhost:8082/api/v1"

# JWT Token (you'll need to get this from auth service first)
JWT_TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiU1RVREVOVCIsInVzZXJJZCI6MiwiZW1haWwiOiJtb3llbnVkZGluMDc1QGdtYWlsLmNvbSIsInN1YiI6Im1veWVuIiwiaWF0IjoxNzUyMDg1MjcyLCJleHAiOjE3NTIxNzE2NzJ9.PYCZMPLSShFDnCtp3Uv0cmhQOKESCKqKzbnzHi-er5j8wF5mf1DX5XXoSEh0JMqHa12mOophEoiMDCcGsnqMlg"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make API calls
make_api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "Method: $method"
    echo "Endpoint: $BASE_URL$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Authorization: Bearer $JWT_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success ($http_code)${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}✗ Failed ($http_code)${NC}"
        echo "Response: $body"
    fi
    
    echo "================================================="
    echo ""
}

# Function to make public API calls (no auth needed)
make_public_api_call() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "Method: $method"
    echo "Endpoint: $BASE_URL$endpoint"
    
    response=$(curl -s -w "\n%{http_code}" -X $method \
        -H "Content-Type: application/json" \
        "$BASE_URL$endpoint")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success ($http_code)${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}✗ Failed ($http_code)${NC}"
        echo "Response: $body"
    fi
    
    echo "================================================="
    echo ""
}

echo "=== Discussion Service API Testing ==="
echo "Make sure the discussion service is running on port 8082"
echo "Update JWT_TOKEN variable with a valid token from auth service"
echo ""

# Check if JWT token is set
if [ "$JWT_TOKEN" = "YOUR_JWT_TOKEN_HERE" ]; then
    echo -e "${RED}Warning: Please update JWT_TOKEN with a valid token from auth service${NC}"
    echo "To get a token, first login through auth service at http://localhost:8081/api/v1/auth/login"
    echo ""
fi

# ======================
# DISCUSSION ENDPOINTS
# ======================

echo "=== DISCUSSION ENDPOINTS ==="

# 1. Get all discussions (public)
make_public_api_call "GET" "/discussions/public?page=0&size=10" "Get all discussions (public)"

# 2. Get discussions (authenticated)
make_api_call "GET" "/discussions?page=0&size=10" "" "Get discussions (authenticated)"

# 3. Get discussions with filters
make_api_call "GET" "/discussions?page=0&size=10&type=QUESTION&sortBy=NEWEST" "" "Get discussions with filters"

# 4. Create discussion
discussion_data='{
    "title": "Test Discussion",
    "content": "This is a test discussion content",
    "type": "QUESTION",
    "subjectId": 1,
    "topicId": 1,
    "classLevel": "INTERMEDIATE",
    "tags": ["test", "api"],
    "isAnonymous": false
}'
make_api_call "POST" "/discussions" "$discussion_data" "Create discussion"

# 5. Get specific discussion (public)
make_public_api_call "GET" "/discussions/1/public" "Get specific discussion (public)"

# 6. Get specific discussion (authenticated)
make_api_call "GET" "/discussions/1" "" "Get specific discussion (authenticated)"

# 7. Update discussion
update_discussion_data='{
    "title": "Updated Test Discussion",
    "content": "This is updated content",
    "type": "QUESTION",
    "subjectId": 1,
    "topicId": 1,
    "classLevel": "INTERMEDIATE",
    "tags": ["updated", "test"],
    "isAnonymous": false
}'
make_api_call "PUT" "/discussions/1" "$update_discussion_data" "Update discussion"

# 8. Upvote discussion
make_api_call "POST" "/discussions/1/upvote" "" "Upvote discussion"

# 9. Downvote discussion
make_api_call "POST" "/discussions/1/downvote" "" "Downvote discussion"

# 10. Bookmark discussion
make_api_call "POST" "/discussions/1/bookmark" "" "Bookmark discussion"

# 11. Delete discussion
make_api_call "DELETE" "/discussions/1" "" "Delete discussion"

# ======================
# ANSWER ENDPOINTS
# ======================

echo "=== ANSWER ENDPOINTS ==="

# 1. Get answers for discussion
make_api_call "GET" "/api/v1/discussions/1/answers?page=0&size=10" "" "Get answers for discussion"

# 2. Create answer
answer_data='{
    "content": "This is a test answer",
    "attachments": ["file1.pdf"],
    "isAnonymous": false
}'
make_api_call "POST" "/api/v1/discussions/1/answers" "$answer_data" "Create answer"

# 3. Update answer
update_answer_data='{
    "content": "This is an updated answer",
    "attachments": ["file2.pdf"],
    "isAnonymous": false
}'
make_api_call "PUT" "/api/v1/answers/1" "$update_answer_data" "Update answer"

# 4. Upvote answer
make_api_call "POST" "/api/v1/answers/1/upvote" "" "Upvote answer"

# 5. Downvote answer
make_api_call "POST" "/api/v1/answers/1/downvote" "" "Downvote answer"

# 6. Accept answer
make_api_call "POST" "/api/v1/answers/1/accept" "" "Accept answer"

# 7. Delete answer
make_api_call "DELETE" "/api/v1/answers/1" "" "Delete answer"

# ======================
# GROUP ENDPOINTS
# ======================

echo "=== GROUP ENDPOINTS ==="

# 1. Get all groups
make_api_call "GET" "/groups?page=0&size=10" "" "Get all groups"

# 2. Get groups with filters
make_api_call "GET" "/groups?page=0&size=10&type=STUDY&joined=false" "" "Get groups with filters"

# 3. Create group
group_data='{
    "name": "Test Study Group",
    "description": "This is a test study group",
    "type": "STUDY",
    "subjectId": 1,
    "classLevel": "INTERMEDIATE",
    "isPrivate": false,
    "rules": "Be respectful and helpful"
}'
make_api_call "POST" "/groups" "$group_data" "Create group"

# 4. Get specific group
make_api_call "GET" "/groups/1" "" "Get specific group"

# 5. Update group
update_group_data='{
    "name": "Updated Study Group",
    "description": "Updated description",
    "type": "STUDY",
    "subjectId": 1,
    "classLevel": "INTERMEDIATE",
    "isPrivate": false,
    "rules": "Updated rules"
}'
make_api_call "PUT" "/groups/1" "$update_group_data" "Update group"

# 6. Join group
make_api_call "POST" "/groups/1/join" "" "Join group"

# 7. Get group members
make_api_call "GET" "/groups/1/members?page=0&size=10" "" "Get group members"

# 8. Change member role
role_data='{"role": "MODERATOR"}'
make_api_call "PUT" "/groups/1/members/2/role" "$role_data" "Change member role"

# 9. Remove group member
make_api_call "DELETE" "/groups/1/members/2" "" "Remove group member"

# 10. Get group discussions
make_api_call "GET" "/groups/1/discussions?page=0&size=10" "" "Get group discussions"

# 11. Create group discussion
group_discussion_data='{
    "title": "Group Discussion",
    "content": "This is a group discussion",
    "type": "QUESTION",
    "subjectId": 1,
    "topicId": 1,
    "classLevel": "INTERMEDIATE",
    "tags": ["group", "test"],
    "isAnonymous": false
}'
make_api_call "POST" "/groups/1/discussions" "$group_discussion_data" "Create group discussion"

# ======================
# MESSAGE ENDPOINTS
# ======================

echo "=== MESSAGE ENDPOINTS ==="

# 1. Get conversations
make_api_call "GET" "/messages/conversations?page=0&size=10" "" "Get conversations"

# 2. Get conversation messages
make_api_call "GET" "/messages/conversations/1?page=0&size=20" "" "Get conversation messages"

# 3. Send message
message_data='{
    "recipientId": 2,
    "content": "Test message",
    "type": "TEXT",
    "attachments": ["file1.pdf"]
}'
make_api_call "POST" "/messages" "$message_data" "Send message"

# 4. Update message
update_message_data='{"content": "Updated message content"}'
make_api_call "PUT" "/messages/1" "$update_message_data" "Update message"

# 5. Delete message
make_api_call "DELETE" "/messages/1" "" "Delete message"

# 6. Mark message as read
make_api_call "PUT" "/messages/1/read" "" "Mark message as read"

# 7. Get unread count
make_api_call "GET" "/messages/unread-count" "" "Get unread message count"

# ======================
# AI ENDPOINTS
# ======================

echo "=== AI ENDPOINTS ==="

# 1. Ask AI
ai_query_data='{
    "question": "What is photosynthesis?",
    "subjectId": 1,
    "topicId": 1,
    "context": "Biology lesson",
    "type": "CONCEPT"
}'
make_api_call "POST" "/ai/ask" "$ai_query_data" "Ask AI"

# 2. Get AI history
make_api_call "GET" "/ai/history?page=0&size=10" "" "Get AI history"

# 3. Get AI history with subject filter
make_api_call "GET" "/ai/history?page=0&size=10&subjectId=1" "" "Get AI history with subject filter"

# ======================
# NOTIFICATION ENDPOINTS
# ======================

echo "=== NOTIFICATION ENDPOINTS ==="

# 1. Get notifications
make_api_call "GET" "/notifications?page=0&size=10" "" "Get notifications"

# 2. Get unread notifications
make_api_call "GET" "/notifications?page=0&size=10&unread=true" "" "Get unread notifications"

# 3. Get notifications by type
make_api_call "GET" "/notifications?page=0&size=10&type=DISCUSSION_REPLY" "" "Get notifications by type"

# 4. Mark notification as read
make_api_call "PUT" "/notifications/1/read" "" "Mark notification as read"

# 5. Mark all notifications as read
make_api_call "PUT" "/notifications/read-all" "" "Mark all notifications as read"

# 6. Get unread notification count
make_api_call "GET" "/notifications/unread-count" "" "Get unread notification count"

# ======================
# SEARCH ENDPOINTS
# ======================

echo "=== SEARCH ENDPOINTS ==="

# 1. Search discussions
make_api_call "GET" "/search/discussions?q=test&page=0&size=10" "" "Search discussions"

# 2. Search discussions with filters
make_api_call "GET" "/search/discussions?q=test&page=0&size=10&type=QUESTION&sortBy=NEWEST" "" "Search discussions with filters"

# 3. Search groups
make_api_call "GET" "/search/groups?q=study&page=0&size=10" "" "Search groups"

# 4. Search groups with type filter
make_api_call "GET" "/search/groups?q=study&page=0&size=10&type=STUDY" "" "Search groups with type filter"

# 5. Search users
make_api_call "GET" "/search/users?q=john&page=0&size=10" "" "Search users"

echo "=== API Testing Complete ==="
echo "Remember to:"
echo "1. Update JWT_TOKEN with a valid token from auth service"
echo "2. Ensure the discussion service is running on port 8082"
echo "3. Check that the database is properly set up"
echo "4. Verify that the auth service is running for token generation"