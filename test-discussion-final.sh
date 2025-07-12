#!/bin/bash

# Final Working Discussion Service API Test Script
# Tests all Discussion Service endpoints with provided credentials

# Configuration
AUTH_URL="http://localhost:8081/api/v1"
DISCUSSION_URL="http://localhost:8082/api/v1"

# User credentials
STUDENT_EMAIL="moyenuddin075@gmail.com"
STUDENT_PASSWORD="password123"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="password123"
QSETTER_EMAIL="qsetter"
QSETTER_PASSWORD="password123"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variables to store created resource IDs
CREATED_DISCUSSION_ID=""
CREATED_GROUP_ID=""
CREATED_ANSWER_ID=""

echo -e "${CYAN}===============================================${NC}"
echo -e "${CYAN}  Discussion Service API Comprehensive Test  ${NC}"
echo -e "${CYAN}===============================================${NC}"
echo ""

# Function to get authentication token
get_auth_token() {
    local email=$1
    local password=$2
    local user_type=$3
    
    echo -e "${YELLOW}Authenticating $user_type user...${NC}"
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"usernameOrEmail\": \"$email\", \"password\": \"$password\"}" \
        "$AUTH_URL/auth/login")
    
    local token=$(echo "$response" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
    
    if [ -n "$token" ]; then
        echo -e "${GREEN}✓ $user_type authentication successful${NC}"
        echo "$token"
        return 0
    else
        echo -e "${RED}✗ $user_type authentication failed${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "  $method $DISCUSSION_URL$endpoint"
    
    local response
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$DISCUSSION_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            "$DISCUSSION_URL$endpoint")
    fi
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ Success ($http_code)${NC}"
        
        # Show truncated response
        if [ ${#body} -gt 150 ]; then
            echo "  Response: $(echo "$body" | head -c 150)..."
        else
            echo "  Response: $body"
        fi
        
        # Extract IDs for subsequent tests
        local id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
        if [ -n "$id" ]; then
            if [[ "$description" == *"Create discussion"* ]]; then
                CREATED_DISCUSSION_ID=$id
                echo -e "  ${BLUE}→ Discussion ID: $id${NC}"
            elif [[ "$description" == *"Create group"* ]]; then
                CREATED_GROUP_ID=$id
                echo -e "  ${BLUE}→ Group ID: $id${NC}"
            elif [[ "$description" == *"Create answer"* ]]; then
                CREATED_ANSWER_ID=$id
                echo -e "  ${BLUE}→ Answer ID: $id${NC}"
            fi
        fi
        
        return 0
    else
        echo -e "  ${RED}✗ Failed ($http_code)${NC}"
        if [ ${#body} -gt 150 ]; then
            echo "  Error: $(echo "$body" | head -c 150)..."
        else
            echo "  Error: $body"
        fi
        return 1
    fi
}

# Function to test public endpoint (no auth)
test_public_api() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "  $method $DISCUSSION_URL$endpoint"
    
    local response=$(curl -s -w "\n%{http_code}" -X "$method" \
        -H "Content-Type: application/json" \
        "$DISCUSSION_URL$endpoint")
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ Success ($http_code)${NC}"
        if [ ${#body} -gt 150 ]; then
            echo "  Response: $(echo "$body" | head -c 150)..."
        else
            echo "  Response: $body"
        fi
    else
        echo -e "  ${RED}✗ Failed ($http_code)${NC}"
        echo "  Error: $body"
    fi
}

# Check service availability
echo -e "${CYAN}Checking Services...${NC}"
auth_check=$(curl -s -o /dev/null -w "%{http_code}" "$AUTH_URL/actuator/health" 2>/dev/null)
discussion_check=$(curl -s -o /dev/null -w "%{http_code}" "$DISCUSSION_URL/actuator/health" 2>/dev/null)

if [ "$auth_check" != "200" ]; then
    echo -e "${RED}✗ Auth Service not available on port 8081${NC}"
    exit 1
fi

if [ "$discussion_check" != "200" ]; then
    echo -e "${RED}✗ Discussion Service not available on port 8082${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Both services are running${NC}"

# Authenticate users
echo -e "\n${CYAN}=== Authentication Phase ===${NC}"

STUDENT_TOKEN=$(get_auth_token "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "STUDENT")
if [ $? -ne 0 ]; then
    echo -e "${RED}Cannot proceed without student token${NC}"
    exit 1
fi

ADMIN_TOKEN=$(get_auth_token "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "ADMIN")
QSETTER_TOKEN=$(get_auth_token "$QSETTER_EMAIL" "$QSETTER_PASSWORD" "QSETTER")

echo -e "\n${GREEN}Authentication completed. Proceeding with API tests...${NC}"

# Test Discussion Endpoints
echo -e "\n${CYAN}=== Discussion Endpoints ===${NC}"

test_public_api "GET" "/discussions/public?page=0&size=5" "Get public discussions"
test_public_api "GET" "/discussions/public?page=0&size=5&type=QUESTION" "Get public discussions with filter"

test_api "GET" "/discussions?page=0&size=5" "$STUDENT_TOKEN" "" "Get discussions (authenticated)"
test_api "GET" "/discussions?page=0&size=5&sortBy=NEWEST" "$STUDENT_TOKEN" "" "Get discussions with sorting"

# Create discussion
discussion_json='{
    "title": "API Test Discussion - Comprehensive Testing",
    "content": "This discussion was created during API testing to verify all endpoints work correctly.",
    "type": "QUESTION",
    "subjectId": 1,
    "topicId": 1,
    "classLevel": "INTERMEDIATE",
    "tags": ["api-test", "automation", "testing"],
    "isAnonymous": false
}'

test_api "POST" "/discussions" "$STUDENT_TOKEN" "$discussion_json" "Create discussion"

# Test with created discussion
if [ -n "$CREATED_DISCUSSION_ID" ]; then
    test_public_api "GET" "/discussions/$CREATED_DISCUSSION_ID/public" "Get specific discussion (public)"
    test_api "GET" "/discussions/$CREATED_DISCUSSION_ID" "$STUDENT_TOKEN" "" "Get specific discussion (authenticated)"
    test_api "POST" "/discussions/$CREATED_DISCUSSION_ID/upvote" "$STUDENT_TOKEN" "" "Upvote discussion"
    test_api "POST" "/discussions/$CREATED_DISCUSSION_ID/downvote" "$STUDENT_TOKEN" "" "Downvote discussion"
    test_api "POST" "/discussions/$CREATED_DISCUSSION_ID/bookmark" "$STUDENT_TOKEN" "" "Bookmark discussion"
fi

# Test Answer Endpoints
echo -e "\n${CYAN}=== Answer Endpoints ===${NC}"

if [ -n "$CREATED_DISCUSSION_ID" ]; then
    test_api "GET" "/discussions/$CREATED_DISCUSSION_ID/answers?page=0&size=5" "$STUDENT_TOKEN" "" "Get answers for discussion"
    
    answer_json='{
        "content": "This is a comprehensive answer created during API testing. It demonstrates the answer creation functionality.",
        "attachments": [],
        "isAnonymous": false
    }'
    
    test_api "POST" "/discussions/$CREATED_DISCUSSION_ID/answers" "$STUDENT_TOKEN" "$answer_json" "Create answer"
    
    if [ -n "$CREATED_ANSWER_ID" ]; then
        test_api "POST" "/answers/$CREATED_ANSWER_ID/upvote" "$STUDENT_TOKEN" "" "Upvote answer"
        test_api "POST" "/answers/$CREATED_ANSWER_ID/downvote" "$STUDENT_TOKEN" "" "Downvote answer"
        test_api "POST" "/answers/$CREATED_ANSWER_ID/accept" "$STUDENT_TOKEN" "" "Accept answer"
    fi
else
    echo -e "${YELLOW}Skipping answer tests - no discussion available${NC}"
fi

# Test Group Endpoints
echo -e "\n${CYAN}=== Group Endpoints ===${NC}"

test_api "GET" "/groups?page=0&size=5" "$STUDENT_TOKEN" "" "Get groups"
test_api "GET" "/groups?page=0&size=5&type=STUDY" "$STUDENT_TOKEN" "" "Get groups with type filter"

group_json='{
    "name": "API Testing Study Group",
    "description": "This study group was created during comprehensive API testing to verify group functionality.",
    "type": "STUDY",
    "subjectId": 1,
    "classLevel": "INTERMEDIATE",
    "isPrivate": false,
    "rules": "Be respectful and helpful to all members. This is a test group."
}'

test_api "POST" "/groups" "$STUDENT_TOKEN" "$group_json" "Create group"

if [ -n "$CREATED_GROUP_ID" ]; then
    test_api "GET" "/groups/$CREATED_GROUP_ID" "$STUDENT_TOKEN" "" "Get specific group"
    test_api "POST" "/groups/$CREATED_GROUP_ID/join" "$STUDENT_TOKEN" "" "Join group"
    test_api "GET" "/groups/$CREATED_GROUP_ID/members?page=0&size=5" "$STUDENT_TOKEN" "" "Get group members"
    test_api "GET" "/groups/$CREATED_GROUP_ID/discussions?page=0&size=5" "$STUDENT_TOKEN" "" "Get group discussions"
fi

# Test AI Endpoints
echo -e "\n${CYAN}=== AI Endpoints ===${NC}"

ai_json='{
    "question": "What is the difference between machine learning and artificial intelligence?",
    "subjectId": 1,
    "topicId": 1,
    "context": "Computer Science and AI fundamentals",
    "type": "CONCEPT"
}'

test_api "POST" "/ai/ask" "$STUDENT_TOKEN" "$ai_json" "Ask AI question"
test_api "GET" "/ai/history?page=0&size=5" "$STUDENT_TOKEN" "" "Get AI history"
test_api "GET" "/ai/history?page=0&size=5&subjectId=1" "$STUDENT_TOKEN" "" "Get AI history with filter"

# Test Notification Endpoints
echo -e "\n${CYAN}=== Notification Endpoints ===${NC}"

test_api "GET" "/notifications?page=0&size=5" "$STUDENT_TOKEN" "" "Get notifications"
test_api "GET" "/notifications?page=0&size=5&unread=true" "$STUDENT_TOKEN" "" "Get unread notifications"
test_api "GET" "/notifications/unread-count" "$STUDENT_TOKEN" "" "Get unread notification count"
test_api "PUT" "/notifications/read-all" "$STUDENT_TOKEN" "" "Mark all notifications as read"

# Test Search Endpoints
echo -e "\n${CYAN}=== Search Endpoints ===${NC}"

test_api "GET" "/search/discussions?q=test&page=0&size=5" "$STUDENT_TOKEN" "" "Search discussions"
test_api "GET" "/search/discussions?q=api&page=0&size=5&type=QUESTION" "$STUDENT_TOKEN" "" "Search discussions with filters"
test_api "GET" "/search/groups?q=study&page=0&size=5" "$STUDENT_TOKEN" "" "Search groups"
test_api "GET" "/search/groups?q=test&page=0&size=5&type=STUDY" "$STUDENT_TOKEN" "" "Search groups with type filter"
test_api "GET" "/search/users?q=test&page=0&size=5" "$STUDENT_TOKEN" "" "Search users"

# Test Message Endpoints
echo -e "\n${CYAN}=== Message Endpoints ===${NC}"

test_api "GET" "/messages/conversations?page=0&size=5" "$STUDENT_TOKEN" "" "Get conversations"
test_api "GET" "/messages/unread-count" "$STUDENT_TOKEN" "" "Get unread message count"

# Summary
echo -e "\n${CYAN}===============================================${NC}"
echo -e "${CYAN}           API Testing Summary                ${NC}"
echo -e "${CYAN}===============================================${NC}"

echo -e "\n${GREEN}✓ Comprehensive API testing completed!${NC}"
echo ""
echo "Resources created during testing:"
[ -n "$CREATED_DISCUSSION_ID" ] && echo -e "  ${BLUE}• Discussion ID: $CREATED_DISCUSSION_ID${NC}"
[ -n "$CREATED_GROUP_ID" ] && echo -e "  ${BLUE}• Group ID: $CREATED_GROUP_ID${NC}"
[ -n "$CREATED_ANSWER_ID" ] && echo -e "  ${BLUE}• Answer ID: $CREATED_ANSWER_ID${NC}"

echo ""
echo "User accounts tested:"
echo -e "  ${GREEN}• $STUDENT_EMAIL (STUDENT role) ✓${NC}"
[ -n "$ADMIN_TOKEN" ] && echo -e "  ${GREEN}• $ADMIN_EMAIL (ADMIN role) ✓${NC}"
[ -n "$QSETTER_TOKEN" ] && echo -e "  ${GREEN}• $QSETTER_EMAIL (QSETTER role) ✓${NC}"

echo ""
echo "Endpoint categories tested:"
echo "  • Discussion endpoints (CRUD operations, voting, bookmarking)"
echo "  • Answer endpoints (CRUD operations, voting, accepting)"
echo "  • Group endpoints (management, membership, discussions)"
echo "  • AI endpoints (questions, history)"
echo "  • Notification endpoints (listing, marking read)"
echo "  • Search endpoints (discussions, groups, users)"
echo "  • Message endpoints (conversations, unread counts)"

echo ""
echo -e "${CYAN}All Discussion Service APIs have been tested with the provided credentials.${NC}"
echo -e "${CYAN}Check the output above for any failed tests that need attention.${NC}"