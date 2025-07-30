# EduConnect Local Development - Windows Setup

This directory contains Windows-specific scripts to run the EduConnect platform locally with Docker infrastructure and local Java services.

## Scripts Available

### 1. PowerShell Script (Recommended) - `run-local.ps1`
**Features:**
- Full error handling and service health checks
- Automatic port conflict resolution
- Real-time service monitoring
- Graceful cleanup on exit
- Detailed logging and status reporting

**Usage:**
```powershell
# Start all services
.\run-local.ps1

# Clean up and start fresh
.\run-local.ps1 -Clean

# Show help
.\run-local.ps1 -Help
```

### 2. Batch Script (Simple) - `run-local.cmd`
**Features:**
- Basic service startup
- Simpler interface for users who prefer CMD
- Works on older Windows versions

**Usage:**
```cmd
# Start all services
run-local.cmd

# Show help
run-local.cmd --help
```

## Prerequisites

### Required Software
1. **Docker Desktop** - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Java 17+** - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
3. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
4. **Git** - Download from [git-scm.com](https://git-scm.com/)

### Environment Setup
1. **Copy environment file:**
   ```cmd
   copy .env.example .env
   ```

2. **Edit `.env` file** with your local configuration:
   ```bash
   # Database Configuration
   DB_USER=educonnect
   DB_PASSWORD=your_secure_password
   DB_NAME=educonnect

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here

   # Other required variables...
   ```

3. **Ensure Docker Desktop is running** before starting the scripts.

## How It Works

### Infrastructure (Docker)
The scripts start these services in Docker containers:
- **PostgreSQL** (Port 5433) - Main database
- **Redis** (Port 6379) - Caching and sessions
- **RabbitMQ** (Port 5672, Management: 15672) - Message queue

### Application Services (Local)
These run locally using Maven:
- **Auth Service** (Port 8081) - Authentication and user management
- **Discussion Service** (Port 8082) - Forums and messaging
- **Assessment Service** (Port 8083) - Questions, exams, and analytics

### Frontend (Local)
- **React Application** (Port 3000) - User interface

## Usage Instructions

### Starting Services

#### Option 1: PowerShell (Recommended)
1. Open PowerShell as Administrator
2. Navigate to project directory
3. Run the script:
   ```powershell
   .\run-local.ps1
   ```

#### Option 2: Command Prompt
1. Open Command Prompt as Administrator
2. Navigate to project directory
3. Run the script:
   ```cmd
   run-local.cmd
   ```

### Accessing the Application
Once all services are running:
- **Frontend:** http://localhost:3000
- **API Documentation:** http://localhost:8081/swagger-ui.html
- **RabbitMQ Management:** http://localhost:15672 (guest/guest)

### Monitoring Services

#### View Logs
```powershell
# PowerShell - Real-time log viewing
Get-Content logs\auth.log -Wait
Get-Content logs\frontend.log -Wait

# Command Prompt - View log content
type logs\auth.log
type logs\frontend.log
```

#### Check Service Status
```powershell
# PowerShell - Check running jobs
Get-Job

# Check Docker containers
docker ps

# Check application endpoints
curl http://localhost:8081/api/v1/actuator/health
curl http://localhost:8082/api/v1/actuator/health
curl http://localhost:8083/api/v1/actuator/health
```

### Stopping Services

#### PowerShell Script
- Press `Ctrl+C` in the PowerShell window
- The script will automatically clean up all services

#### Batch Script
1. Close all service windows
2. Stop Docker infrastructure:
   ```cmd
   docker-compose -f docker-compose.infrastructure.yml down
   ```

#### Manual Cleanup
If services don't stop properly:
```powershell
# Stop all Java processes
Get-Process | Where-Object {$_.ProcessName -eq "java"} | Stop-Process -Force

# Stop Node.js processes
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Stop Docker containers
docker-compose -f docker-compose.infrastructure.yml down
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```
Error: Port 8081 is already in use
```
**Solution:** The PowerShell script automatically handles this, or manually stop the process:
```powershell
# Find process using the port
netstat -ano | findstr :8081

# Stop the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### 2. Docker Not Running
```
Error: Docker is not installed or not running
```
**Solution:** 
- Start Docker Desktop
- Wait for it to fully initialize
- Run the script again

#### 3. Maven Wrapper Permission Issues
```
Error: ./mvnw: Permission denied
```
**Solution:** Use the Windows Maven wrapper:
```cmd
mvnw.cmd spring-boot:run
```

#### 4. Node.js Dependencies Issues
```
Error: Cannot find module
```
**Solution:** 
- Delete `node_modules` folder in frontend
- Run `npm install` manually
- Restart the script

#### 5. Database Connection Issues
```
Error: Connection to localhost:5433 refused
```
**Solution:**
- Ensure Docker containers are running: `docker ps`
- Check Docker logs: `docker-compose -f docker-compose.infrastructure.yml logs`
- Verify `.env` database credentials

### Log Locations
All application logs are stored in the `logs/` directory:
- `logs/auth.log` - Authentication service logs
- `logs/discussion.log` - Discussion service logs  
- `logs/assessment.log` - Assessment service logs
- `logs/frontend.log` - Frontend development server logs

### Performance Tips
1. **Allocate more memory to Docker** in Docker Desktop settings
2. **Close unnecessary applications** to free up system resources
3. **Use SSD storage** for better I/O performance
4. **Increase Java heap size** if needed: `set JAVA_OPTS=-Xmx2g`

## Development Workflow

### Making Changes
1. **Backend Changes:** Services will auto-reload with Spring Boot DevTools
2. **Frontend Changes:** React dev server provides hot reloading
3. **Database Changes:** Use database migration scripts

### Testing
```powershell
# Run backend tests
cd auth
.\mvnw.cmd test

cd ..\assessment-service  
.\mvnw.cmd test

# Run frontend tests
cd ..\frontend
npm test
```

### Building for Production
```powershell
# Build all services
cd auth
.\mvnw.cmd clean package

cd ..\assessment-service
.\mvnw.cmd clean package

cd ..\frontend
npm run build
```

## Additional Resources
- [Docker Desktop Documentation](https://docs.docker.com/desktop/windows/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://reactjs.org/docs/)
- [Project Documentation](./README.md)
