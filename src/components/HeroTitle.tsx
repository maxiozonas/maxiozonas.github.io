import { useEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { glyphPressure } from '@/lib/glyph-pressure';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['Máximo', 'Ozonas'];

// The name is the hero artwork. Its entrance is pure CSS (see "Hero entrance"
// in global.css) so it starts on first paint, before hydration. Once hydrated,
// the glyphs react to the pointer (see glyph-pressure) and the two words drift
// apart and fade as the hero scrolls away.
export default function HeroTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    title.dataset.hydrated = 'true';
    let refreshCenters: (() => void) | undefined;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const [first, last] = title.querySelectorAll<HTMLElement>('.hero-word');
      const hero = title.closest('section') ?? title;
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6, onUpdate: () => refreshCenters?.() },
      });
      timeline
        .to(first, { yPercent: -22, opacity: .15 }, 0)
        .to(last, { yPercent: -48, opacity: .15 }, 0);
    });
    media.add('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const pressure = glyphPressure(title);
      refreshCenters = pressure.measure;
      return () => { refreshCenters = undefined; pressure.dispose(); };
    });
    return () => media.revert();
  }, []);

  let index = 0;
  return <h1 ref={titleRef} id="hero-title" className="hero-title font-bold tracking-tighter">
    <span className="sr-only">Máximo Ozonas</span>
    <span aria-hidden="true" className="hero-name-lines">
      {WORDS.map((word, w) => <span key={word} className={w === 1 ? 'hero-word hero-surname' : 'hero-word'}>
        {Array.from(word).map((letter, i) => {
          const style = { '--i': index++ } as CSSProperties;
          return <span className="hero-glyph-slot" style={style} key={i}><span className="hero-glyph">{letter}</span></span>;
        })}
      </span>)}
    </span>
  </h1>;
}
