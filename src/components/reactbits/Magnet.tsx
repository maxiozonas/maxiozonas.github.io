// React Bits Magnet behavior, adapted to GSAP refs rather than React state on
// every pointer move, and restricted to its own hit area.
import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
export default function Magnet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      const wrapper = ref.current!, inner = wrapper.firstElementChild!;
      const xTo = gsap.quickTo(inner, 'x', { duration: .5, ease: 'power3.out' });
      const yTo = gsap.quickTo(inner, 'y', { duration: .5, ease: 'power3.out' });
      const move = (event: MouseEvent) => { const r = wrapper.getBoundingClientRect(); xTo((event.clientX - r.left - r.width / 2) / 9); yTo((event.clientY - r.top - r.height / 2) / 9); };
      const leave = () => { xTo(0); yTo(0); };
      wrapper.addEventListener('mousemove', move); wrapper.addEventListener('mouseleave', leave);
      return () => { wrapper.removeEventListener('mousemove', move); wrapper.removeEventListener('mouseleave', leave); xTo.tween.kill(); yTo.tween.kill(); };
    });
    return () => media.revert();
  }, []);
  return <div ref={ref} className="inline-block"><div>{children}</div></div>;
}
