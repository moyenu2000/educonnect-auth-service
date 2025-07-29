@echo off
setlocal enabledelayedexpansion

:: EduConnect Local Development Runner for Windows (Batch version)
:: This script starts infrastructure using Docker and services locally

echo 🚀 Starting EduConnect services locally...

:: Check for help parameter
if "%1"=="--help" goto :show_help
if "%1"=="-h" goto :show_help
goto :main

:show_help
echo EduConnect Local Development Runner for Windows (Batch)
echo.
echo Usage:
echo   run-local.cmd           # Start all services
echo   run-local.cmd --help    # Show this help
echo.
echo Requirements:
echo   - Docker Desktop installed and running
echo   - Java 17+ for Spring Boot services
echo   - Node.js 18+ for frontend
echo.
echo Note: For advanced features, use the PowerShell version (run-local.ps1)
goto :end

:main
:: Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo Please create .env file by copying from .env.example:
    echo copy .env.example .env
    echo Then edit .env with your local configuration values.
    pause
    exit /b 1
)

echo 📋 Loading environment variables from .env...

:: Load environment variables from .env file
for /f "usebackq tokens=1,2 delims==" %%A in (".env") do (
    set "line=%%A"
    :: Skip comments and empty lines
    if not "!line:~0,1!"=="#" if not "!line!"=="" (
        set "%%A=%%B"
    )
)

:: Verify critical environment variables
set "missing_vars="
if "%DB_USER%"=="" set "missing_vars=!missing_vars! DB_USER"
if "%DB_PASSWORD%"=="" set "missing_vars=!missing_vars! DB_PASSWORD"
if "%DB_NAME%"=="" set "missing_vars=!missing_vars! DB_NAME"
if "%JWT_SECRET%"=="" set "missing_vars=!missing_vars! JWT_SECRET"

if not "%missing_vars%"=="" (
    echo ❌ Required environment variables are missing: %missing_vars%
    echo Please check your .env file.
    pause
    exit /b 1
)

echo ✅ Environment variables loaded successfully

:: Check if Docker is available
echo 🔍 Checking if Docker and Docker Compose are available...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or not running. Please install Docker Desktop.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not available. Please make sure Docker Desktop is properly installed.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available

:: Create logs directory
if not exist "logs" mkdir logs

:: Start Docker infrastructure
echo 🐳 Starting Docker infrastructure (PostgreSQL, Redis, RabbitMQ)...
docker-compose -f docker-compose.infrastructure.yml up -d

echo ⏳ Waiting for infrastructure services to be ready...
timeout /t 15 /nobreak > nul

:: Start services in background
echo.
echo 🔧 Starting services...

:: Start Auth Service
echo Starting Auth Service (port 8081)...
start "Auth Service" /min cmd /c "cd auth && mvnw.cmd spring-boot:run > ..\logs\auth.log 2>&1"

:: Wait a bit between service starts
timeout /t 5 /nobreak > nul

:: Start Discussion Service
echo Starting Discussion Service (port 8082)...
start "Discussion Service" /min cmd /c "cd discussion-service && mvnw.cmd spring-boot:run > ..\logs\discussion.log 2>&1"

:: Wait a bit between service starts
timeout /t 5 /nobreak > nul

:: Start Assessment Service
echo Starting Assessment Service (port 8083)...
start "Assessment Service" /min cmd /c "cd assessment-service && mvnw.cmd spring-boot:run > ..\logs\assessment.log 2>&1"

:: Wait a bit between service starts
timeout /t 5 /nobreak > nul

:: Start Frontend
echo Starting Frontend...
cd frontend

:: Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing npm dependencies...
    call npm install
)

echo Starting Frontend (port 3000)...
start "Frontend" /min cmd /c "npm run dev > ..\logs\frontend.log 2>&1"

cd ..

echo.
echo 🎉 All services are starting up!
echo.
echo 📊 Service Status:
echo ├── 🐳 PostgreSQL:      http://localhost:5433 (Docker)
echo ├── 🐳 Redis:           http://localhost:6379 (Docker)
echo ├── 🐳 RabbitMQ:        http://localhost:15672 (Docker Management UI)
echo ├── Auth Service:       http://localhost:8081
echo ├── Discussion Service: http://localhost:8082
echo ├── Assessment Service: http://localhost:8083
echo └── Frontend:           http://localhost:3000
echo.
echo 📋 Application logs are being written to:
echo ├── Auth:       logs\auth.log
echo ├── Discussion: logs\discussion.log
echo ├── Assessment: logs\assessment.log
echo └── Frontend:   logs\frontend.log
echo.
echo 💡 Tips:
echo - View logs: type logs\auth.log
echo - Check Docker: docker-compose -f docker-compose.infrastructure.yml logs -f
echo - Stop Docker: docker-compose -f docker-compose.infrastructure.yml down
echo.
echo ⏳ Waiting for services to start (this may take 1-2 minutes)...
timeout /t 30 /nobreak > nul

echo.
echo 🎯 Services should now be running! You can access:
echo 🌐 Frontend: http://localhost:3000
echo.
echo ⚠️  To stop all services:
echo 1. Close this window and all service windows
echo 2. Run: docker-compose -f docker-compose.infrastructure.yml down
echo.
echo Press any key to keep services running or Ctrl+C to exit...
pause > nul

:end
endlocal
