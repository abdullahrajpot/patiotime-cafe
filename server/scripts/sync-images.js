/**
 * Sync menu images into server/public/images so Railway can serve them
 * (Railway only deploys the server folder — not client/public).
 */
const fs = require('fs');
const path = require('path');

const sources = [
  path.join(__dirname, '../../client/public/images'),
  path.join(__dirname, '../uploads'),
];

const target = path.join(__dirname, '../public/images');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!/\.(jpe?g|png|gif|webp)$/i.test(entry.name)) continue;

    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (!fs.existsSync(to) || fs.statSync(from).mtimeMs > fs.statSync(to).mtimeMs) {
      fs.copyFileSync(from, to);
      count++;
    }
  }

  return count;
}

function run() {
  fs.mkdirSync(target, { recursive: true });
  let total = 0;

  for (const src of sources) {
    total += copyDir(src, target);
  }

  const files = fs.readdirSync(target).filter((f) => /\.(jpe?g|png|gif|webp)$/i.test(f));
  console.log(`✅ Image sync: ${files.length} files in server/public/images (${total} updated)`);
}

run();
