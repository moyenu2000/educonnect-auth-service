#!/bin/bash

# EduConnect Local Development Runner
# This script starts all services locally without Docker

set -e

echo "🚀 Starting EduConnect services locally..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file by copying from .env.example:"
    echo "cp .env.example .env"
    echo "Then edit .env with your local configuration values."
    exit 1
fi

# Load environment variables
echo "📋 Loading environment variables from .env..."
source .env

# Verify critical environment variables
required_vars=("DB_USER" "DB_PASSWORD" "DB_NAME" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set in .env file"
        exit 1
    fi
done

echo "✅ Environment variables loaded successfully"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use. Please stop the service using this port."
        return 1
    fi
    return 0
}

# Check if ports are available
echo "🔍 Checking if required ports are available..."
ports=(8081 8082 8083 80)
for port in "${ports[@]}"; do
    if ! check_port $port; then
        echo "❌ Port $port is in use. Please free it before running this script."
        exit 1
    fi
done

echo "✅ All required ports are available"

# Function to cleanup background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    jobs -p | xargs -r kill 2>/dev/null || true
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start services
echo ""
echo "🔧 Starting Auth Service (port 8081)..."
cd auth
./mvnw spring-boot:run > ../logs/auth.log 2>&1 &
AUTH_PID=$!
cd ..

echo "🔧 Starting Discussion Service (port 8082)..."
cd discussion-service
./mvnw spring-boot:run > ../logs/discussion.log 2>&1 &
DISCUSSION_PID=$!
cd ..

echo "🔧 Starting Assessment Service (port 8083)..."
cd assessment-service
./mvnw spring-boot:run > ../logs/assessment.log 2>&1 &
ASSESSMENT_PID=$!
cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

echo "🔧 Installing frontend dependencies (if needed)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

echo "🔧 Starting Frontend (port 80)..."
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 All services are starting up!"
echo ""
echo "📊 Service Status:"
echo "├── Auth Service:       http://localhost:8081"
echo "├── Discussion Service: http://localhost:8082"
echo "├── Assessment Service: http://localhost:8083"
echo "└── Frontend:           http://localhost:8080"
echo ""
echo "📋 Logs are being written to:"
echo "├── Auth:       logs/auth.log"
echo "├── Discussion: logs/discussion.log"
echo "├── Assessment: logs/assessment.log"
echo "└── Frontend:   logs/frontend.log"
echo ""
echo "💡 Tip: You can view logs in real-time with:"
echo "tail -f logs/auth.log"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for services to start and show status
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
check_service() {
    local name=$1
    local url=$2
    local timeout=30
    local count=0
    
    while [ $count -lt $timeout ]; do
        if curl -s -f "$url" >/dev/null 2>&1; then
            echo "✅ $name is ready!"
            return 0
        fi
        sleep 2
        count=$((count + 2))
    done
    echo "⚠️  $name is taking longer than expected to start"
    return 1
}

echo "🔍 Checking service health..."
check_service "Auth Service" "http://localhost:8081/api/v1/actuator/health"
check_service "Discussion Service" "http://localhost:8082/api/v1/actuator/health" 
check_service "Assessment Service" "http://localhost:8083/api/v1/actuator/health"
check_service "Frontend" "http://localhost:8080"

echo ""
echo "🎯 All services are running! You can now access:"
echo "🌐 Frontend: http://localhost:8080"
echo ""

# Keep script running and wait for user to stop
wait