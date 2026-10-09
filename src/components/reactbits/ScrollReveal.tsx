// React Bits Scroll Reveal, adapted to semantic markup, scoped cleanup and
// reduced motion. Opacity is animated without costly blur filters.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(ref.current!.querySelectorAll('.word'), { opacity: .45 }, {
        opacity: 1, stagger: .06, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 55%', scrub: true },
      });
    });
    return () => media.revert();
  }, []);
  return <p ref={ref} className="scroll-reveal-text text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"><span className="sr-only">{text}</span><span aria-hidden="true">{text.split(/(\s+)/).map((word, index) => /\s/.test(word) ? word : <span className="word inline-block" key={index}>{word}</span>)}</span></p>;
}
