# 🚀 Deployment Guide - Real Estate CRM

Complete guide to deploy your Real Estate CRM to production.

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deploy to Railway (Easiest)](#deploy-to-railway)
3. [Deploy to Vercel + Railway](#deploy-to-vercel--railway)
4. [Deploy to Render](#deploy-to-render)
5. [Deploy to VPS (DigitalOcean/AWS)](#deploy-to-vps)
6. [Deploy with Docker](#deploy-with-docker)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Your code is committed and pushed to GitHub
- [ ] All tests pass locally
- [ ] You have production database credentials
- [ ] You've changed default passwords
- [ ] You've generated a strong JWT secret
- [ ] Frontend is configured with production API URL

---

## Deploy to Railway (Easiest - Recommended)

**Cost:** Free tier available, then pay-as-you-go

**What gets deployed:** Backend + PostgreSQL Database

### Step 1: Create Railway Account

1. Go to [Railway.app](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Deploy Backend

1. **Click "Deploy from GitHub repo"**
2. **Select your repository:** `Gaikwad1208/real-estate-crm`
3. **Configure the service:**
   - Root directory: `backend`
   - Build command: `npm install && npx prisma generate`
   - Start command: `npx prisma migrate deploy && node server.js`

### Step 3: Add PostgreSQL Database

1. **Click "+ New"** in your project
2. **Select "Database" → "PostgreSQL"**
3. Railway automatically creates `DATABASE_URL`

### Step 4: Set Environment Variables

In your backend service, add:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-production-key-min-32-chars
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 5: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com/)
2. Import your GitHub repository
3. **Configure:**
   - Framework: Vite
   - Root directory: `./`
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Add environment variable:**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

5. **Deploy!**

### Step 6: Update CORS

Go back to Railway backend environment variables and update:
```env
FRONTEND_URL=https://your-app.vercel.app
```

✅ **Done!** Your app is live!

---

## Deploy to Vercel + Railway

**Best for:** Full-stack deployment with serverless frontend

### Backend on Railway

Follow Railway steps above (Steps 1-4)

### Frontend on Vercel

1. **Import GitHub repo** to Vercel
2. **Framework preset:** Vite
3. **Environment variables:**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
4. **Deploy**

### Connect them:

1. Copy Vercel frontend URL
2. Add to Railway backend:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy backend

---

## Deploy to Render

**Cost:** Free tier available

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub

### Step 2: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `real-estate-crm-db`
3. Plan: Free
4. Create database
5. Copy "Internal Database URL"

### Step 3: Deploy Backend

1. Click "New +" → "Web Service"
2. Connect your repository
3. **Configure:**
   - Name: `real-estate-crm-backend`
   - Root directory: `backend`
   - Environment: `Node`
   - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start command: `node server.js`

4. **Environment variables:**
   ```env
   DATABASE_URL=[paste internal database URL]
   JWT_SECRET=your-super-secret-production-key
   JWT_EXPIRE=7d
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.onrender.com
   ```

5. **Create Web Service**

### Step 4: Deploy Frontend

1. Click "New +" → "Static Site"
2. Connect your repository
3. **Configure:**
   - Name: `real-estate-crm-frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

4. **Environment variables:**
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

5. **Create Static Site**

### Step 5: Update Backend CORS

After frontend deploys, update backend `FRONTEND_URL` with actual frontend URL.

---

## Deploy to VPS (DigitalOcean/AWS/Linode)

**Best for:** Full control, production apps

### Step 1: Create VPS

1. Create Ubuntu 22.04 droplet/instance
2. SSH into server:
   ```bash
   ssh root@your-server-ip
   ```

### Step 2: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2

# Install Git
apt install -y git
```

### Step 3: Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE real_estate_crm;
CREATE USER crm_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE real_estate_crm TO crm_user;
\q
```

### Step 4: Clone and Setup Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm

# Setup backend
cd backend
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://crm_user:your_secure_password@localhost:5432/real_estate_crm?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
EOF

# Run migrations
npm run prisma:generate
npm run prisma:migrate
npm run seed

# Start with PM2
pm2 start server.js --name real-estate-crm-backend
pm2 save
pm2 startup
```

### Step 5: Build Frontend

```bash
cd /var/www/real-estate-crm

# Create .env
cat > .env << EOF
VITE_API_URL=https://your-domain.com/api
EOF

# Install and build
npm install
npm run build
```

### Step 6: Configure Nginx

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/real-estate-crm << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/real-estate-crm/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/real-estate-crm /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
```

### Step 7: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renew
certbot renew --dry-run
```

✅ **Done!** Visit https://your-domain.com

---

## Deploy with Docker

**Best for:** Containerized deployments

### On Any Server:

```bash
# Clone repository
git clone https://github.com/Gaikwad1208/real-estate-crm.git
cd real-estate-crm

# Create .env file
cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=real_estate_crm
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://your-domain.com
EOF

# Start containers
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

### Setup Nginx Reverse Proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"

# JWT
JWT_SECRET="min-32-character-random-string-change-in-production"
JWT_EXPIRE="7d"

# Server
PORT=5000
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-frontend-domain.com

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### Frontend (.env)

```env
# API URL
VITE_API_URL=https://your-backend-domain.com/api

# App Config
VITE_APP_NAME="Real Estate CRM"
VITE_APP_VERSION=1.0.0
```

### Generate Strong JWT Secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Test API
curl https://your-backend.com/api/health

# Should return:
{"status":"ok","message":"Real Estate CRM API is running"}
```

### 2. Create Admin User

```bash
# SSH into server or use Railway/Render shell
cd backend
npm run seed
```

### 3. Test Login

1. Go to https://your-frontend.com
2. Login with:
   - Email: `admin@realestatecrm.com`
   - Password: `admin123`
3. **IMPORTANT:** Change password immediately!

### 4. Setup Monitoring

**For Railway/Render:** Built-in monitoring available

**For VPS:**
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs real-estate-crm-backend
```

### 5. Setup Backups

**PostgreSQL Backup:**
```bash
# Create backup script
cat > /root/backup-db.sh << 'EOF'
#!/bin/bash
pg_dump real_estate_crm > /backups/crm-$(date +%Y%m%d).sql
EOF

chmod +x /root/backup-db.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /root/backup-db.sh
```

### 6. Security Checklist

- [ ] Changed all default passwords
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Database not publicly accessible
- [ ] Strong JWT secret set
- [ ] CORS properly configured
- [ ] Regular backups scheduled

---

## Troubleshooting

### Issue: "502 Bad Gateway"
**Solution:**
- Check backend is running: `pm2 status`
- Check logs: `pm2 logs`
- Restart: `pm2 restart real-estate-crm-backend`

### Issue: "Database connection failed"
**Solution:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `systemctl status postgresql`
- Test connection: `psql $DATABASE_URL`

### Issue: "CORS errors"
**Solution:**
- Update `FRONTEND_URL` in backend .env
- Restart backend service

### Issue: "Cannot login"
**Solution:**
- Check JWT_SECRET is set
- Verify database has users: `npm run seed`
- Check API is responding: `curl backend-url/api/health`

---

## Estimated Costs

| Platform | Free Tier | Paid Plan |
|----------|-----------|----------|
| Railway | $5 credit/month | ~$10-20/month |
| Vercel | Yes (generous) | $20/month |
| Render | Yes (limited) | $7/month |
| DigitalOcean VPS | No | $6/month |
| AWS EC2 | 12 months free | ~$10/month |

---

## Support

For deployment issues:
1. Check this guide
2. See [GitHub Issues](https://github.com/Gaikwad1208/real-estate-crm/issues)
3. Contact platform support (Railway, Vercel, etc.)

---

**Your Real Estate CRM is now live! 🚀**