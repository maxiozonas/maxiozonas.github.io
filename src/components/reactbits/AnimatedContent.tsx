// Adapted from React Bits AnimatedContent; see README.md and LICENSE.md.
import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const element = ref.current!;
      gsap.from(element, { y: 24, opacity: 0, duration: .7, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: element, start: 'top 93%', once: true } });
    });
    return () => media.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
