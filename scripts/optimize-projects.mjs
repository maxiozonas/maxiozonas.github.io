import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const selected = new Set(process.argv.slice(2));
const files = readdirSync('public/projects').filter(file => file.endsWith('.png') && (!selected.size || selected.has(file.slice(0, -4).replace(/-mobile$/, ''))));
for (const file of files) {
  const input = `public/projects/${file}`;
  const slug = file.slice(0, -4);
  if (slug.endsWith('-mobile')) {
    await sharp(input).resize({ width: 780, withoutEnlargement: true }).webp({ quality: 85 }).toFile(`public/projects/${slug}.webp`);
    await sharp(input).resize({ width: 390 }).webp({ quality: 82 }).toFile(`public/projects/${slug}-390.webp`);
    continue;
  }
  await sharp(input).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 85 }).toFile(`public/projects/${slug}.webp`);
  // 640, 900 and 1280 let the project cards pick a file close to their on-screen size, which keeps them sharp.
  for (const width of [480, 640, 768, 900, 1080, 1280]) {
    await sharp(input).resize({ width }).webp({ quality: [640, 900, 1280].includes(width) ? 86 : 82 }).toFile(`public/projects/${slug}-${width}.webp`);
  }
}
console.log(`Optimized ${files.length} project screenshots for mobile, tablet and desktop.`);
