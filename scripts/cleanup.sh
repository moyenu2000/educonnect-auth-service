#!/bin/bash

# EduConnect Docker Cleanup Script
# This script cleans up Docker containers, images, and volumes

echo "🧹 Starting Docker cleanup..."

# Stop all running containers
echo "🛑 Stopping all running containers..."
sudo docker-compose -f docker-compose.prod.yml down || true

# Remove all containers
echo "🗑️  Removing all containers..."
sudo docker container prune -f

# Remove all images
echo "🖼️  Removing unused images..."
sudo docker image prune -a -f

# Remove all volumes
echo "💾 Removing all volumes..."
sudo docker volume prune -f

# Remove all networks
echo "🌐 Removing unused networks..."
sudo docker network prune -f

# Clean up system
echo "🧽 Cleaning up system..."
sudo docker system prune -a -f --volumes

# Clean up apt cache
echo "📦 Cleaning up apt cache..."
sudo apt-get autoremove -y
sudo apt-get autoclean

# Show disk usage
echo "💽 Current disk usage:"
df -h

echo "✅ Cleanup completed!"