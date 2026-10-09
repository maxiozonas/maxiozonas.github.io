import { useEffect, useRef, type ReactNode } from 'react';

export function MapSurface({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current!;
    element.dataset.hydrated = 'true';
    let inView = false;
    const update = () => { element.dataset.moving = String(inView && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <div ref={ref} className={`map-surface ${className}`} data-moving="false">{children}</div>;
}
