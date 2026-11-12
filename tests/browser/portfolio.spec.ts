import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('artifacts/screenshots', { recursive: true });

test('project index keeps the complete website image visible in a compact section', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-index')).toHaveAttribute('data-hydrated', 'true');
  await page.locator('[data-project="madryn-buceo"] .project-index-choice-link').hover();
  const preview = page.locator('[data-project="madryn-buceo"] .project-index-visual');
  await preview.scrollIntoViewIfNeeded();
  const image = preview.locator('img').first();
  await image.evaluate(element => (element as HTMLImageElement).decode());
  const visible = await image.evaluate(element => {
    const img = element as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    return { height: rect.height, expectedHeight: rect.width * img.naturalHeight / img.naturalWidth };
  });
  expect(Math.abs(visible.height - visible.expectedHeight)).toBeLessThan(2);
  expect(await page.locator('#projects').evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(1100);
  await expect(page.locator('.project-index-panel:visible')).toHaveCount(1);
  await expect(page.locator('.project-index svg')).toHaveCount(0);
  expect(await page.locator('.project-index-entry').first().evaluate(element => getComputedStyle(element).borderBottomWidth)).toBe('0px');
});

for (const locale of ['es', 'en']) {
  test(`${locale}: project details show complete desktop and mobile views at both viewport sizes`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const slug of ['catalejo-travel', 'quinta-pata', 'inspira-ingenieria', 'madryn-buceo', 'yogur-griego-rey']) {
        await page.goto(`/${locale}/projects/${slug}/`);
        const showcase = page.locator('.case-showcase');
        await showcase.scrollIntoViewIfNeeded();
        await expect(showcase.locator('.project-desktop')).toBeVisible();
        await expect(showcase.locator('.project-phone')).toBeVisible();
        for (const image of await showcase.locator('img').all()) {
          await image.evaluate(element => (element as HTMLImageElement).decode());
          expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await expect(page.locator('.case-contribution-title')).toHaveText(locale === 'es' ? 'Mi participación' : 'My contribution');
      }
    }
  });
}

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
      const hero = (await page.locator('#top').boundingBox())!;
      expect(hero.y + hero.height).toBeCloseTo(height, 0);
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
      for (const chapter of await page.locator('.experience-chapter').all()) {
        expect(await chapter.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
      }
      for (const image of await page.locator('.project-index-item[open] img').all()) {
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
      await page.locator('[data-project="catalejo-travel"] .project-index-choice-link').hover();
      await page.locator('[data-project="catalejo-travel"] .project-index-visual').click();
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
      await expect(page.locator('.project-index-item')).toHaveCount(6);
    });
  }
}

test('project wall brakes on hover, opens the card and leads to the case page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/es/');
  const wall = page.locator('.wall');
  await wall.scrollIntoViewIfNeeded();
  await expect(wall).toHaveAttribute('data-hydrated', 'true');
  await expect(wall).toBeVisible();
  await expect(page.locator('.project-index-item:visible')).toHaveCount(0);
  const row = wall.locator('.wall-row').first();
  const position = () => row.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).e);
  const before = await position();
  await expect.poll(position).not.toBe(before);
  // A name underneath opens the card of that project closest to the centre.
  await page.locator('[data-project="catalejo-travel"] .project-index-choice-link').hover();
  const card = wall.locator('.wall-tile[data-open="true"]');
  await expect(card).toHaveCount(1);
  await expect(card).toHaveAttribute('data-slug', 'catalejo-travel');
  await expect(card.locator('.wall-caption')).toBeVisible();
  await expect(card.locator('.wall-caption')).toContainText('Ver caso');
  await page.waitForTimeout(1500);
  const braked = await position();
  await page.waitForTimeout(300);
  expect(Math.abs(await position() - braked)).toBeLessThan(.5);
  // Cards open straight from the pointer as well, and the whole card is the link.
  const middle = (await wall.boundingBox())!.y + (await wall.boundingBox())!.height / 2;
  // Sweep a little: a single position can fall on the gap between two cards.
  for (let step = 0; step < 12 && await card.count() === 0; step++) {
    await page.mouse.move(560 + step * 45, middle + step * 12);
    await page.waitForTimeout(80);
  }
  await expect(card).toHaveCount(1);
  const slug = await card.getAttribute('data-slug');
  await card.click();
  await expect(page).toHaveURL(new RegExp(`/es/projects/${slug}/$`));
});

test('project selection supports pointer and keyboard, and native route transitions run', async ({ page }) => {
  // Below the wall breakpoint the index with its preview panel is the layout.
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.addInitScript(() => {
    window.addEventListener('pageswap', event => {
      sessionStorage.setItem('portfolio-transition', String(Boolean((event as PageSwapEvent).viewTransition)));
    });
  });
  await page.goto('/es/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-index')).toHaveAttribute('data-hydrated', 'true');
  const catalejo = page.locator('[data-project="catalejo-travel"]');
  await catalejo.locator('.project-index-choice-link').hover();
  await expect(catalejo.locator('details')).toHaveJSProperty('open', true);
  await expect(page.locator('.project-index-item[open]')).toHaveCount(1);
  const quinta = page.locator('[data-project="quinta-pata"]');
  await quinta.locator('.project-index-choice-link').focus();
  await expect(quinta.locator('details')).toHaveJSProperty('open', true);
  // Hover must not hide the links in a panel that currently contains keyboard focus.
  await quinta.locator('.project-index-case').focus();
  await catalejo.locator('.project-index-choice-link').hover();
  await expect(quinta.locator('details')).toHaveJSProperty('open', true);
  await catalejo.locator('.project-index-choice-link').focus();
  await expect(catalejo.locator('details')).toHaveJSProperty('open', true);
  await catalejo.locator('.project-index-visual img').first().evaluate(element => (element as HTMLImageElement).decode());
  await page.screenshot({ path: 'artifacts/screenshots/project-index-selection.png' });
  await catalejo.locator('.project-index-choice-link').click();
  await expect(page).toHaveURL(/\/es\/projects\/catalejo-travel\/$/);
  expect(await page.evaluate(() => sessionStorage.getItem('portfolio-transition'))).toBe('true');
  await page.goBack();
  await expect(page.locator('.project-index-item')).toHaveCount(6);
  await page.locator('[data-project="quinta-pata"] .project-index-choice-link').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/es\/projects\/quinta-pata\/$/);
});

test('typographic hero reacts locally to the pointer and resets for reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/es/');
  const title = page.locator('#hero-title');
  await expect(title).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.hero-artwork')).toHaveCount(0);
  await expect(title).toHaveAccessibleName('Máximo Ozonas');
  const glyph = title.locator('.hero-glyph').nth(3);
  await glyph.hover();
  await expect.poll(() => glyph.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).d)).toBeGreaterThan(1.02);
  await page.mouse.move(0, 0);
  await expect.poll(() => glyph.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).d)).toBeCloseTo(1, 2);
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await glyph.hover();
  await expect.poll(() => glyph.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).d)).toBeGreaterThan(1.02);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => glyph.evaluate(element => getComputedStyle(element).transform)).toBe('none');
  await title.locator('.hero-glyph').nth(1).hover();
  expect(await glyph.evaluate(element => getComputedStyle(element).transform)).toBe('none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await glyph.hover();
  await expect.poll(() => glyph.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).d)).toBeGreaterThan(1.02);
  expect(errors).toEqual([]);
});

test('mobile project disclosures can close and regain a desktop selection after resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-index')).toHaveAttribute('data-hydrated', 'true');
  const food = page.locator('[data-project="food-partners"]');
  await food.locator('.project-index-disclosure').click();
  await expect(page.locator('.project-index-item[open]')).toHaveCount(0);
  const catalejo = page.locator('[data-project="catalejo-travel"]');
  await catalejo.locator('.project-index-disclosure').click();
  await expect(catalejo.locator('details')).toHaveJSProperty('open', true);
  await catalejo.locator('.project-index-disclosure').click();
  await expect(catalejo.locator('details')).toHaveJSProperty('open', false);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.project-index-item[open]')).toHaveCount(1);
  const index = (await page.locator('.project-index').boundingBox())!;
  const panel = (await page.locator('.project-index-panel:visible').boundingBox())!;
  expect(panel.y + panel.height).toBeLessThanOrEqual(index.y + index.height + 1);
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

for (const [width, height] of [[1440, 900], [1366, 600]]) {
  test(`experience shows two badges and one role at a time at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/es/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    const badges = page.locator('.badge');
    await expect(page.locator('.badges')).toHaveAttribute('data-hydrated', 'true');
    await expect(badges).toHaveCount(2);
    await expect(page.locator('#experience .pin-spacer, .scroll-stack')).toHaveCount(0);
    const gili = page.locator('#experience-gili');
    const xenova = page.locator('#experience-xenova');
    await expect(badges.first()).toHaveAttribute('aria-selected', 'true');
    await expect(gili).toBeVisible();
    await expect(xenova).toBeHidden();
    // Badges hang side by side, to the left of the role they describe.
    const first = (await badges.first().boundingBox())!;
    const second = (await badges.nth(1).boundingBox())!;
    expect(second.x).toBeGreaterThan(first.x + first.width * .6);
    expect((await gili.boundingBox())!.x).toBeGreaterThan(second.x + second.width * .5);
    await badges.nth(1).hover();
    await expect(badges.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(xenova).toBeVisible();
    await expect(gili).toBeHidden();
    await expect(xenova.locator('.job-scope > div')).toHaveCount(2);
    expect(await xenova.locator('.chapter-related a').count()).toBeGreaterThanOrEqual(3);
    await badges.nth(1).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(badges.first()).toHaveAttribute('aria-selected', 'true');
    await expect(badges.first()).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

test('a technology link to a role selects its badge', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/es/#experience-xenova');
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await expect(page.locator('.badges')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('#company-xenova')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#experience-xenova')).toBeVisible();
});

test('experience badges and roles stay readable on mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/es/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await expect(page.locator('.badges')).toHaveAttribute('data-hydrated', 'true');
    for (const badge of await page.locator('.badge').all()) {
      const box = (await badge.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    await page.locator('#company-xenova').click();
    const role = page.locator('#experience-xenova');
    await expect(role).toBeVisible();
    for (const description of await role.locator('.job-scope dd').all()) {
      await description.scrollIntoViewIfNeeded();
      await expect(description).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test('mobile detail, reduced motion and controls remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  await expect(page.locator('.logoloop__track, [data-technology-band]')).toHaveCount(0);
  await expect(page.locator('.work-panel')).toHaveCount(5);
  await page.locator('.work-steps').scrollIntoViewIfNeeded();
  await expect(page.locator('.work-steps')).toHaveAttribute('data-hydrated', 'true');
  await page.locator('.work-panel-tab').nth(2).click();
  await expect(page.locator('.work-panel').nth(2).locator('.work-panel-text')).toBeVisible();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: 'artifacts/screenshots/es-mobile-light.png' });
  await page.locator('#theme-toggle').evaluate(element => (element as HTMLButtonElement).click());
  await page.screenshot({ path: 'artifacts/screenshots/es-mobile-dark.png' });
  await page.locator('[data-project="madryn-buceo"] .project-index-disclosure').click();
  await expect(page.locator('.project-index-item[open]')).toHaveCount(1);
  await page.locator('[data-project="madryn-buceo"] .project-index-visual').click();
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
  await expect(page.locator('#experience-xenova')).toContainText('Tech Lead');
  await expect(page.locator('#experience-gili')).toBeVisible();
  await expect(page.locator('[data-project="food-partners"]')).toContainText('ERP');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('[data-stack-motion="true"]')).toHaveCount(0);
  for (const chapter of await page.locator('.experience-chapter').all()) {
    expect(await chapter.evaluate(element => getComputedStyle(element).position)).toBe('relative');
    expect(await chapter.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  }
  await expect(page.locator('.hero-artwork')).toHaveCount(0);
  await page.locator('[data-project="quinta-pata"] .project-index-choice-link').click();
  await expect(page.locator('#scope-title')).toHaveText('Alcance del trabajo');
  await context.close();
});

// Marks fly out of the folder with a staggered spring; hovering one mid-flight
// makes Playwright retry with a scroll, which moves the page under the pointer.
const settled = (mark: import('@playwright/test').Locator) => mark.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));

for (const locale of ['es', 'en']) {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`${locale}: technology folders close after hover with ${reducedMotion} motion`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ reducedMotion });
      await page.goto(`/${locale}/`);
      await page.locator('.skills-folders').scrollIntoViewIfNeeded();
      await expect(page.locator('.skills-folders')).toHaveAttribute('data-hydrated', 'true');
      const folder = page.locator('.folder-float').nth(1);
      await folder.locator('summary').hover();
      await expect(folder).toHaveJSProperty('open', true);
      await settled(folder.getByRole('button', { name: 'Laravel', exact: true }));
      await folder.getByRole('button', { name: 'Laravel', exact: true }).hover();
      await expect(folder.locator('h3')).toHaveText('Laravel');
      await page.mouse.move(0, 0);
      await expect(folder).toHaveJSProperty('open', false);
      await expect(folder.getByRole('button', { name: 'Laravel', exact: true })).toBeHidden();
      await folder.locator('summary').hover();
      await expect(folder).toHaveJSProperty('open', true);
      await folder.locator('summary').click();
      await page.mouse.move(0, 0);
      await expect(folder).toHaveJSProperty('open', true);
      await folder.locator('summary').click();
      await expect(folder).toHaveJSProperty('open', false);
    });
  }
}

test('work map and technology folders respond to pointer, keyboard and mobile selection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/es/');
  const steps = page.locator('.work-steps');
  await steps.scrollIntoViewIfNeeded();
  await expect(steps).toHaveAttribute('data-hydrated', 'true');
  const panels = steps.locator('.work-panel');
  await expect(panels).toHaveCount(5);
  await expect(panels.first()).toHaveAttribute('data-active', 'true');
  await panels.last().hover();
  await expect(panels.last()).toHaveAttribute('data-active', 'true');
  await expect(panels.last().locator('h3')).toBeVisible();
  await expect(panels.last().locator('h3')).toContainText('Soporte y mantenimiento');
  await expect(panels.last().locator('.work-panel-text')).toBeVisible();
  await expect(panels.first().locator('.work-panel-text')).toBeHidden();
  await expect(steps.locator('.work-panel[data-active="true"]')).toHaveCount(1);
  await expect.poll(async () => (await panels.last().boundingBox())!.height / (await panels.first().boundingBox())!.height).toBeGreaterThan(1.8);
  await panels.nth(3).locator('.work-panel-tab').focus();
  await page.keyboard.press('ArrowUp');
  await expect(panels.nth(2)).toHaveAttribute('data-active', 'true');
  await expect(panels.nth(2).locator('.work-panel-tab')).toBeFocused();
  await page.locator('.skills-folders').scrollIntoViewIfNeeded();
  await expect(page.locator('.skills-folders')).toHaveAttribute('data-hydrated', 'true');
  const web = page.locator('.folder-float').filter({ has: page.locator('summary', { hasText: 'Web y backend' }) });
  await web.locator('summary').hover();
  await web.locator('summary').click();
  await expect(web).toHaveJSProperty('open', true);
  await settled(web.getByRole('button', { name: 'Laravel', exact: true }));
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

test('experience precedes the compact index and reduced motion stops effects', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await page.goto('/es/');
  const sections = await page.locator('main > section').evaluateAll(elements => elements.map(element => element.id));
  expect(sections.indexOf('experience')).toBeLessThan(sections.indexOf('projects'));
  const atmosphere = page.locator('[data-background="light-rays"] canvas');
  await expect(atmosphere).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#fluid, [data-background="ghost-fibers"]')).toHaveCount(0);
  await page.mouse.move(500, 200, { steps: 12 });
  await page.mouse.down();
  await page.mouse.up();
  await page.screenshot({ path: 'artifacts/screenshots/grid-pointer.png' });
  const context = await atmosphere.evaluateHandle(canvas => (canvas as HTMLCanvasElement).getContext('webgl2'));
  expect(await context.evaluate(gl => gl !== null)).toBeTruthy();
  await expect(page.locator('.ambient-toggle, [data-band-pause]')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(atmosphere).toHaveCount(0);
  expect(await context.evaluate(gl => gl!.isContextLost())).toBeTruthy();
  await page.locator('#projects').scrollIntoViewIfNeeded();
  const featured = page.locator('[data-project="food-partners"]');
  await featured.locator('.project-index-choice-link').hover();
  await expect(page.locator('.project-index-item')).toHaveCount(6);
  await expect(page.locator('.project-index-panel:visible')).toHaveCount(1);
  await expect(page.locator('.magic-bento-card')).toHaveCount(0);
  // Food Partners shows captures of its institutional site, like every other project.
  await expect(featured.locator('.project-index-visual img')).toHaveCount(2);
  expect(await featured.locator('.project-index-panel').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});
