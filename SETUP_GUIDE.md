# 🚀 Complete Setup Guide - Real Estate CRM

This guide will walk you through setting up the Real Estate CRM application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Docker Setup](#docker-setup)
5. [Testing the Application](#testing-the-application)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Optional (for Docker deployment)
- **Docker** - [Download](https://www.docker.com/get-started)
- **Docker Compose** - Usually comes with Docker Desktop

### Verify Installations
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
psql --version    # Should show PostgreSQL 14 or higher
git --version     # Should show git version
```

---

## Backend Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm
```

### Step 2: Navigate to Backend Directory
```bash
cd backend
```

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Prisma (database ORM)
- JWT (authentication)
- Bcrypt (password hashing)
- And more...

### Step 4: Setup PostgreSQL Database

**Option A: Using psql command line**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE real_estate_crm;

# Exit psql
\q
```

**Option B: Using pgAdmin**
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" > "Database"
4. Name it `real_estate_crm`
5. Click "Save"

### Step 5: Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env

# Open .env in your text editor
# Update with your actual values
```

**Edit .env file:**
```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/real_estate_crm?schema=public"

# JWT Secret - Use a strong random string
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRE="7d"

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email (Optional - for future features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@realestatecrm.com
```

### Step 6: Run Database Migrations
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate
```

You should see output like:
```
✅ Generated Prisma Client
✅ Database migrations completed successfully
```

### Step 7: Seed the Database (Optional but Recommended)
```bash
npm run seed
```

This creates:
- **Admin User**: admin@realestatecrm.com / admin123
- **Agent User**: agent@realestatecrm.com / admin123
- Sample leads and properties

### Step 8: Start the Backend Server
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📊 Environment: development
```

### Step 9: Test the Backend
Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"Real Estate CRM API is running"}
```

✅ **Backend Setup Complete!**

---

## Frontend Setup

### Step 1: Open New Terminal
Keep the backend server running and open a new terminal window.

### Step 2: Navigate to Project Root
```bash
cd /path/to/real-estate-crm
```

### Step 3: Install Frontend Dependencies
```bash
npm install
```

This installs:
- React and React DOM
- Vite (build tool)
- TailwindCSS (styling)
- React Query (data fetching)
- Axios (HTTP client)
- And more...

### Step 4: Configure Frontend Environment
```bash
# Copy the example env file
cp .env.example .env

# Open .env in your text editor
```

**Edit .env file:**
```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME="Real Estate CRM"
VITE_APP_VERSION=1.0.0
```

### Step 5: Start the Frontend Development Server
```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 6: Access the Application
Open your browser and go to:
```
http://localhost:5173
```

✅ **Frontend Setup Complete!**

---

## Docker Setup

If you prefer using Docker (easier deployment):

### Step 1: Create Docker Environment File
```bash
# In project root directory
cp .env.example .env
```

**Edit .env for Docker:**
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=real_estate_crm
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:5173
```

### Step 2: Start All Services
```bash
docker-compose up -d
```

This starts:
- PostgreSQL database
- Backend API server

### Step 3: Run Migrations
```bash
docker-compose exec backend npx prisma migrate deploy
```

### Step 4: Seed Database (Optional)
```bash
docker-compose exec backend npm run seed
```

### Step 5: Check Running Services
```bash
docker-compose ps
```

You should see:
```
NAME                      STATUS
real-estate-crm-backend   Up
real-estate-crm-db        Up
```

### Stopping Docker Services
```bash
docker-compose down
```

✅ **Docker Setup Complete!**

---

## Testing the Application

### 1. Login with Default Credentials

**Admin Account:**
- Email: `admin@realestatecrm.com`
- Password: `admin123`

**Agent Account:**
- Email: `agent@realestatecrm.com`
- Password: `admin123`

### 2. Test Main Features

#### Dashboard
- View real-time statistics
- Check lead distribution charts
- See recent activities

#### Lead Management
1. Go to "Leads" section
2. Click "Create Lead"
3. Fill in lead details
4. Assign to an agent
5. Update status through pipeline

#### Property Management
1. Go to "Properties" section
2. Click "Add Property"
3. Fill in property details
4. Upload property images
5. View and filter properties

#### Task Management
1. Go to "Tasks" section
2. Create a new task
3. Set due date and priority
4. Assign to user
5. Update status

#### Contact Management
1. Go to "Contacts" section
2. Add new contact
3. Tag and organize contacts
4. Search and filter

### 3. Test API Endpoints

Using curl or Postman:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@realestatecrm.com",
    "password": "admin123"
  }'
```

**Get Leads (with token):**
```bash
curl http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Backend Issues

#### Issue: "Database connection failed"
**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # On Mac/Linux
   pg_isready
   
   # On Windows (in services)
   sc query postgresql-x64-14
   ```
2. Verify DATABASE_URL in .env
3. Test connection:
   ```bash
   psql -U postgres -d real_estate_crm
   ```

#### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

#### Issue: "Prisma Client not generated"
**Solution:**
```bash
cd backend
npm run prisma:generate
```

#### Issue: "Migration failed"
**Solution:**
```bash
# Reset database (WARNING: deletes all data)
cd backend
npx prisma migrate reset

# Then run migrations again
npm run prisma:migrate
```

### Frontend Issues

#### Issue: "Cannot connect to backend"
**Solution:**
1. Check backend is running on port 5000
2. Verify VITE_API_URL in .env
3. Check browser console for CORS errors

#### Issue: "Module not found errors"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Port 5173 already in use"
**Solution:**
```bash
# Vite will automatically use next available port
# Or specify custom port:
npm run dev -- --port 3000
```

### Docker Issues

#### Issue: "Container won't start"
**Solution:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs postgres

# Restart services
docker-compose restart
```

#### Issue: "Database initialization failed"
**Solution:**
```bash
# Remove volumes and restart
docker-compose down -v
docker-compose up -d
```

### Common Errors

#### "JWT token invalid"
- Clear browser localStorage
- Login again

#### "Permission denied on database"
- Check PostgreSQL user permissions
- Grant necessary privileges:
  ```sql
  GRANT ALL PRIVILEGES ON DATABASE real_estate_crm TO postgres;
  ```

#### "Cannot find module"
- Run `npm install` in affected directory
- Check import paths are correct

---

## Next Steps

After successful setup:

1. **Customize the Application**
   - Update branding and colors
   - Add custom fields
   - Modify workflows

2. **Configure Production**
   - Set up SSL/TLS
   - Configure production database
   - Set up backup strategy

3. **Deploy**
   - Choose deployment platform
   - Configure environment variables
   - Set up monitoring

4. **Learn More**
   - Read [API Documentation](backend/README.md)
   - Check [Main README](README.md)
   - Explore the codebase

---

## Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review [backend/README.md](backend/README.md) for API details
3. Search [GitHub Issues](https://github.com/Gaikwad1208/real-estate-crm/issues)
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

---

**Happy Coding! 🚀**