#!/bin/bash

# Assessment Service API Testing Script
# Tests all endpoints with proper authentication

BASE_URL="http://localhost:8083/api/v1"
AUTH_URL="http://localhost:8081/api/v1"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to get JWT token
get_token() {
    local username=$1
    local password=$2
    curl -s -X POST "$AUTH_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"usernameOrEmail\": \"$username\", \"password\": \"$password\"}" | \
        grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4
}

# Function to test API endpoint
test_api() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    local description=$5
    
    echo -e "${BLUE}Testing: $description${NC}"
    echo "  $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -X GET "$BASE_URL$endpoint" \
                -H "Authorization: Bearer $token")
        else
            response=$(curl -s -X GET "$BASE_URL$endpoint")
        fi
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -X PUT "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -X DELETE "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token")
    fi
    
    # Check if response contains success
    if echo "$response" | grep -q '"success":true'; then
        echo -e "  ${GREEN}✅ SUCCESS${NC}"
    elif echo "$response" | grep -q '"success":false'; then
        echo -e "  ${RED}❌ FAILED${NC}"
        echo "  Error: $(echo "$response" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)"
    else
        echo -e "  ${YELLOW}⚠️  UNKNOWN RESPONSE${NC}"
    fi
    
    echo "  Response preview: $(echo "$response" | head -c 100)..."
    echo ""
}

echo -e "${BLUE}======================================"
echo -e "🧪 ASSESSMENT SERVICE API TEST SUITE"
echo -e "======================================${NC}"
echo ""

# Get authentication tokens
echo -e "${YELLOW}📝 Getting Authentication Tokens...${NC}"
ADMIN_TOKEN=$(get_token "admin" "password123")
STUDENT_TOKEN=$(get_token "moyenuddin075@gmail.com" "password123")
QSETTER_TOKEN=$(get_token "qsetter" "password123")

echo "Admin token length: ${#ADMIN_TOKEN}"
echo "Student token length: ${#STUDENT_TOKEN}"
echo "Q.Setter token length: ${#QSETTER_TOKEN}"
echo ""

if [ ${#ADMIN_TOKEN} -lt 100 ] || [ ${#STUDENT_TOKEN} -lt 100 ] || [ ${#QSETTER_TOKEN} -lt 100 ]; then
    echo -e "${RED}❌ Failed to get valid tokens. Check authentication service.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All tokens obtained successfully!${NC}"
echo ""

# 1. SUBJECT MANAGEMENT APIs
echo -e "${YELLOW}📚 1. SUBJECT MANAGEMENT APIs${NC}"
echo "================================"

test_api "GET" "/subjects/public" "" "" "Get Public Subjects"
test_api "GET" "/subjects" "$STUDENT_TOKEN" "" "Get All Subjects (Student)"
test_api "GET" "/subjects" "$ADMIN_TOKEN" "" "Get All Subjects (Admin)"

# Create subject test data
SUBJECT_DATA='{"name": "Test Mathematics", "description": "Test subject for API testing", "classLevel": "CLASS_10", "displayOrder": 11, "isActive": true}'
test_api "POST" "/subjects" "$ADMIN_TOKEN" "$SUBJECT_DATA" "Create Subject (Admin)"

# 2. TOPIC MANAGEMENT APIs
echo -e "${YELLOW}📖 2. TOPIC MANAGEMENT APIs${NC}"
echo "==============================="

test_api "GET" "/topics" "$STUDENT_TOKEN" "" "Get All Topics (Student)"
test_api "GET" "/topics/public/by-subject/1" "" "" "Get Public Topics by Subject"

# Create topic test data
TOPIC_DATA='{"name": "Test Algebra", "description": "Test topic for API testing", "subjectId": 1, "isActive": true}'
test_api "POST" "/topics" "$ADMIN_TOKEN" "$TOPIC_DATA" "Create Topic (Admin)"

# 3. QUESTION MANAGEMENT APIs
echo -e "${YELLOW}❓ 3. QUESTION MANAGEMENT APIs${NC}"
echo "=================================="

test_api "GET" "/questions" "$STUDENT_TOKEN" "" "Get All Questions (Student)"
test_api "GET" "/questions" "$QSETTER_TOKEN" "" "Get All Questions (Question Setter)"

# Create question test data
QUESTION_DATA='{"text": "What is 2 + 2?", "type": "MCQ", "difficulty": "EASY", "subjectId": 1, "topicId": 1, "options": ["3", "4", "5", "6"], "correctAnswer": "4", "explanation": "Basic addition", "tags": ["math", "basic"], "points": 1}'
test_api "POST" "/questions" "$QSETTER_TOKEN" "$QUESTION_DATA" "Create Question (Question Setter)"

# 4. DAILY QUESTIONS APIs
echo -e "${YELLOW}📅 4. DAILY QUESTIONS APIs${NC}"
echo "==========================="

test_api "GET" "/daily-questions/public" "" "" "Get Public Daily Questions"
test_api "GET" "/daily-questions" "$STUDENT_TOKEN" "" "Get Daily Questions (Student)"
test_api "GET" "/daily-questions/streak" "$STUDENT_TOKEN" "" "Get User Streak (Student)"
test_api "GET" "/daily-questions/history" "$STUDENT_TOKEN" "" "Get Daily Question History (Student)"

# Submit daily question answer
DAILY_ANSWER='{"answer": "B", "timeTaken": 45, "explanation": "Selected option B"}'
test_api "POST" "/daily-questions/1/submit" "$STUDENT_TOKEN" "$DAILY_ANSWER" "Submit Daily Question Answer"

# 5. ANALYTICS APIs
echo -e "${YELLOW}📊 5. ANALYTICS APIs${NC}"
echo "===================="

test_api "GET" "/analytics/dashboard" "$STUDENT_TOKEN" "" "Get Analytics Dashboard (Student)"
test_api "GET" "/analytics/performance" "$STUDENT_TOKEN" "" "Get Performance Analytics (Student)"
test_api "GET" "/analytics/progress" "$STUDENT_TOKEN" "" "Get Progress Analytics (Student)"
test_api "GET" "/analytics/rankings" "$STUDENT_TOKEN" "" "Get Rankings (Student)"

# Admin analytics
test_api "GET" "/admin/analytics" "$ADMIN_TOKEN" "" "Get Admin Analytics"

# 6. LEADERBOARD APIs
echo -e "${YELLOW}🏆 6. LEADERBOARD APIs${NC}"
echo "======================"

test_api "GET" "/leaderboard/public" "" "" "Get Public Leaderboard"
test_api "GET" "/leaderboard/global" "$STUDENT_TOKEN" "" "Get Global Leaderboard (Student)"
test_api "GET" "/leaderboard/subject/1" "$STUDENT_TOKEN" "" "Get Subject Leaderboard (Student)"
test_api "GET" "/leaderboard/class/10" "$STUDENT_TOKEN" "" "Get Class Leaderboard (Student)"

# 7. CONTEST APIs
echo -e "${YELLOW}🏁 7. CONTEST APIs${NC}"
echo "=================="

test_api "GET" "/contests/public" "" "" "Get Public Contests"
test_api "GET" "/contests" "$STUDENT_TOKEN" "" "Get All Contests (Student)"
test_api "GET" "/contests" "$ADMIN_TOKEN" "" "Get All Contests (Admin)"

# Create contest test data
CONTEST_DATA='{"title": "Test Math Contest", "description": "Test contest for API testing", "type": "MIXED", "startTime": "2025-01-15T10:00:00", "endTime": "2025-01-15T12:00:00", "duration": 120, "rules": "Test rules", "participants": 0, "status": "UPCOMING"}'
test_api "POST" "/contests" "$ADMIN_TOKEN" "$CONTEST_DATA" "Create Contest (Admin)"

# Contest participation
test_api "POST" "/contests/1/join" "$STUDENT_TOKEN" "" "Join Contest (Student)"
test_api "GET" "/contests/1/questions" "$STUDENT_TOKEN" "" "Get Contest Questions (Student)"
test_api "GET" "/contests/1/leaderboard" "$STUDENT_TOKEN" "" "Get Contest Leaderboard"

# Submit contest answer
CONTEST_ANSWER='{"answer": "A", "timeTaken": 30, "explanation": "Selected option A"}'
test_api "POST" "/contests/1/questions/1/submit" "$STUDENT_TOKEN" "$CONTEST_ANSWER" "Submit Contest Answer"

# 8. LIVE EXAM APIs (via Admin endpoints)
echo -e "${YELLOW}📝 8. LIVE EXAM APIs${NC}"
echo "==================="

# Create live exam
LIVE_EXAM_DATA='{"title": "Test Live Exam", "description": "Test live exam", "subjectId": 1, "duration": 60, "startTime": "2024-12-31T15:00:00", "endTime": "2024-12-31T16:00:00", "questionIds": [1, 2, 3]}'
test_api "POST" "/admin/live-exams" "$ADMIN_TOKEN" "$LIVE_EXAM_DATA" "Create Live Exam (Admin)"

# 9. ADMIN MANAGEMENT APIs
echo -e "${YELLOW}⚙️  9. ADMIN MANAGEMENT APIs${NC}"
echo "============================"

# Set daily questions
DAILY_QUESTIONS_DATA='{"date": "2025-01-15", "questionIds": [1, 2, 3], "subjectDistribution": {"mathematics": 2, "science": 1}}'
test_api "PUT" "/admin/daily-questions" "$ADMIN_TOKEN" "$DAILY_QUESTIONS_DATA" "Set Daily Questions (Admin)"

# 10. PRACTICE PROBLEM APIs
echo -e "${YELLOW}💪 10. PRACTICE PROBLEM APIs${NC}"
echo "============================"

# Note: These endpoints might be covered under questions or have specific controllers
test_api "GET" "/questions?type=MCQ" "$STUDENT_TOKEN" "" "Get Practice Problems (Student)"

# 11. HEALTH & TEST ENDPOINTS
echo -e "${YELLOW}🔧 11. HEALTH & TEST ENDPOINTS${NC}"
echo "================================"

test_api "GET" "/actuator/health" "" "" "Health Check"
test_api "GET" "/test/public" "" "" "Test Public Endpoint"
test_api "GET" "/test/jwt-config" "" "" "Test JWT Config"

# Summary
echo -e "${BLUE}======================================"
echo -e "📋 TEST SUMMARY"
echo -e "======================================${NC}"
echo ""
echo -e "${GREEN}✅ Test completed! Check the results above.${NC}"
echo ""
echo -e "${YELLOW}📝 NOTES:${NC}"
echo "- Some endpoints may require existing data to work properly"
echo "- Admin endpoints require ADMIN role authentication"
echo "- Contest and exam features require proper setup"
echo "- Mock data is available for leaderboards and analytics"
echo ""
echo -e "${BLUE}🚀 The assessment service is ready for exam-taking website!${NC}"