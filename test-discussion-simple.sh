#!/bin/bash

# Simple Discussion Service API Testing Script
# Tests core endpoints with provided user credentials

# Service URLs
AUTH_URL="http://localhost:8081/api/v1"
DISCUSSION_URL="http://localhost:8082/api/v1"

# User credentials
STUDENT_EMAIL="moyenuddin075@gmail.com"
STUDENT_PASSWORD="password123"
ADMIN_EMAIL="admin"
ADMIN_PASSWORD="password123"
QSETTER_EMAIL="qsetter"
QSETTER_PASSWORD="password123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=== Discussion Service API Testing ===${NC}"
echo "Testing all Discussion Service endpoints with multiple users"
echo ""

# Function to authenticate and get token
get_token() {
    local email=$1
    local password=$2
    local user_type=$3
    
    echo -e "${YELLOW}Authenticating $user_type ($email)...${NC}"
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"usernameOrEmail\": \"$email\", \"password\": \"$password\"}" \
        "$AUTH_URL/auth/login")
    
    local token=$(echo "$response" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
    
    if [ -n "$token" ]; then
        echo -e "${GREEN}✓ Authentication successful for $user_type${NC}"
        echo "$token"
    else
        echo -e "${RED}✗ Authentication failed for $user_type${NC}"
        echo "Response: $response"
        return 1
    fi
}

# Function to test an API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Endpoint: $method $DISCUSSION_URL$endpoint"
    
    local cmd="curl -s -w \"\n%{http_code}\" -X $method -H \"Content-Type: application/json\""
    
    if [ -n "$token" ]; then
        cmd="$cmd -H \"Authorization: Bearer $token\""
    fi
    
    if [ -n "$data" ]; then
        cmd="$cmd -d '$data'"
    fi
    
    cmd="$cmd \"$DISCUSSION_URL$endpoint\""
    
    local response=$(eval $cmd)
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success ($http_code)${NC}"
        echo "Response: $body" | head -c 200
        if [ ${#body} -gt 200 ]; then echo "..."; fi
        
        # Extract and store IDs for subsequent tests
        if [[ "$description" == *"Create"* ]]; then
            local id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
            if [ -n "$id" ]; then
                echo -e "${BLUE}Created resource ID: $id${NC}"
                if [[ "$description" == *"discussion"* ]]; then
                    CREATED_DISCUSSION_ID=$id
                elif [[ "$description" == *"group"* ]]; then
                    CREATED_GROUP_ID=$id
                elif [[ "$description" == *"answer"* ]]; then
                    CREATED_ANSWER_ID=$id
                fi
            fi
        fi
    else
        echo -e "${RED}✗ Failed ($http_code)${NC}"
        echo "Response: $body" | head -c 200
        if [ ${#body} -gt 200 ]; then echo "..."; fi
    fi
}

# Check if services are running
echo -e "${CYAN}Checking Services...${NC}"
auth_status=$(curl -s -o /dev/null -w "%{http_code}" "$AUTH_URL/actuator/health" 2>/dev/null || echo "000")
discussion_status=$(curl -s -o /dev/null -w "%{http_code}" "$DISCUSSION_URL/actuator/health" 2>/dev/null || echo "000")

if [ "$auth_status" != "200" ]; then
    echo -e "${RED}✗ Auth Service not running on port 8081${NC}"
    exit 1
fi

if [ "$discussion_status" != "200" ]; then
    echo -e "${RED}✗ Discussion Service not running on port 8082${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Both services are running${NC}"

# Get authentication tokens
echo -e "\n${CYAN}=== AUTHENTICATION ===${NC}"
STUDENT_TOKEN=$(get_token "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "STUDENT")
ADMIN_TOKEN=$(get_token "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "ADMIN")
QSETTER_TOKEN=$(get_token "$QSETTER_EMAIL" "$QSETTER_PASSWORD" "QSETTER")

if [ -z "$STUDENT_TOKEN" ]; then
    echo -e "${RED}Cannot proceed without student token${NC}"
    exit 1
fi

# Test Discussion endpoints
echo -e "\n${CYAN}=== DISCUSSION ENDPOINTS ===${NC}"

# Public endpoints (no auth)
test_endpoint "GET" "/discussions/public?page=0&size=5" "" "" "Get public discussions"

# Authenticated endpoints
test_endpoint "GET" "/discussions?page=0&size=5" "$STUDENT_TOKEN" "" "Get discussions (authenticated)"

# Create discussion
discussion_data='{
    "title": "API Test Discussion",
    "content": "This is a test discussion created via API testing",
    "type": "QUESTION",
    "subjectId": 1,
    "topicId": 1,
    "classLevel": "INTERMEDIATE",
    "tags": ["api-test"],
    "isAnonymous": false
}'
test_endpoint "POST" "/discussions" "$STUDENT_TOKEN" "$discussion_data" "Create discussion"

# Test with created discussion if available
if [ -n "$CREATED_DISCUSSION_ID" ]; then
    test_endpoint "GET" "/discussions/$CREATED_DISCUSSION_ID" "$STUDENT_TOKEN" "" "Get specific discussion"
    test_endpoint "POST" "/discussions/$CREATED_DISCUSSION_ID/upvote" "$STUDENT_TOKEN" "" "Upvote discussion"
    test_endpoint "POST" "/discussions/$CREATED_DISCUSSION_ID/bookmark" "$STUDENT_TOKEN" "" "Bookmark discussion"
fi

# Test Answer endpoints
echo -e "\n${CYAN}=== ANSWER ENDPOINTS ===${NC}"

if [ -n "$CREATED_DISCUSSION_ID" ]; then
    test_endpoint "GET" "/discussions/$CREATED_DISCUSSION_ID/answers?page=0&size=5" "$STUDENT_TOKEN" "" "Get answers for discussion"
    
    # Create answer
    answer_data='{
        "content": "This is a test answer created via API",
        "attachments": [],
        "isAnonymous": false
    }'
    test_endpoint "POST" "/discussions/$CREATED_DISCUSSION_ID/answers" "$STUDENT_TOKEN" "$answer_data" "Create answer"
    
    if [ -n "$CREATED_ANSWER_ID" ]; then
        test_endpoint "POST" "/answers/$CREATED_ANSWER_ID/upvote" "$STUDENT_TOKEN" "" "Upvote answer"
    fi
else
    echo -e "${YELLOW}Skipping answer tests - no discussion created${NC}"
fi

# Test Group endpoints
echo -e "\n${CYAN}=== GROUP ENDPOINTS ===${NC}"

test_endpoint "GET" "/groups?page=0&size=5" "$STUDENT_TOKEN" "" "Get groups"

# Create group
group_data='{
    "name": "API Test Group",
    "description": "Test group created via API",
    "type": "STUDY",
    "subjectId": 1,
    "classLevel": "INTERMEDIATE",
    "isPrivate": false,
    "rules": "Be respectful"
}'
test_endpoint "POST" "/groups" "$STUDENT_TOKEN" "$group_data" "Create group"

if [ -n "$CREATED_GROUP_ID" ]; then
    test_endpoint "GET" "/groups/$CREATED_GROUP_ID" "$STUDENT_TOKEN" "" "Get specific group"
    test_endpoint "POST" "/groups/$CREATED_GROUP_ID/join" "$STUDENT_TOKEN" "" "Join group"
    test_endpoint "GET" "/groups/$CREATED_GROUP_ID/members?page=0&size=5" "$STUDENT_TOKEN" "" "Get group members"
fi

# Test AI endpoints
echo -e "\n${CYAN}=== AI ENDPOINTS ===${NC}"

ai_data='{
    "question": "What is machine learning?",
    "subjectId": 1,
    "topicId": 1,
    "context": "Computer Science",
    "type": "CONCEPT"
}'
test_endpoint "POST" "/ai/ask" "$STUDENT_TOKEN" "$ai_data" "Ask AI question"
test_endpoint "GET" "/ai/history?page=0&size=5" "$STUDENT_TOKEN" "" "Get AI history"

# Test Notification endpoints
echo -e "\n${CYAN}=== NOTIFICATION ENDPOINTS ===${NC}"

test_endpoint "GET" "/notifications?page=0&size=5" "$STUDENT_TOKEN" "" "Get notifications"
test_endpoint "GET" "/notifications/unread-count" "$STUDENT_TOKEN" "" "Get unread notification count"

# Test Search endpoints
echo -e "\n${CYAN}=== SEARCH ENDPOINTS ===${NC}"

test_endpoint "GET" "/search/discussions?q=test&page=0&size=5" "$STUDENT_TOKEN" "" "Search discussions"
test_endpoint "GET" "/search/groups?q=test&page=0&size=5" "$STUDENT_TOKEN" "" "Search groups"
test_endpoint "GET" "/search/users?q=test&page=0&size=5" "$STUDENT_TOKEN" "" "Search users"

# Test Message endpoints
echo -e "\n${CYAN}=== MESSAGE ENDPOINTS ===${NC}"

test_endpoint "GET" "/messages/conversations?page=0&size=5" "$STUDENT_TOKEN" "" "Get conversations"
test_endpoint "GET" "/messages/unread-count" "$STUDENT_TOKEN" "" "Get unread message count"

# Summary
echo -e "\n${CYAN}=== TEST SUMMARY ===${NC}"
echo -e "${GREEN}✓ API testing completed${NC}"
echo ""
echo "Created resources for verification:"
[ -n "$CREATED_DISCUSSION_ID" ] && echo "  Discussion ID: $CREATED_DISCUSSION_ID"
[ -n "$CREATED_GROUP_ID" ] && echo "  Group ID: $CREATED_GROUP_ID"
[ -n "$CREATED_ANSWER_ID" ] && echo "  Answer ID: $CREATED_ANSWER_ID"
echo ""
echo "All major Discussion Service endpoints have been tested."
echo "Check the output above for any failed tests that need attention."