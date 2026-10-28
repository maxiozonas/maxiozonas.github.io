import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// React Bits Text Pressure inspired the proximity interaction. This version
// keeps our self-hosted Cabinet Grotesk and uses transforms, not variable-font axes.
export default function HeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    title.dataset.hydrated = 'true';
    let refreshCenters: (() => void) | undefined;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(title.querySelectorAll('.hero-word'), {
        opacity: 0, y: 28, duration: .85, stagger: .1, ease: 'power3.out', clearProps: 'all',
        onComplete: () => refreshCenters?.(),
      });
    });
    media.add('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const letters = Array.from(title.querySelectorAll<HTMLElement>('.hero-glyph'));
      const controls = letters.map(letter => ({
        letter,
        scale: gsap.quickTo(letter, 'scaleY', { duration: .4, ease: 'power3.out' }),
        lift: gsap.quickTo(letter, 'y', { duration: .4, ease: 'power3.out' }),
      }));
      let centers: { x: number; y: number }[] = [];
      let disposed = false;
      const measure = () => {
        // Measure the untransformed wrappers, so pressure cannot feed back into itself.
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
      refreshCenters = measure;
      observer.observe(title);
      measure();
      void document.fonts.ready.then(() => { if (!disposed) measure(); });
      title.addEventListener('pointermove', move, { passive: true });
      title.addEventListener('pointerleave', reset);
      window.addEventListener('blur', reset);
      return () => {
        disposed = true;
        refreshCenters = undefined;
        observer.disconnect();
        title.removeEventListener('pointermove', move);
        title.removeEventListener('pointerleave', reset);
        window.removeEventListener('blur', reset);
        controls.forEach(({ scale, lift }) => { scale.tween.kill(); lift.tween.kill(); });
        gsap.set(letters, { clearProps: 'transform' });
      };
    });
    return () => media.revert();
  }, []);

  return <h1 ref={titleRef} id="hero-title" className="hero-title font-bold tracking-tighter">
    <span className="sr-only">Máximo Ozonas</span>
    <span aria-hidden="true" className="hero-name-lines">
      {['Máximo', 'Ozonas.'].map((word, index) => <span key={word} className={index === 1 ? 'hero-word hero-surname' : 'hero-word'}>
        {Array.from(word).map((letter, i) => <span className="hero-glyph-slot" key={i}><span className="hero-glyph">{letter}</span></span>)}
      </span>)}
    </span>
  </h1>;
}
