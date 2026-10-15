import { test, expect } from '@playwright/test';

for (const initialTheme of ['light', 'dark']) {
test(`cursor smoke starts in ${initialTheme} mode and keeps its canvas across theme changes`, async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.addInitScript(theme => localStorage.setItem('theme', theme), initialTheme);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/es/');
  const fluid = page.locator('.splash-cursor canvas');
  await expect(fluid).toBeVisible();
  const initial = await fluid.elementHandle();
  let background: Awaited<ReturnType<typeof fluid.elementHandle>> | null = null;
  for (let i = 0; i < 6; i++) {
    await page.locator('#theme-toggle').click();
    await expect(fluid).toBeVisible();
    expect(await fluid.evaluate((canvas, original) => canvas === original, initial)).toBe(true);
    await expect.poll(() => fluid.evaluate(canvas => {
      const context = (canvas as HTMLCanvasElement).getContext('webgl2');
      return context !== null && !context.isContextLost();
    })).toBe(true);
    const dark = (initialTheme === 'light') === (i % 2 === 0);
    const fibers = page.locator('[data-background="ghost-fibers"] canvas');
    if (!background && dark) {
      await expect(fibers).toBeVisible();
      background = await fibers.elementHandle();
    }
    if (background) expect(await fibers.evaluate((canvas, original) => canvas === original, background)).toBe(true);
    if (dark) await expect(fibers).toBeVisible();
    else await expect(fibers).toBeHidden();

    await page.mouse.move(600, 300);
    await page.mouse.move(950, 430, { steps: 12 });
    // Inspect drawn pixels: a mounted but blank/lost canvas is not a working effect.
    await expect.poll(() => fluid.evaluate((element, isDark) => new Promise<boolean>(resolve => {
      requestAnimationFrame(() => {
        const gl = (element as HTMLCanvasElement).getContext('webgl2')!;
        const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        let red = 0, blue = 0, alpha = 0;
        for (let pixel = 0; pixel < pixels.length; pixel += 4) {
          red += pixels[pixel];
          blue += pixels[pixel + 2];
          alpha += pixels[pixel + 3];
        }
        resolve(alpha > 1000 && (isDark ? red > blue * 1.5 : blue > red * 2));
      });
    }), dark)).toBe(true);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(fluid).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(fluid).toBeVisible();
  expect(errors).toEqual([]);
});
}
