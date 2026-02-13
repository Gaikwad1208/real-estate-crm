#!/bin/bash

# Real Estate CRM - Automated Setup Script
# This script will setup everything automatically

echo "========================================="
echo "  Real Estate CRM - Automated Setup"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check if Node.js is installed
print_info "Checking Node.js installation..."
if ! command -v node &> /dev/null
then
    print_error "Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi
print_success "Node.js is installed: $(node --version)"

# Check if PostgreSQL is installed
print_info "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null
then
    print_error "PostgreSQL is not installed!"
    echo "Please install PostgreSQL from: https://www.postgresql.org/download/"
    exit 1
fi
print_success "PostgreSQL is installed: $(psql --version)"

echo ""
echo "========================================="
echo "  Step 1: Backend Setup"
echo "========================================="
echo ""

# Navigate to backend
cd backend

print_info "Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating backend .env file..."
    cp .env.example .env
    print_success ".env file created"
    echo ""
    print_info "Please edit backend/.env file with your PostgreSQL credentials"
    print_info "Default DATABASE_URL: postgresql://postgres:postgres@localhost:5432/real_estate_crm"
    echo ""
    read -p "Press Enter after you've configured the .env file..."
else
    print_success ".env file already exists"
fi

# Ask for database name
echo ""
read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASS
echo ""

read -p "Enter database name (default: real_estate_crm): " DB_NAME
DB_NAME=${DB_NAME:-real_estate_crm}

# Create database
print_info "Creating database: $DB_NAME"
export PGPASSWORD=$DB_PASS
psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "Database created successfully"
else
    print_info "Database might already exist, continuing..."
fi

# Update .env with database credentials
print_info "Updating .env with database credentials..."
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"
sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" .env
print_success "Database URL updated in .env"

# Generate Prisma Client
print_info "Generating Prisma Client..."
npm run prisma:generate
if [ $? -eq 0 ]; then
    print_success "Prisma Client generated"
else
    print_error "Failed to generate Prisma Client"
    exit 1
fi

# Run migrations
print_info "Running database migrations..."
npm run prisma:migrate
if [ $? -eq 0 ]; then
    print_success "Database migrations completed"
else
    print_error "Failed to run migrations"
    exit 1
fi

# Seed database
print_info "Seeding database with sample data..."
npm run seed
if [ $? -eq 0 ]; then
    print_success "Database seeded successfully"
    echo ""
    print_success "Default Admin: admin@realestatecrm.com / admin123"
    print_success "Default Agent: agent@realestatecrm.com / admin123"
else
    print_error "Failed to seed database"
fi

echo ""
echo "========================================="
echo "  Step 2: Frontend Setup"
echo "========================================="
echo ""

# Navigate to frontend
cd ..

print_info "Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Create frontend .env file
if [ ! -f .env ]; then
    print_info "Creating frontend .env file..."
    cp .env.example .env
    print_success "Frontend .env file created"
else
    print_success "Frontend .env file already exists"
fi

echo ""
echo "========================================="
echo "  Setup Complete! 🎉"
echo "========================================="
echo ""
print_success "Backend and Frontend are ready to run!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Default Login:"
echo "  Email: admin@realestatecrm.com"
echo "  Password: admin123"
echo ""
print_info "Setup script completed successfully!"
echo ""