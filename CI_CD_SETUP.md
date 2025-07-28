# CI/CD Setup for EduConnect with VM IP Configuration

This guide explains how to configure your CI/CD pipeline to deploy EduConnect to your VM with IP `35.188.75.223`.

## 🔧 Required GitHub Secrets

Configure these secrets in your GitHub repository settings → Settings → Secrets and variables → Actions:

### ⚡️ VM Configuration (Required)
```
VM_IP=35.188.75.223
```

### Database & Authentication
```
DB_PASSWORD=your_db_password
DB_USER=educonnect
JWT_SECRET=your_jwt_secret_base64
```

### Email Configuration
```
MAIL_USERNAME=healthhubjavafest@gmail.com
MAIL_PASSWORD=your_email_app_password
```

### Docker Hub
```
DOCKER_HUB_USERNAME=your_dockerhub_username
DOCKER_HUB_TOKEN=your_dockerhub_token
```

### Google Cloud (if using GCP)
```
GCP_SA_KEY=your_service_account_json
```

### VM Access
```
VM_USERNAME=your_vm_username
VM_SSH_KEY=your_private_ssh_key
```

### Optional OAuth
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### API Keys
```
GEMINI_API_KEY=your_gemini_api_key
```

## 🚀 Deployment Options

### Option 1: GitHub Actions (Automatic)

Your existing workflow in `.github/workflows/deploy.yml` has been updated to:

1. **Build all services** with VM IP configuration
2. **Create environment files** with `VM_IP=35.188.75.223`
3. **Deploy to VM** using the configured IP
4. **Verify deployment** by checking health endpoints

The workflow will automatically:
- Set `VM_IP=35.188.75.223` in all environment files
- Configure frontend with `VITE_VM_IP=35.188.75.223`
- Set up email URLs to use VM IP
- Configure file upload URLs with VM IP

### Option 2: Manual Deployment Script

Use the deployment script for manual deployments:

```bash
# Deploy to VM
./scripts/deploy-vm.sh

# Deploy with custom VM IP
VM_IP=your_vm_ip ./scripts/deploy-vm.sh

# Deploy with custom environment
VM_IP=35.188.75.223 ENVIRONMENT=production ./scripts/deploy-vm.sh
```

### Option 3: Docker Compose with Environment Files

```bash
# Copy VM environment configuration
cp .env.vm .env
cp frontend/.env.vm frontend/.env

# Export VM IP
export VM_IP=35.188.75.223

# Deploy
docker-compose up -d
```

## 📝 Environment Variables in CI/CD

The CI/CD pipeline automatically configures these VM-specific variables:

### Backend Services
```bash
VM_IP=35.188.75.223
APP_BASE_URL=http://35.188.75.223:8081
FRONTEND_URL=http://35.188.75.223:3000
FILE_BASE_URL=http://35.188.75.223:8082/api/v1/files
```

### Frontend
```bash
VITE_VM_IP=35.188.75.223
VITE_API_BASE_URL=http://35.188.75.223
```

## 🔄 Workflow Stages

### 1. Build Stage
- Validates environment variables
- Builds all Docker images
- Creates environment files with VM IP
- Pushes images to Docker Hub

### 2. Deploy Stage
- Deploys infrastructure (postgres, redis, rabbitmq)
- Deploys services in order (auth → discussion → assessment → frontend)
- Waits for health checks
- Verifies all endpoints

### 3. Verification Stage
- Checks all service health endpoints
- Verifies frontend accessibility
- Confirms email configuration
- Tests API connectivity

## 🏗️ Service URLs After Deployment

With VM IP `35.188.75.223`, your services will be accessible at:

- **Frontend**: http://35.188.75.223:3000
- **Auth Service**: http://35.188.75.223:8081/api/v1
- **Discussion Service**: http://35.188.75.223:8082/api/v1
- **Assessment Service**: http://35.188.75.223:8083/api/v1

### Health Check URLs:
- **Auth**: http://35.188.75.223:8081/api/v1/actuator/health
- **Discussion**: http://35.188.75.223:8082/api/v1/actuator/health  
- **Assessment**: http://35.188.75.223:8083/api/v1/actuator/health

## 🔧 Troubleshooting

### If deployment fails:

1. **Check secrets configuration**:
   ```bash
   # Verify all required secrets are set in GitHub
   ```

2. **Check VM connectivity**:
   ```bash
   # Test SSH access to VM
   ssh your_username@35.188.75.223
   ```

3. **Check service logs**:
   ```bash
   # On VM, check container logs
   docker-compose logs auth-service
   docker-compose logs discussion-service
   docker-compose logs assessment-service
   ```

4. **Verify environment variables**:
   ```bash
   # Check if VM_IP is set correctly
   echo $VM_IP
   cat .env
   ```

## 🔄 Switching Environments

### For Different VM IP:
Update the workflow file and change:
```yaml
VM_IP: 35.188.75.223  # Change this to your new IP
```

### For Local Development:
```bash
cp .env.local .env
cp frontend/.env.local frontend/.env
export VM_IP=localhost
```

## 📚 Additional Configuration

### Custom Domain (Optional):
If you want to use a custom domain instead of IP:

1. Update VM_IP in workflow to your domain
2. Configure DNS to point to your VM
3. Update nginx configuration for SSL

### SSL/HTTPS (Optional):
To enable HTTPS:

1. Update all HTTP URLs to HTTPS
2. Configure SSL certificates
3. Update CORS configuration

## 🎯 Quick Start Commands

```bash
# 1. Set up secrets in GitHub repository
# 2. Push to main branch to trigger deployment
git push origin main

# Or manually trigger deployment
gh workflow run deploy.yml

# Check deployment status
gh run list --workflow=deploy.yml
```