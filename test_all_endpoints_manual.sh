#!/bin/bash

# Generate JWT token for testing
TOKEN=$(python3 generate_test_token.py)
BASE_URL="http://localhost:8083/api/v1"

# Output file for results
OUTPUT_FILE="assessment-service-complete-api.txt"

echo "# ASSESSMENT SERVICE API REFERENCE" > $OUTPUT_FILE
echo "Base URL: $BASE_URL" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function to test endpoint and log result
test_endpoint() {
    local method=$1
    local endpoint=$2
    local desc=$3
    local data=$4
    local auth_required=$5
    
    echo "=== Testing: $desc ==="
    echo "## $desc" >> $OUTPUT_FILE
    echo "$method $endpoint" >> $OUTPUT_FILE
    
    if [ "$auth_required" = "true" ]; then
        if [ -n "$data" ]; then
            response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$data")
        else
            response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json")
        fi
        echo "Headers: Authorization: Bearer <token>" >> $OUTPUT_FILE
    else
        if [ -n "$data" ]; then
            response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
        else
            response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json")
        fi
    fi
    
    if [ -n "$data" ]; then
        echo "Request:" >> $OUTPUT_FILE
        echo "$data" >> $OUTPUT_FILE
    fi
    
    echo "Response:" >> $OUTPUT_FILE
    echo "$response" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
    
    # Show status
    if echo "$response" | grep -q '"success":true'; then
        echo "✅ SUCCESS: $desc"
    elif echo "$response" | grep -q '"success":false'; then
        echo "❌ FAILED: $desc"
    elif echo "$response" | grep -q "Public test endpoint working"; then
        echo "✅ SUCCESS: $desc"
    elif echo "$response" | grep -q "JWT Config Test"; then
        echo "✅ SUCCESS: $desc"
    else
        echo "⚠️  UNKNOWN: $desc"
    fi
    echo ""
}

echo "Starting comprehensive API testing..."

# 1. PUBLIC ENDPOINTS
echo "## PUBLIC ENDPOINTS (No Authentication Required)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/test/public" "Public Test Endpoint" "" "false"
test_endpoint "GET" "/test/jwt-config" "JWT Configuration Test" "" "false"

# 2. SUBJECT ENDPOINTS
echo "## SUBJECT MANAGEMENT" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/subjects" "Get All Subjects" "" "true"
test_endpoint "GET" "/subjects/public" "Get Public Subjects" "" "false"
test_endpoint "GET" "/subjects/2" "Get Subject by ID" "" "true"
test_endpoint "GET" "/subjects?page=0&size=5" "Get Subjects with Pagination" "" "true"
test_endpoint "GET" "/subjects?classLevel=CLASS_10" "Get Subjects by Class Level" "" "true"

# Create subject (ADMIN only)
create_subject_data='{"name":"Test Subject","description":"Test subject description","classLevel":"CLASS_10","displayOrder":99}'
test_endpoint "POST" "/subjects" "Create Subject (ADMIN)" "$create_subject_data" "true"

# 3. TOPIC ENDPOINTS
echo "## TOPIC MANAGEMENT" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/topics" "Get All Topics" "" "true"
test_endpoint "GET" "/topics/public/by-subject/2" "Get Public Topics by Subject" "" "false"
test_endpoint "GET" "/topics?subjectId=2" "Get Topics by Subject ID" "" "true"
test_endpoint "GET" "/topics?page=0&size=10" "Get Topics with Pagination" "" "true"

# Create topic (ADMIN only)
create_topic_data='{"name":"Test Topic","description":"Test topic description","subjectId":2}'
test_endpoint "POST" "/topics" "Create Topic (ADMIN)" "$create_topic_data" "true"

# 4. QUESTION ENDPOINTS
echo "## QUESTION MANAGEMENT" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/questions" "Get All Questions (ADMIN)" "" "true"
test_endpoint "GET" "/questions/random?subjectId=2&count=3" "Get Random Questions" "" "true"
test_endpoint "GET" "/questions/random?difficulty=EASY&count=5" "Get Random Questions by Difficulty" "" "true"
test_endpoint "GET" "/questions/public/daily" "Get Public Daily Questions" "" "false"
test_endpoint "GET" "/questions?page=0&size=10" "Get Questions with Pagination" "" "true"
test_endpoint "GET" "/questions?subjectId=2&difficulty=EASY" "Get Questions with Filters" "" "true"

# Create question (ADMIN only)
create_question_data='{
  "content": "What is 2 + 2?",
  "type": "MULTIPLE_CHOICE",
  "difficulty": "EASY",
  "subjectId": 2,
  "topicId": null,
  "options": [
    {"optionText": "3", "isCorrect": false, "explanation": "Incorrect"},
    {"optionText": "4", "isCorrect": true, "explanation": "Correct answer"},
    {"optionText": "5", "isCorrect": false, "explanation": "Incorrect"}
  ],
  "explanation": "Basic arithmetic",
  "points": 1,
  "timeLimit": 60,
  "classLevel": "CLASS_10"
}'
test_endpoint "POST" "/questions" "Create Question (ADMIN)" "$create_question_data" "true"

# 5. DAILY QUESTIONS
echo "## DAILY QUESTIONS" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/daily-questions" "Get Daily Questions" "" "false"
test_endpoint "GET" "/daily-questions/public" "Get Public Daily Questions" "" "false"
test_endpoint "GET" "/daily-questions/today" "Get Today's Daily Questions" "" "true"
test_endpoint "GET" "/daily-questions/today?subjectId=2" "Get Today's Daily Questions by Subject" "" "true"
test_endpoint "GET" "/daily-questions/streak" "Get Daily Question Streak" "" "true"
test_endpoint "GET" "/daily-questions/stats" "Get Daily Question Statistics" "" "true"
test_endpoint "GET" "/daily-questions/details" "Get Daily Question Details" "" "true"
test_endpoint "GET" "/daily-questions/history" "Get Daily Question History" "" "true"
test_endpoint "GET" "/daily-questions?date=2025-07-22" "Get Daily Questions by Date" "" "false"

# Submit daily question answer
submit_daily_data='{"answer":"4","timeTaken":30,"explanation":"Simple addition"}'
test_endpoint "POST" "/daily-questions/1/submit" "Submit Daily Question Answer" "$submit_daily_data" "true"

# Set daily questions (ADMIN)
set_daily_data='{"date":"2025-07-23","questionIds":[1,2,3]}'
test_endpoint "PUT" "/daily-questions" "Set Daily Questions (ADMIN)" "$set_daily_data" "true"

# 6. ANALYTICS
echo "## ANALYTICS" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/analytics/dashboard" "Get Analytics Dashboard" "" "true"
test_endpoint "GET" "/analytics/dashboard?period=WEEKLY" "Get Weekly Analytics Dashboard" "" "true"
test_endpoint "GET" "/analytics/performance" "Get Performance Analytics" "" "true"
test_endpoint "GET" "/analytics/performance?period=MONTHLY&subjectId=2" "Get Subject Performance Analytics" "" "true"
test_endpoint "GET" "/analytics/progress" "Get Progress Analytics" "" "true"
test_endpoint "GET" "/analytics/progress?subjectId=2" "Get Subject Progress" "" "true"
test_endpoint "GET" "/analytics/rankings" "Get User Rankings" "" "true"
test_endpoint "GET" "/analytics/rankings?type=GLOBAL&period=WEEKLY" "Get Global Weekly Rankings" "" "true"

# 7. CONTESTS
echo "## CONTESTS" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/contests" "Get All Contests" "" "true"
test_endpoint "GET" "/contests/public" "Get Public Contests" "" "false"
test_endpoint "GET" "/contests?page=0&size=10" "Get Contests with Pagination" "" "true"
test_endpoint "GET" "/contests?status=ACTIVE" "Get Active Contests" "" "true"
test_endpoint "GET" "/contests?type=PUBLIC" "Get Public Contest Type" "" "true"

# Create contest (ADMIN)
create_contest_data='{
  "title": "Test Contest",
  "description": "Test contest description", 
  "type": "PUBLIC",
  "startTime": "2025-07-25T10:00:00",
  "endTime": "2025-07-25T12:00:00",
  "duration": 120,
  "questionIds": [1, 2],
  "subjectId": 2,
  "classLevel": "CLASS_10",
  "maxParticipants": 100,
  "prizeMoney": 1000
}'
test_endpoint "POST" "/contests" "Create Contest (ADMIN)" "$create_contest_data" "true"

# Contest operations
test_endpoint "GET" "/contests/1" "Get Contest by ID" "" "true"
test_endpoint "POST" "/contests/1/join" "Join Contest" "" "true"
test_endpoint "GET" "/contests/1/leaderboard" "Get Contest Leaderboard" "" "true"
test_endpoint "GET" "/contests/1/results" "Get Contest Results" "" "true"

# 8. LIVE EXAMS
echo "## LIVE EXAMS" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/live-exams" "Get All Live Exams" "" "true"
test_endpoint "GET" "/live-exams/upcoming" "Get Upcoming Live Exams" "" "true"
test_endpoint "GET" "/live-exams/live" "Get Current Live Exams" "" "true"
test_endpoint "GET" "/live-exams?status=SCHEDULED" "Get Scheduled Live Exams" "" "true"
test_endpoint "GET" "/live-exams?classLevel=CLASS_10" "Get Live Exams by Class" "" "true"

test_endpoint "GET" "/live-exams/1" "Get Live Exam by ID" "" "true"
test_endpoint "POST" "/live-exams/1/register" "Register for Live Exam" "" "true"
test_endpoint "POST" "/live-exams/1/join" "Join Live Exam" "" "true"

# 9. PRACTICE PROBLEMS
echo "## PRACTICE PROBLEMS" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/practice-problems" "Get Practice Problems" "" "true"
test_endpoint "GET" "/practice-problems?page=0&size=10" "Get Practice Problems with Pagination" "" "true"
test_endpoint "GET" "/practice-problems?subjectId=2" "Get Practice Problems by Subject" "" "true"
test_endpoint "GET" "/practice-problems?difficulty=EASY" "Get Easy Practice Problems" "" "true"
test_endpoint "GET" "/practice-problems?type=CODING" "Get Coding Practice Problems" "" "true"
test_endpoint "GET" "/practice-problems/recommendations" "Get Problem Recommendations" "" "true"
test_endpoint "GET" "/practice-problems/recommendations?count=5&difficulty=MEDIUM" "Get Recommended Problems with Filters" "" "true"

test_endpoint "GET" "/practice-problems/1" "Get Practice Problem by ID" "" "true"
test_endpoint "GET" "/practice-problems/1/hint?hintLevel=1" "Get Practice Problem Hint" "" "true"
test_endpoint "POST" "/practice-problems/1/bookmark" "Toggle Problem Bookmark" "" "true"

# Submit practice problem solution
submit_practice_data='{"solution":"print(4)","language":"python","explanation":"Simple solution"}'
test_endpoint "POST" "/practice-problems/1/submit" "Submit Practice Problem Solution" "$submit_practice_data" "true"

# 10. LEADERBOARD
echo "## LEADERBOARD" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/leaderboard/global" "Get Global Leaderboard" "" "true"
test_endpoint "GET" "/leaderboard/public" "Get Public Leaderboard" "" "true"
test_endpoint "GET" "/leaderboard/global?period=WEEKLY" "Get Weekly Global Leaderboard" "" "true"
test_endpoint "GET" "/leaderboard/subject/2" "Get Subject Leaderboard" "" "true"
test_endpoint "GET" "/leaderboard/class/CLASS_10" "Get Class Leaderboard" "" "true"

# 11. PERSONALIZED EXAMS
echo "## PERSONALIZED EXAMS" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/personalized-exams" "Get Personalized Exams" "" "true"
test_endpoint "GET" "/personalized-exams/stats" "Get Personalized Exam Stats" "" "true"
test_endpoint "GET" "/personalized-exams?status=COMPLETED" "Get Completed Personalized Exams" "" "true"

# Create personalized exam
create_personalized_data='{
  "subjectId": 2,
  "difficulty": "MEDIUM", 
  "questionCount": 10,
  "duration": 30,
  "classLevel": "CLASS_10"
}'
test_endpoint "POST" "/personalized-exams" "Create Personalized Exam" "$create_personalized_data" "true"

test_endpoint "GET" "/personalized-exams/1" "Get Personalized Exam by ID" "" "true"
test_endpoint "POST" "/personalized-exams/1/start" "Start Personalized Exam" "" "true"

# 12. ADMIN ENDPOINTS
echo "## ADMIN ENDPOINTS" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/admin/analytics" "Get Admin Analytics" "" "true"
test_endpoint "GET" "/admin/analytics?period=MONTHLY" "Get Monthly Admin Analytics" "" "true"
test_endpoint "GET" "/admin/practice-problems-test" "Test Practice Problems (ADMIN)" "" "true"

# Admin daily questions
admin_daily_data='{"date":"2025-07-24","questionIds":[1,2,3,4,5]}'
test_endpoint "PUT" "/admin/daily-questions" "Set Daily Questions (ADMIN)" "$admin_daily_data" "true"

# Admin practice problems
test_endpoint "POST" "/admin/create-practice-problems?subjectId=2&count=10" "Create Practice Problems from Random Questions" "" "true"

admin_practice_data='[1,2,3,4,5]'
test_endpoint "POST" "/admin/create-practice-problems-from-ids" "Create Practice Problems from Question IDs" "$admin_practice_data" "true"

# 13. HEALTH CHECK
echo "## HEALTH CHECK" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

test_endpoint "GET" "/actuator/health" "Health Check" "" "false"

echo ""
echo "✅ API testing complete! Results saved to: $OUTPUT_FILE"
echo "📊 Check the file for complete request/response documentation"