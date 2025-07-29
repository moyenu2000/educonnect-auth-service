#!/bin/bash

# EduConnect Local Development Runner
# This script starts infrastructure using Docker and services locally

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
        echo "⚠️  Port $1 is already in use."
        return 1
    fi
    return 0
}

# Function to stop services on a port
stop_port() {
    local port=$1
    local pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "🛑 Stopping services on port $port..."
        echo "$pids" | xargs -r kill -TERM 2>/dev/null || true
        sleep 2
        # Force kill if still running
        local remaining_pids=$(lsof -ti :$port 2>/dev/null || true)
        if [ -n "$remaining_pids" ]; then
            echo "💀 Force killing services on port $port..."
            echo "$remaining_pids" | xargs -r kill -KILL 2>/dev/null || true
        fi
        echo "✅ Port $port is now free"
    fi
}

# Check if required commands are available
echo "🔍 Checking if Docker and Docker Compose are available..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Start Docker infrastructure
echo "🐳 Starting Docker infrastructure (PostgreSQL, Redis, RabbitMQ)..."
docker-compose -f docker-compose.infrastructure.yml up -d

echo "⏳ Waiting for infrastructure services to be ready..."
sleep 15

# Stop any services running on required ports
echo "🔍 Checking and stopping services on required ports..."
all_ports=(5433 6379 5672 15672 8081 8082 8083 3000)
for port in "${all_ports[@]}"; do
    if ! check_port $port; then
        stop_port $port
    fi
done

echo "✅ All required ports are now available"

# # Function to cleanup background processes on script exit
# cleanup() {
#     echo ""
#     echo "🛑 Stopping all services..."
#     jobs -p | xargs -r kill 2>/dev/null || true
#     echo "🐳 Stopping Docker infrastructure..."
#     docker-compose -f docker-compose.infrastructure.yml down
#     exit 0
# }

# # Set trap to cleanup on script exit
# trap cleanup SIGINT SIGTERM EXIT

# # Start services
# echo ""
# echo "🔧 Starting Auth Service (port 8081)..."
# cd auth
# ./mvnw spring-boot:run > ../logs/auth.log 2>&1 &
# AUTH_PID=$!
# cd ..

# echo "🔧 Starting Discussion Service (port 8082)..."
# cd discussion-service
# ./mvnw spring-boot:run > ../logs/discussion.log 2>&1 &
# DISCUSSION_PID=$!
# cd ..

# echo "🔧 Starting Assessment Service (port 8083)..."
# cd assessment-service
# ./mvnw spring-boot:run > ../logs/assessment.log 2>&1 &
# ASSESSMENT_PID=$!
# cd ..

# # Create logs directory if it doesn't exist
# mkdir -p logs

# echo "🔧 Installing frontend dependencies (if needed)..."
# cd frontend
# if [ ! -d "node_modules" ]; then
#     echo "📦 Installing npm dependencies..."
#     npm install
# fi

# echo "🔧 Starting Frontend (port 80)..."
# npm run dev > ../logs/frontend.log 2>&1 &
# FRONTEND_PID=$!
# cd ..

# echo ""
# echo "🎉 All services are starting up!"
# echo ""
# echo "📊 Service Status:"
# echo "├── 🐳 PostgreSQL:      http://localhost:5433 (Docker)"
# echo "├── 🐳 Redis:           http://localhost:6379 (Docker)"
# echo "├── 🐳 RabbitMQ:        http://localhost:15672 (Docker Management UI)"
# echo "├── Auth Service:       http://localhost:8081"
# echo "├── Discussion Service: http://localhost:8082"
# echo "├── Assessment Service: http://localhost:8083"
# echo "└── Frontend:           http://localhost:3000"
# echo ""
# echo "📋 Application logs are being written to:"
# echo "├── Auth:       logs/auth.log"
# echo "├── Discussion: logs/discussion.log"
# echo "├── Assessment: logs/assessment.log"
# echo "└── Frontend:   logs/frontend.log"
# echo ""
# echo "🐳 Docker infrastructure logs:"
# echo "docker-compose -f docker-compose.infrastructure.yml logs -f"
# echo ""
# echo "💡 Tip: You can view application logs in real-time with:"
# echo "tail -f logs/auth.log"
# echo ""
# echo "🛑 Press Ctrl+C to stop all services (including Docker infrastructure)"
# echo ""

# # Wait for services to start and show status
# echo "⏳ Waiting for services to start..."
# sleep 10

# # Check service health
# check_service() {
#     local name=$1
#     local url=$2
#     local timeout=300
#     local count=0
    
#     while [ $count -lt $timeout ]; do
#         if curl -s -f "$url" >/dev/null 2>&1; then
#             echo "✅ $name is ready!"
#             return 0
#         fi
#         sleep 2
#         count=$((count + 2))
#     done
#     echo "⚠️  $name is taking longer than expected to start"
#     return 1
# }

# echo "🔍 Checking service health..."
# check_service "Auth Service" "http://localhost:8081/api/v1/actuator/health"
# check_service "Discussion Service" "http://localhost:8082/api/v1/actuator/health" 
# check_service "Assessment Service" "http://localhost:8083/api/v1/actuator/health"
# check_service "Frontend" "http://localhost:3000"

# echo ""
# echo "🎯 All services are running! You can now access:"
# echo "🌐 Frontend: http://localhost:3000"
# echo ""

# # Keep script running and wait for user to stop
# wait