#!/bin/bash

# Comprehensive Discussion Service API Testing Script
# Tests all endpoints with multiple user credentials

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

# Global variables for tokens and created resources
STUDENT_TOKEN=""
ADMIN_TOKEN=""
QSETTER_TOKEN=""
CREATED_DISCUSSION_ID=""
CREATED_GROUP_ID=""
CREATED_ANSWER_ID=""
CREATED_MESSAGE_ID=""

# Function to print section headers
print_section() {
    echo -e "\n${CYAN}=================================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}=================================================${NC}\n"
}

# Function to print test headers
print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
}

# Function to authenticate and get JWT token
authenticate() {
    local email=$1
    local password=$2
    local user_type=$3
    
    print_test "Authenticating $user_type user ($email)"
    
    local login_data="{\"usernameOrEmail\": \"$email\", \"password\": \"$password\"}"
    
    local response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Content-Type: application/json" \
        -d "$login_data" \
        "$AUTH_URL/auth/login")
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        local token=$(echo "$body" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
        if [ -n "$token" ]; then
            echo -e "${GREEN}✓ Authentication successful${NC}"
            echo "Token: ${token:0:20}..."
            echo "$token"
            return 0
        else
            echo -e "${RED}✗ Failed to extract token from response${NC}"
            echo "Response: $body"
            return 1
        fi
    else
        echo -e "${RED}✗ Authentication failed ($http_code)${NC}"
        echo "Response: $body"
        return 1
    fi
}

# Function to make API calls
make_api_call() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    local expected_codes=$6  # Optional: comma-separated list of expected HTTP codes
    
    print_test "$description"
    echo "Method: $method"
    echo "Endpoint: $DISCUSSION_URL$endpoint"
    
    local response
    if [ -n "$token" ]; then
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
    else
        if [ -n "$data" ] && [ "$method" != "GET" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Content-Type: application/json" \
                -d "$data" \
                "$DISCUSSION_URL$endpoint")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" \
                -H "Content-Type: application/json" \
                "$DISCUSSION_URL$endpoint")
        fi
    fi
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Set default expected codes if not provided
    if [ -z "$expected_codes" ]; then
        expected_codes="200,201,204"
    fi
    
    # Check if the HTTP code is in the expected codes list
    if echo "$expected_codes" | grep -q "$http_code"; then
        echo -e "${GREEN}✓ Success ($http_code)${NC}"
        echo "Response: $body"
        
        # Extract IDs from successful creation responses
        if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
            extract_id_from_response "$body" "$description"
        fi
    else
        echo -e "${RED}✗ Failed ($http_code)${NC}"
        echo "Response: $body"
    fi
    
    echo "================================================="
    echo ""
}

# Function to extract IDs from API responses
extract_id_from_response() {
    local response=$1
    local description=$2
    
    # Extract ID from different response formats
    local id=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | sed 's/"id"://')
    
    if [ -n "$id" ]; then
        case "$description" in
            *"Create discussion"*)
                CREATED_DISCUSSION_ID=$id
                echo -e "${BLUE}Created Discussion ID: $id${NC}"
                ;;
            *"Create group"*)
                CREATED_GROUP_ID=$id
                echo -e "${BLUE}Created Group ID: $id${NC}"
                ;;
            *"Create answer"*)
                CREATED_ANSWER_ID=$id
                echo -e "${BLUE}Created Answer ID: $id${NC}"
                ;;
            *"Send message"*)
                CREATED_MESSAGE_ID=$id
                echo -e "${BLUE}Created Message ID: $id${NC}"
                ;;
        esac
    fi
}

# Function to make public API calls (no authentication)
make_public_api_call() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_codes=$4
    
    make_api_call "$method" "$endpoint" "" "" "$description" "$expected_codes"
}

# Start of testing script
echo -e "${CYAN}=== EduConnect Discussion Service Comprehensive API Testing ===${NC}"
echo "Make sure both Auth Service (port 8081) and Discussion Service (port 8082) are running"
echo ""

# Check if services are running
print_section "SERVICE HEALTH CHECKS"

print_test "Checking Auth Service"
auth_health=$(curl -s -o /dev/null -w "%{http_code}" "$AUTH_URL/actuator/health" || echo "000")
if [ "$auth_health" = "200" ]; then
    echo -e "${GREEN}✓ Auth Service is running${NC}"
else
    echo -e "${RED}✗ Auth Service is not responding (HTTP: $auth_health)${NC}"
    echo "Please start the Auth Service on port 8081"
    exit 1
fi

print_test "Checking Discussion Service"
discussion_health=$(curl -s -o /dev/null -w "%{http_code}" "$DISCUSSION_URL/actuator/health" || echo "000")
if [ "$discussion_health" = "200" ]; then
    echo -e "${GREEN}✓ Discussion Service is running${NC}"
else
    echo -e "${RED}✗ Discussion Service is not responding (HTTP: $discussion_health)${NC}"
    echo "Please start the Discussion Service on port 8082"
    exit 1
fi

# Authentication section
print_section "AUTHENTICATION"

STUDENT_TOKEN=$(authenticate "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "STUDENT")
if [ $? -ne 0 ] || [ -z "$STUDENT_TOKEN" ]; then
    echo -e "${RED}Failed to authenticate student user. Exiting.${NC}"
    exit 1
fi
echo -e "${BLUE}Student token obtained: ${STUDENT_TOKEN:0:20}...${NC}"

ADMIN_TOKEN=$(authenticate "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "ADMIN")
if [ $? -ne 0 ] || [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${YELLOW}Warning: Failed to authenticate admin user. Some tests may fail.${NC}"
else
    echo -e "${BLUE}Admin token obtained: ${ADMIN_TOKEN:0:20}...${NC}"
fi

QSETTER_TOKEN=$(authenticate "$QSETTER_EMAIL" "$QSETTER_PASSWORD" "QSETTER")
if [ $? -ne 0 ] || [ -z "$QSETTER_TOKEN" ]; then
    echo -e "${YELLOW}Warning: Failed to authenticate qsetter user. Some tests may fail.${NC}"
else
    echo -e "${BLUE}QSetter token obtained: ${QSETTER_TOKEN:0:20}...${NC}"
fi

# ======================
# DISCUSSION ENDPOINTS
# ======================

print_section "DISCUSSION ENDPOINTS"

# Public endpoints (no authentication required)
make_public_api_call "GET" "/discussions/public?page=0&size=10" "Get public discussions"
make_public_api_call "GET" "/discussions/public?page=0&size=10&type=QUESTION&sortBy=NEWEST" "Get public discussions with filters"

# Authenticated endpoints
make_api_call "GET" "/discussions?page=0&size=10" "$STUDENT_TOKEN" "" "Get discussions (authenticated)"
make_api_call "GET" "/discussions?page=0&size=10&type=QUESTION&sortBy=NEWEST" "$STUDENT_TOKEN" "" "Get discussions with filters"

# Create discussion
discussion_data='{
    "title": "Test API Discussion",
    "content": "This is a comprehensive test discussion created via API",
    "type": "QUESTION",
    "subjectId": 1,
    "topicId": 1,
    "classLevel": "INTERMEDIATE",
    "tags": ["api-test", "automation"],
    "isAnonymous": false
}'
make_api_call "POST" "/discussions" "$STUDENT_TOKEN" "$discussion_data" "Create discussion"

# Use the created discussion ID for subsequent tests
if [ -n "$CREATED_DISCUSSION_ID" ]; then
    # Get specific discussion (public and authenticated)
    make_public_api_call "GET" "/discussions/$CREATED_DISCUSSION_ID/public" "Get specific discussion (public)"
    make_api_call "GET" "/discussions/$CREATED_DISCUSSION_ID" "$STUDENT_TOKEN" "" "Get specific discussion (authenticated)"
    
    # Update discussion
    update_discussion_data='{
        "title": "Updated API Test Discussion",
        "content": "This discussion has been updated via API",
        "type": "QUESTION",
        "subjectId": 1,
        "topicId": 1,
        "classLevel": "ADVANCED",
        "tags": ["updated", "api-test"],
        "isAnonymous": false
    }'
    make_api_call "PUT" "/discussions/$CREATED_DISCUSSION_ID" "$STUDENT_TOKEN" "$update_discussion_data" "Update discussion"
    
    # Vote and bookmark operations
    make_api_call "POST" "/discussions/$CREATED_DISCUSSION_ID/upvote" "$STUDENT_TOKEN" "" "Upvote discussion"
    make_api_call "POST" "/discussions/$CREATED_DISCUSSION_ID/downvote" "$STUDENT_TOKEN" "" "Downvote discussion"
    make_api_call "POST" "/discussions/$CREATED_DISCUSSION_ID/bookmark" "$STUDENT_TOKEN" "" "Bookmark discussion"
else
    echo -e "${YELLOW}Warning: No discussion was created, skipping discussion-specific tests${NC}"
fi

# ======================
# ANSWER ENDPOINTS
# ======================

print_section "ANSWER ENDPOINTS"

if [ -n "$CREATED_DISCUSSION_ID" ]; then
    # Get answers for discussion
    make_api_call "GET" "/discussions/$CREATED_DISCUSSION_ID/answers?page=0&size=10" "$STUDENT_TOKEN" "" "Get answers for discussion"
    
    # Create answer
    answer_data='{
        "content": "This is a comprehensive test answer created via API",
        "attachments": [],
        "isAnonymous": false
    }'
    make_api_call "POST" "/discussions/$CREATED_DISCUSSION_ID/answers" "$STUDENT_TOKEN" "$answer_data" "Create answer"
    
    if [ -n "$CREATED_ANSWER_ID" ]; then
        # Update answer
        update_answer_data='{
            "content": "This answer has been updated via API",
            "attachments": [],
            "isAnonymous": false
        }'
        make_api_call "PUT" "/answers/$CREATED_ANSWER_ID" "$STUDENT_TOKEN" "$update_answer_data" "Update answer"
        
        # Vote and accept operations
        make_api_call "POST" "/answers/$CREATED_ANSWER_ID/upvote" "$STUDENT_TOKEN" "" "Upvote answer"
        make_api_call "POST" "/answers/$CREATED_ANSWER_ID/downvote" "$STUDENT_TOKEN" "" "Downvote answer"
        make_api_call "POST" "/answers/$CREATED_ANSWER_ID/accept" "$STUDENT_TOKEN" "" "Accept answer"
    fi
else
    echo -e "${YELLOW}Warning: No discussion available, skipping answer tests${NC}"
fi

# ======================
# GROUP ENDPOINTS
# ======================

print_section "GROUP ENDPOINTS"

# Get all groups
make_api_call "GET" "/groups?page=0&size=10" "$STUDENT_TOKEN" "" "Get all groups"
make_api_call "GET" "/groups?page=0&size=10&type=STUDY&joined=false" "$STUDENT_TOKEN" "" "Get groups with filters"

# Create group
group_data='{
    "name": "API Test Study Group",
    "description": "This is a test study group created via API",
    "type": "STUDY",
    "subjectId": 1,
    "classLevel": "INTERMEDIATE",
    "isPrivate": false,
    "rules": "Be respectful and helpful to all members"
}'
make_api_call "POST" "/groups" "$STUDENT_TOKEN" "$group_data" "Create group"

if [ -n "$CREATED_GROUP_ID" ]; then
    # Get specific group
    make_api_call "GET" "/groups/$CREATED_GROUP_ID" "$STUDENT_TOKEN" "" "Get specific group"
    
    # Update group
    update_group_data='{
        "name": "Updated API Test Study Group",
        "description": "This group has been updated via API",
        "type": "STUDY",
        "subjectId": 1,
        "classLevel": "ADVANCED",
        "isPrivate": false,
        "rules": "Updated rules via API"
    }'
    make_api_call "PUT" "/groups/$CREATED_GROUP_ID" "$STUDENT_TOKEN" "$update_group_data" "Update group"
    
    # Group membership operations
    make_api_call "POST" "/groups/$CREATED_GROUP_ID/join" "$STUDENT_TOKEN" "" "Join group"
    make_api_call "GET" "/groups/$CREATED_GROUP_ID/members?page=0&size=10" "$STUDENT_TOKEN" "" "Get group members"
    
    # Group discussions
    make_api_call "GET" "/groups/$CREATED_GROUP_ID/discussions?page=0&size=10" "$STUDENT_TOKEN" "" "Get group discussions"
    
    # Create group discussion
    group_discussion_data='{
        "title": "Group API Test Discussion",
        "content": "This is a group discussion created via API",
        "type": "QUESTION",
        "subjectId": 1,
        "topicId": 1,
        "classLevel": "INTERMEDIATE",
        "tags": ["group", "api-test"],
        "isAnonymous": false
    }'
    make_api_call "POST" "/groups/$CREATED_GROUP_ID/discussions" "$STUDENT_TOKEN" "$group_discussion_data" "Create group discussion"
fi

# ======================
# MESSAGE ENDPOINTS
# ======================

print_section "MESSAGE ENDPOINTS"

# Get conversations
make_api_call "GET" "/messages/conversations?page=0&size=10" "$STUDENT_TOKEN" "" "Get conversations"

# Get unread count
make_api_call "GET" "/messages/unread-count" "$STUDENT_TOKEN" "" "Get unread message count"

# Note: We can't test message sending without knowing another user's ID
# This would typically be done in integration tests with known test data

# ======================
# AI ENDPOINTS
# ======================

print_section "AI ENDPOINTS"

# Ask AI
ai_query_data='{
    "question": "What is the Pythagorean theorem and how is it used?",
    "subjectId": 1,
    "topicId": 1,
    "context": "Mathematics lesson on triangles",
    "type": "CONCEPT"
}'
make_api_call "POST" "/ai/ask" "$STUDENT_TOKEN" "$ai_query_data" "Ask AI"

# Get AI history
make_api_call "GET" "/ai/history?page=0&size=10" "$STUDENT_TOKEN" "" "Get AI history"
make_api_call "GET" "/ai/history?page=0&size=10&subjectId=1" "$STUDENT_TOKEN" "" "Get AI history with subject filter"

# ======================
# NOTIFICATION ENDPOINTS
# ======================

print_section "NOTIFICATION ENDPOINTS"

# Get notifications
make_api_call "GET" "/notifications?page=0&size=10" "$STUDENT_TOKEN" "" "Get notifications"
make_api_call "GET" "/notifications?page=0&size=10&unread=true" "$STUDENT_TOKEN" "" "Get unread notifications"
make_api_call "GET" "/notifications?page=0&size=10&type=DISCUSSION_REPLY" "$STUDENT_TOKEN" "" "Get notifications by type"

# Get unread notification count
make_api_call "GET" "/notifications/unread-count" "$STUDENT_TOKEN" "" "Get unread notification count"

# Mark all notifications as read
make_api_call "PUT" "/notifications/read-all" "$STUDENT_TOKEN" "" "Mark all notifications as read"

# ======================
# SEARCH ENDPOINTS
# ======================

print_section "SEARCH ENDPOINTS"

# Search discussions
make_api_call "GET" "/search/discussions?q=test&page=0&size=10" "$STUDENT_TOKEN" "" "Search discussions"
make_api_call "GET" "/search/discussions?q=test&page=0&size=10&type=QUESTION&sortBy=NEWEST" "$STUDENT_TOKEN" "" "Search discussions with filters"

# Search groups
make_api_call "GET" "/search/groups?q=study&page=0&size=10" "$STUDENT_TOKEN" "" "Search groups"
make_api_call "GET" "/search/groups?q=study&page=0&size=10&type=STUDY" "$STUDENT_TOKEN" "" "Search groups with type filter"

# Search users
make_api_call "GET" "/search/users?q=test&page=0&size=10" "$STUDENT_TOKEN" "" "Search users"

# ======================
# CLEANUP SECTION
# ======================

print_section "CLEANUP (OPTIONAL)"

# Delete created resources (commented out to preserve test data)
# if [ -n "$CREATED_ANSWER_ID" ]; then
#     make_api_call "DELETE" "/answers/$CREATED_ANSWER_ID" "$STUDENT_TOKEN" "" "Delete created answer"
# fi

# if [ -n "$CREATED_DISCUSSION_ID" ]; then
#     make_api_call "DELETE" "/discussions/$CREATED_DISCUSSION_ID" "$STUDENT_TOKEN" "" "Delete created discussion"
# fi

# ======================
# SUMMARY
# ======================

print_section "TEST SUMMARY"

echo -e "${GREEN}✓ API Testing Complete!${NC}"
echo ""
echo "Created Resources (for manual verification):"
[ -n "$CREATED_DISCUSSION_ID" ] && echo -e "  ${BLUE}Discussion ID: $CREATED_DISCUSSION_ID${NC}"
[ -n "$CREATED_GROUP_ID" ] && echo -e "  ${BLUE}Group ID: $CREATED_GROUP_ID${NC}"
[ -n "$CREATED_ANSWER_ID" ] && echo -e "  ${BLUE}Answer ID: $CREATED_ANSWER_ID${NC}"
[ -n "$CREATED_MESSAGE_ID" ] && echo -e "  ${BLUE}Message ID: $CREATED_MESSAGE_ID${NC}"
echo ""
echo "Remember to:"
echo "1. Verify the created resources in the database or web interface"
echo "2. Check logs for any errors during API calls"
echo "3. Clean up test data if needed"
echo "4. Run integration tests for complex workflows"
echo ""
echo -e "${CYAN}Testing completed at $(date)${NC}"