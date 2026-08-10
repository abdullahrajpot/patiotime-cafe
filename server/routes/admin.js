const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Reservation = require('../models/Reservation');
const Contact = require('../models/Contact');
const { requireAdmin } = require('../middleware/auth');
const { 
  validateMenuItem, 
  validateOrderStatus, 
  validateReservationStatus, 
  validateContactStatus 
} = require('../middleware/validation');
const orderController = require('../controllers/orderController');
const menuController = require('../controllers/menuController');
const { ensureDefaultCategories, resolveCategoryId, buildCategoryLookup, resolveCategoryRef, migrateLegacyMenuCategories } = require('../utils/ensureCategories');
const { invalidateOnChange } = require('../middleware/cache');

const router = express.Router();

// Apply admin authentication to ALL routes in this file
router.use(requireAdmin);

const uploadDir = process.env.UPLOAD_DIR
  ? path.resolve(__dirname, process.env.UPLOAD_DIR)
  : path.join(__dirname, 'uploads');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueName = Date.now() + '-' + file.originalname.toLowerCase().replace(/\s+/g, '-');
    cb(null, uniqueName);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// ========== ORDER MANAGEMENT ==========

// GET /api/admin/orders?status= -> order board list
router.get('/orders', orderController.getAllOrders.bind(orderController));

// GET /api/admin/orders/:id -> get single order with full details (no masking)
router.get('/orders/:id', orderController.getOrderById.bind(orderController));

// PATCH /api/admin/orders/:id/status -> advance/change an order's status
router.patch('/orders/:id/status', validateOrderStatus, orderController.updateOrderStatus.bind(orderController));

// ========== IMAGE UPLOAD ==========

// POST /api/admin/upload -> upload image
router.post('/upload', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error
      console.error('Multer error:', err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      // Other errors
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the filename to be saved in database
    res.json({ 
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      message: 'Image uploaded successfully'
    });
  });
});

// ========== MENU MANAGEMENT ==========

// GET /api/admin/menu -> get all menu items
router.get('/menu', async (req, res) => {
  try {
    await migrateLegacyMenuCategories();
    const items = await MenuItem.find().sort({ sortOrder: 1 }).lean();
    const categories = await Category.find().lean();
    const lookup = buildCategoryLookup(categories);

    res.json(
      items.map((item) => ({
        ...item,
        category: resolveCategoryRef(item.category, lookup),
      }))
    );
  } catch (err) {
    console.error('Admin menu load error:', err);
    res.status(500).json({ error: 'Failed to load menu items.', details: err.message });
  }
});

// POST /api/admin/menu -> create new menu item
router.post('/menu', validateMenuItem, invalidateOnChange(['/menu', '/categories']), async (req, res) => {
  try {
    const { name, description, price, category, badge, image, sortOrder } = req.body;

    console.log('📝 Creating menu item with data:', { name, price, category });

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }

    console.log('🔍 Resolving category:', category);
    let categoryId = await resolveCategoryId(category);

    if (!categoryId) {
      await ensureDefaultCategories();
      categoryId = await resolveCategoryId(category);
    }

    if (!categoryId) {
      const allCategories = await Category.find({}, 'name slug');
      console.error('❌ Category not found:', category, 'Available:', allCategories);
      return res.status(400).json({
        error: `Category '${category}' not found. Please ensure categories are created first.`,
        availableCategories: allCategories.map((c) => ({ name: c.name, slug: c.slug })),
      });
    }

    const item = await MenuItem.create({
      name,
      description: description || '',
      price,
      category: categoryId,
      badge: badge || null,
      image: image || null,
      sortOrder: sortOrder || 1,
      isAvailable: true,
    });

    const populatedItem = await MenuItem.findById(item._id).populate('category');
    console.log('✅ Menu item created successfully:', populatedItem.name);
    res.status(201).json(populatedItem);
  } catch (err) {
    console.error('❌ Error creating menu item:', err);
    res.status(500).json({ error: 'Failed to create menu item.', details: err.message });
  }
});

// PUT /api/admin/menu/:id -> update menu item
router.put('/menu/:id', validateMenuItem, invalidateOnChange(['/menu', '/categories']), async (req, res) => {
  try {
    const { name, description, price, category, badge, image, sortOrder, isAvailable } = req.body;

    let categoryId = category ? await resolveCategoryId(category) : undefined;
    if (category && !categoryId) {
      await ensureDefaultCategories();
      categoryId = await resolveCategoryId(category);
    }
    if (category && !categoryId) {
      return res.status(400).json({ error: `Category '${category}' not found.` });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category: categoryId,
        badge: badge || null,
        image: image || null,
        sortOrder,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
      },
      { new: true, runValidators: true }
    ).populate('category');

    if (!item) return res.status(404).json({ error: 'Menu item not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ error: 'Failed to update menu item.', details: err.message });
  }
});

// DELETE /api/admin/menu/:id -> delete menu item
// DELETE /api/admin/menu/:id -> delete menu item
router.delete('/menu/:id', invalidateOnChange(['/menu', '/categories']), async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found.' });

    // Optionally delete the image file
    if (item.image) {
      const imagePath = path.join(uploadDir, item.image);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          console.error('Failed to delete image file:', err);
        }
      }
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

// GET /api/admin/categories -> get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 }).lean();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load categories.' });
  }
});

// POST /api/admin/categories/init -> ensure default categories exist (with slugs)
router.post('/categories/init', async (req, res) => {
  try {
    await ensureDefaultCategories();
    const categories = await Category.find().sort({ sortOrder: 1 });
    res.json({
      message: 'Categories verified successfully',
      count: categories.length,
      categories,
    });
  } catch (err) {
    console.error('Error initializing categories:', err);
    res.status(500).json({ error: 'Failed to initialize categories.' });
  }
});

// ========== RESERVATION MANAGEMENT ==========

// GET /api/admin/reservations -> get all reservations
router.get('/reservations', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const reservations = await Reservation.find(filter).sort({ date: -1, createdAt: -1 }).lean();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load reservations.' });
  }
});

// PATCH /api/admin/reservations/:id/status -> update reservation status
router.patch('/reservations/:id/status', validateReservationStatus, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }
    
    res.json({ ok: true, reservation });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reservation.' });
  }
});

// DELETE /api/admin/reservations/:id -> delete reservation
router.delete('/reservations/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }
    res.json({ ok: true, message: 'Reservation deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete reservation.' });
  }
});

// ========== CONTACT MANAGEMENT ==========

// GET /api/admin/contacts -> get all contact messages
router.get('/contacts', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const contacts = await Contact.find(filter).sort({ createdAt: -1 }).lean();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load contacts.' });
  }
});

// PATCH /api/admin/contacts/:id/status -> update contact status
router.patch('/contacts/:id/status', validateContactStatus, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'replied'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' });
    }
    
    res.json({ ok: true, contact });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact.' });
  }
});

// DELETE /api/admin/contacts/:id -> delete contact message
router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' });
    }
    res.json({ ok: true, message: 'Contact deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact.' });
  }
});

module.exports = router;
