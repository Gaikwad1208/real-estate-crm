# ✅ Pre-Deployment Checklist - Real Estate CRM

**Last Updated:** February 13, 2026

Complete this checklist before deploying to production to ensure a secure and successful deployment.

---

## 📝 Quick Status Check

### ✅ 1. Code Committed and Pushed to GitHub

**Status:** ✅ **COMPLETE**

- Latest commit: `89988f42` (February 13, 2026)
- All code is pushed to: https://github.com/Gaikwad1208/real-estate-crm
- Repository is up to date

**Verification:**
```bash
git status
# Should show: "Your branch is up to date with 'origin/main'"
```

---

### 🛠️ 2. Local Tests Pass

**Status:** ⚠️ **ACTION REQUIRED**

You need to test locally before deploying.

#### **How to Test Locally:**

**Step 1: Start Backend**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📊 Environment: development
✅ Database connected successfully
```

**Step 2: Test Backend API**
```bash
# In a new terminal
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"Real Estate CRM API is running"}
```

**Step 3: Start Frontend**
```bash
# In a new terminal
npm run dev
```

**Expected Output:**
```
VITE v6.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

**Step 4: Manual Testing**
1. Open http://localhost:5173
2. Login with: `admin@realestatecrm.com` / `admin123`
3. Test features:
   - ✅ Dashboard loads
   - ✅ Can view leads
   - ✅ Can create a lead
   - ✅ Can view properties
   - ✅ Can create a task

✅ **Mark as complete when all tests pass**

---

### 📋 3. Production Database Credentials

**Status:** ⚠️ **ACTION REQUIRED**

You need production database credentials from your hosting provider.

#### **Option A: Railway (Recommended)**

1. Sign up at [Railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database
4. Copy the `DATABASE_URL` provided

**Format:**
```
postgresql://user:password@host:5432/database?sslmode=require
```

#### **Option B: Render**

1. Sign up at [Render.com](https://render.com)
2. Create PostgreSQL database (Free tier available)
3. Copy "Internal Database URL"

#### **Option C: Your Own PostgreSQL Server**

**Create Database:**
```sql
CREATE DATABASE real_estate_crm_prod;
CREATE USER crm_prod_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE real_estate_crm_prod TO crm_prod_user;
```

**Connection String:**
```
postgresql://crm_prod_user:strong_password_here@your-server-ip:5432/real_estate_crm_prod?schema=public
```

✅ **Mark as complete when you have production DATABASE_URL**

---

### 🔒 4. Change Default Passwords

**Status:** ⚠️ **CRITICAL - MUST DO**

**Current Default Credentials (INSECURE):**
- Admin: `admin@realestatecrm.com` / `admin123`
- Agent: `agent@realestatecrm.com` / `admin123`

#### **How to Change After Deployment:**

**Method 1: Through the App (Recommended)**
1. Login with default credentials
2. Go to Profile/Settings
3. Change password
4. Logout and login with new password

**Method 2: Direct Database Update**
```bash
# SSH into your server or use Railway/Render shell
cd backend
node -e "
const bcrypt = require('bcrypt');
const password = 'YOUR_NEW_SECURE_PASSWORD';
bcrypt.hash(password, 10).then(hash => console.log(hash));
"

# Then update database:
psql $DATABASE_URL
UPDATE "User" SET password = 'hashed_password_here' WHERE email = 'admin@realestatecrm.com';
```

**Method 3: Create New Admin (Best Practice)**
```bash
# After deployment, create your own admin user
# Then delete the default ones
DELETE FROM "User" WHERE email IN ('admin@realestatecrm.com', 'agent@realestatecrm.com');
```

⚠️ **IMPORTANT:** Change passwords IMMEDIATELY after first deployment!

---

### 🔑 5. Generate Strong JWT Secret

**Status:** ⚠️ **CRITICAL - MUST DO**

**Current JWT Secret (INSECURE):**
```
your-super-secret-jwt-key-change-this-in-production
```

#### **Generate New JWT Secret:**

**Method 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Method 2: Using OpenSSL**
```bash
openssl rand -hex 64
```

**Method 3: Online Generator**
- Go to: https://generate-secret.vercel.app/64
- Copy the generated secret

**Example Output:**
```
8f7d9c2e1b4a6f3e5d8c7a9b2e4f6c8a1d3e5f7c9b2a4e6f8c1a3e5d7c9b2a4e6f8
```

#### **Where to Use:**

**For Railway/Render:**
- Add as environment variable: `JWT_SECRET=your_generated_secret`

**For VPS:**
- Update `backend/.env`:
```env
JWT_SECRET="8f7d9c2e1b4a6f3e5d8c7a9b2e4f6c8a1d3e5f7c9b2a4e6f8c1a3e5d7c9b2a4e6f8"
```

⚠️ **Never use the default JWT secret in production!**

✅ **Mark as complete when you have generated and saved your JWT secret**

---

### 🌐 6. Frontend Configured with Production API URL

**Status:** ⚠️ **ACTION REQUIRED**

**Current Configuration (Development):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Production Configuration Needed:**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

#### **How to Configure:**

**For Vercel:**
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.railway.app/api`
5. Redeploy

**For Render:**
1. Go to Render dashboard
2. Select your static site
3. Go to Environment
4. Add: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Trigger deploy

**For VPS:**
1. Update `.env` file:
```bash
cd /var/www/real-estate-crm
cat > .env << EOF
VITE_API_URL=https://your-domain.com/api
EOF
```
2. Rebuild frontend:
```bash
npm run build
```

✅ **Mark as complete when frontend points to production backend**

---

## 🛡️ Additional Security Checklist

### 7. CORS Configuration

**Backend Environment Variable:**
```env
FRONTEND_URL=https://your-frontend-domain.com
```

**Multiple Origins (if needed):**
```javascript
// backend/server.js
const allowedOrigins = [
  'https://your-frontend.vercel.app',
  'https://your-custom-domain.com'
];
```

### 8. Environment Variables Checklist

**Backend Required:**
- [ ] `DATABASE_URL` - Production database connection
- [ ] `JWT_SECRET` - Strong random secret (min 64 characters)
- [ ] `JWT_EXPIRE` - Token expiration (e.g., "7d")
- [ ] `PORT` - Server port (5000)
- [ ] `NODE_ENV` - Set to "production"
- [ ] `FRONTEND_URL` - Production frontend URL

**Frontend Required:**
- [ ] `VITE_API_URL` - Production backend API URL

**Optional but Recommended:**
- [ ] `EMAIL_HOST` - SMTP server
- [ ] `EMAIL_PORT` - SMTP port
- [ ] `EMAIL_USER` - Email username
- [ ] `EMAIL_PASSWORD` - Email password
- [ ] `EMAIL_FROM` - Sender email address

### 9. SSL/HTTPS

**Railway/Vercel/Render:** ✅ Automatic HTTPS

**VPS:** Configure Certbot
```bash
sudo certbot --nginx -d your-domain.com
```

### 10. Database Backups

**Railway:** Automatic backups (paid plans)

**Render:** Manual backups recommended

**VPS:** Setup automated backups
```bash
# Create backup script
cat > /root/backup-crm.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/crm_$DATE.sql
find /backups -name "crm_*.sql" -mtime +7 -delete
EOF

chmod +x /root/backup-crm.sh

# Schedule daily at 2 AM
crontab -e
# Add: 0 2 * * * /root/backup-crm.sh
```

---

## 📊 Final Verification

Before going live, verify:

- [ ] ✅ Code is on GitHub (latest commit: Feb 13, 2026)
- [ ] ⚠️ All local tests pass
- [ ] ⚠️ Production database ready
- [ ] ⚠️ Default passwords will be changed after deployment
- [ ] ⚠️ Strong JWT secret generated
- [ ] ⚠️ Frontend configured with production API URL
- [ ] CORS properly configured
- [ ] SSL/HTTPS enabled
- [ ] Database backups scheduled
- [ ] Environment variables set

---

## 🚀 Ready to Deploy?

### Recommended Deployment Path:

**Phase 1: Deploy Backend**
1. Railway/Render: Deploy from GitHub
2. Add PostgreSQL database
3. Set all environment variables
4. Run migrations

**Phase 2: Deploy Frontend**
1. Vercel/Render: Import from GitHub
2. Set `VITE_API_URL` environment variable
3. Deploy

**Phase 3: Post-Deployment**
1. Test login
2. Change default passwords
3. Create your admin user
4. Delete default users
5. Test all features

### Deployment Guides:

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [QUICKSTART.md](QUICKSTART.md) - Quick local setup
- [README.md](README.md) - Project overview

---

## 📞 Need Help?

If you're stuck on any step:

1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions
2. See [Troubleshooting section](DEPLOYMENT.md#troubleshooting)
3. Create issue: https://github.com/Gaikwad1208/real-estate-crm/issues

---

## 📝 Deployment Checklist Summary

```
Pre-Deployment:
✅ Code on GitHub
⚠️ Tests pass locally
⚠️ Database credentials ready
⚠️ JWT secret generated
⚠️ Frontend API URL configured

During Deployment:
□ Backend deployed
□ Database connected
□ Migrations run
□ Frontend deployed
□ CORS configured

Post-Deployment:
□ Login tested
□ Passwords changed
□ Default users removed
□ Backups scheduled
□ Monitoring setup
```

**Once all ✅ - You're ready to deploy! 🚀**