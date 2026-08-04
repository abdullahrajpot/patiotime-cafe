const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Reservation = require('../models/Reservation');
const Contact = require('../models/Contact');

const router = express.Router();

const STATUSES = ['received', 'preparing', 'ready', 'completed', 'cancelled'];

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../client/public/images');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
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
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    res.json(
      orders.map((o) => ({
        id: o._id,
        order_code: o.orderCode,
        customer_name: o.customerName,
        customer_phone: o.customerPhone,
        order_type: o.orderType,
        address: o.address,
        items: o.items,
        subtotal: o.subtotal,
        tax: o.tax,
        total: o.total,
        status: o.status,
        created_at: o.createdAt,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders.' });
  }
});

// PATCH /api/admin/orders/:id/status -> advance/change an order's status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order.' });
  }
});

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
      path: `/images/${req.file.filename}`,
      message: 'Image uploaded successfully'
    });
  });
});

// ========== MENU MANAGEMENT ==========

// GET /api/admin/menu -> get all menu items
router.get('/menu', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ sortOrder: 1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load menu items.' });
  }
});

// POST /api/admin/menu -> create new menu item
router.post('/menu', async (req, res) => {
  try {
    const { name, description, price, category, badge, image, sortOrder } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }

    const item = await MenuItem.create({
      name,
      description: description || '',
      price,
      category,
      badge: badge || null,
      image: image || null,
      sortOrder: sortOrder || 1,
      isAvailable: true,
    });

    const populatedItem = await MenuItem.findById(item._id).populate('category');
    res.status(201).json(populatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// PUT /api/admin/menu/:id -> update menu item
router.put('/menu/:id', async (req, res) => {
  try {
    const { name, description, price, category, badge, image, sortOrder, isAvailable } = req.body;

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
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
    console.error(err);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// DELETE /api/admin/menu/:id -> delete menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found.' });

    // Optionally delete the image file
    if (item.image) {
      const imagePath = path.join(__dirname, '../../client/public/images', item.image);
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
router.patch('/reservations/:id/status', async (req, res) => {
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
router.patch('/contacts/:id/status', async (req, res) => {
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
