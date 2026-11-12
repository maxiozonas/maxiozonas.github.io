import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { glyphPressure } from '@/lib/glyph-pressure';

// The name is the hero artwork: it enters word by word and its glyphs react to
// the pointer (see glyph-pressure). Uses the self-hosted Cabinet Grotesk.
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
      const pressure = glyphPressure(title);
      refreshCenters = pressure.measure;
      return () => { refreshCenters = undefined; pressure.dispose(); };
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
