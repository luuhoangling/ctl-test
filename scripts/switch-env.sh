#!/bin/bash

# Environment switching script for CTL Web Testing

# Function to display usage
usage() {
    echo "Usage: $0 [local|dev|staging|prod]"
    echo "Switch between different environment configurations"
    exit 1
}

# Check if argument is provided
if [ $# -eq 0 ]; then
    usage
fi

ENV=$1

case $ENV in
    local)
        echo "Switching to LOCAL environment..."
        cat > .env << EOF
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
EOF
        ;;
    dev)
        echo "Switching to DEV environment..."
        cat > .env << EOF
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
EOF
        ;;
    staging)
        echo "Switching to STAGING environment..."
        cat > .env << EOF
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
EOF
        ;;
    prod)
        echo "Switching to PRODUCTION environment..."
        echo "⚠️  WARNING: You are about to run tests against PRODUCTION!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cat > .env << EOF
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
EOF
        else
            echo "Cancelled."
            exit 1
        fi
        ;;
    *)
        echo "Invalid environment: $ENV"
        usage
        ;;
esac

echo "Environment switched to: $ENV"
echo "Configuration saved to .env"
echo ""
echo "Current configuration:"
cat .env
