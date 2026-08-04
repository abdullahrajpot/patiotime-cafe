const fs = require('fs');
const path = require('path');

const BASE = 'https://patiotime.loftocean.com/demo8/wp-content/uploads/sites/5/2022/04';
const PUBLIC = path.join(__dirname, '..', 'client', 'public', 'images');

const files = [
  'pt-logo.png',
  'home-01.jpg',
  'home-02.jpg',
  'home-03.jpg',
  'home-04-2.jpg',
  'home-06.jpg',
  'home-07.jpg',
  'home-08.jpg',
  'coffee-bg.jpg',
  'coffee-bg-1.jpg',
  'coffee-1.jpg',
  'coffee-2.jpg',
  'coffee-3.jpg',
  'coffee-4.jpg',
  'coffee-5-2.jpg',
  'food-3.jpg',
  'food-4.jpg',
  'brooke-cagle-9fHMo1-5Io8-unsplash-2.jpg',
  'tyler-nix-3uSHEffsDXI-unsplash.jpg',
  'alaksiej-carankievic-JBDYs80RTcs-unsplash.jpg',
  'bundo-kim-y6dGNZaDu4w-unsplash.jpg',
  'choi-sungwoo-mvTvOFa-hQ4-unsplash.jpg',
  'img-37.jpg',
  'img-38.jpg',
  'img-39.jpg',
  'ig-4.jpg',
  'ig-6.jpg',
  'ig-7.jpg',
  'ig-8.jpg',
  'ig-9.jpg',
  'ig-10.jpg',
  'ig-11.jpg',
  'ig-12.jpg',
  'ig-13.jpg',
  'ig-14.jpg',
  'ig-15.jpg',
  'ig-16.jpg',
  'ig-17.jpg',
  'ig-18.jpg',
  'ig-19.jpg',
  'ig-20.jpg',
];

async function download(name) {
  const url = `${BASE}/${name}`;
  const dest = path.join(PUBLIC, name);
  await fs.promises.mkdir(PUBLIC, { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.promises.writeFile(dest, buf);
  console.log('OK', name);
}

async function main() {
  for (const f of files) {
    try {
      await download(f);
    } catch (e) {
      console.log('FAIL', f, e.message);
    }
  }
}

main();
