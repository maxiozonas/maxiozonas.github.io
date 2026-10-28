import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

// Capture the actual React Bits shader, not a generated imitation. Start the
// local site first, or set PORTFOLIO_URL to an existing preview server.
const baseURL = process.env.PORTFOLIO_URL || 'http://127.0.0.1:4321';
mkdirSync('artifacts/screenshots', { recursive: true });
mkdirSync('public/images', { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined),
});
try {
  for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto(`${baseURL}/es/`);
    const canvas = page.locator(`.site-atmosphere canvas[data-ready="true"][data-mode="${theme}"]`);
    await canvas.waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: `
      body * { visibility: hidden !important; }
      .site-atmosphere, .site-atmosphere * { visibility: visible !important; }
      .site-atmosphere { opacity: 1 !important; }
      .site-atmosphere::before { display: none !important; }
    ` });
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.site-atmosphere canvas')).opacity === '1');
    const image = await canvas.screenshot({ path: `artifacts/screenshots/atmosphere-source-${theme}.png` });
    const destination = `public/images/atmosphere-${theme}.webp`;
    await sharp(image).webp({ quality: 82 }).toFile(destination);
    console.log(destination);
    await page.close();
  }
} finally {
  await browser.close();
}
