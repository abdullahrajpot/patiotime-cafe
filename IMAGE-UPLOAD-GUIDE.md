# Image Upload Feature Guide

## Overview
The admin panel now supports direct image upload for menu items. Admins can upload images directly through the interface instead of manually placing files in folders.

## Features

### ✅ File Upload
- **Supported Formats**: JPEG, JPG, PNG, GIF, WEBP
- **Max File Size**: 5MB per image
- **Automatic Naming**: Files are renamed with timestamp to avoid conflicts
- **Storage Location**: `client/public/images/`

### ✅ Image Preview
- Real-time preview after selecting an image
- Shows current image when editing existing items
- 200x200px preview with proper aspect ratio

### ✅ Validation
- Client-side file type validation
- Client-side file size validation (5MB limit)
- Server-side validation with multer
- User-friendly error messages

### ✅ Loading States
- "Uploading..." button state during upload
- Disabled buttons during upload process
- Prevents duplicate submissions

## How to Use

### Adding a New Menu Item with Image

1. **Navigate to Admin Panel**
   - Go to `/admin`
   - Click on "Menu Items" tab in sidebar

2. **Click "Add New Item"**
   - Fill in required fields: Name, Price, Category
   - Fill in optional fields: Description, Badge, Sort Order

3. **Upload Image**
   - Click "Choose File" button in Image Upload section
   - Select an image from your computer
   - Preview will appear below the file input
   - Supported formats: JPEG, PNG, GIF, WEBP (max 5MB)

4. **Submit**
   - Click "Add Item" button
   - Image will upload first, then item will be created
   - Button shows "Uploading..." during process

5. **Verification**
   - New item appears in the menu items list
   - Navigate to `/menu` page to see the item displayed

### Editing an Existing Item

1. **Click "Edit"** on any menu item
2. **Current Image**: You'll see the current image filename
3. **To Change Image**: Select a new file (optional)
4. **To Keep Current**: Don't select a new file
5. **Click "Update Item"**

### Deleting Items

When you delete a menu item, the associated image file is automatically deleted from the server.

## Technical Details

### Backend API

#### Upload Endpoint
```
POST /api/admin/upload
Content-Type: multipart/form-data
Body: { image: File }

Response:
{
  "filename": "1234567890-coffee-latte.jpg",
  "path": "/images/1234567890-coffee-latte.jpg",
  "message": "Image uploaded successfully"
}
```

#### Create Menu Item
```
POST /api/admin/menu
Content-Type: application/json
Body: {
  "name": "Latte",
  "price": 4.99,
  "category": "categoryId",
  "image": "1234567890-coffee-latte.jpg",
  ...
}
```

### Frontend Implementation

#### File Upload Flow
1. User selects file → `handleFileChange()`
2. Validate file type and size
3. Create preview using FileReader
4. Store file in `selectedFile` state

#### Form Submission Flow
1. User clicks submit → `handleSubmit()`
2. If new file selected:
   - Create FormData with file
   - Upload to `/api/admin/upload`
   - Get filename from response
3. Create/update menu item with image filename
4. Reload menu list
5. Reset form and clear preview

### File Storage

```
project-root/
├── client/
│   └── public/
│       └── images/           ← Images stored here
│           ├── 1234567890-coffee-1.jpg
│           ├── 1234567891-food-3.jpg
│           └── ...
└── server/
    └── routes/
        └── admin.js          ← Upload configuration
```

### Image Naming Convention

Uploaded images are automatically renamed:
- Format: `timestamp-original-filename`
- Example: `1704067200000-cappuccino.jpg`
- Spaces replaced with hyphens
- Converted to lowercase
- Ensures uniqueness and prevents overwrites

## Error Handling

### Client-Side Errors
- **Invalid File Type**: "Only image files (JPEG, PNG, GIF, WEBP) are allowed"
- **File Too Large**: "File size must be less than 5MB"

### Server-Side Errors
- **Upload Failed**: Shows error message from server
- **Network Error**: "Failed to upload image"
- **Item Creation Failed**: Shows specific error

## Testing

### Test Upload Feature
1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Navigate to `/admin`
4. Try adding a menu item with an image:
   - Valid image (should succeed)
   - Large file >5MB (should fail with error)
   - Non-image file (should fail with error)
5. Check `client/public/images/` for uploaded file
6. Check `/menu` page to verify image displays

### Verify Image Display
- Menu page should show uploaded images
- Image path: `/images/filename.jpg`
- Images should load properly in menu cards

## Troubleshooting

### Image Not Uploading
- Check server console for errors
- Verify multer is installed: `cd server && npm list multer`
- Check folder permissions for `client/public/images/`
- Ensure folder exists (created automatically by multer)

### Image Not Displaying
- Verify image filename in database
- Check image exists in `client/public/images/`
- Check browser console for 404 errors
- Verify server is serving static files correctly

### Upload Fails Silently
- Open browser DevTools Network tab
- Look for 400/500 errors on upload request
- Check server console for detailed error messages

## Security Notes

- File type validation on both client and server
- File size limited to 5MB to prevent abuse
- Files stored outside server code directory
- Unique filenames prevent path traversal attacks
- Consider adding authentication before production

## Future Enhancements

- [ ] Image compression before upload
- [ ] Multiple image upload support
- [ ] Image cropping/editing tools
- [ ] Drag-and-drop upload interface
- [ ] Progress bar for large uploads
- [ ] Image optimization (WebP conversion)
- [ ] CDN integration for production
- [ ] Admin authentication/authorization

## Related Files

- **Frontend**: `client/src/pages/Admin.jsx` (Menu tab component)
- **Backend**: `server/routes/admin.js` (Upload endpoint)
- **API**: `client/src/api.js` (API functions)
- **Storage**: `client/public/images/` (Image directory)
- **Config**: `server/package.json` (Multer dependency)
