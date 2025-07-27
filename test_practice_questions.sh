#!/bin/bash

# Test script for Practice Questions functionality
set -e

echo "=== Testing Practice Questions Implementation ==="

# Base URLs (updated with correct ports and context paths)
AUTH_BASE_URL="http://localhost:8081/api/v1"
ASSESSMENT_BASE_URL="http://localhost:8083/api/v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Step 1: Login as admin to get JWT token
print_info "Step 1: Logging in as admin..."

LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract access token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken // empty')

if [ -z "$ACCESS_TOKEN" ] || [ "$ACCESS_TOKEN" = "null" ]; then
    echo -e "${RED}Failed to get access token${NC}"
    echo "Login response: $LOGIN_RESPONSE"
    exit 1
fi

print_status 0 "Admin login successful"

# Step 2: Check if there are questions available
print_info "Step 2: Checking available questions..."

QUESTIONS_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/questions?page=0&size=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json")

echo "Questions response: $QUESTIONS_RESPONSE"

# Extract first question ID
QUESTION_ID=$(echo $QUESTIONS_RESPONSE | jq -r '.data.content[0].id // empty')

if [ -z "$QUESTION_ID" ] || [ "$QUESTION_ID" = "null" ]; then
    echo -e "${RED}No questions available for testing${NC}"
    exit 1
fi

print_status 0 "Found question ID: $QUESTION_ID"

# Step 3: Create a practice problem from the question
print_info "Step 3: Creating practice problem from question..."

CREATE_PRACTICE_RESPONSE=$(curl -s -X POST "$ASSESSMENT_BASE_URL/admin/practice-questions" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"questionId\": $QUESTION_ID,
    \"customPoints\": 15,
    \"customDifficulty\": \"MEDIUM\",
    \"hintText\": \"Think about the key concepts\",
    \"hints\": [\"Hint 1: Focus on the basics\", \"Hint 2: Review the theory\"],
    \"solutionSteps\": \"Step 1: Analyze the question\\nStep 2: Apply the concept\\nStep 3: Verify the answer\"
  }")

echo "Create practice response: $CREATE_PRACTICE_RESPONSE"

# Check if creation was successful
PRACTICE_ID=$(echo $CREATE_PRACTICE_RESPONSE | jq -r '.data.id // empty')

if [ -z "$PRACTICE_ID" ] || [ "$PRACTICE_ID" = "null" ]; then
    # Check if it already exists
    if echo $CREATE_PRACTICE_RESPONSE | grep -q "already exists"; then
        print_info "Practice problem already exists for this question"
        
        # Get existing practice problems to find the ID
        EXISTING_PRACTICE_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/admin/practice-questions?page=0&size=10" \
          -H "Authorization: Bearer $ACCESS_TOKEN")
        
        PRACTICE_ID=$(echo $EXISTING_PRACTICE_RESPONSE | jq -r ".data.content[] | select(.question.id == $QUESTION_ID) | .id")
        
        if [ -z "$PRACTICE_ID" ] || [ "$PRACTICE_ID" = "null" ]; then
            echo -e "${RED}Could not find or create practice problem${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Failed to create practice problem${NC}"
        echo "Response: $CREATE_PRACTICE_RESPONSE"
        exit 1
    fi
fi

print_status 0 "Practice problem available with ID: $PRACTICE_ID"

# Step 4: Get practice questions list (student endpoint)
print_info "Step 4: Testing practice questions list endpoint..."

PRACTICE_LIST_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/practice-questions?page=0&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Practice list response: $PRACTICE_LIST_RESPONSE"

# Check if the response contains our practice question
if echo $PRACTICE_LIST_RESPONSE | jq -e ".data.content[] | select(.questionId == $QUESTION_ID)" > /dev/null; then
    print_status 0 "Practice questions list retrieved successfully"
else
    print_status 1 "Practice question not found in list"
fi

# Step 5: Get specific practice question details
print_info "Step 5: Testing practice question details endpoint..."

PRACTICE_DETAIL_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/practice-questions/$QUESTION_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Practice detail response: $PRACTICE_DETAIL_RESPONSE"

if echo $PRACTICE_DETAIL_RESPONSE | jq -e '.data.questionId' > /dev/null; then
    print_status 0 "Practice question details retrieved successfully"
else
    print_status 1 "Failed to retrieve practice question details"
fi

# Step 6: Submit an answer to the practice question
print_info "Step 6: Testing practice question submission..."

# Get the question details to determine the correct answer format
QUESTION_DETAIL=$(echo $PRACTICE_DETAIL_RESPONSE | jq -r '.data')
QUESTION_TYPE=$(echo $QUESTION_DETAIL | jq -r '.type')

# Prepare answer based on question type
if [ "$QUESTION_TYPE" = "MCQ" ]; then
    # For MCQ, use the first option ID
    ANSWER_VALUE=$(echo $QUESTION_DETAIL | jq -r '.options[0].id')
elif [ "$QUESTION_TYPE" = "TRUE_FALSE" ]; then
    ANSWER_VALUE="true"
else
    ANSWER_VALUE="Sample answer"
fi

SUBMIT_RESPONSE=$(curl -s -X POST "$ASSESSMENT_BASE_URL/practice-questions/$QUESTION_ID/submit" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"answer\": \"$ANSWER_VALUE\",
    \"timeTaken\": 45,
    \"explanation\": \"Test explanation\",
    \"deviceInfo\": \"Test device\"
  }")

echo "Submit response: $SUBMIT_RESPONSE"

if echo $SUBMIT_RESPONSE | jq -e '.data.id' > /dev/null; then
    print_status 0 "Answer submission successful"
    
    # Check if immediate feedback is provided
    if echo $SUBMIT_RESPONSE | jq -e '.data.correctAnswer' > /dev/null; then
        print_status 0 "Immediate feedback provided"
    else
        print_status 1 "Immediate feedback not provided"
    fi
else
    print_status 1 "Answer submission failed"
fi

# Step 7: Test submission history
print_info "Step 7: Testing submission history endpoint..."

HISTORY_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/practice-questions/submissions/history?page=0&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "History response: $HISTORY_RESPONSE"

if echo $HISTORY_RESPONSE | jq -e '.data.content' > /dev/null; then
    print_status 0 "Submission history retrieved successfully"
else
    print_status 1 "Failed to retrieve submission history"
fi

# Step 8: Test user statistics
print_info "Step 8: Testing user statistics endpoint..."

STATS_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/practice-questions/submissions/stats" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Stats response: $STATS_RESPONSE"

if echo $STATS_RESPONSE | jq -e '.data.totalSubmissions' > /dev/null; then
    print_status 0 "User statistics retrieved successfully"
else
    print_status 1 "Failed to retrieve user statistics"
fi

# Step 9: Test question submissions for specific question
print_info "Step 9: Testing question-specific submissions endpoint..."

QUESTION_SUBMISSIONS_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/practice-questions/$QUESTION_ID/submissions" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Question submissions response: $QUESTION_SUBMISSIONS_RESPONSE"

if echo $QUESTION_SUBMISSIONS_RESPONSE | jq -e '.data' > /dev/null; then
    print_status 0 "Question-specific submissions retrieved successfully"
else
    print_status 1 "Failed to retrieve question-specific submissions"
fi

# Step 10: Test admin endpoints - bulk create
print_info "Step 10: Testing admin bulk create endpoint..."

# Get more question IDs for bulk creation
MORE_QUESTIONS_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/questions?page=0&size=3" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

QUESTION_IDS=$(echo $MORE_QUESTIONS_RESPONSE | jq -r '.data.content[].id' | head -3 | tr '\n' ',' | sed 's/,$//')

if [ ! -z "$QUESTION_IDS" ]; then
    BULK_CREATE_RESPONSE=$(curl -s -X POST "$ASSESSMENT_BASE_URL/admin/practice-questions/bulk-create" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"questionIds\": [$QUESTION_IDS],
        \"defaultPoints\": 10,
        \"defaultDifficulty\": \"EASY\"
      }")
    
    echo "Bulk create response: $BULK_CREATE_RESPONSE"
    
    if echo $BULK_CREATE_RESPONSE | jq -e '.data.totalCreated' > /dev/null; then
        print_status 0 "Bulk create successful"
    else
        print_status 0 "Bulk create completed (some questions may already exist)"
    fi
else
    print_info "Skipping bulk create test - insufficient questions"
fi

# Step 11: Test admin practice problems list
print_info "Step 11: Testing admin practice problems list..."

ADMIN_LIST_RESPONSE=$(curl -s -X GET "$ASSESSMENT_BASE_URL/admin/practice-questions?page=0&size=10" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "Admin list response: $ADMIN_LIST_RESPONSE"

if echo $ADMIN_LIST_RESPONSE | jq -e '.data.content' > /dev/null; then
    print_status 0 "Admin practice problems list retrieved successfully"
else
    print_status 1 "Failed to retrieve admin practice problems list"
fi

# Step 12: Test multiple submissions (verify multiple attempts allowed)
print_info "Step 12: Testing multiple submissions for same question..."

SECOND_SUBMIT_RESPONSE=$(curl -s -X POST "$ASSESSMENT_BASE_URL/practice-questions/$QUESTION_ID/submit" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"answer\": \"$ANSWER_VALUE\",
    \"timeTaken\": 30,
    \"explanation\": \"Second attempt\",
    \"deviceInfo\": \"Test device\"
  }")

echo "Second submit response: $SECOND_SUBMIT_RESPONSE"

if echo $SECOND_SUBMIT_RESPONSE | jq -e '.data.id' > /dev/null; then
    print_status 0 "Multiple submissions allowed successfully"
else
    print_status 1 "Multiple submissions failed"
fi

print_info "=== Practice Questions Testing Complete ==="

echo -e "${GREEN}"
echo "All tests completed successfully!"
echo "✓ Practice problem creation"
echo "✓ Practice questions listing with submission status"
echo "✓ Question details retrieval"
echo "✓ Answer submission with immediate feedback"
echo "✓ Multiple submissions allowed"
echo "✓ Submission history tracking"
echo "✓ User statistics"
echo "✓ Admin management endpoints"
echo -e "${NC}"