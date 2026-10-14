import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
mkdirSync('artifacts', { recursive: true });
const results = [];
const selected = new Set(process.argv.slice(2));
for (const [slug, url] of [
  ['catalejo-travel', 'https://www.catalejotravel.com/es/'],
  ['quinta-pata', 'https://5tapata.com.ar/'],
  ['inspira-ingenieria', 'https://www.ingenieriainspira.com/'],
  ['madryn-buceo', 'https://madrynbuceo.xenova.com.ar/'],
  ['yogur-griego-rey', 'https://yogurgriegorey.com.ar/'],
]) {
  if (selected.size && !selected.has(slug)) continue;
  for (const [device, viewport, deviceScaleFactor] of [
    ['desktop', { width: 1440, height: 900 }, 1],
    ['mobile', { width: 390, height: 844 }, 2],
  ]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: 'reduce', isMobile: device === 'mobile', hasTouch: device === 'mobile' });
    const page = await context.newPage();
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await page.evaluate(() => document.fonts.ready);
      const reject = page.getByRole('button', { name: /^(rechazar|reject|decline|solo necesarias|reject all)$/i }).first();
      if (await reject.isVisible()) await reject.click();
      await page.evaluate(async () => {
        await Promise.all([...document.images].filter(image => image.loading !== 'lazy').map(image => image.decode().catch(() => {})));
      });
      await page.waitForTimeout(1500);
      const title = await page.title();
      if (!response?.ok() || /error|not found|unavailable/i.test(title)) throw new Error(`${response?.status()}: ${title}`);
      const file = `${slug}${device === 'mobile' ? '-mobile' : ''}.png`;
      await page.screenshot({ path: `public/projects/${file}` });
      results.push({ slug, device, url, file, viewport, deviceScaleFactor, title, status: response.status(), capturedAt: new Date().toISOString() });
      console.log(`Captured ${slug}: ${device}`);
    } catch (error) {
      results.push({ slug, device, url, error: String(error), retainedExistingScreenshot: true });
      console.log(`Capture failed for ${slug}: ${device}: ${String(error)}`);
    } finally {
      await context.close();
    }
  }
}
await browser.close();
writeFileSync('artifacts/project-captures.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
