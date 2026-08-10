/**
 * Resolve image URLs for local dev and split production (Vercel + Railway).
 * - Static assets (hero, instagram, etc.): served from frontend /assets/
 * - Dynamic uploads (menu items): served from backend /images/
 */

export function getApiRoot() {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) return apiUrl.replace(/\/api\/?$/, '');
  return '';
}

/** Static assets bundled with the frontend (hero, instagram, etc.) */
export function img(name) {
  // Static images are in public/images and NOT proxied to backend in production
  // In dev, we need to NOT proxy these specific static images
  return `/images/${name}`;
}

export const HERO_HOME = img('herobg.png');
export const HERO_ABOUT = img('tyler-nix-3uSHEffsDXI-unsplash.jpg');
export const HERO_MENU = img('menuherobg.png');
export const STORY_IMG = img('brooke-cagle-9fHMo1-5Io8-unsplash-2.jpg');
export const ABOUT_V60 = img('bundo-kim-y6dGNZaDu4w-unsplash.jpg');
export const NEWSLETTER_BG = img('coffee-bg.jpg');
export const LOGO = img('pt-logo.png');

export const MENU_HERO_GRID = [
  img('cf1.jpg'),
  img('cf2.jpg'),
  img('cf3.jpg'),
  img('cf4.jpg'),
];

export const BRUNCH_SLIDES = [
  img('cf1.jpg'),
  img('food-3.jpg'),
  img('food-4.jpg'),
  img('cf2.jpg'),
  img('home-02.jpg'),
  img('cf3.jpg'),
];

export const INSTAGRAM = [
  'ig-4.jpg', 'ig-6.jpg', 'ig-7.jpg', 'ig-8.jpg', 'ig-9.jpg', 'ig-10.jpg',
  'ig-11.jpg', 'ig-12.jpg', 'ig-13.jpg', 'ig-14.jpg', 'ig-15.jpg', 'ig-16.jpg',
  'ig-17.jpg', 'ig-18.jpg',
].map(img);

export const NEWS = [
  {
    image: img('img-37.jpg'),
    date: 'April 3, 2022',
    title: 'Coffee Tips & Tricks for the Perfect Brew',
    excerpt: 'Discover simple techniques to elevate your home coffee ritual every morning.',
  },
  {
    image: img('img-38.jpg'),
    date: 'March 28, 2022',
    title: 'Seasonal Pastries You Should Try This Spring',
    excerpt: 'Our pastry chef shares the new bakery lineup inspired by fresh seasonal flavors.',
  },
  {
    image: img('img-39.jpg'),
    date: 'March 15, 2022',
    title: 'All-Day Brunch: A PatioTime Signature',
    excerpt: 'From classic eggs benedict to Italian pasta — brunch served all day, every day.',
  },
];

/** Menu item images stored in the database (uploads + seed filenames) */
export function menuItemImg(filename) {
  if (!filename) {
    console.warn('⚠️ No filename provided, using default');
    return img('coffee-1.jpg');
  }
  if (/^https?:\/\//i.test(filename)) {
    console.log('✅ Full URL detected:', filename);
    return filename;
  }

  // CRITICAL: All current menu images are static seed files in public/images/
  // These exist in the frontend build and should be served from Vercel
  // Only future uploaded images (if any) would need to be served from backend
  
  // For now, ALL images are served from frontend's public/images in both dev and prod
  const staticUrl = `/images/${filename}`;
  console.log('🖼️ Menu image from frontend public/images:', staticUrl);
  return staticUrl;
}
