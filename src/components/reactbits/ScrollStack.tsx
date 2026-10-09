// React Bits Scroll Stack composition, adapted to the document scroll using
// sticky cards and GSAP scaling. No nested scroller or second smoothing engine.
// Source: src/ts-default/Components/ScrollStack/ScrollStack.tsx, LICENSE.md.
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function ScrollStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = Array.from(ref.current!.querySelectorAll<HTMLElement>('.scroll-stack-card'));
      cards.slice(0, -1).forEach((card, index) => {
        gsap.to(card, { scale: .95, transformOrigin: 'top center', ease: 'none', scrollTrigger: { trigger: cards[index + 1], start: 'top 90%', end: 'top 180px', scrub: true } });
      });
      const refresh = () => {
        // Taller cards must scroll their whole content into view before sticking.
        cards.forEach(card => card.style.setProperty('--stack-top', `${Math.min(140, window.innerHeight - card.offsetHeight - 40)}px`));
        ScrollTrigger.refresh();
      };
      const observer = new ResizeObserver(refresh);
      cards.forEach(card => observer.observe(card));
      window.addEventListener('resize', refresh);
      refresh();
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', refresh);
        cards.forEach(card => card.style.removeProperty('--stack-top'));
      };
    });
    return () => media.revert();
  }, []);
  return <div ref={ref} className="experience-list scroll-stack">{children}</div>;
}
