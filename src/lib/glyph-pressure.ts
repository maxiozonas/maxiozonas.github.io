import { gsap } from 'gsap';

// Pointer proximity for large type: glyphs near the pointer stretch and lift a
// little. Each glyph sits in an untransformed slot, which is what gets measured,
// so the effect cannot feed back into itself. Shared by the hero name and the
// contact address. Inspired by React Bits Text Pressure, with transforms instead
// of variable-font axes.
export function glyphPressure(title: HTMLElement, selector = '.hero-glyph') {
  const letters = Array.from(title.querySelectorAll<HTMLElement>(selector));
  const controls = letters.map(letter => ({
    letter,
    scale: gsap.quickTo(letter, 'scaleY', { duration: .4, ease: 'power3.out' }),
    lift: gsap.quickTo(letter, 'y', { duration: .4, ease: 'power3.out' }),
  }));
  let centers: { x: number; y: number }[] = [];
  let disposed = false;
  const measure = () => {
    const rect = title.getBoundingClientRect();
    centers = letters.map(letter => {
      const box = letter.parentElement!.getBoundingClientRect();
      return { x: box.left - rect.left + box.width / 2, y: box.top - rect.top + box.height / 2 };
    });
  };
  const reset = () => controls.forEach(({ scale, lift }) => { scale(1); lift(0); });
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const rect = title.getBoundingClientRect();
    const radius = Math.min(240, rect.width * .22);
    controls.forEach(({ scale, lift }, index) => {
      const center = centers[index];
      if (!center) return;
      const distance = Math.hypot(event.clientX - rect.left - center.x, event.clientY - rect.top - center.y);
      const pressure = Math.max(0, 1 - distance / radius) ** 2;
      scale(1 + pressure * .16);
      lift(-pressure * 5);
    });
  };
  const observer = new ResizeObserver(measure);
  observer.observe(title);
  measure();
  void document.fonts.ready.then(() => { if (!disposed) measure(); });
  title.addEventListener('pointermove', move, { passive: true });
  title.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  return {
    measure,
    dispose() {
      disposed = true;
      observer.disconnect();
      title.removeEventListener('pointermove', move);
      title.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      controls.forEach(({ scale, lift }) => { scale.tween.kill(); lift.tween.kill(); });
      gsap.set(letters, { clearProps: 'transform' });
    },
  };
}
