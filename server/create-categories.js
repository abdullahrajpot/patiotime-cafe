// Simple script to create categories
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

async function createCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Define category schema inline
    const categorySchema = new mongoose.Schema({
      name: String,
      eyebrow: String,
      slug: String,
      sortOrder: Number,
      isActive: Boolean,
    });

    const Category = mongoose.model('Category', categorySchema);

    // Check if categories exist
    const count = await Category.countDocuments();
    console.log('Current categories:', count);

    if (count > 0) {
      console.log('Categories already exist!');
      const cats = await Category.find();
      cats.forEach(c => console.log(' -', c.name, '(slug:', c.slug + ')'));
    } else {
      console.log('Creating categories...');
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

      await Category.insertMany(categories);
      console.log('SUCCESS! Created 3 categories:');
      console.log(' - Coffees & Teas (slug: coffees-teas)');
      console.log(' - Bakery & Lunch (slug: bakery-lunch)');
      console.log(' - All-Day Brunch (slug: all-day-brunch)');
    }

    console.log('\nDone! You can now add menu items.');
    
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createCategories();
