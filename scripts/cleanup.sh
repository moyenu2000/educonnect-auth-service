#!/bin/bash

# Cleanup script for EduConnect services

set -e

echo "Starting cleanup process..."

# Function to check if docker-compose file exists
check_compose_file() {
    if [ ! -f "docker-compose.prod.yml" ]; then
        echo "Error: docker-compose.prod.yml not found in current directory"
        exit 1
    fi
}

# Function to check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        echo "Error: .env file not found in current directory"
        exit 1
    fi
}

# Function to stop and remove containers
cleanup_containers() {
    echo "Stopping and removing containers..."
    
    # Stop all services
    sudo docker-compose -f docker-compose.prod.yml --env-file .env down --remove-orphans || true
    
    # Remove specific containers if they exist
    sudo docker rm -f educonnect-postgres educonnect-redis educonnect-auth-service educonnect-discussion-service educonnect-assessment-service educonnect-frontend 2>/dev/null || true
    
    # Kill any processes using ports 3000, 8081, 8082, 8083 to prevent conflicts
    echo "Killing processes on ports 3000, 8081, 8082, 8083..."
    sudo fuser -k 3000/tcp 8081/tcp 8082/tcp 8083/tcp 2>/dev/null || true
    
    # Remove orphaned containers
    sudo docker container prune -f || true
    
    echo "Containers cleaned up successfully"
}

# Function to clean up images
cleanup_images() {
    echo "Cleaning up unused images..."
    sudo docker image prune -f || true
    echo "Images cleaned up successfully"
}

# Function to clean up volumes (optional)
cleanup_volumes() {
    if [ "$1" == "all" ]; then
        echo "Cleaning up all volumes..."
        sudo docker volume prune -f || true
        echo "Volumes cleaned up successfully"
    else
        echo "Skipping volume cleanup (use 'all' argument to clean volumes)"
    fi
}

# Function to clean up networks
cleanup_networks() {
    echo "Cleaning up unused networks..."
    sudo docker network prune -f || true
    echo "Networks cleaned up successfully"
}

# Main cleanup function
main() {
    echo "EduConnect Docker Cleanup Script"
    echo "================================"
    
    check_compose_file
    check_env_file
    
    cleanup_containers
    cleanup_images
    cleanup_networks
    cleanup_volumes $1
    
    echo "Cleanup completed successfully!"
    echo "You can now run: sudo docker-compose -f docker-compose.prod.yml --env-file .env up -d"
}

# Run main function with all arguments
main "$@"
