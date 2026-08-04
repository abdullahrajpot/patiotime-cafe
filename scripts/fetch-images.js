const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PUBLIC = path.join(__dirname, '..', 'client', 'public', 'images');

async function fetchText(url) {
  const res = await fetch(url);
  return res.text();
}

async function download(url, dest) {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.promises.writeFile(dest, buf);
  console.log('Saved', path.basename(dest));
}

const imageMap = {
  'hero-home.jpg': 'https://patiotime.loftocean.com/demo8/wp-content/uploads/sites/8/2021/08/coffee-pour-hero.jpg',
  'hero-about.jpg': 'https://patiotime.loftocean.com/demo8/wp-content/uploads/sites/8/2021/08/about-hero.jpg',
  'hero-menu.jpg': 'https://patiotime.loftocean.com/demo8/wp-content/uploads/sites/8/2021/08/menu-hero.jpg',
  'story-barista.jpg': 'https://patiotime.loftocean.com/demo8/wp-content/uploads/sites/8/2021/08/our-story-barista.jpg',
  'newsletter-bg.jpg': 'https://patiotime.loftocean.com/demo8/wp-content/uploads/sites/8/2021/08/newsletter-bg.jpg',
};

async function main() {
  // Try to discover URLs from homepage
  try {
    const html = await fetchText('https://patiotime.loftocean.com/demo8/');
    const urls = [...new Set([...html.matchAll(/https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]))];
    console.log('Found', urls.length, 'image URLs on homepage');
    fs.writeFileSync(path.join(__dirname, 'discovered-urls.txt'), urls.join('\n'));
  } catch (e) {
    console.log('Could not scrape homepage:', e.message);
  }

  for (const [name, url] of Object.entries(imageMap)) {
    try {
      await download(url, path.join(PUBLIC, name));
    } catch (e) {
      console.log('Skip', name, e.message);
    }
  }
}

main();
