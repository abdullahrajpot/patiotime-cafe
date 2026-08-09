// Direct script to create categories - NO AUTH NEEDED
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function createCategories() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected!\n');

    // Define schema
    const categorySchema = new mongoose.Schema({
      name: String,
      eyebrow: String,
      slug: { type: String, unique: true },
      sortOrder: Number,
      isActive: Boolean,
    });

    const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

    // Check existing
    const existing = await Category.find();
    console.log('📊 Current categories in database:', existing.length);
    
    if (existing.length > 0) {
      console.log('\n📚 Found these categories:');
      existing.forEach(c => console.log('  ✅', c.name, '(slug:', c.slug + ')'));
      console.log('\n✨ Categories already exist! You can add menu items now.\n');
      process.exit(0);
    }

    console.log('📝 Creating 3 categories...\n');

    const categories = [
      {
        name: 'Coffees & Teas',
        eyebrow: 'Best Drinks',
        slug: 'coffees-teas',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Bakery & Lunch',
        eyebrow: 'Delicious Food',
        slug: 'bakery-lunch',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'All-Day Brunch',
        eyebrow: 'We Also Have',
        slug: 'all-day-brunch',
        sortOrder: 3,
        isActive: true
      }
    ];

    const created = await Category.insertMany(categories);
    
    console.log('✅ SUCCESS! Created', created.length, 'categories:\n');
    created.forEach(c => {
      console.log('  ✅', c.name);
      console.log('     Slug:', c.slug);
      console.log('     ID:', c._id.toString());
      console.log('');
    });

    console.log('🎉 DONE! You can now add menu items in Admin Panel!\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createCategories();
