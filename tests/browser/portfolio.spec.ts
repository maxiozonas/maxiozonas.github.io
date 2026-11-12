import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('artifacts/screenshots', { recursive: true });

const option = (page: import('@playwright/test').Page, slug: string) => page.locator(`.deck-option[data-project="${slug}"]`);

test('projects pair a wheel of names with a stack of cards', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-deck')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('.deck-option')).toHaveCount(6);
  await expect(page.locator('.swap-card')).toHaveCount(6);
  const front = page.locator('.swap-card[data-pos="0"]');
  await expect(front).toHaveAttribute('data-slug', 'food-partners');
  await expect(option(page, 'food-partners')).toHaveAttribute('aria-current', 'true');
  // The stack sits to the right of the wheel, and the front card is straight.
  const wheel = (await page.locator('.deck-wheel').boundingBox())!;
  const stage = (await page.locator('.swap-stage').boundingBox())!;
  expect(stage.x).toBeGreaterThan(wheel.x + wheel.width * .5);
  expect(await front.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).b)).toBe(0);
  expect(await page.locator('.swap-card[data-pos="1"]').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).b)).toBeGreaterThan(0);
  // A name selects its card; both captures of the front card are loaded.
  await option(page, 'madryn-buceo').click();
  await expect(front).toHaveAttribute('data-slug', 'madryn-buceo');
  await expect(page.locator('.deck-option[aria-current="true"]')).toHaveCount(1);
  await expect(page.locator('.deck-detail[data-active="true"]')).toContainText('Ver caso');
  await expect(front.locator('img')).toHaveCount(2);
  for (const image of await front.locator('img').all()) {
    await image.evaluate(element => (element as HTMLImageElement).decode());
    expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  expect(await page.locator('#projects').evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(1100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440);
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
      for (const image of await page.locator('.swap-card[data-pos="0"] img').all()) {
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
      await option(page, 'catalejo-travel').click();
      await expect(page.locator('.swap-card[data-pos="0"]')).toHaveAttribute('data-slug', 'catalejo-travel');
      await page.locator('.swap-card[data-pos="0"]').click();
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
      await expect(page.locator('.deck-option')).toHaveCount(6);
    });
  }
}

test('project cards advance on their own, pause on hover and lead to the case page', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    window.addEventListener('pageswap', event => {
      sessionStorage.setItem('portfolio-transition', String(Boolean((event as PageSwapEvent).viewTransition)));
    });
  });
  await page.goto('/es/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-deck')).toHaveAttribute('data-hydrated', 'true');
  const front = page.locator('.swap-card[data-pos="0"]');
  await expect(front).toHaveAttribute('data-slug', 'food-partners');
  await page.mouse.move(5, 5);
  // Left alone, the front card drops away and the next project steps forward, on the wheel too.
  await expect(front).toHaveAttribute('data-slug', 'catalejo-travel', { timeout: 9000 });
  await expect(option(page, 'catalejo-travel')).toHaveAttribute('aria-current', 'true');
  // Once it has arrived, the new front card is straight.
  await expect.poll(() => front.evaluate(element => Math.abs(new DOMMatrixReadOnly(getComputedStyle(element).transform).b))).toBeLessThan(.001);
  // Pointing at the section holds the current card.
  await option(page, 'quinta-pata').click();
  await expect(front).toHaveAttribute('data-slug', 'quinta-pata');
  await page.waitForTimeout(5400);
  await expect(front).toHaveAttribute('data-slug', 'quinta-pata');
  // A card behind comes to the front (only a strip of it shows); the front card is the link.
  const behind = (await page.locator('.swap-card[data-pos="1"]').boundingBox())!;
  await page.mouse.click(behind.x + behind.width - 7, behind.y + behind.height * .45);
  await expect(front).toHaveAttribute('data-slug', 'inspira-ingenieria');
  await expect(page).toHaveURL(/\/es\/$/);
  await front.click();
  await expect(page).toHaveURL(/\/es\/projects\/inspira-ingenieria\/$/);
  expect(await page.evaluate(() => sessionStorage.getItem('portfolio-transition'))).toBe('true');
  await page.goBack();
  // Keyboard: focusing a name selects it, the arrows move along the wheel and Enter opens the case.
  await option(page, 'food-partners').focus();
  await expect(front).toHaveAttribute('data-slug', 'food-partners');
  await page.keyboard.press('ArrowDown');
  await expect(option(page, 'catalejo-travel')).toBeFocused();
  await expect(front).toHaveAttribute('data-slug', 'catalejo-travel');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/es\/projects\/catalejo-travel\/$/);
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

test('on mobile the card stack sits above the wheel of names', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-deck')).toHaveAttribute('data-hydrated', 'true');
  const stage = (await page.locator('.swap-stage').boundingBox())!;
  const wheel = (await page.locator('.deck-wheel').boundingBox())!;
  expect(wheel.y).toBeGreaterThan(stage.y + stage.height);
  expect(stage.x).toBeGreaterThanOrEqual(0);
  expect(stage.x + stage.width).toBeLessThanOrEqual(390);
  await option(page, 'catalejo-travel').click();
  await expect(page.locator('.swap-card[data-pos="0"]')).toHaveAttribute('data-slug', 'catalejo-travel');
  await expect(page.locator('.deck-detail[data-active="true"] .deck-summary')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
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
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-deck')).toHaveAttribute('data-hydrated', 'true');
  await option(page, 'madryn-buceo').click();
  await expect(option(page, 'madryn-buceo')).toHaveAttribute('aria-current', 'true');
  // A name only selects, however many times it is tapped; the card opens the case.
  await option(page, 'madryn-buceo').click();
  await expect(page).toHaveURL(/\/es\/$/);
  await page.locator('.swap-card[data-pos="0"]').click();
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
  await expect(page.locator('#projects')).toContainText('ERP');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('[data-stack-motion="true"]')).toHaveCount(0);
  for (const chapter of await page.locator('.experience-chapter').all()) {
    expect(await chapter.evaluate(element => getComputedStyle(element).position)).toBe('relative');
    expect(await chapter.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
  }
  await expect(page.locator('.hero-artwork')).toHaveCount(0);
  await option(page, 'quinta-pata').click();
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

test('experience precedes the projects and reduced motion stops effects', async ({ page }) => {
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
  await expect(page.locator('.deck-option')).toHaveCount(6);
  // Food Partners shows captures of its institutional site, like every other project.
  await expect(page.locator('.swap-card[data-slug="food-partners"] img')).toHaveCount(2);
  // With reduced motion the stack does not advance on its own.
  const front = page.locator('.swap-card[data-pos="0"]');
  const slug = await front.getAttribute('data-slug');
  await page.mouse.move(5, 5);
  await page.waitForTimeout(5400);
  await expect(front).toHaveAttribute('data-slug', slug!);
});
