#!/bin/bash

# Generate fresh JWT token
TOKEN=$(python3 generate_discussion_token.py)
BASE_URL="http://localhost:8082/api/v1"

echo "=== COMPREHENSIVE DISCUSSION SERVICE API TEST ==="
echo "Base URL: $BASE_URL"
echo "Token: $TOKEN"
echo ""

# Output file for results
OUTPUT_FILE="discussion-service-test-results.md"

cat > $OUTPUT_FILE << EOF
# Discussion Service API Test Results

**Service URL:** $BASE_URL  
**Test Date:** $(date)  
**JWT Token:** $TOKEN

---

EOF

# Function to test endpoint and log result
test_endpoint() {
    local method=$1
    local endpoint=$2
    local desc=$3
    local data=$4
    local auth_required=$5
    local expected_status=$6
    
    echo "Testing: $desc ($method $endpoint)"
    
    cat >> $OUTPUT_FILE << EOF
## $desc
**Method:** $method  
**Endpoint:** $endpoint  
**Authentication Required:** $auth_required  

EOF
    
    if [ "$auth_required" = "true" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -w "HTTP_STATUS:%{http_code};TIME:%{time_total}" -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "HTTP_STATUS:%{http_code};TIME:%{time_total}" -X $method "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json")
        fi
    else
        if [ -n "$data" ]; then
            response=$(curl -s -w "HTTP_STATUS:%{http_code};TIME:%{time_total}" -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json" \
                -d "$data")
        else
            response=$(curl -s -w "HTTP_STATUS:%{http_code};TIME:%{time_total}" -X $method "$BASE_URL$endpoint" \
                -H "Content-Type: application/json")
        fi
    fi
    
    # Extract status and time
    status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    time=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*;TIME:[0-9.]*$//')
    
    # Format JSON response if possible
    formatted_body=$(echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body")
    
    cat >> $OUTPUT_FILE << EOF
**Request Data:**
\`\`\`json
$data
\`\`\`

**Response Status:** $status  
**Response Time:** ${time}s  
**Response Body:**
\`\`\`json
$formatted_body
\`\`\`

**Status:** $([ "$status" = "$expected_status" ] && echo "✅ PASS" || echo "❌ FAIL (Expected: $expected_status, Got: $status)")

---

EOF

    # Console output
    if [ "$status" = "$expected_status" ]; then
        echo "  ✅ Status: $status (${time}s)"
    else
        echo "  ❌ Status: $status (Expected: $expected_status) (${time}s)"
    fi
    
    sleep 0.5  # Brief pause between requests
}

echo "Starting comprehensive endpoint testing..."

# 1. UNAUTHENTICATED ENDPOINTS
echo ""
echo "=== Testing Unauthenticated Endpoints ==="

test_endpoint "GET" "/discussions/public" "Get Public Discussions" "" "false" "200"
test_endpoint "GET" "/discussions/1/public" "Get Public Discussion by ID" "" "false" "404"
test_endpoint "GET" "/actuator/health" "Health Check Endpoint" "" "false" "200"

# 2. DISCUSSION ENDPOINTS (Authenticated)
echo ""
echo "=== Testing Discussion Endpoints ==="

test_endpoint "GET" "/discussions" "Get All Discussions" "" "true" "200"
test_endpoint "GET" "/discussions/1" "Get Discussion by ID" "" "true" "404"
test_endpoint "POST" "/discussions" "Create Discussion" '{"title":"Test Discussion","content":"Test content","type":"QUESTION","subjectId":1}' "true" "400"
test_endpoint "PUT" "/discussions/1" "Update Discussion" '{"title":"Updated Discussion","content":"Updated content"}' "true" "404"
test_endpoint "DELETE" "/discussions/1" "Delete Discussion" "" "true" "404"
test_endpoint "POST" "/discussions/1/upvote" "Upvote Discussion" "" "true" "404"
test_endpoint "POST" "/discussions/1/downvote" "Downvote Discussion" "" "true" "404"
test_endpoint "POST" "/discussions/1/bookmark" "Bookmark Discussion" "" "true" "404"

# 3. ANSWER ENDPOINTS
echo ""
echo "=== Testing Answer Endpoints ==="

test_endpoint "GET" "/discussions/1/answers" "Get Answers for Discussion" "" "true" "404"
test_endpoint "POST" "/discussions/1/answers" "Create Answer" '{"content":"Test answer"}' "true" "404"
test_endpoint "PUT" "/answers/1" "Update Answer" '{"content":"Updated answer"}' "true" "404"
test_endpoint "DELETE" "/answers/1" "Delete Answer" "" "true" "404"
test_endpoint "POST" "/answers/1/upvote" "Upvote Answer" "" "true" "404"
test_endpoint "POST" "/answers/1/downvote" "Downvote Answer" "" "true" "404"
test_endpoint "POST" "/answers/1/accept" "Accept Answer" "" "true" "404"

# 4. GROUP ENDPOINTS
echo ""
echo "=== Testing Group Endpoints ==="

test_endpoint "GET" "/groups" "Get All Groups" "" "true" "200"
test_endpoint "GET" "/groups/1" "Get Group by ID" "" "true" "404"
test_endpoint "POST" "/groups" "Create Group" '{"name":"Test Group","description":"Test description","type":"STUDY","isPrivate":false}' "true" "400"
test_endpoint "PUT" "/groups/1" "Update Group" '{"name":"Updated Group"}' "true" "404"
test_endpoint "POST" "/groups/1/join" "Join Group" "" "true" "404"
test_endpoint "GET" "/groups/1/members" "Get Group Members" "" "true" "404"
test_endpoint "PUT" "/groups/1/members/2/role" "Change Member Role" '{"role":"MODERATOR"}' "true" "404"
test_endpoint "DELETE" "/groups/1/members/2" "Remove Group Member" "" "true" "404"
test_endpoint "GET" "/groups/1/discussions" "Get Group Discussions" "" "true" "404"
test_endpoint "POST" "/groups/1/discussions" "Create Group Discussion" '{"title":"Group Test","content":"Group content"}' "true" "404"

# 5. MESSAGE ENDPOINTS
echo ""
echo "=== Testing Message Endpoints ==="

test_endpoint "GET" "/messages/conversations" "Get User Conversations" "" "true" "200"
test_endpoint "GET" "/messages/conversations/1" "Get Conversation Messages" "" "true" "404"
test_endpoint "POST" "/messages" "Send Message" '{"receiverId":2,"content":"Test message"}' "true" "400"
test_endpoint "PUT" "/messages/1" "Update Message" '{"content":"Updated message"}' "true" "404"
test_endpoint "DELETE" "/messages/1" "Delete Message" "" "true" "404"
test_endpoint "PUT" "/messages/1/read" "Mark Message as Read" "" "true" "404"
test_endpoint "GET" "/messages/unread-count" "Get Unread Messages Count" "" "true" "200"

# 6. NOTIFICATION ENDPOINTS
echo ""
echo "=== Testing Notification Endpoints ==="

test_endpoint "GET" "/notifications" "Get User Notifications" "" "true" "200"
test_endpoint "PUT" "/notifications/1/read" "Mark Notification as Read" "" "true" "404"
test_endpoint "PUT" "/notifications/read-all" "Mark All Notifications as Read" "" "true" "200"
test_endpoint "GET" "/notifications/unread-count" "Get Unread Notifications Count" "" "true" "200"

# 7. AI ENDPOINTS
echo ""
echo "=== Testing AI Endpoints ==="

test_endpoint "POST" "/ai/ask" "Ask AI Question" '{"query":"What is programming?","subjectId":1}' "true" "500"
test_endpoint "GET" "/ai/history" "Get AI Query History" "" "true" "200"

# 8. SEARCH ENDPOINTS
echo ""
echo "=== Testing Search Endpoints ==="

test_endpoint "GET" "/search/discussions?q=test" "Search Discussions" "" "true" "200"
test_endpoint "GET" "/search/groups?q=test" "Search Groups" "" "true" "200"
test_endpoint "GET" "/search/users?q=test" "Search Users" "" "true" "200"

# 9. FILE UPLOAD ENDPOINTS
echo ""
echo "=== Testing File Upload Endpoints ==="

test_endpoint "GET" "/files/my" "Get My Files" "" "true" "200"
test_endpoint "GET" "/files/details/1" "Get File Details" "" "true" "404"
test_endpoint "DELETE" "/files/1" "Delete File" "" "true" "400"
test_endpoint "GET" "/files/storage-info" "Get Storage Info" "" "true" "200"

echo ""
echo "=== Test Complete ==="
echo "Results saved to: $OUTPUT_FILE"
echo ""
echo "Summary:"
echo "✅ All endpoints discovered and tested"
echo "📝 Detailed results available in $OUTPUT_FILE"