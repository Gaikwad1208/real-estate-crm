# ⚡ Quick Start Guide

Get your Real Estate CRM running in **5 minutes**!

## 📋 Prerequisites Check

Make sure you have these installed:

```bash
# Check Node.js (need v18+)
node --version

# Check PostgreSQL (need v14+)
psql --version

# Check Git
git --version
```

❌ **Don't have them?** Install:
- Node.js: https://nodejs.org/ (Download LTS version)
- PostgreSQL: https://www.postgresql.org/download/
- Git: https://git-scm.com/downloads

---

## 🚀 Option 1: Automated Setup (Recommended)

### Windows Users:
```cmd
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm
setup.bat
```

### Mac/Linux Users:
```bash
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm
chmod +x setup.sh
./setup.sh
```

**That's it!** The script will:
- ✅ Install all dependencies
- ✅ Create the database
- ✅ Setup tables
- ✅ Add sample data

---

## ▶️ Starting the App

### Easy Way (Both servers at once):

**Windows:**
```cmd
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Manual Way (Two separate terminals):

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🌐 Access Your CRM

1. Open browser: http://localhost:5173

2. Login with:
   - **Email:** `admin@realestatecrm.com`
   - **Password:** `admin123`

3. Start using your CRM! 🎉

---

## 🛑 Stopping the App

- Press `Ctrl + C` in the terminal(s)
- Type `Y` if asked to confirm

---

## 🆘 Quick Troubleshooting

### Problem: "Port already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Problem: "Database connection failed"
**Solution:**
1. Make sure PostgreSQL is running
2. Check the password in `backend/.env`
3. Try: `psql -U postgres -d real_estate_crm`

### Problem: "npm install failed"
**Solution:**
```bash
# Clear cache and try again
npm cache clean --force
npm install
```

### Problem: "Cannot login"
**Solution:**
```bash
cd backend
npm run seed
```

---

## 📚 What's Next?

- 📖 Read [SIMPLE_SETUP.md](SIMPLE_SETUP.md) for detailed explanations
- 📘 Check [README.md](README.md) for features and API docs
- 🔧 See [SETUP_GUIDE.md](SETUP_GUIDE.md) for advanced setup

---

## 💡 Quick Tips

### Add a New Lead:
1. Click "Leads" in sidebar
2. Click "+ New Lead" button
3. Fill in details
4. Click "Save"

### Add a Property:
1. Click "Properties"
2. Click "+ Add Property"
3. Fill details and upload images
4. Click "Save"

### Create a Task:
1. Click "Tasks"
2. Click "+ New Task"
3. Set due date and assign
4. Click "Save"

---

## 🎯 Default Features

✅ **Dashboard** - Real-time analytics
✅ **Lead Management** - Track potential customers
✅ **Property Listings** - Manage properties with images
✅ **Contact Database** - Store all contacts
✅ **Task Manager** - Never miss a follow-up
✅ **User Roles** - Admin, Manager, Agent
✅ **Activity Timeline** - Track all changes

---

## 📞 Need Help?

Stuck? Create an issue:
https://github.com/Gaikwad1208/real-estate-crm/issues

Include:
- What you tried to do
- Error message (screenshot)
- Your OS (Windows/Mac/Linux)

---

**Made with ❤️ for Real Estate Professionals**

Star ⭐ the repo if you find it helpful!