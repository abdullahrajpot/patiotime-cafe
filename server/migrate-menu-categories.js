/**
 * Migration Script: Convert Menu Item Categories from Slugs to ObjectIDs
 * 
 * Run this ONCE to migrate existing menu items from string category slugs
 * to ObjectID references.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Category = require('./models/Category');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function migrateCategoryReferences() {
  try {
    console.log('🔄 Starting category migration...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all categories
    const categories = await Category.find();
    console.log(`📁 Found ${categories.length} categories`);

    // Create slug to ObjectID map
    const slugToIdMap = {};
    categories.forEach(cat => {
      slugToIdMap[cat.slug] = cat._id;
      console.log(`  - ${cat.slug} → ${cat._id}`);
    });

    // Find all menu items
    const menuItems = await MenuItem.find();
    console.log(`\n📋 Found ${menuItems.length} menu items to check`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of menuItems) {
      try {
        // Check if category is a string (slug) or ObjectID
        const categoryValue = item.category;
        
        if (typeof categoryValue === 'string') {
          // It's a slug, need to convert
          const categoryId = slugToIdMap[categoryValue];
          
          if (categoryId) {
            console.log(`\n🔧 Migrating: "${item.name}"`);
            console.log(`   Category: "${categoryValue}" (slug) → ${categoryId} (ObjectID)`);
            
            item.category = categoryId;
            await item.save();
            migrated++;
            console.log(`   ✅ Migrated successfully`);
          } else {
            console.log(`\n⚠️  Warning: Unknown category slug "${categoryValue}" for item "${item.name}"`);
            console.log(`   Available slugs:`, Object.keys(slugToIdMap).join(', '));
            errors++;
          }
        } else {
          // Already an ObjectID, skip
          skipped++;
        }
      } catch (err) {
        console.error(`\n❌ Error migrating item "${item.name}":`, err.message);
        errors++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Migrated: ${migrated} items`);
    console.log(`   ⏭️  Skipped: ${skipped} items (already ObjectIDs)`);
    console.log(`   ❌ Errors: ${errors} items`);
    console.log(`${'='.repeat(60)}\n`);

    if (errors === 0) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️  Migration completed with some errors. Please review above.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

// Run migration
migrateCategoryReferences();
