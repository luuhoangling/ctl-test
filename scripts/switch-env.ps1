# Environment switching script for CTL Web Testing (PowerShell)
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "dev", "staging", "prod")]
    [string]$Environment
)

function Write-EnvFile {
    param($Content)
    $Content | Out-File -FilePath ".env" -Encoding UTF8
}

switch ($Environment) {
    "local" {
        Write-Host "Switching to LOCAL environment..." -ForegroundColor Green
        $envContent = @"
BASE_URL=http://127.0.0.1/ctl-web
LOGIN_PATH=/login
TEST_ENV=local
BROWSER=chrome
HEADLESS=false
DEFAULT_TIMEOUT=10000
LOGIN_TIMEOUT=15000
VALID_EMAIL=admin@test.com
VALID_PASSWORD=password123
INVALID_EMAIL=invalid@test.com
INVALID_PASSWORD=wrongpassword
DEBUG_MODE=false
TAKE_SCREENSHOTS=true
"@
        Write-EnvFile $envContent
    }
    "dev" {
        Write-Host "Switching to DEV environment..." -ForegroundColor Yellow
        $envContent = @"
BASE_URL=http://dev.ctl-web.com
LOGIN_PATH=/login
TEST_ENV=dev
BROWSER=chrome
HEADLESS=false
DEFAULT_TIMEOUT=15000
LOGIN_TIMEOUT=20000
VALID_EMAIL=dev@test.com
VALID_PASSWORD=devpassword
INVALID_EMAIL=invalid@test.com
INVALID_PASSWORD=wrongpassword
DEBUG_MODE=true
TAKE_SCREENSHOTS=true
"@
        Write-EnvFile $envContent
    }
    "staging" {
        Write-Host "Switching to STAGING environment..." -ForegroundColor Cyan
        $envContent = @"
BASE_URL=https://staging.ctl-web.com
LOGIN_PATH=/login
TEST_ENV=staging
BROWSER=chrome
HEADLESS=true
DEFAULT_TIMEOUT=20000
LOGIN_TIMEOUT=25000
VALID_EMAIL=staging@test.com
VALID_PASSWORD=stagingpassword
INVALID_EMAIL=invalid@test.com
INVALID_PASSWORD=wrongpassword
DEBUG_MODE=false
TAKE_SCREENSHOTS=true
"@
        Write-EnvFile $envContent
    }
    "prod" {
        Write-Host "⚠️  WARNING: You are about to run tests against PRODUCTION!" -ForegroundColor Red
        $confirmation = Read-Host "Are you sure? (y/N)"
        if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
            $envContent = @"
BASE_URL=https://ctl-web.com
LOGIN_PATH=/login
TEST_ENV=prod
BROWSER=chrome
HEADLESS=true
DEFAULT_TIMEOUT=30000
LOGIN_TIMEOUT=35000
VALID_EMAIL=prod@test.com
VALID_PASSWORD=prodpassword
INVALID_EMAIL=invalid@test.com
INVALID_PASSWORD=wrongpassword
DEBUG_MODE=false
TAKE_SCREENSHOTS=true
"@
            Write-EnvFile $envContent
        } else {
            Write-Host "Cancelled." -ForegroundColor Yellow
            exit 1
        }
    }
}

Write-Host "Environment switched to: $Environment" -ForegroundColor Green
Write-Host "Configuration saved to .env" -ForegroundColor Green
Write-Host ""
Write-Host "Current configuration:" -ForegroundColor Cyan
Get-Content .env
