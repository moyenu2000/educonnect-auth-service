#!/bin/bash

# Debug script to test authentication flow

AUTH_URL="http://localhost:8081/api/v1"
DISCUSSION_URL="http://localhost:8082/api/v1"
STUDENT_EMAIL="moyenuddin075@gmail.com"
STUDENT_PASSWORD="password123"

echo "=== DEBUG: Authentication Flow ==="

# Step 1: Authenticate
echo "1. Authenticating user..."
response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "{\"usernameOrEmail\": \"$STUDENT_EMAIL\", \"password\": \"$STUDENT_PASSWORD\"}" \
    "$AUTH_URL/auth/login")

echo "Auth response: $response"

# Step 2: Extract token
token=$(echo "$response" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
echo "Extracted token: $token"
echo "Token length: ${#token}"

if [ -z "$token" ]; then
    echo "ERROR: No token extracted!"
    exit 1
fi

# Step 3: Test API with token
echo ""
echo "2. Testing API with token..."
echo "Token preview: ${token:0:50}..."

# Test as done in the script
echo ""
echo "3. Testing with script-like curl command..."
api_response=$(curl -s -w "\n%{http_code}" -X GET \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    "$DISCUSSION_URL/discussions?page=0&size=5")

http_code=$(echo "$api_response" | tail -n1)
body=$(echo "$api_response" | sed '$d')

echo "HTTP Code: $http_code"
echo "Response body: $body"

if [ "$http_code" -eq 200 ]; then
    echo "SUCCESS: API call worked!"
else
    echo "FAILED: API call failed"
fi

# Test simpler version
echo ""
echo "4. Testing with simple curl..."
simple_response=$(curl -s -H "Authorization: Bearer $token" "$DISCUSSION_URL/discussions?page=0&size=5")
echo "Simple response: $simple_response"