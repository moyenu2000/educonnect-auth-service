# EduConnect Test Runner Script (PowerShell) - Auth Service Only
# This script runs tests for the Auth service (currently the only service with tests)

param(
    [string]$Profile = "test",
    [switch]$Help
)

if ($Help) {
    Write-Host "Usage: .\run-all-tests.ps1 [OPTIONS]"
    Write-Host "Options:"
    Write-Host "  -Profile PROFILE     Test profile (test|integration-test)"
    Write-Host "  -Help               Show this help message"
    Write-Host ""
    Write-Host "Note: Only Auth Service has tests configured."
    Write-Host "Other services (discussion-service, assessment-service) will be skipped."
    exit 0
}

Write-Host "🧪 Starting EduConnect Auth Service Tests..." -ForegroundColor Blue
Write-Host "============================================"

Write-Host "[INFO] Test profile: $Profile" -ForegroundColor Blue
Write-Host "[NOTE] Only Auth Service has tests configured" -ForegroundColor Yellow
Write-Host ""

$testResults = @{}

function Run-AuthServiceTests {
    param(
        [string]$TestProfile
    )
    
    Write-Host "[INFO] Running Auth Service tests with profile: $TestProfile" -ForegroundColor Blue
    
    if (Test-Path "auth") {
        Set-Location "auth"
        
        try {
            Write-Host "[INFO] Running unit tests..." -ForegroundColor Yellow
            & .\mvnw.cmd clean test "-Dspring.profiles.active=$TestProfile" -q
            
            if ($LASTEXITCODE -eq 0) {
                $testResults["auth"] = "PASSED"
                Write-Host "[PASS] Auth Service tests completed successfully" -ForegroundColor Green
                
                # Generate coverage report
                Write-Host "[INFO] Generating coverage report..." -ForegroundColor Blue
                & .\mvnw.cmd jacoco:report -q
                
                if (Test-Path "target\site\jacoco\index.html") {
                    Write-Host "[INFO] Coverage report generated: auth\target\site\jacoco\index.html" -ForegroundColor Green
                }
            } else {
                $testResults["auth"] = "FAILED"
                Write-Host "[FAIL] Auth Service tests failed" -ForegroundColor Red
            }
        }
        catch {
            $testResults["auth"] = "FAILED"
            Write-Host "[FAIL] Auth Service tests failed with exception: $_" -ForegroundColor Red
        }
        
        Set-Location ..
    } else {
        Write-Host "[ERROR] Auth service directory not found!" -ForegroundColor Red
        $testResults["auth"] = "MISSING"
    }
}

# Run Auth service tests
Run-AuthServiceTests -TestProfile $Profile

# Print summary
Write-Host ""
Write-Host "🏁 Test Summary" -ForegroundColor Blue
Write-Host "==============="

$status = $testResults["auth"]
if (-not $status) { $status = "NOT_RUN" }

switch ($status) {
    "PASSED" {
        Write-Host "✅ Auth Service: PASSED" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Auth Service tests passed!" -ForegroundColor Green
        Write-Host "✅ Ready for deployment" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 View coverage report:" -ForegroundColor Blue
        Write-Host "   auth\target\site\jacoco\index.html"
        exit 0
    }
    "FAILED" {
        Write-Host "❌ Auth Service: FAILED" -ForegroundColor Red
        Write-Host ""
        Write-Host "💥 Auth Service tests failed!" -ForegroundColor Red
        Write-Host "❌ Fix issues before deployment" -ForegroundColor Red
        exit 1
    }
    "MISSING" {
        Write-Host "❓ Auth Service: DIRECTORY NOT FOUND" -ForegroundColor Red
        Write-Host ""
        Write-Host "💥 Cannot find auth service directory!" -ForegroundColor Red
        exit 1
    }
    default {
        Write-Host "❓ Auth Service: UNKNOWN STATUS" -ForegroundColor Red
        exit 1
    }
}
