# Image Upload Feature - Setup & Installation

## Quick Start

The image upload feature is now **FULLY IMPLEMENTED** and ready to use!

## What's Been Done ✅

### 1. Backend (Server)
- ✅ Added `multer` dependency to `server/package.json`
- ✅ Created upload endpoint: `POST /api/admin/upload`
- ✅ Configured file storage to `client/public/images/`
- ✅ Added file validation (type & size)
- ✅ Auto-delete images when menu item is deleted
- ✅ Server configured to serve uploaded images

### 2. Frontend (Client)
- ✅ Updated `Admin.jsx` with file upload UI
- ✅ Added image preview functionality
- ✅ Added file validation (client-side)
- ✅ Added loading states during upload
- ✅ Integrated upload with menu item creation/update

### 3. Documentation
- ✅ Created comprehensive guide: `IMAGE-UPLOAD-GUIDE.md`
- ✅ Setup instructions (this file)

## Installation Steps

### If Multer is Not Installed

If you get errors about multer not being found, run:

```bash
cd server
npm install
```

This will install all dependencies including multer (version 1.4.5-lts.1).

### Verify Installation

Check if multer is installed:

```bash
cd server
npm list multer
```

Expected output:
```
server@1.0.0
└── multer@1.4.5-lts.1
```

## How to Test

### 1. Start the Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

### 2. Test Image Upload

1. Navigate to `http://localhost:5173/admin`
2. Click on "Menu Items" tab
3. Click "+ Add New Item" button
4. Fill in the form:
   - Name: Test Coffee
   - Price: 5.99
   - Category: Select a category
   - Description: Test description
5. Click "Choose File" and select an image
6. Preview should appear below the file input
7. Click "Add Item"
8. Watch for "Uploading..." state
9. Item should be added to the list

### 3. Verify Image Upload

Check that the image was uploaded:

```bash
# On Windows
dir "client\public\images"

# On Mac/Linux
ls -la client/public/images/
```

You should see your uploaded file with a timestamp prefix.

### 4. Verify Image Display

1. Navigate to `http://localhost:5173/menu`
2. Find your newly added item
3. The image should display correctly

## File Structure

```
mern-cafe/
├── client/
│   ├── public/
│   │   └── images/              ← Images uploaded here
│   │       ├── herobg.jpg       (existing)
│   │       ├── coffee-1.jpg     (existing)
│   │       └── 1234567890-new.jpg  (uploaded)
│   └── src/
│       └── pages/
│           └── Admin.jsx        ← Updated with upload UI
├── server/
│   ├── routes/
│   │   └── admin.js             ← Upload endpoint
│   ├── package.json             ← Multer dependency
│   └── server.js                ← Serves static images
└── IMAGE-UPLOAD-GUIDE.md        ← Detailed documentation
```

## API Endpoints

### Upload Image
```http
POST /api/admin/upload
Content-Type: multipart/form-data

Body:
- image: [File]

Response: 200 OK
{
  "filename": "1704067200-coffee.jpg",
  "path": "/images/1704067200-coffee.jpg",
  "message": "Image uploaded successfully"
}
```

### Create Menu Item (with image)
```http
POST /api/admin/menu
Content-Type: application/json

Body:
{
  "name": "Cappuccino",
  "price": 4.99,
  "category": "categoryId",
  "description": "Classic Italian coffee",
  "image": "1704067200-coffee.jpg",
  "badge": "NEW",
  "sortOrder": 1
}

Response: 201 Created
{
  "_id": "...",
  "name": "Cappuccino",
  "image": "1704067200-coffee.jpg",
  ...
}
```

## Configuration

### Multer Configuration (in server/routes/admin.js)

```javascript
const storage = multer.diskStorage({
  destination: 'client/public/images',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    // ... validation logic
  }
});
```

### File Restrictions
- **Max Size**: 5MB
- **Allowed Types**: JPEG, JPG, PNG, GIF, WEBP
- **Naming**: Timestamp-prefixed for uniqueness

## Troubleshooting

### Error: "Cannot find module 'multer'"

**Solution:**
```bash
cd server
npm install multer --save
```

### Error: "ENOENT: no such file or directory"

The images folder doesn't exist. It's created automatically, but you can create it manually:

```bash
mkdir client\public\images
```

### Images Not Displaying on Menu Page

1. Check if image exists:
   ```bash
   dir "client\public\images"
   ```

2. Check browser DevTools Network tab for 404 errors

3. Verify image path in database matches file in folder

4. Check server console for errors

### Upload Button Stays in "Uploading..." State

1. Open browser DevTools Console
2. Check for JavaScript errors
3. Check Network tab for failed upload request
4. Verify server is running on correct port (5000)

## Next Steps

### Ready to Use! 🎉

The feature is fully implemented and ready for production use. Just:

1. Ensure multer is installed (`npm install` in server directory)
2. Start both servers
3. Go to admin panel and start uploading images!

### Optional Enhancements

Consider these improvements for the future:

- **Image Compression**: Optimize images before upload
- **Drag & Drop**: Better UX for file selection
- **Multiple Upload**: Upload multiple images at once
- **Image Cropping**: Built-in image editor
- **CDN Integration**: Use Cloudinary or AWS S3 for production
- **Authentication**: Add admin login before going live

## Related Documentation

- **Detailed Guide**: See `IMAGE-UPLOAD-GUIDE.md`
- **Admin Panel**: See `ADMIN-PANEL-GUIDE.md`
- **Dashboard**: See `ADMIN-DASHBOARD.md`
- **Quick Start**: See `QUICKSTART.md`

## Support

If you encounter any issues:

1. Check the console (both browser and server)
2. Verify all dependencies are installed
3. Ensure both servers are running
4. Check file permissions for uploads directory
5. Review `IMAGE-UPLOAD-GUIDE.md` for detailed troubleshooting

---

**Status**: ✅ Feature Complete & Ready to Use
**Last Updated**: Image upload fully implemented with preview, validation, and documentation
