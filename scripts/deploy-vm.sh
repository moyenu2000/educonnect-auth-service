#!/bin/bash

# EduConnect VM Deployment Script
# This script configures and deploys the application with VM IP settings

set -e

# Configuration
VM_IP=${VM_IP:-35.188.75.223}
ENVIRONMENT=${ENVIRONMENT:-production}

echo "🚀 Starting EduConnect deployment for VM: $VM_IP"

# Function to create environment files
create_env_files() {
    echo "📝 Creating environment files..."
    
    # Create backend .env file
    cat > .env << EOF
VM_IP=$VM_IP
DB_USER=${DB_USER:-educonnect}
DB_PASSWORD=${DB_PASSWORD:-educonnect123}
RABBITMQ_USER=${RABBITMQ_USER:-educonnect}
RABBITMQ_PASSWORD=${RABBITMQ_PASSWORD:-educonnect123}
JWT_SECRET=${JWT_SECRET:-dGhpcyBpcyBhIHZlcnkgc2VjdXJlIHNlY3JldCBrZXkgZm9yIGp3dCB0b2tlbiBnZW5lcmF0aW9uIHdoaWNoIHNob3VsZCBiZSBjaGFuZ2VkIGluIHByb2R1Y3Rpb24=}
MAIL_USERNAME=${MAIL_USERNAME:-healthhubjavafest@gmail.com}
MAIL_PASSWORD=${MAIL_PASSWORD:-dydvxmkgfbhmajlv}
GEMINI_API_KEY=${GEMINI_API_KEY:-AIzaSyDedz-JY1RT3Oj8T8M76r_cFQXnQbhafto}
FRONTEND_URL=http://$VM_IP:3000
APP_BASE_URL=http://$VM_IP:8081
FILE_BASE_URL=http://$VM_IP:8082/api/v1/files
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET:-}
EOF

    # Create frontend .env file
    cat > frontend/.env << EOF
VM_IP=$VM_IP
VITE_VM_IP=$VM_IP
VITE_API_BASE_URL=http://$VM_IP
EOF

    echo "✅ Environment files created successfully"
}

# Function to export environment variables
export_env_vars() {
    echo "🔧 Exporting environment variables..."
    export VM_IP=$VM_IP
    export FRONTEND_URL=http://$VM_IP:3000
    export APP_BASE_URL=http://$VM_IP:8081
    export FILE_BASE_URL=http://$VM_IP:8082/api/v1/files
    echo "✅ Environment variables exported"
}

# Function to build and deploy services
deploy_services() {
    echo "🏗️ Building and deploying services..."
    
    # Stop existing services
    echo "⏹️ Stopping existing services..."
    docker-compose down || true
    
    # Clean up Docker system
    echo "🧹 Cleaning up Docker system..."
    docker system prune -f
    
    # Build and start services
    echo "🚀 Starting services with VM IP configuration..."
    docker-compose build
    docker-compose up -d
    
    echo "✅ Services deployed successfully"
}

# Function to verify deployment
verify_deployment() {
    echo "🔍 Verifying deployment..."
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    # Check service health
    services=("8081" "8082" "8083")
    for port in "${services[@]}"; do
        echo "🔍 Checking service on port $port..."
        if curl -f "http://$VM_IP:$port/api/v1/actuator/health" > /dev/null 2>&1; then
            echo "✅ Service on port $port is healthy"
        else
            echo "❌ Service on port $port is not responding"
            exit 1
        fi
    done
    
    # Check frontend
    echo "🔍 Checking frontend on port 3000..."
    if curl -f "http://$VM_IP:3000" > /dev/null 2>&1; then
        echo "✅ Frontend is accessible"
    else
        echo "❌ Frontend is not responding"
        exit 1
    fi
    
    echo "✅ All services are running successfully!"
}

# Function to display deployment info
display_info() {
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📊 Service URLs:"
    echo "  Frontend:    http://$VM_IP:3000"
    echo "  Auth:        http://$VM_IP:8081/api/v1"
    echo "  Discussion:  http://$VM_IP:8082/api/v1"
    echo "  Assessment:  http://$VM_IP:8083/api/v1"
    echo ""
    echo "🔗 Health Checks:"
    echo "  Auth:        http://$VM_IP:8081/api/v1/actuator/health"
    echo "  Discussion:  http://$VM_IP:8082/api/v1/actuator/health"
    echo "  Assessment:  http://$VM_IP:8083/api/v1/actuator/health"
    echo ""
}

# Main deployment flow
main() {
    echo "🚀 EduConnect VM Deployment"
    echo "VM IP: $VM_IP"
    echo "Environment: $ENVIRONMENT"
    echo ""
    
    create_env_files
    export_env_vars
    deploy_services
    verify_deployment
    display_info
}

# Run main function
main "$@"