require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

const coffeeItems = [
  ['Marbled Iced Latte', 'Condensed Milk, Ice Cubes, Espresso', 3.65, 'SEASONAL', 'cf9.jpg'],
  ['Hot Vanilla Latte', 'Espresso, Vanilla Syrup, Steamed Milk', 3.25, null, 'cf10.jpg'],
  ['Almondmilk Latte', 'Espresso, Almond Milk, Vegan', 4.25, 'NEW', 'cf11.jpg'],
  ['Cappuccino', 'Espresso, Extra Froth, Chocolate Powder', 3.65, null, 'cf12.jpg'],
  ['Double Shot Espresso', 'Double Shot Espresso', 2.25, null, 'coffee-5-2.jpg'],
  ['Black Tea with Milk', 'Royal English Breakfast Tea Latte', 2.55, null, 'coffee-1.jpg'],
];

const bakeryItems = [
  ['Breakfast Sandwich', 'Bacon, Gouda, Toasted Sourdough', 4.25, null, 'food-3.jpg'],
  ['Croissant Bun', 'Slow Roasted Ham, Butter Croissant', 3.75, null, 'food-4.jpg'],
  ['Sausage Sandwich', 'Cheddar, Fresh Salad, Sausage', 4.25, null, 'home-02.jpg'],
  ['Iced Lemon Pound Cake', 'Lemon Glaze, Butter Cake', 2.45, 'NEW', 'home-04-2.jpg'],
  ['Chilli Turkey Sandwich', 'Sweet Chilli Turkey, Fresh Greens', 4.75, null, 'home-07.jpg'],
  ['Blueberry Waffles', 'Fresh Blueberries, Waffles, Honey', 4.95, null, 'home-08.jpg'],
];

const brunchItems = [
  ['Spaghetti alla Puttanesca', 'Extra virgin olive oil, touch of garlic, prawns, green peas, sun dried tomato, white wine and Italian herbs', 29.99, null, 'img-37.jpg'],
  ['Spaghetti Napoletana', 'Spaghetti with olive oil, touch of garlic, olives, capers, anchovies, Italian herbs and Napolitana sauce', 24.99, null, 'img-38.jpg'],
  ['Penne Alla Arrabbiata', 'Tubes of pasta with olive oil, garlic, bacon, onion, basil and red sauce', 24.99, null, 'img-39.jpg'],
  ['Pappardelle Gamberi', 'Extra virgin olive oil, touch of garlic, prawns, green peas, sun dried tomato, white wine', 35.99, null, 'choi-sungwoo-mvTvOFa-hQ4-unsplash.jpg'],
  ['Seafood Capellini Pasta', 'Fresh seafood in regional tomato sauce with herbs', 24.99, null, 'home-06.jpg'],
  ['Mushroom Bolognese Pasta', 'Fresh mushrooms in rich bolognese sauce', 24.99, null, 'alaksiej-carankievic-JBDYs80RTcs-unsplash.jpg'],
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding:', MONGO_URI);

  await Category.deleteMany({});
  await MenuItem.deleteMany({});

  const coffee = await Category.create({ name: 'Coffees & Teas', eyebrow: 'Best Drinks', sortOrder: 1 });
  const bakery = await Category.create({ name: 'Bakery & Lunch', eyebrow: 'Delicious Food', sortOrder: 2 });
  const brunch = await Category.create({ name: 'All-Day Brunch', eyebrow: 'We Also Have', sortOrder: 3 });

  const buildDocs = (catId, items) =>
    items.map(([name, description, price, badge, image], i) => ({
      category: catId,
      name,
      description,
      price,
      badge,
      image,
      sortOrder: i + 1,
    }));

  await MenuItem.insertMany(buildDocs(coffee._id, coffeeItems));
  await MenuItem.insertMany(buildDocs(bakery._id, bakeryItems));
  await MenuItem.insertMany(buildDocs(brunch._id, brunchItems));

  console.log('Seed complete: 3 categories, 18 menu items.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
