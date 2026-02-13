# 🚀 Simple Setup Guide (For Beginners)

Don't worry! This guide explains everything step-by-step in simple terms.

## 📋 What You Need

Think of this like cooking - you need ingredients before you start:

### 1. **Node.js** (The engine that runs JavaScript)
**What it does:** Lets you run the backend server and build the frontend

**How to install:**
- Go to: https://nodejs.org/
- Download the "LTS" version (recommended)
- Run the installer
- Click "Next" through all steps

**How to check it's installed:**
```bash
node --version
# Should show something like: v18.17.0
```

### 2. **PostgreSQL** (The database)
**What it does:** Stores all your data (leads, properties, contacts, etc.)

**How to install:**

**Windows:**
- Go to: https://www.postgresql.org/download/windows/
- Download the installer
- During installation, remember the password you set!
- Keep the default port: 5432

**Mac:**
```bash
# If you have Homebrew installed
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**How to check it's installed:**
```bash
psql --version
# Should show: psql (PostgreSQL) 14.x or 15.x
```

### 3. **Git** (To download the code)
**What it does:** Downloads code from GitHub

**How to install:**
- Go to: https://git-scm.com/downloads
- Download and install
- Use default settings

---

## 🎯 Automated Setup (Easiest Way)

I've created scripts that do everything automatically!

### For Windows:

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Download the project:**
```bash
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm
```

3. **Run the setup script:**
```bash
setup.bat
```

4. **Follow the prompts:**
   - Enter PostgreSQL username (usually: `postgres`)
   - Enter PostgreSQL password (the one you set during installation)
   - Press Enter to use default database name

5. **That's it!** The script does everything:
   - Installs all packages
   - Creates database
   - Sets up tables
   - Adds sample data

### For Mac/Linux:

1. **Open Terminal**
   - Mac: Press `Cmd + Space`, type "Terminal", press Enter
   - Linux: Press `Ctrl + Alt + T`

2. **Download the project:**
```bash
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm
```

3. **Make the script executable:**
```bash
chmod +x setup.sh
```

4. **Run the setup script:**
```bash
./setup.sh
```

5. **Follow the prompts:**
   - Enter PostgreSQL username (usually: `postgres`)
   - Enter PostgreSQL password
   - Press Enter to use default database name

---

## ▶️ Starting the Application

After setup is complete, you need to run TWO things:

### Step 1: Start the Backend (Server)

**Open a terminal/command prompt:**
```bash
cd real-estate-crm/backend
npm run dev
```

**You should see:**
```
🚀 Server running on port 5000
📊 Environment: development
```

**What this does:** Starts the API server that handles all data

**Keep this terminal open!** Don't close it.

### Step 2: Start the Frontend (Website)

**Open a NEW terminal/command prompt:**
```bash
cd real-estate-crm
npm run dev
```

**You should see:**
```
  VITE v6.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

**What this does:** Starts the website you'll use

---

## 🌐 Using the Application

1. **Open your web browser** (Chrome, Firefox, Edge, Safari)

2. **Go to:** http://localhost:5173

3. **Login with:**
   - Email: `admin@realestatecrm.com`
   - Password: `admin123`

4. **You're in!** Start exploring:
   - Dashboard: See statistics
   - Leads: Manage potential customers
   - Properties: Add real estate listings
   - Contacts: Store contact information
   - Tasks: Track things to do

---

## 🛑 Stopping the Application

**To stop:**
- Go to each terminal window
- Press `Ctrl + C`
- Type `Y` if asked to confirm

**Next time you want to use it:**
- Just run Step 1 and Step 2 again (start backend and frontend)
- You don't need to run setup again!

---

## 📖 What Each Part Does (Simple Explanation)

### Backend (Server)
**Location:** `backend/` folder

**What it is:** The "brain" of your application

**What it does:**
- Stores data in database
- Handles login/logout
- Processes requests from frontend
- Manages security

**Files you might edit:**
- `.env` - Configuration (database password, etc.)
- `prisma/schema.prisma` - Database structure

### Frontend (Website)
**Location:** `src/` folder

**What it is:** The "face" of your application (what you see)

**What it does:**
- Shows beautiful interface
- Handles user clicks and inputs
- Talks to backend to get/save data
- Updates in real-time

**Files you might edit:**
- `src/pages/` - Different pages (Dashboard, Leads, etc.)
- `src/components/` - Reusable UI pieces

### Database (PostgreSQL)
**What it is:** Where all your data lives

**What it stores:**
- Users (who can login)
- Leads (potential customers)
- Properties (real estate listings)
- Contacts
- Tasks
- Activity history

---

## ❓ Common Questions

### Q: Do I need to pay for anything?
**A:** No! Everything is free and open-source.

### Q: Can I use this for my real business?
**A:** Yes! It's built for real use. Just change the passwords!

### Q: What if I close my computer?
**A:** The data stays in the database. Just start the backend and frontend again.

### Q: Can other people access it?
**A:** Not yet - it's only on your computer. To share it, you need to "deploy" it (we can do that later).

### Q: What if something breaks?
**A:** Don't worry! Your data is safe. Just:
1. Stop the servers (Ctrl + C)
2. Start them again
3. Check the troubleshooting section below

---

## 🔧 Troubleshooting (Common Problems)

### Problem: "Port 5000 already in use"
**What it means:** Something else is using that port

**Solution:**
```bash
# Find what's using it
netstat -ano | findstr :5000

# Kill that process
taskkill /PID <number> /F
```

### Problem: "Cannot connect to database"
**What it means:** PostgreSQL isn't running or wrong password

**Solution:**
1. Check PostgreSQL is running:
   - Windows: Open "Services" app, find PostgreSQL, click Start
   - Mac: `brew services start postgresql@15`
   - Linux: `sudo systemctl start postgresql`

2. Check password in `backend/.env` file is correct

### Problem: "Module not found"
**What it means:** Packages didn't install properly

**Solution:**
```bash
# Delete and reinstall
cd backend
rm -rf node_modules
npm install

# Same for frontend
cd ..
rm -rf node_modules
npm install
```

### Problem: "Migration failed"
**What it means:** Database setup had issues

**Solution:**
```bash
cd backend
npm run prisma:migrate
```

### Problem: "Cannot login"
**What it means:** Database might not be seeded

**Solution:**
```bash
cd backend
npm run seed
```

---

## 📞 Getting Help

If you're stuck:

1. **Read the error message** - It usually tells you what's wrong
2. **Check this guide** - Look for your problem above
3. **Google the error** - Copy the error message and search
4. **Ask on GitHub** - Create an issue: https://github.com/Gaikwad1208/real-estate-crm/issues

**When asking for help, include:**
- What you were trying to do
- The error message (copy the whole thing)
- Your operating system (Windows/Mac/Linux)
- Screenshots if possible

---

## 🎉 Next Steps

Once everything is running:

1. **Explore the features**
   - Click around and see what everything does
   - Add a test lead
   - Create a property listing

2. **Customize it**
   - Change colors (in `tailwind.config.js`)
   - Add your company name
   - Upload your logo

3. **Add real data**
   - Delete the sample data
   - Start adding your actual leads and properties

4. **Learn more**
   - Read the full [README.md](README.md)
   - Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for advanced setup

---

## 💡 Understanding the Workflow

**When you make changes:**

1. **Frontend changes** (how it looks):
   - Edit files in `src/`
   - Save the file
   - Browser refreshes automatically!

2. **Backend changes** (how it works):
   - Edit files in `backend/`
   - Save the file
   - Server restarts automatically!

3. **Database changes** (data structure):
   - Edit `backend/prisma/schema.prisma`
   - Run: `npm run prisma:migrate`
   - Database updates!

---

**You're all set! Happy building! 🚀**

Remember: Everyone starts as a beginner. Don't be afraid to experiment and break things - that's how you learn!