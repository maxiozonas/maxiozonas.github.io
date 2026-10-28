// React Bits Scroll Stack composition, adapted to the document scroll using
// sticky chapters and GSAP scaling. No nested scroller or second smoothing engine.
// Source: src/ts-default/Components/ScrollStack/ScrollStack.tsx, LICENSE.md.
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function ScrollStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      root.dataset.stackMotion = 'true';
      const cards = Array.from(root.querySelectorAll<HTMLElement>('.scroll-stack-card'));
      const padding = (card: HTMLElement, side: 'paddingTop' | 'paddingBottom') => {
        const content = card.querySelector<HTMLElement>('.chapter-inner') ?? card;
        return parseFloat(getComputedStyle(content)[side]) || 0;
      };
      cards.slice(0, -1).forEach((card, index) => {
        const next = cards[index + 1];
        const clearAt = () => {
          const top = parseFloat(card.style.getPropertyValue('--stack-top')) || 0;
          // Finish before incoming text can meet the outgoing content. Measuring
          // at refresh time avoids per-frame DOM reads and handles short windows.
          return top + card.offsetHeight - padding(card, 'paddingBottom') - padding(next, 'paddingTop') + 32;
        };
        gsap.to(card, {
          scale: .96, autoAlpha: 0, transformOrigin: 'top center', ease: 'none',
          scrollTrigger: {
            trigger: next,
            start: () => `top ${clearAt() + Math.min(160, window.innerHeight * .22)}px`,
            end: () => `top ${clearAt()}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
      const refresh = () => {
        // Taller chapters must scroll their whole content into view before sticking.
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
        delete root.dataset.stackMotion;
      };
    });
    return () => media.revert();
  }, []);
  return <div ref={ref} className="experience-list scroll-stack" data-scroll-stack>{children}</div>;
}
