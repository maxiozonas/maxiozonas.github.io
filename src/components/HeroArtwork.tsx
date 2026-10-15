import { useEffect, useRef } from 'react';
import { createConstellation, projectConstellation, type ProjectedStar } from './hero-constellation';

const constellation = createConstellation(640);
const still = projectConstellation(constellation.stars, 0.4, -0.16);
const fallbackLines = constellation.links.map(([a, b]) => {
  const start = still[a];
  const end = still[b];
  return `M${start.x.toFixed(2)},${start.y.toFixed(2)}L${end.x.toFixed(2)},${end.y.toFixed(2)}`;
}).join('');
const fallbackStars = still.filter((_, index) => index % 3 === 0).map(star =>
  `M${(star.x - 0.9).toFixed(2)},${star.y.toFixed(2)}a.9,.9 0 1,0 1.8,0a.9,.9 0 1,0 -1.8,0`
).join('');

export default function HeroArtwork() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!root || !canvas || !context) return;

    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const desktop = window.matchMedia('(min-width: 768px)');
    const pointer = { x: 0, y: 0, active: false };
    const lean = { x: 0, y: 0 };
    let brand = '';
    let highlight = '';
    let size = 0;
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let rotation = 0.4;
    let disposed = false;

    const readTheme = () => {
      const style = getComputedStyle(document.documentElement);
      brand = style.getPropertyValue('--brand').trim();
      highlight = style.getPropertyValue('--foreground').trim();
    };

    const draw = (stars: ProjectedStar[]) => {
      context.clearRect(0, 0, size, size);
      const scale = size / 500;
      context.save();
      context.scale(scale, scale);
      context.lineWidth = 0.65;
      context.strokeStyle = brand;
      // Batch the network by depth so the back of the shell stays quiet.
      for (let depth = 0; depth < 4; depth++) {
        context.beginPath();
        for (const [a, b] of constellation.links) {
          const start = stars[a];
          const end = stars[b];
          if (Math.min(3, Math.floor(((start.depth + end.depth) / 2 + 1) * 2)) !== depth) continue;
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
        }
        context.globalAlpha = [0.06, 0.14, 0.28, 0.48][depth];
        context.stroke();
      }

      for (const star of stars) {
        const distance = pointer.active ? Math.hypot(star.x / 500 - 0.5 - pointer.x, star.y / 500 - 0.5 - pointer.y) : 1;
        const glow = Math.max(0, 1 - distance / 0.23);
        context.globalAlpha = Math.min(1, 0.2 + (star.depth + 1) * 0.32 + glow * 0.5);
        context.fillStyle = glow > 0.2 ? highlight : brand;
        context.beginPath();
        context.arc(star.x, star.y, 0.7 + (star.depth + 1) * 0.3 + glow * 1.1, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
      canvas.dataset.ready = 'true';
    };

    const tick = (time: number) => {
      frame = 0;
      if (disposed) return;
      const elapsed = time - lastTime;
      if (elapsed >= 1000 / 30) {
        const delta = Math.min(elapsed / 1000, 0.05);
        rotation += delta * 0.075;
        const follow = 1 - Math.exp(-delta * 5);
        lean.x += ((pointer.active ? pointer.x * 0.25 : 0) - lean.x) * follow;
        lean.y += ((pointer.active ? pointer.y * 0.25 : 0) - lean.y) * follow;
        draw(projectConstellation(constellation.stars, rotation + lean.x, -0.16 + lean.y));
        lastTime = time;
      }
      frame = requestAnimationFrame(tick);
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!motion.matches || !desktop.matches || !visible || document.hidden || !size) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      size = root.getBoundingClientRect().width;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      update();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = root.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(readTheme);
    readTheme();
    intersection.observe(root);
    resizeObserver.observe(root);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', leave);
    motion.addEventListener('change', update);
    desktop.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      motion.removeEventListener('change', update);
      desktop.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return <div ref={rootRef} className="hero-artwork" aria-hidden="true">
    <svg className="hero-artwork-fallback" viewBox="0 0 500 500" fill="none">
      <path d={fallbackLines} stroke="currentColor" strokeWidth=".65" opacity=".24"/>
      <path d={fallbackStars} fill="currentColor" opacity=".7"/>
    </svg>
    <canvas ref={canvasRef} className="hero-constellation"/>
  </div>;
}
