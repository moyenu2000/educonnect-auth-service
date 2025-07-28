#!/bin/bash

# Generate JWT token for testing
TOKEN=$(python3 generate_test_token.py)

echo "=== Comprehensive Assessment Service API Testing ==="
echo ""

# Function to test endpoint and show result
test_endpoint() {
    local method=$1
    local url=$2
    local desc=$3
    local data=$4
    
    echo "Testing: $desc"
    echo "  $method $url"
    
    if [ -n "$data" ]; then
        result=$(curl -s -X $method "$url" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$data")
    else
        result=$(curl -s -X $method "$url" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json")
    fi
    
    # Check if response contains success field
    if echo "$result" | grep -q '"success":true'; then
        echo "  ✓ SUCCESS"
    elif echo "$result" | grep -q '"success":false'; then
        echo "  ✗ FAILED: $(echo "$result" | grep -o '"error":"[^"]*"' | head -1)"
    elif echo "$result" | grep -q "Public test endpoint working"; then
        echo "  ✓ SUCCESS (Public endpoint)"
    elif echo "$result" | grep -q "JWT Config Test"; then
        echo "  ✓ SUCCESS (JWT test endpoint)"
    else
        echo "  ? UNKNOWN: ${result:0:100}..."
    fi
    echo ""
}

# Test public endpoints (no auth required)
echo "=== 1. PUBLIC ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/test/public" "Public test endpoint"
test_endpoint "GET" "http://localhost:8083/api/v1/test/jwt-config" "JWT configuration test"
test_endpoint "GET" "http://localhost:8083/api/v1/subjects/public" "Public subjects"
test_endpoint "GET" "http://localhost:8083/api/v1/topics/public/by-subject/2" "Public topics for subject 2"
test_endpoint "GET" "http://localhost:8083/api/v1/contests/public" "Public contests"
test_endpoint "GET" "http://localhost:8083/api/v1/daily-questions" "Daily questions (no filters)"
test_endpoint "GET" "http://localhost:8083/api/v1/daily-questions/public" "Public daily questions"

# Test authenticated endpoints
echo "=== 2. SUBJECT ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/subjects" "Get all subjects"
test_endpoint "GET" "http://localhost:8083/api/v1/subjects/2" "Get subject by ID"
test_endpoint "GET" "http://localhost:8083/api/v1/subjects?page=0&size=5" "Get subjects with pagination"

echo "=== 3. TOPIC ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/topics" "Get all topics"
test_endpoint "GET" "http://localhost:8083/api/v1/topics?subjectId=2" "Get topics by subject"

echo "=== 4. QUESTION ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/questions" "Get all questions (ADMIN)"
test_endpoint "GET" "http://localhost:8083/api/v1/questions/random?subjectId=2&count=3" "Get random questions"
test_endpoint "GET" "http://localhost:8083/api/v1/questions/public/daily" "Public daily questions"

echo "=== 5. DAILY QUESTION ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/daily-questions/today" "Today's daily questions"
test_endpoint "GET" "http://localhost:8083/api/v1/daily-questions/streak" "Daily question streak"
test_endpoint "GET" "http://localhost:8083/api/v1/daily-questions/stats" "Daily question stats"
test_endpoint "GET" "http://localhost:8083/api/v1/daily-questions/details" "Daily question details"
test_endpoint "GET" "http://localhost:8083/api/v1/daily-questions/history" "Daily question history"

echo "=== 6. ANALYTICS ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/analytics/dashboard" "Analytics dashboard"
test_endpoint "GET" "http://localhost:8083/api/v1/analytics/performance" "Performance analytics"
test_endpoint "GET" "http://localhost:8083/api/v1/analytics/progress" "Progress analytics"
test_endpoint "GET" "http://localhost:8083/api/v1/analytics/rankings" "User rankings"

echo "=== 7. CONTEST ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/contests" "Get all contests"
test_endpoint "GET" "http://localhost:8083/api/v1/contests?page=0&size=10" "Get contests with pagination"

echo "=== 8. LIVE EXAM ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/live-exams" "Get all live exams"
test_endpoint "GET" "http://localhost:8083/api/v1/live-exams/upcoming" "Get upcoming exams"
test_endpoint "GET" "http://localhost:8083/api/v1/live-exams/live" "Get current live exams"

echo "=== 9. PRACTICE PROBLEM ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/practice-problems" "Get practice problems"
test_endpoint "GET" "http://localhost:8083/api/v1/practice-problems/recommendations" "Get recommendations"

echo "=== 10. LEADERBOARD ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/leaderboard/global" "Global leaderboard"
test_endpoint "GET" "http://localhost:8083/api/v1/leaderboard/public" "Public leaderboard"

echo "=== 11. ADMIN ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/admin/analytics" "Admin analytics"
test_endpoint "GET" "http://localhost:8083/api/v1/admin/practice-problems-test" "Admin practice problems test"

echo "=== 12. PERSONALIZED EXAM ENDPOINTS ==="
test_endpoint "GET" "http://localhost:8083/api/v1/personalized-exams" "Personalized exams"
test_endpoint "GET" "http://localhost:8083/api/v1/personalized-exams/stats" "Personalized exam stats"

echo ""
echo "=== TESTING COMPLETE ==="
echo "Used JWT Token: ${TOKEN:0:50}..."