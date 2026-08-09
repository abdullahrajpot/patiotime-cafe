# PatioTime Cafe - Complete Deployment Guide

**Version:** 1.0.0  
**Last Updated:** February 9, 2026

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
- [Backend Deployment (Railway)](#backend-deployment-railway)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Post-Deployment Steps](#post-deployment-steps)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Accounts
- [ ] GitHub account (for code repository)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Railway account (free tier available)
- [ ] Vercel account (free tier available)

### Required Tools
- [ ] Git installed
- [ ] Node.js v18+ installed
- [ ] npm or yarn installed
- [ ] Code editor (VS Code recommended)

---

## Environment Setup

### 1. Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/yourusername/patiotime-cafe.git
cd patiotime-cafe

# Or if starting fresh
mkdir patiotime-cafe
cd patiotime-cafe
# Copy your project files here
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Test Locally

```bash
# Start backend (from server folder)
cd server
npm start
# Should run on http://localhost:5000

# Start frontend (from client folder - new terminal)
cd client
npm run dev
# Should run on http://localhost:5173
```

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign In"
3. Create account or login

### Step 2: Create a Cluster

1. Click "Create" button
2. Choose **FREE** tier (M0)
3. Select cloud provider: **AWS** (recommended)
4. Select region: **Closest to your users** (e.g., US East for US users)
5. Cluster name: `Cluster0` (default is fine)
6. Click "Create Cluster"
7. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `patiotime_user` (or your choice)
5. Password: Click "Autogenerate Secure Password" and **SAVE IT**
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 4: Configure Network Access

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose one of:
   - **Allow Access from Anywhere**: `0.0.0.0/0` (for Railway/Vercel) ✅ RECOMMENDED
   - **Add Current IP Address**: (for local testing only)
4. Click "Confirm"

### Step 5: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace** `<password>` with your actual password
8. **Add** database name after `.net/`: `/patiotime`
9. Final format:
   ```
   mongodb+srv://patiotime_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/patiotime?retryWrites=true&w=majority
   ```

### Step 6: Initialize Database

The database collections will be created automatically when the app first runs. To manually initialize categories:

```bash
# From server folder
cd server
node create-categories.js
```

---

## Backend Deployment (Railway)

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/patiotime-cafe.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Account

1. Go to [Railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### Step 3: Create New Project

1. Click "New Project"
2. Choose "Deploy from GitHub repo"
3. Select your repository: `patiotime-cafe`
4. Railway will detect it's a monorepo

### Step 4: Configure Backend Service

1. Click on the deployed service
2. Go to "Settings" tab
3. **Root Directory**: Set to `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Click "Deploy"

### Step 5: Add Environment Variables

1. Go to "Variables" tab
2. Add the following variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://patiotime_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/patiotime?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_change_this
CLIENT_URL=https://your-frontend-app.vercel.app
```

**Generate strong JWT_SECRET:**
```bash
# In terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

3. Click "Add" for each variable
4. Railway will automatically redeploy

### Step 6: Get Backend URL

1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. Copy the generated URL (e.g., `https://patiotime-cafe-production.up.railway.app`)
5. **Save this URL** - you'll need it for frontend

### Step 7: Test Backend

1. Open browser and go to: `https://your-railway-url.up.railway.app/api/health`
2. Should see:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "environment": "production",
     ...
   }
   ```

---

## Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment

1. Edit `client/.env`:
   ```env
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```
2. Commit changes:
   ```bash
   git add client/.env
   git commit -m "Update API URL for production"
   git push
   ```

### Step 2: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com)
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. **Framework Preset**: Vite
4. **Root Directory**: Set to `client`
5. Click "Deploy"

### Step 4: Configure Environment Variables

1. After deployment, go to project settings
2. Click "Environment Variables"
3. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
   - **Environment**: All (Production, Preview, Development)
4. Click "Save"

### Step 5: Redeploy

1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache"
5. Click "Redeploy"

### Step 6: Get Frontend URL

1. Vercel automatically assigns a domain
2. Default: `https://patiotime-cafe.vercel.app`
3. Can add custom domain in "Domains" settings

### Step 7: Update Backend CORS

1. Go back to Railway
2. Update `CLIENT_URL` variable:
   ```env
   CLIENT_URL=https://patiotime-cafe.vercel.app
   ```
3. Railway will auto-redeploy

---

## Post-Deployment Steps

### 1. Initialize Categories

**Option A: Using Browser Console**
1. Open frontend in browser
2. Press F12 (open console)
3. Paste and run:
```javascript
fetch('https://your-railway-url.up.railway.app/api/init-categories-now', {
  method: 'POST'
}).then(r => r.json()).then(d => console.log(d));
```

**Option B: Using Postman**
1. Send POST request to: `https://your-railway-url.up.railway.app/api/init-categories-now`
2. No body needed
3. Should return 3 categories

### 2. Create Admin User

**Option A: Register via Frontend**
1. Go to `https://your-app.vercel.app/register`
2. Create an account
3. Get the user's `_id` from MongoDB Atlas

**Option B: Direct MongoDB**
1. Log into MongoDB Atlas
2. Click "Collections"
3. Find `users` collection
4. Find your user document
5. Click "Edit" and change `role` from `customer` to `admin`
6. Click "Update"

**Option C: MongoDB Compass**
1. Connect to your cluster using Compass
2. Navigate to `patiotime.users`
3. Find your user
4. Change `role` to `admin`
5. Save

### 3. Test All Features

**Frontend:**
- [ ] Homepage loads
- [ ] Menu displays items
- [ ] Can create an order
- [ ] Can track order by code
- [ ] Can create reservation
- [ ] Can submit contact form
- [ ] Login works
- [ ] Register works
- [ ] Dashboard shows orders (logged in)

**Admin:**
- [ ] Can login with admin account
- [ ] Admin panel accessible
- [ ] Can view orders
- [ ] Can update order status
- [ ] Can add menu items
- [ ] Can upload images
- [ ] Can view reservations
- [ ] Can view contacts

### 4. Upload Menu Images

1. Login as admin
2. Go to Menu Management
3. Add menu items with images
4. Images will be stored in Railway's ephemeral storage
   - **Note**: Images will be lost on Railway restarts
   - **Solution**: Use Cloudinary for production (see below)

### 5. Setup Cloudinary (Optional - Recommended)

For permanent image storage:

1. Create [Cloudinary account](https://cloudinary.com)
2. Get credentials from dashboard
3. Add to Railway environment:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Update multer config to use Cloudinary
   - See `FIX-IMAGE-UPLOAD.md` for implementation

---

## Environment Variables

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| NODE_ENV | Yes | Environment mode | `production` |
| PORT | Auto | Server port (Railway provides) | `5000` |
| MONGO_URI | Yes | MongoDB connection string | `mongodb+srv://...` |
| JWT_SECRET | Yes | JWT signing key (32+ chars) | Generated hash |
| CLIENT_URL | Yes | Frontend URL for CORS | `https://app.vercel.app` |
| RATE_LIMIT_ENABLED | No | Enable rate limiting | `true` |
| LOG_LEVEL | No | Logging level | `info` |

### Frontend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| VITE_API_URL | Yes | Backend API URL | `https://api.railway.app/api` |

---

## Troubleshooting

### Backend Issues

#### Error: "MongoDB connection failed"
**Cause**: Incorrect MONGO_URI or network access not configured

**Fix:**
1. Check MONGO_URI is correct in Railway variables
2. Verify password in connection string (no special chars need encoding)
3. Check MongoDB Atlas Network Access allows 0.0.0.0/0
4. Check Railway logs: `railway logs`

#### Error: "JWT_SECRET not set"
**Cause**: Missing or too short JWT_SECRET

**Fix:**
1. Generate strong secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Add to Railway environment variables
3. Must be 32+ characters

#### Error: "CORS policy blocked"
**Cause**: CLIENT_URL doesn't match frontend domain

**Fix:**
1. Update CLIENT_URL in Railway to exact Vercel URL
2. Include `https://` protocol
3. No trailing slash

#### Railway Build Fails
**Cause**: Wrong root directory or missing dependencies

**Fix:**
1. Check Root Directory is set to `server`
2. Check `package.json` exists in server folder
3. Check Railway logs for specific error

### Frontend Issues

#### Error: "Failed to fetch from API"
**Cause**: Wrong VITE_API_URL or backend not running

**Fix:**
1. Check VITE_API_URL in Vercel environment variables
2. Test backend URL in browser: `/api/health`
3. Redeploy frontend after changing env vars

#### Error: "Menu not loading"
**Cause**: Categories not initialized

**Fix:**
1. Initialize categories (see Post-Deployment Steps)
2. Check Railway logs for errors
3. Verify MongoDB has `categories` collection

#### Images Not Showing
**Cause**: Images on Railway ephemeral storage

**Fix:**
1. Use Cloudinary for production
2. Or re-upload images after Railway restart
3. Images stored in `/client/public/images` are lost on restart

### Database Issues

#### Collections Not Created
**Cause**: No data inserted yet

**Fix:**
- Collections auto-create on first insert
- Manually initialize categories
- Add first menu item via admin panel

#### Can't Find User in Database
**Cause**: User not registered yet

**Fix:**
1. Register via frontend
2. Check MongoDB Atlas → Collections → users
3. Verify `MONGO_URI` database name matches

---

## Rollback Procedures

### Backend Rollback (Railway)

1. Go to Railway dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Find last working deployment
5. Click "..." → "Redeploy"
6. Confirm redeployment

**Or using Git:**
```bash
# Find commit hash of last working version
git log

# Revert to that commit
git revert <commit-hash>
git push

# Railway will auto-deploy the reverted version
```

### Frontend Rollback (Vercel)

1. Go to Vercel dashboard
2. Go to "Deployments" tab
3. Find last working deployment
4. Click "..." → "Promote to Production"
5. Confirm promotion

### Database Rollback (MongoDB Atlas)

1. Go to MongoDB Atlas
2. Click "Backup" tab on your cluster
3. Find desired snapshot
4. Click "..." → "Download" or "Restore"
5. Follow restore procedure (see BACKUP-RESTORE.md)

---

## Production Checklist

Before going live:

**Security:**
- [ ] Strong JWT_SECRET (64+ characters)
- [ ] MongoDB Network Access configured (0.0.0.0/0)
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] No sensitive data in git repo
- [ ] .env files in .gitignore

**Database:**
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Backups enabled (automatic in Atlas)
- [ ] Categories initialized
- [ ] Admin user created

**Backend:**
- [ ] Deployed to Railway
- [ ] Environment variables set
- [ ] /api/health returns 200
- [ ] Can create orders
- [ ] Can track orders

**Frontend:**
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] VITE_API_URL points to Railway
- [ ] All pages load correctly
- [ ] Can place orders
- [ ] Admin panel works

**Testing:**
- [ ] Can register new user
- [ ] Can login
- [ ] Can browse menu
- [ ] Can place order
- [ ] Can track order
- [ ] Admin can manage orders
- [ ] Admin can manage menu

**Documentation:**
- [ ] README updated with live URLs
- [ ] API documentation available
- [ ] Admin credentials documented securely

---

## Monitoring

### Railway Monitoring
- View logs: Railway dashboard → Logs tab
- View metrics: Railway dashboard → Metrics tab
- Set up alerts: Railway dashboard → Settings → Alerts

### Vercel Monitoring
- View deployments: Vercel dashboard → Deployments
- View analytics: Vercel dashboard → Analytics (paid feature)
- View logs: Vercel dashboard → Logs

### MongoDB Atlas Monitoring
- View metrics: Atlas dashboard → Metrics tab
- View slow queries: Atlas dashboard → Performance Advisor
- View backups: Atlas dashboard → Backup tab

---

## Support

### Railway Support
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://railway.statuspage.io

### Vercel Support
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel-status.com

### MongoDB Atlas Support
- Documentation: https://docs.atlas.mongodb.com
- Support: https://support.mongodb.com
- Status: https://status.mongodb.com

---

## Common Commands

### Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Open in browser
railway open
```

### Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# View logs
vercel logs
```

---

*Last Updated: February 9, 2026*
*Deployment Guide Version: 1.0.0*
