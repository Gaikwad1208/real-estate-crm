@echo off
REM Real Estate CRM - Automated Setup Script for Windows
REM This script will setup everything automatically

echo =========================================
echo   Real Estate CRM - Automated Setup
echo =========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed
node --version

REM Check if PostgreSQL is installed
echo Checking PostgreSQL installation...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL is not installed!
    echo Please install PostgreSQL from: https://www.postgresql.org/download/
    pause
    exit /b 1
)
echo [OK] PostgreSQL is installed
psql --version

echo.
echo =========================================
echo   Step 1: Backend Setup
echo =========================================
echo.

REM Navigate to backend
cd backend

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating backend .env file...
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo Please edit backend\.env file with your PostgreSQL credentials
    echo Default DATABASE_URL: postgresql://postgres:postgres@localhost:5432/real_estate_crm
    echo.
    pause
) else (
    echo [OK] .env file already exists
)

REM Get database credentials
echo.
set /p DB_USER="Enter PostgreSQL username (default: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_PASS="Enter PostgreSQL password: "

set /p DB_NAME="Enter database name (default: real_estate_crm): "
if "%DB_NAME%"=="" set DB_NAME=real_estate_crm

REM Create database
echo Creating database: %DB_NAME%
set PGPASSWORD=%DB_PASS%
psql -U %DB_USER% -h localhost -c "CREATE DATABASE %DB_NAME%;" 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Database might already exist, continuing...
) else (
    echo [OK] Database created successfully
)

REM Update .env with database credentials
echo Updating .env with database credentials...
echo DATABASE_URL="postgresql://%DB_USER%:%DB_PASS%@localhost:5432/%DB_NAME%?schema=public" > .env.temp
echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production" >> .env.temp
echo JWT_EXPIRE="7d" >> .env.temp
echo PORT=5000 >> .env.temp
echo NODE_ENV=development >> .env.temp
echo FRONTEND_URL=http://localhost:5173 >> .env.temp
move /y .env.temp .env >nul
echo [OK] Database URL updated in .env

REM Generate Prisma Client
echo Generating Prisma Client...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to generate Prisma Client
    pause
    exit /b 1
)
echo [OK] Prisma Client generated

REM Run migrations
echo Running database migrations...
call npm run prisma:migrate
if %errorlevel% neq 0 (
    echo [ERROR] Failed to run migrations
    pause
    exit /b 1
)
echo [OK] Database migrations completed

REM Seed database
echo Seeding database with sample data...
call npm run seed
if %errorlevel% neq 0 (
    echo [WARNING] Failed to seed database
) else (
    echo [OK] Database seeded successfully
    echo.
    echo [OK] Default Admin: admin@realestatecrm.com / admin123
    echo [OK] Default Agent: agent@realestatecrm.com / admin123
)

echo.
echo =========================================
echo   Step 2: Frontend Setup
echo =========================================
echo.

REM Navigate to frontend
cd ..

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

REM Create frontend .env file
if not exist .env (
    echo Creating frontend .env file...
    copy .env.example .env
    echo [OK] Frontend .env file created
) else (
    echo [OK] Frontend .env file already exists
)

echo.
echo =========================================
echo   Setup Complete! 🎉
echo =========================================
echo.
echo [OK] Backend and Frontend are ready to run!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo Default Login:
echo   Email: admin@realestatecrm.com
echo   Password: admin123
echo.
echo [INFO] Setup script completed successfully!
echo.
pause