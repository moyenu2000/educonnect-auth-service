# EduConnect Local Development Runner for Windows
# This script starts infrastructure using Docker and services locally

param(
    [switch]$Help,
    [switch]$Clean
)

if ($Help) {
    Write-Host "EduConnect Local Development Runner for Windows" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\run-local.ps1           # Start all services"
    Write-Host "  .\run-local.ps1 -Clean    # Clean up and start fresh"
    Write-Host "  .\run-local.ps1 -Help     # Show this help"
    Write-Host ""
    Write-Host "Requirements:" -ForegroundColor Yellow
    Write-Host "  - Docker Desktop installed and running"
    Write-Host "  - PowerShell 5.1 or later"
    Write-Host "  - Java 17+ for Spring Boot services"
    Write-Host "  - Node.js 18+ for frontend"
    exit 0
}

Write-Host "Starting EduConnect services locally..." -ForegroundColor Green

# Set error action preference
$ErrorActionPreference = "Stop"

# Function to check if .env file exists and load it
function Load-Environment {
    if (-not (Test-Path ".env")) {
        Write-Host "ERROR: .env file not found!" -ForegroundColor Red
        Write-Host "Please create .env file by copying from .env.example:" -ForegroundColor Yellow
        Write-Host "Copy-Item .env.example .env" -ForegroundColor Cyan
        Write-Host "Then edit .env with your local configuration values." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "Loading environment variables from .env..." -ForegroundColor Blue
    
    # Read and parse .env file
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            $value = $value -replace '^"(.*)"$', '$1'
            $value = $value -replace "^'(.*)'$", '$1'
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }

    # Verify critical environment variables
    $requiredVars = @("DB_USER", "DB_PASSWORD", "DB_NAME", "JWT_SECRET")
    foreach ($var in $requiredVars) {
        if (-not [Environment]::GetEnvironmentVariable($var)) {
            Write-Host "ERROR: Required environment variable $var is not set in .env file" -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "SUCCESS: Environment variables loaded successfully" -ForegroundColor Green
}

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to stop services on a port
function Stop-Port {
    param([int]$Port)
    
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                 Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($processes) {
        Write-Host "Stopping services on port $Port..." -ForegroundColor Yellow
        foreach ($processId in $processes) {
            try {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "   Stopping process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Gray
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                }
            }
            catch {
                Write-Host "   Could not stop process $processId" -ForegroundColor Gray
            }
        }
        Start-Sleep -Seconds 2
        Write-Host "SUCCESS: Port $Port is now free" -ForegroundColor Green
    }
}

# Function to check if Docker is available
function Test-Docker {
    Write-Host "Checking if Docker and Docker Compose are available..." -ForegroundColor Blue
    
    try {
        $dockerVersion = docker --version 2>$null
        if (-not $dockerVersion) {
            throw "Docker not found"
        }
    }
    catch {
        Write-Host "ERROR: Docker is not installed or not running. Please install Docker Desktop and make sure it's running." -ForegroundColor Red
        exit 1
    }

    try {
        $composeVersion = docker-compose --version 2>$null
        if (-not $composeVersion) {
            throw "Docker Compose not found"
        }
    }
    catch {
        Write-Host "ERROR: Docker Compose is not available. Please make sure Docker Desktop is properly installed." -ForegroundColor Red
        exit 1
    }

    Write-Host "SUCCESS: Docker and Docker Compose are available" -ForegroundColor Green
}

# Function to create directory if it doesn't exist
function Ensure-Directory {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

# Function to check service health
function Test-ServiceHealth {
    param(
        [string]$Name,
        [string]$Url,
        [int]$TimeoutSeconds = 60
    )
    
    $count = 0
    while ($count -lt $TimeoutSeconds) {
        try {
            $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "SUCCESS: $Name is ready!" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Service not ready yet, continue waiting
        }
        Start-Sleep -Seconds 2
        $count += 2
        if ($count % 10 -eq 0) {
            Write-Host "   Still waiting for $Name... ($count/$TimeoutSeconds seconds)" -ForegroundColor Gray
        }
    }
    Write-Host "WARNING: $Name is taking longer than expected to start" -ForegroundColor Yellow
    return $false
}

# Cleanup function
function Cleanup {
    Write-Host ""
    Write-Host "Stopping all services..." -ForegroundColor Yellow
    
    # Stop background jobs
    Get-Job | Stop-Job
    Get-Job | Remove-Job -Force
    
    # Stop Docker infrastructure
    Write-Host "Stopping Docker infrastructure..." -ForegroundColor Blue
    try {
        docker-compose -f docker-compose.infrastructure.yml down 2>$null
    }
    catch {
        Write-Host "   Could not stop Docker infrastructure" -ForegroundColor Gray
    }
    
    Write-Host "SUCCESS: Cleanup completed" -ForegroundColor Green
}

# Set up cleanup on script exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

try {
    # Load environment
    Load-Environment

    # Check Docker
    Test-Docker

    # Clean up if requested
    if ($Clean) {
        Write-Host "Cleaning up existing services..." -ForegroundColor Yellow
        Cleanup
        Start-Sleep -Seconds 3
    }

    # Start Docker infrastructure
    Write-Host "Starting Docker infrastructure (PostgreSQL, Redis, RabbitMQ)..." -ForegroundColor Blue
    docker-compose -f docker-compose.infrastructure.yml up -d

    Write-Host "Waiting for infrastructure services to be ready..." -ForegroundColor Blue
    Start-Sleep -Seconds 15

    # Check and stop services on required ports
    Write-Host "Checking and stopping services on required ports..." -ForegroundColor Blue
    $allPorts = @(5433, 6379, 5672, 15672, 8081, 8082, 8083, 3000)
    foreach ($port in $allPorts) {
        if (Test-Port -Port $port) {
            Stop-Port -Port $port
        }
    }

    Write-Host "SUCCESS: All required ports are now available" -ForegroundColor Green

    # Create logs directory
    Ensure-Directory "logs"

    # Start services
    Write-Host ""
    Write-Host "Starting Auth Service (port 8081)..." -ForegroundColor Blue
    Set-Location "auth"
    Start-Job -Name "AuthService" -ScriptBlock {
        Set-Location $using:PWD
        .\mvnw.cmd spring-boot:run > ..\logs\auth.log 2>&1
    } | Out-Null
    Set-Location ".."

    Write-Host "Starting Discussion Service (port 8082)..." -ForegroundColor Blue
    Set-Location "discussion-service"
    Start-Job -Name "DiscussionService" -ScriptBlock {
        Set-Location $using:PWD
        .\mvnw.cmd spring-boot:run > ..\logs\discussion.log 2>&1
    } | Out-Null
    Set-Location ".."

    Write-Host "Starting Assessment Service (port 8083)..." -ForegroundColor Blue
    Set-Location "assessment-service"
    Start-Job -Name "AssessmentService" -ScriptBlock {
        Set-Location $using:PWD
        .\mvnw.cmd spring-boot:run > ..\logs\assessment.log 2>&1
    } | Out-Null
    Set-Location ".."

    # Start frontend
    Write-Host "Installing frontend dependencies (if needed)..." -ForegroundColor Blue
    Set-Location "frontend"
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
        npm install
    }

    Write-Host "Starting Frontend (port 3000)..." -ForegroundColor Blue
    Start-Job -Name "Frontend" -ScriptBlock {
        Set-Location $using:PWD
        npm run dev > ..\logs\frontend.log 2>&1
    } | Out-Null
    Set-Location ".."

    Write-Host ""
    Write-Host "SUCCESS: All services are starting up!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Status:" -ForegroundColor Cyan
    Write-Host "PostgreSQL:      http://localhost:5433 (Docker)" -ForegroundColor Gray
    Write-Host "Redis:           http://localhost:6379 (Docker)" -ForegroundColor Gray
    Write-Host "RabbitMQ:        http://localhost:15672 (Docker Management UI)" -ForegroundColor Gray
    Write-Host "Auth Service:       http://localhost:8081" -ForegroundColor Gray
    Write-Host "Discussion Service: http://localhost:8082" -ForegroundColor Gray
    Write-Host "Assessment Service: http://localhost:8083" -ForegroundColor Gray
    Write-Host "Frontend:           http://localhost:3000" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Application logs are being written to:" -ForegroundColor Cyan
    Write-Host "Auth:       logs\auth.log" -ForegroundColor Gray
    Write-Host "Discussion: logs\discussion.log" -ForegroundColor Gray
    Write-Host "Assessment: logs\assessment.log" -ForegroundColor Gray
    Write-Host "Frontend:   logs\frontend.log" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Docker infrastructure logs:" -ForegroundColor Cyan
    Write-Host "docker-compose -f docker-compose.infrastructure.yml logs -f" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Tip: You can view application logs in real-time with:" -ForegroundColor Yellow
    Write-Host "Get-Content logs\auth.log -Wait" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press Ctrl+C to stop all services (including Docker infrastructure)" -ForegroundColor Red
    Write-Host ""

    # Wait for services to start and show status
    Write-Host "Waiting for services to start..." -ForegroundColor Blue
    Start-Sleep -Seconds 20

    # Check service health
    Write-Host "Checking service health..." -ForegroundColor Blue
    Test-ServiceHealth -Name "Auth Service" -Url "http://localhost:8081/api/v1/actuator/health"
    Test-ServiceHealth -Name "Discussion Service" -Url "http://localhost:8082/api/v1/actuator/health"
    Test-ServiceHealth -Name "Assessment Service" -Url "http://localhost:8083/api/v1/actuator/health"
    Test-ServiceHealth -Name "Frontend" -Url "http://localhost:3000"

    Write-Host ""
    Write-Host "SUCCESS: All services are running! You can now access:" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Additional Useful Commands:" -ForegroundColor Yellow
    Write-Host "Check running jobs:     Get-Job" -ForegroundColor Gray
    Write-Host "View job output:        Receive-Job -Name 'AuthService'" -ForegroundColor Gray
    Write-Host "Stop specific service:  Stop-Job -Name 'Frontend'" -ForegroundColor Gray
    Write-Host "View all logs:          Get-Content logs\*.log -Wait" -ForegroundColor Gray
    Write-Host ""

    # Keep script running and wait for user to stop
    Write-Host "Services are running. Press Ctrl+C to stop all services..." -ForegroundColor Blue
    
    # Monitor jobs and restart if they fail
    while ($true) {
        $jobs = Get-Job
        $failedJobs = $jobs | Where-Object { $_.State -eq "Failed" }
        
        if ($failedJobs) {
            Write-Host "WARNING: Some services have failed. Check logs for details:" -ForegroundColor Yellow
            foreach ($job in $failedJobs) {
                Write-Host "   Failed: $($job.Name)" -ForegroundColor Red
                # Optionally, you could restart the failed job here
            }
        }
        
        Start-Sleep -Seconds 10
    }
}
catch {
    Write-Host "ERROR: An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Cleanup
    exit 1
}
finally {
    Cleanup
}
