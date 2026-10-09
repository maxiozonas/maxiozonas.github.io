import sharp from 'sharp';
import { readdirSync } from 'node:fs';

for (const file of readdirSync('public/projects').filter(file => file.endsWith('.png'))) {
  const input = `public/projects/${file}`;
  const slug = file.slice(0, -4);
  await sharp(input).webp({ quality: 85 }).toFile(`public/projects/${slug}.webp`);
  for (const width of [480, 768, 1080]) {
    await sharp(input).resize({ width }).webp({ quality: 82 }).toFile(`public/projects/${slug}-${width}.webp`);
  }
}
console.log('Optimized four project screenshots for mobile, tablet and desktop.');
