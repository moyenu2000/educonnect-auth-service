#!/bin/bash

# EduConnect Test Runner Script - Auth Service Only
# This script runs tests for the Auth service (currently the only service with tests)

set -e

echo "🧪 Starting EduConnect Auth Service Tests..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
declare -A test_results

# Function to run tests for Auth service
run_auth_tests() {
    local profile=${1:-test}
    
    echo -e "${BLUE}[INFO]${NC} Running Auth Service tests with profile: $profile"
    
    if [ -d "auth" ]; then
        cd "auth"
        
        echo -e "${YELLOW}[INFO]${NC} Running unit tests..."
        ./mvnw clean test -Dspring.profiles.active=$profile -q
        
        if [ $? -eq 0 ]; then
            test_results["auth"]="PASSED"
            echo -e "${GREEN}[PASS]${NC} Auth Service tests completed successfully"
            
            # Generate coverage report
            echo -e "${BLUE}[INFO]${NC} Generating coverage report..."
            ./mvnw jacoco:report -q
            
            if [ -f "target/site/jacoco/index.html" ]; then
                echo -e "${GREEN}[INFO]${NC} Coverage report generated: auth/target/site/jacoco/index.html"
            fi
        else
            test_results["auth"]="FAILED"
            echo -e "${RED}[FAIL]${NC} Auth Service tests failed"
        fi
        
        cd ..
    else
        echo -e "${RED}[ERROR]${NC} Auth service directory not found!"
        test_results["auth"]="MISSING"
        return 1
    fi
}

# Parse command line arguments
PROFILE="test"

while [[ $# -gt 0 ]]; do
    case $1 in
        --profile)
            PROFILE="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --profile PROFILE     Test profile (test|integration-test)"
            echo "  --help               Show this help message"
            echo ""
            echo "Note: Only Auth Service has tests configured."
            echo "Other services (discussion-service, assessment-service) will be skipped."
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}[INFO]${NC} Test profile: $PROFILE"
echo -e "${YELLOW}[NOTE]${NC} Only Auth Service has tests configured"
echo ""

# Run Auth service tests
run_auth_tests "$PROFILE"

# Print summary
echo ""
echo "🏁 Test Summary"
echo "==============="

status=${test_results["auth"]:-"NOT_RUN"}
case $status in
    "PASSED")
        echo -e "${GREEN}✅ Auth Service: PASSED${NC}"
        echo ""
        echo -e "${GREEN}🎉 Auth Service tests passed!${NC}"
        echo -e "${GREEN}✅ Ready for deployment${NC}"
        echo ""
        echo -e "${BLUE}📊 View coverage report:${NC}"
        echo "   auth/target/site/jacoco/index.html"
        exit 0
        ;;
    "FAILED")
        echo -e "${RED}❌ Auth Service: FAILED${NC}"
        echo ""
        echo -e "${RED}💥 Auth Service tests failed!${NC}"
        echo -e "${RED}❌ Fix issues before deployment${NC}"
        exit 1
        ;;
    "MISSING")
        echo -e "${RED}❓ Auth Service: DIRECTORY NOT FOUND${NC}"
        echo ""
        echo -e "${RED}💥 Cannot find auth service directory!${NC}"
        exit 1
        ;;
    *)
        echo -e "${RED}❓ Auth Service: UNKNOWN STATUS${NC}"
        exit 1
        ;;
esac
