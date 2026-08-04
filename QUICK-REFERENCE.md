# Quick Reference - Image Upload Feature

## 🚀 Quick Start

```bash
# 1. Start server
cd server
npm run dev

# 2. Start client (new terminal)
cd client
npm run dev

# 3. Go to admin
Open: http://localhost:5173/admin
Click: Menu Items → Add New Item
Upload: Choose an image file
Submit: Click "Add Item"
View: Go to /menu to see it live!
```

## 📋 Checklist

### Before Using:
- [ ] MongoDB running
- [ ] Server started (`npm run dev`)
- [ ] Client started (`npm run dev`)
- [ ] Multer installed (`npm list multer` in server folder)

### To Add Item with Image:
- [ ] Fill in Name (required)
- [ ] Fill in Price (required)
- [ ] Select Category (required)
- [ ] Add Description (optional)
- [ ] Add Badge (optional)
- [ ] **Click "Choose File"**
- [ ] **Select image (JPEG/PNG/GIF/WEBP, <5MB)**
- [ ] **Preview appears**
- [ ] Click "Add Item"
- [ ] Wait for "Uploading..." to complete
- [ ] Item appears in list ✅

## 🎯 Key Features

| Feature | Details |
|---------|---------|
| **File Types** | JPEG, JPG, PNG, GIF, WEBP |
| **Max Size** | 5MB |
| **Preview** | Real-time before upload |
| **Storage** | `client/public/images/` |
| **Naming** | `timestamp-filename.jpg` |
| **Validation** | Client + Server side |
| **Database** | Filename stored in MongoDB |
| **Display** | Automatic on menu page |
| **Delete** | Auto-deletes file with item |

## 📁 File Locations

```
Admin UI:     client/src/pages/Admin.jsx
API Routes:   server/routes/admin.js
Upload Path:  client/public/images/
Database:     MongoDB → menuitems collection → "image" field
Display:      client/src/pages/Menu.jsx
```

## 🔌 API Quick Reference

### Upload Image
```http
POST /api/admin/upload
Content-Type: multipart/form-data
Body: { image: File }

Response:
{
  "filename": "1704067200-coffee.jpg",
  "path": "/images/1704067200-coffee.jpg"
}
```

### Create Item
```http
POST /api/admin/menu
Content-Type: application/json

Body:
{
  "name": "Cappuccino",
  "price": 4.99,
  "category": "categoryId",
  "image": "1704067200-coffee.jpg"
}
```

### Get Menu (Public)
```http
GET /api/menu

Response: Array of items with images
[
  {
    "_id": "...",
    "name": "Cappuccino",
    "image": "1704067200-coffee.jpg",
    ...
  }
]
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Cannot find module 'multer'"** | Run `npm install` in server folder |
| **Image not uploading** | Check file size (<5MB) and type (image/*) |
| **Preview not showing** | Check browser console for errors |
| **Image not on menu** | Check database has correct filename |
| **404 on image** | Verify file exists in `client/public/images/` |
| **Stuck on "Uploading..."** | Check server console for errors |

## 🔍 Quick Checks

### Verify Upload:
```bash
# Check uploaded files
dir "client\public\images"

# Should see: 1704067200-yourfile.jpg
```

### Verify Database:
```javascript
// In MongoDB
db.menuitems.find({}, { name: 1, image: 1 })

// Should see:
// { name: "Cappuccino", image: "1704067200-coffee.jpg" }
```

### Verify Display:
```
1. Go to: http://localhost:5173/menu
2. Find your item
3. Right-click image → "Open in new tab"
4. URL should be: /images/1704067200-coffee.jpg
5. Image should load successfully
```

## 💡 Pro Tips

1. **File Naming**: Files auto-renamed with timestamp to prevent conflicts
2. **Preview Before Upload**: Always shows preview before submitting
3. **Edit Mode**: When editing, can keep old image or upload new one
4. **No File Selected**: Can create items without images (optional)
5. **Auto Cleanup**: Deleting item also deletes image file
6. **Database Driven**: Everything fetched from MongoDB in real-time

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `IMAGE-UPLOAD-GUIDE.md` | Complete feature guide |
| `SETUP-IMAGE-UPLOAD.md` | Installation & testing |
| `FEATURE-COMPLETE.md` | Implementation details |
| `TASK-COMPLETE-SUMMARY.md` | Task completion summary |
| `UPLOAD-FLOW-DIAGRAM.md` | Visual flow diagrams |
| `QUICK-REFERENCE.md` | This file |

## ✅ Status: COMPLETE

The feature is **fully functional** and ready to use!

### What Works:
✅ Upload images through admin UI  
✅ Preview before submitting  
✅ Validate file type and size  
✅ Save to filesystem  
✅ Store filename in database  
✅ Display on menu page  
✅ Edit existing items  
✅ Delete items (with images)  
✅ Loading states  
✅ Error handling  

### Test It Now:
1. Start servers
2. Go to `/admin`
3. Add item with image
4. Check `/menu` page
5. Done! 🎉

---

**Need help?** Check `IMAGE-UPLOAD-GUIDE.md` for detailed documentation.
