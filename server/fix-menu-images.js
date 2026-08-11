/**
 * Fix menu item images to use existing files from client/public/images
 */

require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Category = require('./models/Category');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

// Mapping of menu items to appropriate images from client/public/images
const DEFAULT_IMAGES = {
  coffee: 'coffee-2.jpg',
  tea: 'coffee-3.jpg',
  espresso: 'coffee-1.jpg',
  latte: 'coffee-4.jpg',
  cappuccino: 'coffee-5-2.jpg',
  pastry: 'img-37.jpg',
  sandwich: 'food-3.jpg',
  salad: 'food-4.jpg',
  brunch: 'img-39.jpg',
  breakfast: 'img-38.jpg',
  default: 'coffee-1.jpg'
};

function pickImageForItem(itemName) {
  const name = itemName.toLowerCase();
  
  // Try to match keywords
  for (const [keyword, image] of Object.entries(DEFAULT_IMAGES)) {
    if (name.includes(keyword)) {
      return image;
    }
  }
  
  return DEFAULT_IMAGES.default;
}

async function fixImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const clientImagesPath = path.join(__dirname, '../client/public/images');
    console.log(`📁 Client images path: ${clientImagesPath}\n`);

    // Get all menu items
    const menuItems = await MenuItem.find().populate('category');
    console.log(`📋 Found ${menuItems.length} menu items\n`);

    console.log('═══════════════════════════════════════════════════════════════');

    let fixed = 0;
    let skipped = 0;

    for (const item of menuItems) {
      const categoryName = item.category?.name || 'Unknown';
      console.log(`\n📦 ${item.name} (${categoryName})`);
      console.log(`   Current image: "${item.image || 'NONE'}"`);

      // Check if current image exists
      if (item.image) {
        const imagePath = path.join(clientImagesPath, item.image);
        if (fs.existsSync(imagePath)) {
          console.log(`   ✅ Current image exists - no fix needed`);
          skipped++;
          continue;
        }
      }

      // Pick a new image based on item name
      const newImage = pickImageForItem(item.name);
      const newImagePath = path.join(clientImagesPath, newImage);

      if (!fs.existsSync(newImagePath)) {
        console.log(`   ⚠️  Suggested image ${newImage} doesn't exist!`);
        console.log(`   Using default: ${DEFAULT_IMAGES.default}`);
        item.image = DEFAULT_IMAGES.default;
      } else {
        item.image = newImage;
      }

      await item.save();
      console.log(`   ✅ FIXED → ${item.image}`);
      fixed++;
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Fixed: ${fixed}`);
    console.log(`   ⏭️  Skipped (already correct): ${skipped}`);
    console.log(`   📋 Total: ${menuItems.length}`);

    if (fixed > 0) {
      console.log(`\n✅ ${fixed} menu items updated with working images!`);
      console.log(`\nNext steps:`);
      console.log(`1. Refresh your browser to see the images`);
      console.log(`2. Images should now display correctly on menu page`);
      console.log(`3. You can customize images later via admin panel`);
    } else {
      console.log(`\n✅ All menu items already have valid images!`);
    }

    await mongoose.disconnect();
    console.log(`\n✅ Done!`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

fixImages();
