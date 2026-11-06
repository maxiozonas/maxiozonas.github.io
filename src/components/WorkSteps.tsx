// Five working stages as full-width cards that stack over each other while the
// page scrolls (sticky cards + a GSAP scale on the card being covered, the same
// approach as the experience chapters). Below 1024px they are ordinary blocks;
// with reduced motion every visual is shown in its final state.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Locale } from '../data/content';
import { workflow } from '../data/workflow';
import { workVisuals } from './work-visuals';
gsap.registerPlugin(ScrollTrigger);

export default function WorkSteps({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const es = locale === 'es';
  const steps = workflow[locale];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.work-card'));
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: reduce)', () => {
      el.dataset.animate = 'false';
      cards.forEach(card => { card.dataset.active = 'true'; });
    });

    // Each visual plays its entrance when its card reaches the viewport.
    media.add('(prefers-reduced-motion: no-preference)', () => {
      el.dataset.animate = 'true';
      const triggers = cards.map(card => {
        card.dataset.active = 'false';
        return ScrollTrigger.create({
          trigger: card, start: 'top 78%',
          onEnter: () => { card.dataset.active = 'true'; },
          onLeaveBack: () => { card.dataset.active = 'false'; },
        });
      });
      return () => triggers.forEach(trigger => trigger.kill());
    });

    media.add('(min-width: 1024px)', () => {
      el.dataset.stack = 'true';
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { delete el.dataset.stack; };
    });

    // The card being covered recedes slightly as the next one arrives.
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      cards.slice(0, -1).forEach((card, index) => {
        const next = cards[index + 1];
        gsap.to(card, {
          scale: .95, ease: 'none', transformOrigin: 'top center',
          scrollTrigger: {
            trigger: next, start: 'top bottom',
            end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
            scrub: true, invalidateOnRefresh: true,
          },
        });
      });
    });
    return () => media.revert();
  }, []);

  return <div className="work-steps" ref={root} data-animate="false">
    <ol className="work-stack" aria-label={es ? 'Etapas de mi proceso de trabajo' : 'Stages of my working process'}>
      {steps.map((step, index) => {
        const Visual = workVisuals[index];
        return <li key={step.name} className="work-card" data-active="true" style={{ '--n': index } as React.CSSProperties}>
          <div className="work-card-copy">
            <div className="work-card-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
            <p className="work-card-name">{step.name}</p>
            <h3>{step.title}</h3>
            <p className="work-card-text">{step.text}</p>
            <p className="work-card-result"><span>{es ? 'Resultado' : 'Outcome'}</span>{step.result}</p>
          </div>
          <div className="work-visual" aria-hidden="true"><Visual es={es} /></div>
        </li>;
      })}
    </ol>
  </div>;
}
