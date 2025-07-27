# EduConnect Deployment Issues and Fixes

## Issues Identified and Fixed

### 1. **Missing RabbitMQ Service**
**Problem**: The auth service logs showed attempts to connect to RabbitMQ at `localhost:5672`, but `docker-compose.prod.yml` didn't include RabbitMQ service.

**Fix Applied**:
- Added RabbitMQ service to `docker-compose.prod.yml`
- Added RabbitMQ environment variables to all services
- Updated deployment workflow to start RabbitMQ in infrastructure phase
- Added RabbitMQ configuration to all service application-docker.properties files

### 2. **Health Check Issues** 
**Problem**: Health checks were failing because `curl` might not be available in containers, and health endpoints were being treated as static resources.

**Fix Applied**:
- Changed health checks from `curl` to `wget` which is more commonly available
- Updated deployment workflow health checks to use `wget`
- Improved health check retry logic

### 3. **Missing Environment Variables**
**Problem**: RabbitMQ credentials and GCP service account key validation were missing.

**Fix Applied**:
- Added `RABBITMQ_USER` and `RABBITMQ_PASSWORD` to environment variables
- Added `GCP_SA_KEY` validation to ensure deployment credentials are available
- Updated `.env` file generation to include RabbitMQ variables

### 4. **Service Dependencies**
**Problem**: Services weren't properly waiting for RabbitMQ to be ready before starting.

**Fix Applied**:
- Added `rabbitmq` dependency to all application services
- Added RabbitMQ readiness check in deployment workflow
- Improved infrastructure startup sequence

## Files Modified

### 1. `docker-compose.prod.yml`
- Added RabbitMQ service with health checks
- Added RabbitMQ environment variables to all services
- Updated service dependencies to include RabbitMQ
- Changed health checks from curl to wget
- Added `rabbitmq_data` volume

### 2. `.github/workflows/deploy.yml`
- Added RabbitMQ environment variables to .env creation
- Added RabbitMQ to infrastructure startup
- Added RabbitMQ readiness check
- Changed curl to wget for health checks
- Added GCP_SA_KEY validation

### 3. Application Properties Files
- `auth/src/main/resources/application-docker.properties`
- `discussion-service/src/main/resources/application-docker.properties`
- `assessment-service/src/main/resources/application-docker.properties`

All files now include RabbitMQ configuration:
```properties
# RabbitMQ Configuration  
spring.rabbitmq.host=${SPRING_RABBITMQ_HOST:-rabbitmq}
spring.rabbitmq.port=${SPRING_RABBITMQ_PORT:-5672}
spring.rabbitmq.username=${SPRING_RABBITMQ_USERNAME:-educonnect}
spring.rabbitmq.password=${SPRING_RABBITMQ_PASSWORD:-educonnect123}
```

## Required GitHub Secrets

Ensure these secrets are configured in your GitHub repository:

### Required Secrets:
- `DOCKER_HUB_USERNAME` - Docker Hub username
- `DOCKER_HUB_TOKEN` - Docker Hub access token
- `DB_PASSWORD` - PostgreSQL password
- `JWT_SECRET` - JWT signing secret
- `GCP_SA_KEY` - Google Cloud Service Account key (JSON)

### Optional Secrets (with defaults):
- `DB_USER` - Database user (defaults to 'postgres')
- `RABBITMQ_USER` - RabbitMQ username (defaults to 'educonnect')
- `RABBITMQ_PASSWORD` - RabbitMQ password (defaults to 'educonnect123')
- `MAIL_USERNAME` - Email service username
- `MAIL_PASSWORD` - Email service password
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `APP_BASE_URL` - Application base URL
- `FRONTEND_URL` - Frontend application URL

## Deployment Sequence

The fixed deployment now follows this sequence:

1. **Validate** - Check all required secrets
2. **Test Auth** - Run unit tests for auth service
3. **Build Services** - Build and push Docker images (parallel)
4. **Deploy Infrastructure** - Start PostgreSQL, Redis, RabbitMQ
5. **Deploy Auth** - Start auth service
6. **Deploy Discussion** - Start discussion service  
7. **Deploy Assessment** - Start assessment service

## Next Steps

1. **Verify Secrets**: Ensure all required GitHub secrets are properly configured
2. **Test Deployment**: Trigger the workflow and monitor the deployment
3. **Monitor Logs**: Check service logs for any remaining issues
4. **Health Checks**: Verify all services are responding to health checks

## Common Issues to Watch For

1. **RabbitMQ Connection**: Services should now connect to RabbitMQ successfully
2. **Health Endpoint Access**: Health checks should no longer show "No static resource" errors
3. **Service Startup Order**: Services should start in the correct dependency order
4. **Resource Allocation**: Monitor for memory/disk space issues on GCP VM

The deployment should now work correctly with these fixes applied!
