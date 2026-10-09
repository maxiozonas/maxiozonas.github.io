import { useEffect, useRef, type ReactNode } from 'react';

export interface Point { x: number; y: number; }
export interface Connection { id: string; from: Point; to: Point; active: boolean; curve?: number; }

// These are relationships in a map, rather than directional arrows.
export function Connections({ links, width, height }: { links: Connection[]; width: number; height: number }) {
  return <svg className="map-connections" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
    {links.map(link => {
      const middle = { x: (link.from.x + link.to.x) / 2, y: (link.from.y + link.to.y) / 2 };
      const bend = link.curve ?? .12;
      const dx = link.to.x - link.from.x, dy = link.to.y - link.from.y;
      const path = `M${link.from.x},${link.from.y} Q${middle.x - dy * bend},${middle.y + dx * bend} ${link.to.x},${link.to.y}`;
      return <g key={link.id} data-active={link.active}><path className="map-link" d={path}/><path className="map-reach" d={path} pathLength="100" style={{ strokeDashoffset: link.active ? 0 : 100 }}/>{link.active && <path className="map-signal" d={path} pathLength="100"/>}</g>;
    })}
  </svg>;
}

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
