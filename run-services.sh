#!/bin/bash

# EduConnect Services Runner Script
# This script starts all EduConnect services using Maven wrapper

echo "Starting EduConnect Services..."

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default values if not provided
export SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL:-"jdbc:postgresql://localhost:5433/educonnect"}
export SPRING_RABBITMQ_USERNAME=${SPRING_RABBITMQ_USERNAME:-"educonnect"}
export SPRING_RABBITMQ_PASSWORD=${SPRING_RABBITMQ_PASSWORD:-"educonnect123"}
export MANAGEMENT_HEALTH_RABBIT_ENABLED=${MANAGEMENT_HEALTH_RABBIT_ENABLED:-"false"}
export MANAGEMENT_HEALTH_MAIL_ENABLED=${MANAGEMENT_HEALTH_MAIL_ENABLED:-"false"}

# Kill any existing processes
echo "Stopping any existing services..."
pkill -f "auth.*spring-boot:run" 2>/dev/null
pkill -f "discussion-service.*spring-boot:run" 2>/dev/null
pkill -f "assessment-service.*spring-boot:run" 2>/dev/null

# Wait for processes to terminate
sleep 3

# Start infrastructure services with Docker Compose
echo "Starting infrastructure services (PostgreSQL, Redis, RabbitMQ)..."
docker-compose up -d postgres redis rabbitmq

# Wait for infrastructure to be ready
echo "Waiting for infrastructure to be ready..."
sleep 10

# Start Auth Service
echo "Starting Auth Service..."
cd auth && SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/educonnect?currentSchema=auth" ./mvnw spring-boot:run > ../auth-service.log 2>&1 &
cd ..

# Start Discussion Service
echo "Starting Discussion Service..."
cd discussion-service && SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/educonnect?currentSchema=discussion" ./mvnw spring-boot:run -Dspring.profiles.active=test > ../discussion-service.log 2>&1 &
cd ..

# Start Assessment Service
echo "Starting Assessment Service..."
cd assessment-service && SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/educonnect?currentSchema=assessment" ./mvnw spring-boot:run -Dspring.profiles.active=test > ../assessment-service.log 2>&1 &
cd ..

echo "Services are starting..."
echo "Logs:"
echo "  Auth Service: auth-service.log"
echo "  Discussion Service: discussion-service.log"
echo "  Assessment Service: assessment-service.log"
echo ""
echo "Health check endpoints:"
echo "  Auth Service: http://localhost:8081/api/v1/actuator/health"
echo "  Discussion Service: http://localhost:8082/api/v1/actuator/health"
echo "  Assessment Service: http://localhost:8083/api/v1/actuator/health"
echo ""
echo "Wait about 30 seconds for all services to fully start up..."