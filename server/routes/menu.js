const express = require('express');
const menuController = require('../controllers/menuController');
const { cache } = require('../middleware/cache');

const router = express.Router();

// GET /api/menu -> categories with their available items, nested
// Cache for 10 minutes (menu doesn't change frequently)
router.get('/', cache(600), menuController.getMenu.bind(menuController));

// GET /api/menu/categories -> list all categories
// Cache for 15 minutes (categories change even less frequently)
router.get('/categories', cache(900), menuController.getCategories.bind(menuController));

module.exports = router;
