#!/bin/bash

# =====================================================
# EduConnect Demo Data Execution Script
# =====================================================
# This script executes the demo data generation for
# the EduConnect educational platform
# =====================================================

set -e

echo "🚀 Starting EduConnect Demo Data Generation..."
echo "================================================"

# Database connection parameters
DB_HOST="localhost"
DB_PORT="5433"
DB_NAME="educonnect"
DB_USER="educonnect"
DB_PASSWORD="educonnect123"

# Export password to avoid prompts
export PGPASSWORD="$DB_PASSWORD"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if PostgreSQL is running
check_postgres() {
    echo_info "Checking PostgreSQL connection..."
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        echo_success "PostgreSQL is running and accessible"
    else
        echo_error "Cannot connect to PostgreSQL. Please ensure:"
        echo "  - PostgreSQL is running on $DB_HOST:$DB_PORT"
        echo "  - Database '$DB_NAME' exists"
        echo "  - User '$DB_USER' has proper permissions"
        exit 1
    fi
}

# Function to check if database schemas exist
check_schemas() {
    echo_info "Checking database schemas..."
    
    # Check if schemas exist
    SCHEMAS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('auth', 'assessment', 'discussion');")
    
    if [[ $SCHEMAS == *"auth"* ]] && [[ $SCHEMAS == *"assessment"* ]] && [[ $SCHEMAS == *"discussion"* ]]; then
        echo_success "All required schemas exist"
    else
        echo_warning "Some schemas are missing. This is normal for first-time setup."
        echo_info "Schemas will be created when microservices start."
    fi
}

# Function to execute SQL file
execute_sql_file() {
    local file=$1
    local description=$2
    
    echo_info "$description"
    if [ -f "$file" ]; then
        echo "  📄 Executing: $file"
        if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file" > /tmp/sql_output.log 2>&1; then
            echo_success "$description completed successfully"
            
            # Show some key statistics from the output
            if grep -q "Generated" /tmp/sql_output.log; then
                echo "  📊 Statistics:"
                grep "Generated\|NOTICE" /tmp/sql_output.log | sed 's/^/    /'
            fi
        else
            echo_error "$description failed"
            echo "  📄 Error details:"
            tail -10 /tmp/sql_output.log | sed 's/^/    /'
            return 1
        fi
    else
        echo_error "File not found: $file"
        return 1
    fi
}

# Function to show final statistics
show_statistics() {
    echo_info "Generating final statistics..."
    
    cat > /tmp/stats_query.sql << 'EOF'
-- Generate comprehensive statistics
DO $$
DECLARE
    stats_output TEXT;
BEGIN
    SELECT format('
🎯 EDUCONNECT DEMO DATA STATISTICS
=====================================
👥 Users:              %s
   ├── Admins:         %s  
   ├── Question Setters: %s
   └── Students:       %s

📚 Academic Content:
   ├── Subjects:       %s
   ├── Topics:         %s
   ├── Questions:      %s
   └── Question Options: %s

💬 Community:
   ├── Discussions:    %s
   └── Answers:        %s

🏆 Assessments:
   ├── Daily Questions: %s
   ├── Practice Problems: %s
   ├── Contests:       %s
   └── Live Exams:     %s

🔐 Authentication:
   └── Refresh Tokens: %s

=====================================
✅ Demo data generation completed successfully!
🌟 Your EduConnect platform is now ready with comprehensive test data.
',
    (SELECT COUNT(*) FROM auth.users),
    (SELECT COUNT(*) FROM auth.users WHERE role = 'ADMIN'),
    (SELECT COUNT(*) FROM auth.users WHERE role = 'QUESTION_SETTER'),
    (SELECT COUNT(*) FROM auth.users WHERE role = 'STUDENT'),
    (SELECT COUNT(*) FROM assessment.subjects),
    (SELECT COUNT(*) FROM assessment.topics),
    (SELECT COUNT(*) FROM assessment.questions),
    (SELECT COUNT(*) FROM assessment.question_options),
    (SELECT COUNT(*) FROM discussion.discussions),
    (SELECT COUNT(*) FROM discussion.answers),
    (SELECT COUNT(*) FROM assessment.daily_questions),
    (SELECT COUNT(*) FROM assessment.practice_problems),
    (SELECT COUNT(*) FROM assessment.contests),
    (SELECT COUNT(*) FROM assessment.live_exams),
    (SELECT COUNT(*) FROM auth.refresh_tokens)
    ) INTO stats_output;
    
    RAISE NOTICE '%', stats_output;
END $$;
EOF

    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f /tmp/stats_query.sql 2>/dev/null | grep -A 30 "🎯 EDUCONNECT"; then
        echo ""
    else
        echo_warning "Could not generate detailed statistics (tables may not exist yet)"
        echo_info "This is normal if microservices haven't created tables yet."
    fi
}

# Function to provide usage instructions
show_usage_instructions() {
    echo ""
    echo_info "Next Steps:"
    echo "==========="
    echo "1. 🚀 Start all microservices:"
    echo "   cd auth && ./mvnw spring-boot:run &"
    echo "   cd assessment-service && ./mvnw spring-boot:run &" 
    echo "   cd discussion-service && ./mvnw spring-boot:run &"
    echo "   cd frontend && npm run dev &"
    echo ""
    echo "2. 🌐 Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Auth API: http://localhost:8081/api/v1"
    echo "   Assessment API: http://localhost:8083/api/v1"
    echo "   Discussion API: http://localhost:8082/api/v1"
    echo ""
    echo "3. 👤 Demo User Accounts:"
    echo "   Admin: admin_john / password"
    echo "   Question Setter: qs_math_prof_kumar / password"
    echo "   Student: student_12_001 / password"
    echo ""
}

# Main execution flow
main() {
    echo "🎓 EduConnect Educational Platform"
    echo "📊 Comprehensive Demo Data Generation"
    echo "================================================"
    echo ""
    
    # Pre-execution checks
    check_postgres
    check_schemas
    
    echo ""
    echo_info "Starting demo data generation process..."
    echo ""
    
    # Execute base demo data
    if execute_sql_file "demo-data-generator.sql" "Generating base demo data (users, subjects, questions, discussions)"; then
        echo_success "Base demo data generation completed"
    else
        echo_error "Failed to generate base demo data"
        exit 1
    fi
    
    echo ""
    
    # Execute expansion data  
    if execute_sql_file "demo-data-expansion.sql" "Generating massive expansion data (10K+ questions, 1K+ discussions)"; then
        echo_success "Expansion demo data generation completed"
    else
        echo_warning "Expansion data generation failed, but base data is available"
        echo_info "You can still use the platform with base demo data"
    fi
    
    echo ""
    echo "================================================"
    
    # Show final statistics
    show_statistics
    
    # Clean up temp files
    rm -f /tmp/sql_output.log /tmp/stats_query.sql
    
    # Show usage instructions
    show_usage_instructions
    
    echo_success "Demo data generation process completed! 🎉"
}

# Handle script interruption
trap 'echo ""; echo_warning "Demo data generation interrupted"; exit 1' INT TERM

# Check if required files exist
if [ ! -f "demo-data-generator.sql" ]; then
    echo_error "demo-data-generator.sql not found in current directory"
    exit 1
fi

if [ ! -f "demo-data-expansion.sql" ]; then
    echo_warning "demo-data-expansion.sql not found - will skip expansion data"
fi

# Execute main function
main

exit 0