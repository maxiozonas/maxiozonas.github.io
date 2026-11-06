import { test, expect } from '@playwright/test';

for (const initialTheme of ['light', 'dark']) {
  test(`Light Rays draws in ${initialTheme} mode and preserves its canvas across themes`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addInitScript(theme => localStorage.setItem('theme', theme), initialTheme);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/es/');
    const canvas = page.locator('.site-atmosphere canvas');
    await expect(canvas).toHaveAttribute('data-ready', 'true');
    await expect(canvas).toHaveAttribute('data-mode', initialTheme);
    const initial = await canvas.elementHandle();
    await expect(page.locator('#fluid, .splash-cursor, [data-background="ghost-fibers"]')).toHaveCount(0);
    for (let i = 0; i < 6; i++) {
      await page.locator('#theme-toggle').click();
      const theme = i % 2 === 0 ? (initialTheme === 'light' ? 'dark' : 'light') : initialTheme;
      await expect(canvas).toHaveAttribute('data-mode', theme);
      expect(await canvas.evaluate((element, original) => element === original, initial)).toBe(true);
      await expect.poll(() => canvas.evaluate((element, dark) => new Promise<boolean>(resolve => {
        const gl = (element as HTMLCanvasElement).getContext('webgl2')!;
        if (!gl || gl.isContextLost()) { resolve(false); return; }
        // Read immediately after drawing, before the browser discards the buffer.
        const draw = gl.drawArrays;
        gl.drawArrays = (mode: number, first: number, count: number) => {
          draw.call(gl, mode, first, count);
          if (gl.getParameter(gl.FRAMEBUFFER_BINDING) !== null) return;
          gl.drawArrays = draw;
          const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          let red = 0, green = 0, blue = 0, alpha = 0;
          for (let pixel = 0; pixel < pixels.length; pixel += 16) {
            red += pixels[pixel]; green += pixels[pixel + 1]; blue += pixels[pixel + 2]; alpha += pixels[pixel + 3];
          }
          // Emerald accent: the rays must lean green over red, in both themes.
          resolve(alpha > 1000 && green > red && green > blue);
        };
        window.dispatchEvent(new PointerEvent('pointermove', { clientX: 420, clientY: 200, pointerType: 'mouse' }));
      }), theme === 'dark')).toBe(true);
    }
    const before = await canvas.screenshot();
    await page.mouse.move(650, 150);
    await page.mouse.move(1100, 250, { steps: 15 });
    const after = await canvas.screenshot();
    expect(before.equals(after)).toBe(false);
    await expect(page.locator('.site-atmosphere canvas')).toHaveCount(1);
    const context = await canvas.evaluateHandle(element => (element as HTMLCanvasElement).getContext('webgl2'));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(canvas).toHaveCount(0);
    await expect.poll(() => context.evaluate(gl => gl!.isContextLost())).toBe(true);
    expect(await page.locator('.site-atmosphere').evaluate(element => getComputedStyle(element, '::before').backgroundImage)).toContain(`atmosphere-${initialTheme}.webp`);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(canvas).toHaveAttribute('data-ready', 'true');
    expect(await canvas.evaluate((element, original) => element === original, initial)).toBe(false);
    expect(errors).toEqual([]);
  });
}

test('mobile and no-JavaScript views use the static light capture without WebGL', async ({ browser }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ javaScriptEnabled, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/es/');
    await expect(page.locator('[data-background="light-rays"]')).toBeVisible();
    await expect(page.locator('.site-atmosphere canvas')).toHaveCount(0);
    expect(await page.locator('.site-atmosphere').evaluate(element => getComputedStyle(element, '::before').backgroundImage)).toContain('atmosphere-light.webp');
    await expect(page.locator('#hero-title')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    await context.close();
  }
});

test('Light Rays pauses while hidden and resumes when visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/es/');
  const canvas = page.locator('.site-atmosphere canvas[data-ready="true"]');
  await canvas.waitFor();
  await canvas.evaluate(element => {
    const surface = element as HTMLCanvasElement;
    const gl = surface.getContext('webgl2')!;
    const draw = gl.drawArrays;
    surface.dataset.testDraws = '0';
    gl.drawArrays = (mode: number, first: number, count: number) => {
      draw.call(gl, mode, first, count);
      if (gl.getParameter(gl.FRAMEBUFFER_BINDING) === null) surface.dataset.testDraws = String(Number(surface.dataset.testDraws) + 1);
    };
  });
  await page.mouse.move(1000, 220, { steps: 12 });
  await expect.poll(() => canvas.evaluate(element => Number((element as HTMLElement).dataset.testDraws))).toBeGreaterThan(0);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const paused = await canvas.getAttribute('data-test-draws');
  // Allow several animation frames without using a fixed wall-clock delay.
  await page.evaluate(() => new Promise<void>(resolve => {
    let frames = 0;
    const tick = () => { if (++frames === 12) resolve(); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
  expect(await canvas.getAttribute('data-test-draws')).toBe(paused);
  await page.evaluate(() => {
    delete (document as unknown as { visibilityState?: string }).visibilityState;
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => canvas.evaluate(element => Number((element as HTMLElement).dataset.testDraws))).toBeGreaterThan(Number(paused));
});

test('unavailable or lost WebGL reveals the static atmosphere instead of a blank layer', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/es/');
  const canvas = page.locator('.site-atmosphere canvas');
  await expect(canvas).toHaveAttribute('data-ready', 'true');
  await canvas.evaluate(element => (element as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(canvas).not.toHaveAttribute('data-ready');
  await expect.poll(() => page.locator('.site-atmosphere').evaluate(element => getComputedStyle(element, '::before').opacity)).toBe('1');
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      return type.startsWith('webgl') ? null : Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.reload();
  await page.locator('.site-atmosphere canvas').waitFor({ state: 'attached' });
  await expect(page.locator('.site-atmosphere')).toBeVisible();
  await expect(page.locator('canvas[data-ready="true"]')).toHaveCount(0);
  expect(await page.locator('.site-atmosphere').evaluate(element => getComputedStyle(element, '::before').backgroundImage)).toContain('atmosphere-light.webp');
});
