# EduConnect VM Deployment Instructions

This guide explains how to configure the application to use your VM IP address (35.188.75.223) instead of localhost.

## Quick Setup

### For VM Deployment (Current Setup)

The application is now pre-configured for your VM IP `35.188.75.223`. Simply use the VM environment files:

```bash
# Copy VM environment configuration
cp .env.vm .env
cp frontend/.env.vm frontend/.env
```

### For Local Development

To switch back to localhost for local development:

```bash
# Copy local environment configuration
cp .env.local .env
cp frontend/.env.local frontend/.env
```

## Environment Variables

The application now uses the `VM_IP` environment variable to automatically configure all URLs:

- **Frontend APIs**: Will use `http://${VM_IP}:8081/8082/8083`
- **Email URLs**: Will use `http://${VM_IP}:8081` in email templates
- **File URLs**: Will use `http://${VM_IP}:8082/api/v1/files`
- **CORS Origins**: Will allow `http://${VM_IP}:3000`

## Configuration Files

### Backend Services
- `auth/src/main/resources/application.properties` - Uses `${VM_IP}` variable
- `discussion-service/src/main/resources/application.properties` - Uses `${VM_IP}` variable
- `docker-compose.yml` - Uses `${VM_IP}` environment variable

### Frontend
- `frontend/src/services/api.ts` - Uses `VITE_VM_IP` environment variable
- `frontend/src/services/authService.ts` - Uses `VITE_VM_IP` environment variable
- `frontend/src/services/aiService.ts` - Uses `VITE_VM_IP` environment variable
- `frontend/vite.config.ts` - Uses `VM_IP` environment variable

## Starting the Application

### On VM (Current Configuration)
```bash
# Ensure VM environment is set
export VM_IP=35.188.75.223

# Start services
docker-compose up -d

# Or start frontend separately
cd frontend
npm run dev
```

### On Local Machine
```bash
# Set local environment
export VM_IP=localhost

# Start services
docker-compose up -d

# Or start frontend separately
cd frontend
npm run dev
```

## Switching Between Environments

To switch from VM to local or vice versa:

1. **For VM Deployment:**
   ```bash
   cp .env.vm .env
   cp frontend/.env.vm frontend/.env
   export VM_IP=35.188.75.223
   ```

2. **For Local Development:**
   ```bash
   cp .env.local .env
   cp frontend/.env.local frontend/.env
   export VM_IP=localhost
   ```

3. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## URL Structure

When `VM_IP=35.188.75.223`:
- Auth Service: `http://35.188.75.223:8081`
- Discussion Service: `http://35.188.75.223:8082`
- Assessment Service: `http://35.188.75.223:8083`
- Frontend: `http://35.188.75.223:3000`

When `VM_IP=localhost`:
- Auth Service: `http://localhost:8081`
- Discussion Service: `http://localhost:8082`
- Assessment Service: `http://localhost:8083`
- Frontend: `http://localhost:3000`

## Verification

After deployment, verify the configuration:

1. **Check environment variables:**
   ```bash
   echo $VM_IP
   ```

2. **Test API endpoints:**
   ```bash
   curl http://${VM_IP}:8081/api/v1/actuator/health
   curl http://${VM_IP}:8082/api/v1/actuator/health
   curl http://${VM_IP}:8083/api/v1/actuator/health
   ```

3. **Check email templates** by registering a new user - the verification email should contain your VM IP.

## Notes

- The configuration automatically falls back to the VM IP if environment variables are not set
- Email templates will now use the correct URLs based on the `VM_IP` setting
- CORS is configured to allow both localhost and VM IP for flexibility
- File upload URLs will use the correct base URL for your deployment environment