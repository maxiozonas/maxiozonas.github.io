import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
mkdirSync('artifacts', { recursive: true });
const results = [];
for (const [slug, url] of [
  ['catalejo-travel', 'https://www.catalejotravel.com/es/'],
  ['quinta-pata', 'https://5tapata.com.ar/'],
  ['inspira-ingenieria', 'https://www.ingenieriainspira.com/'],
  ['madryn-buceo', 'https://madrynbuceo.xenova.com.ar/'],
]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 });
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForLoadState('networkidle', { timeout: 18000 }).catch(() => {});
    await page.evaluate(async () => {
      await Promise.all([...document.images].filter(image => image.loading !== 'lazy').map(image => image.decode().catch(() => {})));
    });
    await page.waitForTimeout(1500);
    const title = await page.title();
    if (!response?.ok() || /error|not found|unavailable/i.test(title)) throw new Error(`${response?.status()}: ${title}`);
    await page.screenshot({ path: `public/projects/${slug}.png` });
    results.push({ slug, url, title, status: response.status(), capturedAt: new Date().toISOString() });
  } catch (error) {
    results.push({ slug, url, error: String(error), retainedExistingScreenshot: true });
  } finally {
    await page.close();
  }
}
await browser.close();
writeFileSync('artifacts/project-captures.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
