# Complete Deployment Guide - PatioTime Cafe

## Overview
This guide covers deploying your MERN cafe application with:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Render (Node.js/Express)
- **Database**: MongoDB Atlas (Cloud Database)

---

## Prerequisites

### Accounts Required
- ✅ [GitHub Account](https://github.com) - For code repository
- ✅ [Vercel Account](https://vercel.com) - For frontend hosting
- ✅ [Render Account](https://render.com) - For backend hosting
- ✅ [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) - For database

### Local Requirements
- Git installed on your computer
- Node.js and npm installed
- Your project code ready

---

## Part 1: Prepare Your Code

### Step 1.1: Initialize Git Repository

```bash
# Navigate to project root
cd "c:\Users\Sabri laptop\Downloads\patiotime-mern-app\mern-cafe"

# Initialize git (if not already done)
git init

# Create .gitignore in root directory
```

Create **`.gitignore`** in project root:
```
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment files
.env
server/.env
client/.env

# Build files
client/dist/
client/build/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### Step 1.2: Update Backend for Production

Create **`server/vercel.json`** (for Vercel compatibility):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

Update **`server/server.js`** to handle CORS for production:
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const reservationRoutes = require('./routes/reservations');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../client/public/images')));

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected:', MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
```

### Step 1.3: Update Frontend API Configuration

Update **`client/src/api.js`** to use environment variable for API URL:
```javascript
const BASE = import.meta.env.VITE_API_URL || '/api';

// Rest of the file remains the same...
```

### Step 1.4: Add Build Scripts

Verify **`client/package.json`** has build script:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Verify **`server/package.json`**:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 1.5: Commit to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create repository on GitHub (via website)
# Then connect and push
git remote add origin https://github.com/YOUR_USERNAME/patiotime-cafe.git
git branch -M main
git push -u origin main
```

---

## Part 2: MongoDB Atlas Setup

### Step 2.1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Choose **FREE tier** (M0 Sandbox)
5. Select **Cloud Provider**: AWS
6. Select **Region**: Closest to your users
7. Cluster Name: `patiotime-cafe`
8. Click **"Create Cluster"**

### Step 2.2: Configure Database Access

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `patiotime_admin`
5. Password: Click **"Autogenerate Secure Password"** (save this!)
6. Database User Privileges: **Atlas Admin**
7. Click **"Add User"**

### Step 2.3: Configure Network Access

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

⚠️ **Note**: For production, restrict to specific IPs for better security

### Step 2.4: Get Connection String

1. Go back to **"Database"** in sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://patiotime_admin:<password>@patiotime-cafe.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with the password you saved earlier
7. Add database name before `?`:
   ```
   mongodb+srv://patiotime_admin:YOUR_PASSWORD@patiotime-cafe.xxxxx.mongodb.net/patiotime?retryWrites=true&w=majority
   ```

Save this connection string - you'll need it for Render!

---

## Part 3: Deploy Backend to Render

### Step 3.1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your **patiotime-cafe** repository

### Step 3.2: Configure Web Service

**Basic Settings**:
- **Name**: `patiotime-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type**:
- Select **Free** tier (or paid for better performance)

### Step 3.3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `5000` | Port number |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-secret-key-here` | Generate a strong random string |
| `CLIENT_URL` | `https://your-app.vercel.app` | Will update after Vercel deployment |

**Generate Strong JWT Secret**:
```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3.4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes first time)
3. Once deployed, you'll get a URL like: `https://patiotime-backend.onrender.com`

### Step 3.5: Test Backend

Visit: `https://patiotime-backend.onrender.com/api/health`

Should see:
```json
{
  "ok": true,
  "timestamp": "2025-02-01T..."
}
```

✅ Backend is live!

### Step 3.6: Seed Database (Optional)

If you have a seed script in `server/seed.js`:

1. In Render dashboard, go to your service
2. Click **"Shell"** tab
3. Run:
   ```bash
   cd server
   node seed.js
   ```

Or create a **one-time job**:
1. In Render, click **"New +"** → **"Job"**
2. Connect same repository
3. Root Directory: `server`
4. Build Command: `npm install`
5. Start Command: `node seed.js`
6. Click **"Create Job"**
7. Manually trigger to seed database

---

## Part 4: Deploy Frontend to Vercel

### Step 4.1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

Or use the Vercel dashboard (recommended for first deployment)

### Step 4.2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select **patiotime-cafe**

### Step 4.3: Configure Project

**Framework Preset**: Vite

**Root Directory**: Click **"Edit"** → Set to `client`

**Build Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4.4: Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://patiotime-backend.onrender.com/api` | Production |

⚠️ **Important**: Use your actual Render backend URL!

### Step 4.5: Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. You'll get a URL like: `https://patiotime-cafe.vercel.app`

### Step 4.6: Update Backend CORS

Go back to Render dashboard:

1. Navigate to your backend service
2. Go to **"Environment"** tab
3. Update `CLIENT_URL` variable:
   - Value: `https://patiotime-cafe.vercel.app` (your actual Vercel URL)
4. Click **"Save Changes"**
5. Service will automatically redeploy

---

## Part 5: Configure Custom Domain (Optional)

### For Vercel (Frontend)

1. In Vercel project settings
2. Go to **"Domains"** tab
3. Click **"Add"**
4. Enter your domain: `www.patiotimecafe.com`
5. Follow DNS configuration instructions
6. Add CNAME record pointing to Vercel

### For Render (Backend)

1. In Render service settings
2. Go to **"Settings"** tab
3. Scroll to **"Custom Domain"**
4. Add: `api.patiotimecafe.com`
5. Follow DNS configuration instructions
6. Add CNAME record pointing to Render

---

## Part 6: Image Upload Configuration

### Issue: Uploaded Images Storage

By default, Render uses **ephemeral storage** - files uploaded are lost on each deployment.

### Solution Options:

#### Option 1: Use Cloud Storage (Recommended)

**Cloudinary** (Free tier: 25GB storage):

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Install SDK:
   ```bash
   cd server
   npm install cloudinary multer-storage-cloudinary
   ```

3. Update **`server/routes/admin.js`** upload route:
   ```javascript
   const cloudinary = require('cloudinary').v2;
   const { CloudinaryStorage } = require('multer-storage-cloudinary');

   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
   });

   const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
       folder: 'patiotime-menu',
       allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
       transformation: [{ width: 800, height: 800, crop: 'limit' }]
     }
   });

   const upload = multer({ 
     storage: storage,
     limits: { fileSize: 5 * 1024 * 1024 }
   });

   router.post('/upload', upload.single('image'), async (req, res) => {
     try {
       res.json({ 
         filename: req.file.filename,
         url: req.file.path // Cloudinary URL
       });
     } catch (err) {
       res.status(500).json({ error: 'Upload failed' });
     }
   });
   ```

4. Add environment variables in Render:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. Update frontend to use full URL from upload response

#### Option 2: Use MongoDB GridFS

Store images directly in MongoDB (good for small-medium apps)

#### Option 3: Use Render Persistent Disks (Paid)

Render offers persistent storage volumes (paid feature)

---

## Part 7: Testing Deployment

### Test Checklist

#### Frontend Tests:
- [ ] Home page loads
- [ ] Menu page displays items from database
- [ ] Images load correctly
- [ ] Add to cart works
- [ ] Checkout form works
- [ ] Registration works
- [ ] Login works
- [ ] Reservation form works
- [ ] Contact form works
- [ ] Mobile responsive
- [ ] All navigation links work

#### Backend Tests:
- [ ] `/api/health` returns success
- [ ] `/api/menu` returns menu items
- [ ] `/api/orders` creates orders
- [ ] `/api/auth/register` creates users
- [ ] `/api/auth/login` returns token
- [ ] `/api/admin/orders` returns orders
- [ ] Image uploads work (if using cloud storage)

#### Admin Panel Tests:
- [ ] Dashboard stats display
- [ ] Orders list shows
- [ ] Can update order status
- [ ] Menu items CRUD works
- [ ] Image upload works
- [ ] Reservations display
- [ ] Contacts display

---

## Part 8: Troubleshooting

### Common Issues

#### Issue 1: CORS Errors

**Symptom**: Frontend can't connect to backend

**Solution**:
1. Check `CLIENT_URL` in Render environment variables
2. Verify it matches your Vercel URL exactly
3. Ensure no trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`

#### Issue 2: MongoDB Connection Fails

**Symptom**: Backend crashes on startup

**Solution**:
1. Check `MONGO_URI` is correct
2. Verify password has no special characters or is URL-encoded
3. Check Network Access allows 0.0.0.0/0
4. Ensure database user has correct permissions

#### Issue 3: Environment Variables Not Working

**Symptom**: App works locally but not in production

**Solution**:
1. In Vercel: Prefix with `VITE_` for client-side variables
2. In Render: Check all variables are set in Environment tab
3. Redeploy after adding/changing variables

#### Issue 4: Images Not Loading

**Symptom**: Menu items show broken image icons

**Solution**:
1. Use full URLs for images (not relative paths)
2. Implement Cloudinary or other cloud storage
3. Check image paths in database

#### Issue 5: Build Fails

**Symptom**: Deployment fails during build

**Solution**:
1. Check build logs for specific errors
2. Verify all dependencies in package.json
3. Test build locally: `npm run build`
4. Check Node version compatibility

#### Issue 6: Slow Backend (Render Free Tier)

**Symptom**: First request takes 30+ seconds

**Solution**:
- Render free tier spins down after inactivity
- Consider upgrading to paid tier ($7/month)
- Or use a cron job to ping every 10 minutes

---

## Part 9: Environment Variables Reference

### Backend (Render)

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/patiotime?retryWrites=true&w=majority
JWT_SECRET=your-64-character-random-string-here
CLIENT_URL=https://your-app.vercel.app

# Optional: For Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (Vercel)

```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Part 10: Monitoring & Maintenance

### Render Monitoring

1. **Logs**: View real-time logs in Render dashboard
2. **Metrics**: Check CPU, memory usage
3. **Health Checks**: Render automatically monitors uptime

### Vercel Monitoring

1. **Analytics**: Enable Vercel Analytics (free)
2. **Error Tracking**: Use Sentry or similar
3. **Performance**: Check Lighthouse scores

### Database Monitoring

1. **MongoDB Atlas**: Check cluster metrics
2. **Storage**: Monitor database size
3. **Backups**: Enable automatic backups (paid feature)

### Maintenance Tasks

- [ ] Monitor error logs weekly
- [ ] Check database backups monthly
- [ ] Review storage usage monthly
- [ ] Update dependencies quarterly
- [ ] Test all features after updates

---

## Part 11: Continuous Deployment

### Auto-Deploy Setup

**Vercel** (Automatic):
- Pushes to `main` branch auto-deploy
- Pull requests create preview deployments
- No configuration needed!

**Render** (Automatic):
- Pushes to `main` branch auto-deploy
- Can configure auto-deploy in service settings
- Enable "Auto-Deploy" option

### Deployment Workflow

```bash
# Local development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub
# Review changes
# Merge to main

# Automatic deployment triggers!
# Vercel: Frontend deploys
# Render: Backend deploys
```

---

## Part 12: Costs Summary

### Free Tier Limits

**Vercel** (Hobby - Free):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Custom domain
- ✅ Automatic HTTPS
- ✅ Preview deployments

**Render** (Free):
- ✅ 750 hours/month (1 service 24/7)
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 30-50 second cold start
- ✅ 512 MB RAM
- ✅ Custom domain

**MongoDB Atlas** (M0 - Free):
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Suitable for development/small apps
- ⚠️ Limited to 1 free cluster per account

### Recommended Paid Upgrades

**For Production**:
1. **Render Starter** ($7/month): No spin-down, faster
2. **MongoDB M2** ($9/month): 2GB storage, better performance
3. **Cloudinary** (Free → $0): 25GB storage

**Total**: ~$16/month for professional hosting

---

## Quick Reference Commands

```bash
# Test backend locally
cd server
npm run dev

# Test frontend locally
cd client
npm run dev

# Build frontend locally
cd client
npm run build

# Test production build locally
cd client
npm run preview

# View Vercel logs
vercel logs

# Deploy to Vercel manually
vercel --prod

# Rollback Vercel deployment
vercel rollback
```

---

## Deployment Checklist

### Before Deployment:
- [ ] Code pushed to GitHub
- [ ] .gitignore properly configured
- [ ] Environment variables documented
- [ ] Build scripts tested locally
- [ ] MongoDB Atlas cluster created
- [ ] Connection string saved securely

### Backend Deployment:
- [ ] Render service created
- [ ] Environment variables set
- [ ] Connected to GitHub repo
- [ ] Root directory set to `server`
- [ ] Deployment successful
- [ ] Health endpoint tested
- [ ] Database connection verified

### Frontend Deployment:
- [ ] Vercel project created
- [ ] Root directory set to `client`
- [ ] VITE_API_URL configured
- [ ] Build successful
- [ ] Site accessible
- [ ] API calls working

### Post-Deployment:
- [ ] Backend CORS updated with frontend URL
- [ ] All features tested
- [ ] Admin panel accessible
- [ ] Image uploads working (if configured)
- [ ] Mobile responsive checked
- [ ] Custom domains configured (if applicable)

---

## Success! 🎉

Your PatioTime Cafe is now live!

**Access Your App**:
- 🌐 **Frontend**: https://your-app.vercel.app
- 🔧 **Backend API**: https://your-backend.onrender.com
- 💾 **Database**: MongoDB Atlas

**Admin Access**: https://your-app.vercel.app/admin

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Vite Documentation](https://vitejs.dev/guide)
- [Express.js Documentation](https://expressjs.com)

---

**Happy Deploying! ☕**
