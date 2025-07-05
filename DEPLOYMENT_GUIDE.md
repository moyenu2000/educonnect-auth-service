# EduConnect Deployment Guide

## Recent Fixes Applied

### Issues Fixed:
1. **Container Name Conflicts**: Added unique container names to prevent conflicts
2. **Orphaned Containers**: Added cleanup for orphaned containers (like educonnect-frontend)
3. **Service Dependencies**: Improved dependency management with health checks
4. **Network Isolation**: Added dedicated Docker network for better container communication

### Changes Made:

#### 1. Docker Compose Configuration (`docker-compose.prod.yml`)
- Added unique container names for all services
- Added health checks for PostgreSQL and Redis
- Improved dependency management with condition-based waiting
- Added dedicated network (`educonnect-network`)

#### 2. CI/CD Workflows
- **Main Deploy Workflow** (`deploy.yml`):
  - Added cleanup script execution
  - Improved container cleanup with `--remove-orphans` flag
  - Added service status monitoring after deployment

- **Discussion Service Workflow** (`deploy-discussion-service.yml`):
  - Added specific container cleanup before deployment
  - Improved dependency startup sequence
  - Added service status monitoring

- **Assessment Service Workflow** (`deploy-assessment-service.yml`):
  - Added specific container cleanup before deployment
  - Improved dependency startup sequence
  - Added service status monitoring

#### 3. Cleanup Script (`scripts/cleanup.sh`)
- Created automated cleanup script for manual maintenance
- Handles container, image, network, and volume cleanup
- Provides safe cleanup operations with error handling

## Deployment Process

### Automatic Deployment (via CI/CD)
1. Push changes to `main` branch
2. CI/CD pipeline automatically:
   - Builds Docker images
   - Pushes to Docker Hub
   - Deploys to GCP VM
   - Handles cleanup and restart

### Manual Deployment
If you need to deploy manually on the VM:

```bash
# 1. Copy files to VM
gcloud compute scp docker-compose.prod.yml auth-service-vm:~/ --zone=us-central1-a
gcloud compute scp scripts/cleanup.sh auth-service-vm:~/ --zone=us-central1-a

# 2. SSH into VM
gcloud compute ssh auth-service-vm --zone=us-central1-a

# 3. Create .env file (replace with actual values)
cat > .env << EOF
DOCKER_HUB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APP_BASE_URL=https://your-domain.com
FRONTEND_URL=https://your-frontend-domain.com
EOF

# 4. Run cleanup
chmod +x cleanup.sh
./cleanup.sh

# 5. Deploy services
sudo docker-compose -f docker-compose.prod.yml --env-file .env up -d

# 6. Check status
sudo docker-compose -f docker-compose.prod.yml --env-file .env ps
```

## Troubleshooting

### Common Issues and Solutions:

#### 1. Container Name Conflicts
**Error**: `Conflict. The container name "/runner-redis-1" is already in use`
**Solution**: Run the cleanup script or manually remove conflicting containers:
```bash
sudo docker stop container_name
sudo docker rm container_name
```

#### 2. Orphaned Containers
**Error**: `Found orphan containers for this project`
**Solution**: Use the `--remove-orphans` flag:
```bash
sudo docker-compose -f docker-compose.prod.yml --env-file .env down --remove-orphans
```

#### 3. Service Dependencies
**Error**: Services starting before dependencies are ready
**Solution**: The new configuration includes health checks and proper dependency conditions. Services will wait for dependencies to be healthy before starting.

#### 4. Network Issues
**Error**: Services can't communicate with each other
**Solution**: All services are now on the same `educonnect-network` for better communication.

## Service URLs
- **Auth Service**: `http://your-vm-ip:8081`
- **Discussion Service**: `http://your-vm-ip:8082`
- **Assessment Service**: `http://your-vm-ip:8084`
- **PostgreSQL**: `your-vm-ip:5432`
- **Redis**: `your-vm-ip:6379`

## Monitoring

### Check Service Status
```bash
sudo docker-compose -f docker-compose.prod.yml --env-file .env ps
```

### View Logs
```bash
# All services
sudo docker-compose -f docker-compose.prod.yml --env-file .env logs

# Specific service
sudo docker-compose -f docker-compose.prod.yml --env-file .env logs auth-service
```

### Health Checks
```bash
# Check if services are healthy
sudo docker inspect educonnect-postgres | grep -A 10 Health
sudo docker inspect educonnect-redis | grep -A 10 Health
```

## Maintenance

### Regular Cleanup
Run the cleanup script periodically to free up disk space:
```bash
./cleanup.sh all  # Include volume cleanup
```

### Update Images
```bash
sudo docker-compose -f docker-compose.prod.yml --env-file .env pull
sudo docker-compose -f docker-compose.prod.yml --env-file .env up -d
```

### Backup Database
```bash
sudo docker exec educonnect-postgres pg_dump -U postgres educonnect > backup.sql
```

## Security Notes
- Ensure `.env` file contains correct secrets
- Keep Docker images updated
- Monitor logs for security issues
- Use HTTPS in production (configure reverse proxy)
