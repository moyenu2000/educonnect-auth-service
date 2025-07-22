#!/bin/bash

# Get JWT token
TOKEN=$(python3 generate_test_token.py)

echo "=== Assessment Service API Testing ==="
echo "Token: $TOKEN"
echo ""

# Test 1: Test endpoints (no auth required)
echo "1. Testing public endpoints:"
echo "   - Public test endpoint:"
curl -s -X GET "http://localhost:8083/api/v1/test/public"
echo ""
echo "   - JWT config test:"
curl -s -X GET "http://localhost:8083/api/v1/test/jwt-config"
echo ""

# Test 2: Subjects
echo "2. Testing Subjects endpoints:"
echo "   - Get all subjects:"
curl -s -X GET "http://localhost:8083/api/v1/subjects" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get public subjects:"
curl -s -X GET "http://localhost:8083/api/v1/subjects/public" | jq '.success' 2>/dev/null || echo "Error"
echo "   - Get subject by ID:"
curl -s -X GET "http://localhost:8083/api/v1/subjects/2" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo ""

# Test 3: Topics
echo "3. Testing Topics endpoints:"
echo "   - Get all topics:"
curl -s -X GET "http://localhost:8083/api/v1/topics" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get topics by subject (public):"
curl -s -X GET "http://localhost:8083/api/v1/topics/public/by-subject/2" | jq '.success' 2>/dev/null || echo "Error"
echo ""

# Test 4: Questions
echo "4. Testing Questions endpoints:"
echo "   - Get all questions (ADMIN):"
curl -s -X GET "http://localhost:8083/api/v1/questions" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get random questions:"
curl -s -X GET "http://localhost:8083/api/v1/questions/random?subjectId=2&count=5" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo ""

# Test 5: Daily Questions
echo "5. Testing Daily Questions endpoints:"
echo "   - Get today's daily questions:"
curl -s -X GET "http://localhost:8083/api/v1/daily-questions/today" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get daily questions with filters:"
curl -s -X GET "http://localhost:8083/api/v1/daily-questions?subjectId=2" | jq '.success' 2>/dev/null || echo "Error"
echo ""

# Test 6: Analytics
echo "6. Testing Analytics endpoints:"
echo "   - Get dashboard analytics:"
curl -s -X GET "http://localhost:8083/api/v1/analytics/dashboard" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get performance metrics:"
curl -s -X GET "http://localhost:8083/api/v1/analytics/performance" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo ""

# Test 7: Contests
echo "7. Testing Contests endpoints:"
echo "   - Get all contests:"
curl -s -X GET "http://localhost:8083/api/v1/contests" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get public contests:"
curl -s -X GET "http://localhost:8083/api/v1/contests/public" | jq '.success' 2>/dev/null || echo "Error"
echo ""

# Test 8: Live Exams
echo "8. Testing Live Exams endpoints:"
echo "   - Get all live exams:"
curl -s -X GET "http://localhost:8083/api/v1/live-exams" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get upcoming exams:"
curl -s -X GET "http://localhost:8083/api/v1/live-exams/upcoming" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo ""

# Test 9: Practice Problems
echo "9. Testing Practice Problems endpoints:"
echo "   - Get practice problems:"
curl -s -X GET "http://localhost:8083/api/v1/practice-problems" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "   - Get recommendations:"
curl -s -X GET "http://localhost:8083/api/v1/practice-problems/recommendations" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo ""

# Test 10: Leaderboard
echo "10. Testing Leaderboard endpoints:"
echo "    - Get global leaderboard:"
curl -s -X GET "http://localhost:8083/api/v1/leaderboard/global" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo "    - Get public leaderboard:"
curl -s -X GET "http://localhost:8083/api/v1/leaderboard/public" -H "Authorization: Bearer $TOKEN" | jq '.success'
echo ""

echo "=== API Testing Complete ==="