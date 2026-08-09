# Deploy Updated Code to Railway - Step by Step Guide

**Issue:** Railway is running old code without the new routes (`/api/orders/history`, `/api/admin/categories/init`)

**Solution:** Push your updated code to GitHub to trigger Railway auto-deployment

---

## Step 1: Check Current Status

Open Command Prompt or PowerShell in your project folder:

```bash
cd "c:\Users\Sabri laptop\Downloads\patiotime-mern-app\mern-cafe"
```

Check what files have changed:

```bash
git status
```

You should see many modified and new files.

---

## Step 2: Add All Changes to Git

Add all your changes to staging:

```bash
git add .
```

Verify files are staged:

```bash
git status
```

All files should now show in green as "Changes to be committed"

---

## Step 3: Commit Your Changes

Commit with a descriptive message:

```bash
git commit -m "feat: implement all 8 phases - security, architecture, testing, performance

- Phase 1: Critical security fixes (JWT, IDOR, validation)
- Phase 2: Layered architecture (controllers/services/repositories)
- Phase 3: Automated testing suite (Jest + Supertest)
- Phase 4: Error handling and logging
- Phase 5: Frontend improvements
- Phase 6: Production configuration
- Phase 7: Complete documentation
- Phase 8: Performance optimization (indexes, caching)

All routes updated and tested locally"
```

---

## Step 4: Push to GitHub

Push your commit to GitHub:

```bash
git push origin main
```

**If you get an error about authentication:**

Option A: Use GitHub Desktop (recommended for Windows)
1. Download GitHub Desktop: https://desktop.github.com/
2. Open GitHub Desktop
3. Select your repository
4. Click "Push origin"

Option B: Use Personal Access Token
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Use token as password when pushing

---

## Step 5: Monitor Railway Deployment

1. **Go to Railway Dashboard**
   - Open: https://railway.app/dashboard
   - Find your `patiotime-cafe-production` project

2. **Watch the Deployment**
   - Railway will automatically detect the new commit
   - You'll see "Deploying..." in the dashboard
   - Click on the deployment to see logs

3. **Deployment Takes 2-5 Minutes**
   - Building Docker image
   - Installing dependencies
   - Starting server

4. **Check Deployment Logs**
   - Look for these success messages:
     ```
     ✅ MongoDB connected
     ✅ Default menu categories verified
     ✅ API server running on port XXXX
     ```

---

## Step 6: Verify Routes Work

Once deployment is complete, test the endpoints:

### Test 1: Health Check
```bash
curl https://patiotime-cafe-production.up.railway.app/api/health
```

**Expected:** JSON response with `"status": "ok"`

### Test 2: Categories Init (Admin)
Open browser console on your admin page and run:
```javascript
fetch('https://patiotime-cafe-production.up.railway.app/api/admin/categories/init', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

**Expected:** JSON with categories list

### Test 3: Order History (User Dashboard)
```javascript
fetch('https://patiotime-cafe-production.up.railway.app/api/orders/history', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

**Expected:** JSON array of user's orders

---

## Step 7: Test Your Frontend

1. **Open your deployed frontend:**
   - https://patiotime-cafe.vercel.app

2. **Login as admin:**
   - Email: admin@patiotime.com
   - Password: admin123

3. **Test Admin Panel:**
   - Go to Admin Dashboard
   - Try to view orders
   - Try to add/edit menu items
   - Check if categories load

4. **Test User Dashboard:**
   - Logout from admin
   - Login as a regular user
   - Go to Dashboard
   - Check if order history loads

---

## Troubleshooting

### Issue: Git push fails with "Authentication failed"

**Solution 1: Use GitHub Desktop**
- Easier for Windows users
- No need to deal with tokens

**Solution 2: Generate Personal Access Token**
```bash
# 1. Go to: https://github.com/settings/tokens
# 2. Generate new token (classic)
# 3. Select "repo" scope
# 4. Copy the token
# 5. When pushing, use token as password
```

### Issue: Railway still shows 404 after deployment

**Check:**
1. Deployment completed successfully (green checkmark in Railway)
2. No errors in Railway logs
3. Correct branch is deployed (should be `main`)

**Force Redeploy:**
```bash
# In Railway dashboard
# Click your service → Settings → "Redeploy" button
```

### Issue: Routes work locally but not on Railway

**Possible causes:**
1. Code not pushed to GitHub
2. Railway watching wrong branch
3. Railway environment variables missing

**Solution:**
```bash
# Verify Railway is watching the correct branch
# Railway Dashboard → Service → Settings → "Source" section
# Should show: Branch: main
```

---

## Alternative: Manual Deployment Verification

If you're unsure if Railway deployed your code, check the build logs:

1. Go to Railway Dashboard
2. Click your backend service
3. Click "Deployments" tab
4. Click the latest deployment
5. Check "Build Logs" and "Deploy Logs"

Look for file changes in build logs:
```
✅ server/routes/orders.js
✅ server/routes/admin.js
✅ server/controllers/orderController.js
```

---

## Quick Reference: Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message here"

# Push to GitHub (triggers Railway deployment)
git push origin main

# View commit history
git log --oneline

# Check remote URL
git remote -v
```

---

## Expected Timeline

| Step | Time | Description |
|------|------|-------------|
| Git add & commit | 30 seconds | Local operation |
| Git push | 1-2 minutes | Upload to GitHub |
| Railway detection | 10-30 seconds | Auto-detect new commit |
| Railway build | 2-3 minutes | Install dependencies |
| Railway deploy | 30 seconds | Start server |
| **Total** | **4-6 minutes** | Full deployment |

---

## Success Indicators

✅ **Git push successful:**
```
Enumerating objects: X, done.
Writing objects: 100% (X/X), X KiB | X MiB/s, done.
To https://github.com/your-username/your-repo.git
   abc1234..def5678  main -> main
```

✅ **Railway deployment successful:**
```
✅ MongoDB connected
✅ Node version: vX.X.X
✅ Default menu categories verified
✅ API server running on port 5000
```

✅ **Routes working:**
- Admin dashboard loads without errors
- User dashboard shows order history
- Menu items can be created/edited
- No 404 errors in browser console

---

## Still Having Issues?

If routes still return 404 after following all steps:

1. **Check Railway Logs**
   - Look for error messages
   - Verify server started successfully

2. **Check Environment Variables**
   - Railway Dashboard → Service → Variables
   - Verify JWT_SECRET, MONGODB_URI are set

3. **Try Manual Redeploy**
   - Railway Dashboard → Service → Click "..." → "Redeploy"

4. **Check if code is actually on GitHub**
   - Visit your GitHub repository
   - Browse to `server/routes/orders.js`
   - Verify line 13 shows: `router.get('/history', authenticateToken, ...)`

---

**Need Help?**
- Check Railway logs for errors
- Verify GitHub has the latest code
- Ensure environment variables are set in Railway

---

**Last Updated:** February 9, 2026
