import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('artifacts/screenshots', { recursive: true });

for (const locale of ['es', 'en']) {
  for (const [width, height] of [[1440, 900], [1024, 768], [768, 900], [390, 844], [320, 700]]) {
    test(`${locale}: responsive layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`/${locale}/`);
      await page.locator('#hero-title').waitFor();
      await page.waitForTimeout(1800);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const heading = await page.locator('#hero-title').boundingBox();
      expect(heading?.height).toBeLessThan(340);
      const actions = await page.locator('.hero-actions').boundingBox();
      expect(actions!.y + actions!.height).toBeLessThan(height);
      for (const button of await page.locator('.hero-actions a').all()) {
        expect(await button.evaluate(element => element.scrollWidth <= element.clientWidth + 2)).toBeTruthy();
      }
      if (width >= 1024) {
        expect(await page.locator('.site-header').evaluate(element => element.clientHeight)).toBeLessThanOrEqual(80);
        await expect(page.locator('[data-slot=navigation-menu-list]')).toBeVisible();
      }
      if (width < 768) {
        await page.getByRole('button', { name: locale === 'es' ? 'Abrir men\u00fa' : 'Open menu' }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.locator('.mobile-nav a[href$="#projects"]').click();
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page).toHaveURL(/#projects$/);
      }
      await page.locator('#contact').scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      expect(errors).toEqual([]);
    });
  }

  for (const theme of ['light', 'dark']) {
    test(`${locale}: ${theme} theme, accessibility and screenshots`, async ({ page }) => {
      test.setTimeout(60000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.addInitScript(value => localStorage.setItem('theme', value), theme);
      await page.goto(`/${locale}/`);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: `artifacts/screenshots/${locale}-desktop-${theme}.png` });
      // Stabilise the long screenshot and contrast audit after checking the animated entrance.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      for (const image of await page.locator('.project-card-image').all()) {
        await image.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await expect(image).toHaveJSProperty('complete', true);
        expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      }
      for (const section of await page.locator('main section').all()) {
        await section.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
        await page.waitForTimeout(700);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(600);
      await page.screenshot({ path: `artifacts/screenshots/${locale}-full-${theme}.png`, fullPage: true });
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(audit.violations).toEqual([]);
      await page.locator('.project-image-link').first().click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/projects/catalejo-travel/`));
      await expect(page.locator('.detail-heading h1')).toHaveText('Catalejo Travel');
      expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain(`/${locale}/projects/catalejo-travel/`);
      for (const paragraph of await page.locator('.detail-deliverables > p').all()) {
        await paragraph.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await page.waitForTimeout(700);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(700);
      await page.screenshot({ path: `artifacts/screenshots/${locale}-detail-${theme}.png`, fullPage: true });
      const detailAudit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(detailAudit.violations).toEqual([]);
      await page.locator('.language-toggle').click();
      await expect(page).toHaveURL(new RegExp(`/${locale === 'es' ? 'en' : 'es'}/projects/catalejo-travel/`));
      await page.locator('.back-link').click();
      await expect(page).toHaveURL(/#projects$/);
      await expect(page.locator('.project-card')).toHaveCount(4);
    });
  }
}

test('Magic Bento reacts to the pointer and native route transitions run', async ({ page }) => {
  await page.addInitScript(() => {
    window.addEventListener('pageswap', event => {
      sessionStorage.setItem('portfolio-transition', String(Boolean((event as PageSwapEvent).viewTransition)));
    });
  });
  await page.goto('/es/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const card = page.locator('.magic-bento-card').first();
  await card.hover({ position: { x: 90, y: 100 } });
  await page.waitForTimeout(500);
  expect(await card.evaluate(element => Number((element as HTMLElement).style.getPropertyValue('--glow-intensity')))).toBeGreaterThan(0);
  expect(await card.evaluate(element => (element as HTMLElement).style.transform)).toContain('rotate');
  await page.screenshot({ path: 'artifacts/screenshots/magic-bento-hover.png' });
  await page.locator('.project-image-link').first().click();
  await expect(page).toHaveURL(/\/es\/projects\/catalejo-travel\/$/);
  expect(await page.evaluate(() => sessionStorage.getItem('portfolio-transition'))).toBe('true');
  await page.goBack();
  await expect(page.locator('.project-card')).toHaveCount(4);
});

test('theme persists and follows system preference before manual selection', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/es/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('[data-band-pause], .ambient-toggle')).toHaveCount(0);
});

test('experience heading stays in view while the next job enters', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/es/');
  await page.waitForTimeout(1100);
  await page.locator('.experience-intro').evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY + 150, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const box = await page.locator('.experience-intro').boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(112);
  expect(box!.y).toBeLessThanOrEqual(118);
});

test('mobile detail, reduced motion and controls remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  await expect(page.locator('.logoloop__track, [data-technology-band]')).toHaveCount(0);
  expect(await page.locator('.work-wheel-sectors path').first().evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: 'artifacts/screenshots/es-mobile-light.png' });
  await page.locator('#theme-toggle').evaluate(element => (element as HTMLButtonElement).click());
  await page.screenshot({ path: 'artifacts/screenshots/es-mobile-dark.png' });
  await page.locator('.project-image-link').last().click();
  await expect(page.locator('.detail-heading h1')).toHaveText('Madryn Buceo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  for (const paragraph of await page.locator('.detail-deliverables > p').all()) {
    await paragraph.scrollIntoViewIfNeeded();
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'artifacts/screenshots/es-mobile-detail.png', fullPage: true });
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('portfolio and project scope work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/es/');
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('.job-summary')).toHaveCount(2);
  await expect(page.locator('#experience-food-partners .job-scope')).toContainText('Mi Legajo');
  await page.locator('.project-image-link').first().click();
  await expect(page.locator('#scope-title')).toHaveText('Alcance del trabajo');
  await context.close();
});

test('work map and technology folders respond to pointer, keyboard and mobile selection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/es/');
  await page.locator('.work-map').scrollIntoViewIfNeeded();
  await expect(page.locator('.work-map [data-hydrated="true"]')).toHaveCount(1);
  await page.locator('.work-map').getByRole('button', { name: 'Acompañar', exact: true }).click();
  await expect(page.locator('.work-map-detail h3')).toHaveText('El sistema sigue aprendiendo.');
  await page.locator('.skills-folders').scrollIntoViewIfNeeded();
  await expect(page.locator('.skills-folders')).toHaveAttribute('data-hydrated', 'true');
  const web = page.locator('.folder-float').filter({ has: page.locator('summary', { hasText: 'Web y backend' }) });
  await web.locator('summary').hover();
  await web.locator('summary').click();
  await expect(web).toHaveJSProperty('open', true);
  await web.getByRole('button', { name: 'Laravel', exact: true }).hover();
  await expect(web.locator('h3')).toHaveText('Laravel');
  await expect(web.locator('.folder-projects')).toContainText('Catalejo Travel');
  await expect(page.locator('.folder-float[open]')).toHaveCount(1);
  const data = page.locator('.folder-float').filter({ has: page.locator('summary', { hasText: 'Bases de datos' }) });
  await page.mouse.move(0, 0);
  await data.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(web.getByRole('button', { name: 'Laravel', exact: true })).toBeHidden();
  await data.getByRole('button', { name: 'PostgreSQL', exact: true }).focus();
  await expect(data.locator('h3')).toHaveText('PostgreSQL');
  await expect(page.locator('.folder-float[open]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.folder-float[open]')).toHaveCount(0);
  await expect(data.locator('summary')).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await web.locator('summary').click();
  await web.getByRole('button', { name: '.NET', exact: true }).click();
  await expect(web.locator('h3')).toHaveText('.NET');
  const project = web.locator('.folder-projects').getByRole('link', { name: 'Quinta Pata' });
  await project.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/es\/projects\/quinta-pata\/$/);
});

test('experience precedes projects, bento stays dense and reduced motion stops effects', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('/es/');
  const sections = await page.locator('main > section').evaluateAll(elements => elements.map(element => element.id));
  expect(sections.indexOf('experience')).toBeLessThan(sections.indexOf('projects'));
  await expect(page.locator('[data-background="ghost-fibers"] canvas')).toBeVisible();
  await expect(page.locator('#fluid')).toBeVisible();
  await page.mouse.move(500, 200, { steps: 12 });
  await page.mouse.down();
  await page.mouse.up();
  await page.screenshot({ path: 'artifacts/screenshots/splash-cursor.png' });
  const context = await page.evaluateHandle(() => {
    const canvas = document.getElementById('fluid');
    return canvas instanceof HTMLCanvasElement ? canvas.getContext('webgl2') : null;
  });
  expect(await context.evaluate(gl => gl !== null)).toBeTruthy();
  await expect(page.locator('.ambient-toggle, [data-band-pause]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#fluid')).toHaveCount(0);
  expect(await context.evaluate(gl => gl!.isContextLost())).toBeTruthy();
  await page.locator('#projects').scrollIntoViewIfNeeded();
  const cards = page.locator('.magic-bento-card');
  const images = page.locator('.project-image-link');
  const heights = await images.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(2);
  expect(await cards.first().evaluate(element => getComputedStyle(element).borderTopWidth)).toBe('1px');
  expect(await page.locator('.bento-section').evaluate(element => getComputedStyle(element).gridAutoFlow)).toContain('dense');
});
