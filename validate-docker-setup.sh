#!/bin/bash

# Docker setup validation script
# This script checks if all prerequisites for Docker deployment are met

# Don't exit on error for checks
# set -e

echo "==================================="
echo "Docker Setup Validation Script"
echo "==================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
checks_passed=0
checks_failed=0

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((checks_passed++))
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
    ((checks_failed++))
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check Docker
echo "Checking prerequisites..."
echo ""

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker is installed: $DOCKER_VERSION"
else
    print_error "Docker is not installed"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_success "Docker Compose is installed: $COMPOSE_VERSION"
elif docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    print_success "Docker Compose (plugin) is installed: $COMPOSE_VERSION"
else
    print_error "Docker Compose is not installed"
fi

echo ""
echo "Checking Docker files..."
echo ""

# Check required files
for file in Dockerfile nginx.conf docker-compose.yml .dockerignore; do
    if [ -f "$file" ]; then
        print_success "Found: $file"
    else
        print_error "Missing: $file"
    fi
done

echo ""
echo "Checking SSL certificates..."
echo ""

# Check SSL directory
if [ -d "ssl" ]; then
    if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
        print_success "SSL certificates found in ssl/ directory"
    else
        print_warning "SSL directory exists but certificates are missing"
        echo "           Run: ./generate-ssl-cert.sh"
    fi
else
    print_warning "SSL directory not found"
    echo "           Run: ./generate-ssl-cert.sh to generate certificates"
fi

echo ""
echo "Checking environment configuration..."
echo ""

# Check .env file
if [ -f ".env" ]; then
    print_success ".env file exists"
    
    # Check for required variables
    required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env 2>/dev/null; then
            value=$(grep "^${var}=" .env | cut -d'=' -f2)
            if [ -n "$value" ] && [ "$value" != "your_supabase_project_url" ] && [ "$value" != "your_supabase_anon_key" ]; then
                print_success "Environment variable $var is configured"
            else
                print_warning "Environment variable $var needs to be set"
            fi
        else
            print_warning "Environment variable $var is not defined"
        fi
    done
else
    print_warning ".env file not found"
    echo "           Copy .env.docker.example to .env and configure it"
fi

echo ""
echo "==================================="
echo "Validation Summary"
echo "==================================="
echo -e "${GREEN}Passed: $checks_passed${NC}"
echo -e "${RED}Failed: $checks_failed${NC}"
echo ""

if [ $checks_failed -eq 0 ]; then
    echo -e "${GREEN}All critical checks passed!${NC}"
    echo ""
    echo "You can now build and run the Docker container:"
    echo "  docker-compose up -d web"
    exit 0
else
    echo -e "${RED}Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
