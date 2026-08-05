# 🚀 Quick Deployment Checklist

Use this checklist to deploy PatioTime Cafe step by step.

---

## ✅ Pre-Deployment (Local)

- [ ] Test app locally - frontend and backend work
- [ ] All dependencies installed (`npm install` in both folders)
- [ ] Environment variables configured locally
- [ ] Git initialized in project root
- [ ] `.gitignore` file created
- [ ] Code committed to Git

---

## ✅ GitHub Setup

- [ ] Create new repository on GitHub
- [ ] Repository name: `patiotime-cafe` (or your choice)
- [ ] Make it **Public** (required for free Vercel/Render)
- [ ] Push code to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/patiotime-cafe.git
  git branch -M main
  git push -u origin main
  ```

---

## ✅ MongoDB Atlas (Database)

- [ ] Sign up/login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create new cluster (FREE M0 tier)
- [ ] Create database user with password (save it!)
- [ ] Add Network Access: `0.0.0.0/0` (allow all)
- [ ] Get connection string
- [ ] Replace `<password>` in connection string
- [ ] Add database name: `.../patiotime?retryWrites...`
- [ ] Save connection string securely

**Connection String Format**:
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/patiotime?retryWrites=true&w=majority
```

---

## ✅ Render (Backend Deployment)

- [ ] Sign up/login to [Render](https://render.com)
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Connect GitHub repository
- [ ] Configure service:
  - **Name**: `patiotime-backend`
  - **Root Directory**: `server`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Instance Type**: Free

- [ ] Add environment variables:
  - `NODE_ENV` = `production`
  - `PORT` = `5000`
  - `MONGO_URI` = `your-mongodb-atlas-connection-string`
  - `JWT_SECRET` = `generate-random-64-char-string`
  - `CLIENT_URL` = `https://your-app.vercel.app` (will update later)

- [ ] Click **"Create Web Service"**
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy backend URL: `https://patiotime-backend.onrender.com`
- [ ] Test health endpoint: `/api/health`

**Generate JWT Secret** (in terminal):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Vercel (Frontend Deployment)

- [ ] Sign up/login to [Vercel](https://vercel.com)
- [ ] Click **"Add New..."** → **"Project"**
- [ ] Import GitHub repository
- [ ] Configure project:
  - **Framework**: Vite
  - **Root Directory**: `client` ✅ **IMPORTANT**
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  
- [ ] Add environment variable:
  - `VITE_API_URL` = `https://your-backend.onrender.com/api`
  - ⚠️ Use your actual Render URL!

- [ ] Click **"Deploy"**
- [ ] Wait 2-5 minutes
- [ ] Copy frontend URL: `https://patiotime-cafe.vercel.app`

---

## ✅ Update Backend CORS

- [ ] Go back to Render dashboard
- [ ] Open your backend service
- [ ] Go to **"Environment"** tab
- [ ] Update `CLIENT_URL`:
  - Value: `https://your-app.vercel.app` (your actual Vercel URL)
- [ ] Click **"Save Changes"**
- [ ] Wait for automatic redeploy (2-3 minutes)

---

## ✅ Seed Database (Optional)

If you have menu items or test data to add:

**Option 1: Via Render Shell**
- [ ] In Render service, click **"Shell"** tab
- [ ] Run: `node seed.js`

**Option 2: Via Admin Panel**
- [ ] Visit: `https://your-app.vercel.app/admin`
- [ ] Manually add menu items via UI

---

## ✅ Testing

Test each feature on the live site:

### Frontend Tests:
- [ ] Home page loads correctly
- [ ] Menu displays items from database
- [ ] Can add items to cart
- [ ] Cart page works
- [ ] Checkout form works
- [ ] Can place test order
- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Reservation form submits
- [ ] Contact form submits

### Admin Panel Tests:
- [ ] Navigate to `/admin`
- [ ] Dashboard shows stats
- [ ] Orders tab displays orders
- [ ] Can update order status
- [ ] Menu Items tab works
- [ ] Can add new menu item
- [ ] Can edit menu item
- [ ] Can delete menu item
- [ ] Reservations tab works
- [ ] Contacts tab works

### Mobile Tests:
- [ ] Open site on mobile device
- [ ] Navigation hamburger menu works
- [ ] All pages responsive
- [ ] Forms work on mobile
- [ ] Admin panel responsive

---

## ✅ Final Steps

- [ ] Test all functionality end-to-end
- [ ] Check browser console for errors
- [ ] Verify no CORS errors
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Share URL with team/client

---

## 🎉 Success URLs

After successful deployment, save these:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://your-app.vercel.app` | Public website |
| **Backend** | `https://your-backend.onrender.com` | API server |
| **Admin Panel** | `https://your-app.vercel.app/admin` | Admin dashboard |
| **MongoDB** | Atlas Dashboard | Database management |
| **GitHub** | Your repository | Source code |

---

## ⚠️ Common Issues

### Issue: CORS Error
**Fix**: Update `CLIENT_URL` in Render to match Vercel URL exactly

### Issue: Backend Takes 30+ Seconds
**Fix**: Render free tier spins down - first request is slow (normal)

### Issue: Images Not Loading
**Fix**: Use Cloudinary for production image storage (see deployment guide)

### Issue: Can't Connect to Database
**Fix**: Check MongoDB Atlas Network Access allows `0.0.0.0/0`

---

## 📞 Need Help?

- Read full guide: `DEPLOYMENT-GUIDE.md`
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

---

## 🔄 Continuous Deployment

✅ Auto-deploy is enabled by default!

Every time you push to GitHub:
1. Vercel automatically rebuilds frontend
2. Render automatically rebuilds backend
3. Changes go live in 2-5 minutes

**Workflow**:
```bash
# Make changes locally
git add .
git commit -m "Your change description"
git push origin main

# Wait 2-5 minutes
# Visit your site - changes are live!
```

---

**Deployment Complete! ☕️🎉**
