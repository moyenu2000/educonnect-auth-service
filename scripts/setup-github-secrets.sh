#!/bin/bash

# GitHub Secrets Setup Script
# This script helps you set up all required GitHub secrets for CI/CD

set -e

echo "🔧 GitHub Secrets Setup for EduConnect CI/CD"
echo "=============================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is logged in
if ! gh auth status &> /dev/null; then
    echo "❌ You are not logged in to GitHub CLI."
    echo "Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and you are logged in."
echo ""

# Function to set a secret
set_secret() {
    local name=$1
    local description=$2
    local default_value=$3
    local is_required=$4
    
    echo "🔐 Setting secret: $name"
    echo "Description: $description"
    
    if [ -n "$default_value" ]; then
        echo "Default value: $default_value"
        read -p "Enter value (press Enter for default): " value
        if [ -z "$value" ]; then
            value=$default_value
        fi
    else
        if [ "$is_required" = "true" ]; then
            while [ -z "$value" ]; do
                read -p "Enter value (required): " value
                if [ -z "$value" ]; then
                    echo "❌ This secret is required!"
                fi
            done
        else
            read -p "Enter value (optional, press Enter to skip): " value
        fi
    fi
    
    if [ -n "$value" ]; then
        echo "$value" | gh secret set "$name"
        echo "✅ Secret $name set successfully"
    else
        echo "⏭️ Skipped $name"
    fi
    echo ""
}

echo "📋 Setting up required secrets..."
echo ""

# VM Configuration (Required)
set_secret "VM_IP" "Your VM IP address" "35.188.75.223" true

# Database & Authentication
set_secret "DB_PASSWORD" "Database password" "" true
set_secret "DB_USER" "Database username" "educonnect" false
set_secret "JWT_SECRET" "JWT secret (base64 encoded)" "" true

# Email Configuration
set_secret "MAIL_USERNAME" "Email username for sending emails" "healthhubjavafest@gmail.com" false
set_secret "MAIL_PASSWORD" "Email app password" "" true

# Docker Hub
set_secret "DOCKER_HUB_USERNAME" "Docker Hub username" "" true
set_secret "DOCKER_HUB_TOKEN" "Docker Hub access token" "" true

# Google Cloud (Optional)
echo "🔧 Google Cloud configuration (optional):"
set_secret "GCP_SA_KEY" "Google Cloud service account JSON key" "" false

# VM Access
echo "🔧 VM access configuration:"
set_secret "VM_USERNAME" "VM SSH username" "" true
set_secret "VM_SSH_KEY" "VM SSH private key" "" true

# OAuth (Optional)
echo "🔧 OAuth configuration (optional):"
set_secret "GOOGLE_CLIENT_ID" "Google OAuth client ID" "" false
set_secret "GOOGLE_CLIENT_SECRET" "Google OAuth client secret" "" false

# API Keys
set_secret "GEMINI_API_KEY" "Gemini AI API key" "AIzaSyDedz-JY1RT3Oj8T8M76r_cFQXnQbhafto" false

echo "🎉 GitHub secrets setup completed!"
echo ""
echo "📋 Summary of set secrets:"
gh secret list
echo ""
echo "🚀 You can now trigger deployments by pushing to main branch:"
echo "   git push origin main"
echo ""
echo "Or manually trigger with:"
echo "   gh workflow run deploy.yml"