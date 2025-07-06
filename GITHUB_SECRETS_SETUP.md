# GitHub Secrets Setup Guide

This document outlines all the GitHub secrets required for the EduConnect microservices deployment.

## Required Secrets

### Database Configuration
- **`DB_PASSWORD`** (Required): PostgreSQL database password
- **`DB_USER`** (Optional): Database username (defaults to 'educonnect' for local, 'postgres' for production)

### RabbitMQ Configuration  
- **`RABBITMQ_PASSWORD`** (Required): RabbitMQ password
- **`RABBITMQ_USER`** (Optional): RabbitMQ username (defaults to 'educonnect')

### JWT Configuration
- **`JWT_SECRET`** (Required): Secret key for JWT token generation and validation
  - Should be a long, random, base64-encoded string
  - Example generation: `openssl rand -base64 64`

### Email Service Configuration
- **`MAIL_USERNAME`** (Required): SMTP email username (e.g., Gmail account)
- **`MAIL_PASSWORD`** (Required): SMTP email password (use App Password for Gmail)

### Google OAuth Configuration
- **`GOOGLE_CLIENT_ID`** (Required): Google OAuth2 client ID
- **`GOOGLE_CLIENT_SECRET`** (Required): Google OAuth2 client secret

### Application URLs
- **`APP_BASE_URL`** (Required): Base URL for the backend API (e.g., `https://api.yourdomain.com`)
- **`FRONTEND_URL`** (Required): Frontend application URL (e.g., `https://yourdomain.com`)

### Docker Hub Configuration
- **`DOCKER_HUB_USERNAME`** (Required): Docker Hub username for pushing images
- **`DOCKER_HUB_TOKEN`** (Required): Docker Hub access token

### Google Cloud Platform Configuration
- **`GCP_SA_KEY`** (Required): Google Cloud Service Account JSON key for deployment

### Optional Configuration
- **`GRAFANA_PASSWORD`** (Optional): Grafana admin password (defaults to 'admin')

## How to Set Up GitHub Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value

## Security Best Practices

1. **Never commit secrets to the repository**
2. **Use strong, unique passwords** for all services
3. **Rotate secrets regularly**, especially JWT secrets
4. **Use environment-specific secrets** for different deployment environments
5. **Limit access** to secrets to only necessary team members

## Environment Variables in Local Development

For local development, copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
# Edit .env with your local values
```

## Validation

The GitHub Actions workflows include validation steps to ensure required secrets are set before deployment.

## Troubleshooting

If deployment fails due to missing secrets:

1. Check the GitHub Actions logs for specific missing secret names
2. Verify the secret name matches exactly (case-sensitive)
3. Ensure the secret value is not empty
4. Re-run the deployment after adding missing secrets