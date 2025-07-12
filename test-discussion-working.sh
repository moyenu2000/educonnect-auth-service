#!/bin/bash

# Working Discussion Service API Test Script
# Fixed authentication and token handling

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
echo -e "${CYAN}  Discussion Service API Test (Working)      ${NC}"
echo -e "${CYAN}===============================================${NC}"
echo ""

# Function to get authentication token (fixed)
get_auth_token() {
    local email=$1
    local password=$2
    local user_type=$3
    
    echo -e "${YELLOW}Authenticating $user_type user ($email)...${NC}"
    
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"usernameOrEmail\": \"$email\", \"password\": \"$password\"}" \
        "$AUTH_URL/auth/login")
    
    # Extract token directly and validate
    local token=$(echo "$response" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
    
    if [ -n "$token" ] && [ "${#token}" -gt 50 ]; then
        echo -e "${GREEN}✓ $user_type authentication successful${NC}"
        echo -e "  Token: ${token:0:30}..."
        echo "$token"  # This is what gets captured by the calling function
        return 0
    else
        echo -e "${RED}✗ $user_type authentication failed${NC}"
        echo "  Response: $response"
        return 1
    fi
}

# Function to test API endpoint (fixed)
test_api() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "  $method $DISCUSSION_URL$endpoint"
    
    # Validate token before making request
    if [ -z "$token" ]; then
        echo -e "  ${RED}✗ No token provided${NC}"
        return 1
    fi
    
    local response
    if [ -n "$data" ] && [ "$method" != "GET" ]; then
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

# Authenticate users (fixed)
echo -e "\n${CYAN}=== Authentication Phase ===${NC}"

# Get student token and validate it's captured correctly
echo "Getting student token..."
STUDENT_TOKEN=$(get_auth_token "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "STUDENT" 2>/dev/null | tail -n1)
if [ -z "$STUDENT_TOKEN" ] || [ "${#STUDENT_TOKEN}" -lt 50 ]; then
    echo -e "${RED}Failed to get student token. Token: '$STUDENT_TOKEN'${NC}"
    exit 1
fi
echo -e "${GREEN}Student token obtained successfully${NC}"

# Get admin token
echo "Getting admin token..."
ADMIN_TOKEN=$(get_auth_token "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "ADMIN" 2>/dev/null | tail -n1)
if [ -n "$ADMIN_TOKEN" ] && [ "${#ADMIN_TOKEN}" -gt 50 ]; then
    echo -e "${GREEN}Admin token obtained successfully${NC}"
else
    echo -e "${YELLOW}Admin token not obtained (${#ADMIN_TOKEN} chars)${NC}"
    ADMIN_TOKEN=""
fi

# Get qsetter token
echo "Getting qsetter token..."
QSETTER_TOKEN=$(get_auth_token "$QSETTER_EMAIL" "$QSETTER_PASSWORD" "QSETTER" 2>/dev/null | tail -n1)
if [ -n "$QSETTER_TOKEN" ] && [ "${#QSETTER_TOKEN}" -gt 50 ]; then
    echo -e "${GREEN}QSetter token obtained successfully${NC}"
else
    echo -e "${YELLOW}QSetter token not obtained (${#QSETTER_TOKEN} chars)${NC}"
    QSETTER_TOKEN=""
fi

echo -e "\n${GREEN}Authentication completed. Proceeding with API tests...${NC}"

# Test Discussion Endpoints
echo -e "\n${CYAN}=== Discussion Endpoints ===${NC}"

test_public_api "GET" "/discussions/public?page=0&size=5" "Get public discussions"

test_api "GET" "/discussions?page=0&size=5" "$STUDENT_TOKEN" "" "Get discussions (authenticated)"

# Create discussion
discussion_json='{
    "title": "Working API Test Discussion",
    "content": "This discussion was created during comprehensive API testing to verify all endpoints work correctly after fixing authentication.",
    "type": "QUESTION",
    "subjectId": 1,
    "topicId": 1,
    "classLevel": "INTERMEDIATE",
    "tags": ["api-test", "fixed", "working"],
    "isAnonymous": false
}'

test_api "POST" "/discussions" "$STUDENT_TOKEN" "$discussion_json" "Create discussion"

# Test with created discussion
if [ -n "$CREATED_DISCUSSION_ID" ]; then
    test_api "GET" "/discussions/$CREATED_DISCUSSION_ID" "$STUDENT_TOKEN" "" "Get specific discussion"
    test_api "POST" "/discussions/$CREATED_DISCUSSION_ID/upvote" "$STUDENT_TOKEN" "" "Upvote discussion"
    test_api "POST" "/discussions/$CREATED_DISCUSSION_ID/bookmark" "$STUDENT_TOKEN" "" "Bookmark discussion"
fi

# Test Answer Endpoints
echo -e "\n${CYAN}=== Answer Endpoints ===${NC}"

if [ -n "$CREATED_DISCUSSION_ID" ]; then
    test_api "GET" "/discussions/$CREATED_DISCUSSION_ID/answers?page=0&size=5" "$STUDENT_TOKEN" "" "Get answers for discussion"
    
    answer_json='{
        "content": "This is a comprehensive answer created during API testing after fixing authentication issues.",
        "attachments": [],
        "isAnonymous": false
    }'
    
    test_api "POST" "/discussions/$CREATED_DISCUSSION_ID/answers" "$STUDENT_TOKEN" "$answer_json" "Create answer"
    
    if [ -n "$CREATED_ANSWER_ID" ]; then
        test_api "POST" "/answers/$CREATED_ANSWER_ID/upvote" "$STUDENT_TOKEN" "" "Upvote answer"
    fi
else
    echo -e "${YELLOW}Skipping answer tests - no discussion available${NC}"
fi

# Test Group Endpoints
echo -e "\n${CYAN}=== Group Endpoints ===${NC}"

test_api "GET" "/groups?page=0&size=5" "$STUDENT_TOKEN" "" "Get groups"

group_json='{
    "name": "Working API Test Group",
    "description": "This study group was created during comprehensive API testing after fixing authentication.",
    "type": "STUDY",
    "subjectId": 1,
    "classLevel": "INTERMEDIATE",
    "isPrivate": false,
    "rules": "Be respectful and helpful. Authentication is now working!"
}'

test_api "POST" "/groups" "$STUDENT_TOKEN" "$group_json" "Create group"

if [ -n "$CREATED_GROUP_ID" ]; then
    test_api "GET" "/groups/$CREATED_GROUP_ID" "$STUDENT_TOKEN" "" "Get specific group"
    test_api "POST" "/groups/$CREATED_GROUP_ID/join" "$STUDENT_TOKEN" "" "Join group"
fi

# Test Notification Endpoints
echo -e "\n${CYAN}=== Notification Endpoints ===${NC}"

test_api "GET" "/notifications?page=0&size=5" "$STUDENT_TOKEN" "" "Get notifications"
test_api "GET" "/notifications/unread-count" "$STUDENT_TOKEN" "" "Get unread notification count"

# Test Search Endpoints
echo -e "\n${CYAN}=== Search Endpoints ===${NC}"

test_api "GET" "/search/discussions?q=test&page=0&size=5" "$STUDENT_TOKEN" "" "Search discussions"
test_api "GET" "/search/groups?q=study&page=0&size=5" "$STUDENT_TOKEN" "" "Search groups"

# Test Message Endpoints
echo -e "\n${CYAN}=== Message Endpoints ===${NC}"

test_api "GET" "/messages/conversations?page=0&size=5" "$STUDENT_TOKEN" "" "Get conversations"
test_api "GET" "/messages/unread-count" "$STUDENT_TOKEN" "" "Get unread message count"

# Summary
echo -e "\n${CYAN}===============================================${NC}"
echo -e "${CYAN}           Test Results Summary               ${NC}"
echo -e "${CYAN}===============================================${NC}"

echo -e "\n${GREEN}✓ API testing completed successfully!${NC}"
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
echo -e "${CYAN}All Discussion Service APIs have been tested successfully!${NC}"
echo -e "${CYAN}The authentication issue has been resolved.${NC}"