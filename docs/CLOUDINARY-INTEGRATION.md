# Cloudinary Integration Guide (Optional)

**Status:** Optional Enhancement  
**Purpose:** Cloud-based image storage and optimization  
**Benefits:** Automatic image optimization, CDN delivery, persistent storage

---

## Why Cloudinary?

### Current Setup (Local Storage)
- ❌ Images stored in `/client/public/images`
- ❌ Lost on Railway restarts (ephemeral filesystem)
- ❌ No automatic optimization
- ❌ No CDN delivery
- ❌ Manual image management

### With Cloudinary
- ✅ Permanent cloud storage
- ✅ Automatic image optimization
- ✅ CDN delivery worldwide
- ✅ On-the-fly transformations
- ✅ Free tier: 25GB storage, 25GB bandwidth/month

---

## Setup Instructions

### Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up for free account
3. Verify your email
4. Login to dashboard

### Step 2: Get Credentials

1. Go to Dashboard
2. Find "Account Details" section
3. Note these values:
   - **Cloud Name**: `your-cloud-name`
   - **API Key**: `123456789012345`
   - **API Secret**: `your-api-secret`

### Step 3: Install Cloudinary SDK

```bash
cd server
npm install cloudinary multer-storage-cloudinary
```

### Step 4: Configure Environment Variables

Add to `server/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 5: Update Multer Configuration

Replace the multer storage configuration in `server/routes/admin.js`:

**Before (Local Storage):**
```javascript
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../client/public/images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.toLowerCase().replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});
```

**After (Cloudinary):**
```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'patiotime-menu', // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      {
        width: 800,
        height: 600,
        crop: 'limit', // Don't upscale, only downscale
        quality: 'auto:good', // Automatic quality optimization
        fetch_format: 'auto', // Serve WebP to supported browsers
      }
    ],
  },
});
```

### Step 6: Update Upload Response

Replace the upload route handler response:

**Before:**
```javascript
res.json({ 
  filename: req.file.filename,
  path: `/images/${req.file.filename}`,
  message: 'Image uploaded successfully'
});
```

**After:**
```javascript
res.json({ 
  filename: req.file.filename, // Cloudinary public_id
  path: req.file.path, // Full Cloudinary URL
  url: req.file.path, // Full URL for direct access
  message: 'Image uploaded successfully'
});
```

### Step 7: Update Frontend Image URLs

In `client/src/utils/images.js`, update the image URL helper:

**Before:**
```javascript
export function menuItemImg(imageName) {
  if (!imageName) return '/images/placeholder.jpg';
  return `/images/${imageName}`;
}
```

**After:**
```javascript
export function menuItemImg(imagePathOrName) {
  if (!imagePathOrName) return '/images/placeholder.jpg';
  
  // If it's a full Cloudinary URL, use it directly
  if (imagePathOrName.startsWith('http://') || imagePathOrName.startsWith('https://')) {
    return imagePathOrName;
  }
  
  // Otherwise, legacy local path
  return `/images/${imagePathOrName}`;
}
```

### Step 8: Update Railway Environment Variables

1. Go to Railway dashboard
2. Select your project
3. Go to Variables tab
4. Add:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your-api-secret
   ```
5. Railway will auto-redeploy

---

## Testing

### Test Upload

1. Login as admin
2. Go to Menu Management
3. Try uploading an image
4. Check Cloudinary dashboard → Media Library
5. Image should appear in `patiotime-menu` folder

### Test Display

1. Add menu item with uploaded image
2. Go to Menu page
3. Image should load from Cloudinary CDN
4. Check Network tab: image URL should be `res.cloudinary.com/...`

---

## Image Transformations

Cloudinary allows on-the-fly transformations:

### Automatic Format Conversion

```javascript
// Serve WebP to supported browsers automatically
transformation: [{ fetch_format: 'auto' }]
```

### Responsive Images

```javascript
// Serve different sizes based on device
const transformations = {
  thumbnail: { width: 200, height: 150, crop: 'fill' },
  medium: { width: 800, height: 600, crop: 'limit' },
  large: { width: 1200, height: 900, crop: 'limit' },
};
```

### Quality Optimization

```javascript
// Automatic quality based on content
{ quality: 'auto:good' }

// Or specific quality
{ quality: 80 }
```

### Example: Build URL with Transformations

```javascript
// In frontend
const imageUrl = cloudinary.url('patiotime-menu/image-id', {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto',
  fetch_format: 'auto',
});
```

---

## Migration from Local to Cloudinary

### Option 1: Manual Migration

1. Login to Cloudinary dashboard
2. Go to Media Library
3. Click "Upload"
4. Drag and drop existing images
5. Update menu items with new Cloudinary URLs

### Option 2: Programmatic Migration

Create migration script `server/scripts/migrate-to-cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;
const MenuItem = require('../models/MenuItem');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImages() {
  const items = await MenuItem.find({ image: { $ne: null } });
  
  for (const item of items) {
    const localPath = path.join(__dirname, '../../client/public/images', item.image);
    
    if (!fs.existsSync(localPath)) {
      console.log(`❌ Image not found: ${item.image}`);
      continue;
    }
    
    try {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'patiotime-menu',
        public_id: item.image.replace(/\.[^/.]+$/, ''), // Remove extension
      });
      
      // Update menu item with Cloudinary URL
      item.image = result.secure_url;
      await item.save();
      
      console.log(`✅ Migrated: ${item.name}`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${item.name}:`, error.message);
    }
  }
  
  console.log('✅ Migration complete!');
}

migrateImages();
```

Run migration:
```bash
cd server
node scripts/migrate-to-cloudinary.js
```

---

## Cost Estimation

### Free Tier (Sufficient for most cafes)
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: ~10,000 images (at 2.5MB average)

### Example Usage
- 100 menu items with images
- 1,000 visitors/month
- Each visitor views 20 images
- **Total bandwidth**: ~500MB/month
- **Cost**: FREE ✅

### Paid Plans (If Needed)
- **Plus**: $99/month - 78GB storage, 78GB bandwidth
- **Advanced**: $249/month - 159GB storage, 159GB bandwidth

---

## Benefits Summary

### Performance
- ✅ CDN delivery from closest server
- ✅ Automatic WebP conversion (30% smaller)
- ✅ Lazy loading support
- ✅ Progressive JPEG loading

### Reliability
- ✅ 99.9% uptime SLA
- ✅ Automatic backups
- ✅ No data loss on Railway restarts
- ✅ Redundant storage

### Developer Experience
- ✅ On-the-fly transformations
- ✅ No manual image optimization
- ✅ Easy-to-use API
- ✅ Comprehensive dashboard

### Cost
- ✅ Free tier sufficient for most use cases
- ✅ Pay-as-you-grow pricing
- ✅ No upfront costs

---

## Alternatives to Cloudinary

### AWS S3 + CloudFront
- More control
- More complex setup
- Similar costs

### Imgix
- Similar to Cloudinary
- Better for high-traffic sites
- More expensive

### Local + Object Storage (Current + Simple S3)
- Keep local storage
- Sync to S3 for backup
- No CDN benefits

---

## Troubleshooting

### Error: "Invalid credentials"
- Check `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
- Verify they're set in Railway environment variables
- Restart server after adding variables

### Error: "Upload failed"
- Check file size (<10MB for free tier)
- Check file format (jpg, png, gif, webp only)
- Check Cloudinary dashboard for quota

### Images Not Loading
- Check browser Network tab for 404 errors
- Verify Cloudinary URLs are correct
- Check Cloudinary Media Library for uploaded images

---

## Rollback to Local Storage

If you need to revert:

1. Remove Cloudinary packages:
   ```bash
   npm uninstall cloudinary multer-storage-cloudinary
   ```

2. Restore original multer configuration in `admin.js`

3. Remove Cloudinary environment variables

4. Download images from Cloudinary:
   - Go to Media Library
   - Select all images
   - Download as ZIP
   - Extract to `/client/public/images`

---

## Conclusion

Cloudinary integration is **optional but recommended** for production deployments. It provides:

- ✅ Better performance
- ✅ Better reliability
- ✅ Better developer experience
- ✅ Free for small to medium usage

**Recommended for:**
- Production deployments
- Sites with frequent image uploads
- Multi-location deployments

**Not necessary for:**
- Local development
- Sites with few images (<50)
- Testing environments

---

*Last Updated: February 9, 2026*
*Guide Version: 1.0.0*
