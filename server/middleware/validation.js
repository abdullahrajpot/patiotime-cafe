const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ========== AUTHENTICATION VALIDATION ==========

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Address is too long'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

// ========== ORDER VALIDATION ==========

const validateCreateOrder = [
  body('customer_name')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('customer_phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),
  
  body('customer_email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('order_type')
    .notEmpty().withMessage('Order type is required')
    .isIn(['pickup', 'delivery']).withMessage('Order type must be pickup or delivery'),
  
  body('address')
    .if(body('order_type').equals('delivery'))
    .notEmpty().withMessage('Address is required for delivery orders')
    .trim()
    .isLength({ max: 500 }).withMessage('Address is too long'),
  
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  
  body('items.*.menu_item_id')
    .notEmpty().withMessage('Menu item ID is required')
    .isMongoId().withMessage('Invalid menu item ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes are too long'),
  
  handleValidationErrors
];

// ========== MENU ITEM VALIDATION ==========

const validateMenuItem = [
  body('name')
    .trim()
    .notEmpty().withMessage('Item name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description is too long'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0, max: 10000 }).withMessage('Price must be between 0 and 10000'),
  
  body('category')
    .notEmpty().withMessage('Category is required'),
  
  body('badge')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 30 }).withMessage('Badge must be 30 characters or less'),
  
  body('image')
    .optional()
    .trim(),
  
  body('sortOrder')
    .optional()
    .isInt({ min: 1 }).withMessage('Sort order must be a positive integer'),
  
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean'),
  
  handleValidationErrors
];

// ========== RESERVATION VALIDATION ==========

const validateReservation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format'),
  
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  
  body('time')
    .notEmpty().withMessage('Time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:MM format'),
  
  body('guests')
    .notEmpty().withMessage('Number of guests is required')
    .isInt({ min: 1, max: 50 }).withMessage('Guests must be between 1 and 50'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Message is too long'),
  
  handleValidationErrors
];

// ========== CONTACT VALIDATION ==========

const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 2, max: 200 }).withMessage('Subject must be 2-200 characters'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
  
  handleValidationErrors
];

// ========== STATUS UPDATE VALIDATION ==========

const validateOrderStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['received', 'preparing', 'ready', 'completed', 'cancelled'])
    .withMessage('Invalid order status'),
  
  handleValidationErrors
];

const validateReservationStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid reservation status'),
  
  handleValidationErrors
];

const validateContactStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['new', 'read', 'replied'])
    .withMessage('Invalid contact status'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateOrder,
  validateMenuItem,
  validateReservation,
  validateContact,
  validateOrderStatus,
  validateReservationStatus,
  validateContactStatus
};
