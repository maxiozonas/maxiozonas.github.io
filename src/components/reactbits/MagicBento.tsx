// Adapted from React Bits Magic Bento (MIT + Commons Clause; see LICENSE.md).
// Real project content replaces demo
// cards; spotlight is scoped to the grid, with reversible GSAP effects.
import { useEffect, useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { Badge } from '@/components/ui/badge';
import type { Project, Locale } from '@/data/content';
import { projectSrcset } from '@/lib/project-images';
import { cn } from '@/lib/utils';

function updateCardGlowProperties(card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mouseX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((mouseY - rect.top) / rect.height) * 100}%`);
  card.style.setProperty('--glow-intensity', String(glow));
  card.style.setProperty('--glow-radius', `${radius}px`);
}

export default function MagicBento({ projects, locale, enableTilt = true, spotlightRadius = 400, glowColor }: {
  projects: Project[]; locale: Locale; enableTilt?: boolean; spotlightRadius?: number; glowColor?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('.magic-bento-card'));
      const controllers = cards.map(card => ({
        card,
        rx: gsap.quickTo(card, 'rotationX', { duration: .45, ease: 'power3.out' }),
        ry: gsap.quickTo(card, 'rotationY', { duration: .45, ease: 'power3.out' }),
      }));
      gsap.set(cards, { transformPerspective: 1600 });
      const move = (event: MouseEvent) => {
        controllers.forEach(({ card, rx, ry }) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left, y = event.clientY - rect.top;
          const distance = Math.max(0, Math.hypot(x - rect.width / 2, y - rect.height / 2) - Math.max(rect.width, rect.height) / 2);
          const glow = Math.max(0, 1 - distance / (spotlightRadius * .75));
          updateCardGlowProperties(card, event.clientX, event.clientY, glow, spotlightRadius);
          const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
          if (enableTilt) { rx(inside ? (y / rect.height - .5) * -5 : 0); ry(inside ? (x / rect.width - .5) * 5 : 0); }
        });
      };
      const leave = () => controllers.forEach(({ card, rx, ry }) => { card.style.setProperty('--glow-intensity', '0'); rx(0); ry(0); });
      grid.addEventListener('mousemove', move);
      grid.addEventListener('mouseleave', leave);
      return () => {
        grid.removeEventListener('mousemove', move); grid.removeEventListener('mouseleave', leave);
        controllers.forEach(({ card, rx, ry }) => { rx.tween.kill(); ry.tween.kill(); card.style.setProperty('--glow-intensity', '0'); });
      };
    });
    return () => media.revert();
  }, [enableTilt, spotlightRadius]);

  return <div ref={gridRef} className="bento-section grid grid-cols-1 grid-flow-dense gap-4 md:grid-cols-12 md:gap-5" style={glowColor ? { '--glow-color': glowColor } as CSSProperties : undefined}>
    {projects.map((project, index) => <article key={project.slug} className={cn('project-card magic-bento-card group relative overflow-hidden rounded-3xl bg-card text-card-foreground', index === 0 || index === 3 ? 'md:col-span-7' : 'md:col-span-5')}>
      <div className="relative flex items-center justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <p className="text-sm text-muted-foreground">{project.type}</p>
        <a className="project-visit inline-flex min-h-11 shrink-0 items-center justify-center text-xs font-bold" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`${locale === 'es' ? 'Visitar sitio' : 'Visit website'}: ${project.name}`}>{locale === 'es' ? 'Sitio web' : 'Website'}</a>
      </div>
      <div className="relative px-6 pb-6 pt-2 md:px-8 md:pb-8">
        <a href={`/${locale}/projects/${project.slug}/`} className="project-title-link inline-block"><h3 className="text-3xl font-bold tracking-tight lg:text-4xl" style={{ viewTransitionName: `title-${project.slug}` }}>{project.name}</h3></a>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{project.summary}</p>
      </div>
      <a className="project-image-link relative mx-6 block overflow-hidden rounded-t-xl md:mx-8" href={`/${locale}/projects/${project.slug}/`} aria-label={`${locale === 'es' ? 'Ver proyecto' : 'View project'}: ${project.name}`}>
        <picture><source srcSet={projectSrcset(project.slug)} sizes="(max-width: 767px) 85vw, (min-width: 1440px) 700px, 55vw" type="image/webp" /><img className="project-card-image w-full transition-transform duration-700 group-hover:scale-[1.035]" src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" width={1440} height={1080} style={{ viewTransitionName: `project-${project.slug}` }} /></picture>
      </a>
      <div className="relative flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-8">
        <div className="flex flex-wrap gap-2">{project.stack.slice(0, 2).map(tech => <Badge variant="secondary" key={tech}>{tech}</Badge>)}</div>
        <a className="project-detail-link flex min-h-11 items-center gap-2 text-sm font-bold" href={`/${locale}/projects/${project.slug}/`}>{locale === 'es' ? 'Ver caso' : 'View case'}</a>
      </div>
    </article>)}
  </div>;
}
