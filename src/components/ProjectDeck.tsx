// Projects: a wheel of names (after React Bits OptionWheel) drives a stack of
// cards (after React Bits CardSwap). The selected name sits in the middle of the
// wheel and its card is at the front of the stack, straight and sharp; the cards
// behind lean away. Left alone, the stack advances every few seconds: the front
// card drops and the next one steps forward and straightens. Names select; the
// front card and the links under it open the case page. Names are real links,
// so the list still works without JavaScript and with the keyboard.
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import type { Locale, Project } from '@/data/content';
import './ProjectDeck.css';

const INTERVAL = 4400;

export default function ProjectDeck({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const activeRef = useRef(0);
  const previous = useRef<number[]>([]);
  const es = locale === 'es';
  const count = projects.length;

  // The card that was in front drops away only when the stack advances by one.
  const show = (index: number) => {
    const before = activeRef.current;
    if (index === before) return;
    activeRef.current = index;
    setActive(index);
    setLeaving(index === (before + 1) % count ? before : null);
  };
  const showRef = useRef(show);
  showRef.current = show;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.hydrated = 'true';
    // Autoplay rests while someone points at the section, uses it with the
    // keyboard, has asked for less motion, or it is off screen.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let hovered = false;
    let visible = false;
    const enter = (event: PointerEvent) => { if (event.pointerType === 'mouse') hovered = true; };
    const leave = () => { hovered = false; };
    root.addEventListener('pointerenter', enter);
    root.addEventListener('pointerleave', leave);
    const view = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); }, { threshold: .35 });
    view.observe(root);
    const timer = window.setInterval(() => {
      if (hovered || !visible || reduced.matches || document.hidden || root.contains(document.activeElement)) return;
      showRef.current((activeRef.current + 1) % count);
    }, INTERVAL);
    return () => { window.clearInterval(timer); view.disconnect(); root.removeEventListener('pointerenter', enter); root.removeEventListener('pointerleave', leave); };
  }, [count]);

  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), 700);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  // A card behind comes to the front first; the front card is the link to its case page.
  const pick = (event: MouseEvent, index: number) => {
    if (index === activeRef.current) return;
    event.preventDefault();
    show(index);
  };
  // Names only select with the pointer (focus selects before the click arrives, so the
  // click must never count as "already selected"). Enter on a focused name still opens it.
  const choose = (event: MouseEvent, index: number) => {
    if (event.detail === 0) return;
    event.preventDefault();
    show(index);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    const move = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const next = (index + move + count) % count;
    show(next);
    rootRef.current?.querySelectorAll<HTMLAnchorElement>('.deck-option')[next]?.focus();
  };

  // Signed distance of every name from the selected one, going around the wheel.
  const distances = projects.map((_, index) => {
    let d = (index - active + count) % count;
    if (d > count / 2) d -= count;
    return d;
  });
  // A name that wraps from one end of the wheel to the other must not fly across it.
  const wrapped = distances.map((d, index) => previous.current[index] !== undefined && Math.abs(d - previous.current[index]) > 2);
  useEffect(() => { previous.current = distances; });

  return <div ref={rootRef} className="project-deck" data-project-index>
    <nav className="deck-wheel" aria-label={es ? 'Proyectos' : 'Projects'}>
      <ul>
        {projects.map((project, index) => <li key={project.slug}>
          <a
            className="deck-option"
            href={`/${locale}/projects/${project.slug}/`}
            data-project={project.slug}
            data-dist={Math.min(3, Math.abs(distances[index]))}
            data-wrap={wrapped[index] || undefined}
            aria-current={index === active ? 'true' : undefined}
            style={{ '--d': distances[index] } as CSSProperties}
            onClick={event => choose(event, index)}
            onFocus={() => show(index)}
            onKeyDown={event => onKeyDown(event, index)}
          >{project.slug === 'food-partners' ? 'Food Partners' : project.name}</a>
        </li>)}
      </ul>
    </nav>
    <div className="deck-side">
      <div className="swap-stage" aria-hidden="true">
        {projects.map((project, index) => {
          const position = (index - active + count) % count;
          const hostname = project.url ? new URL(project.url).hostname.replace(/^www\./, '') : project.name;
          return <a key={project.slug} className="swap-card" href={`/${locale}/projects/${project.slug}/`} tabIndex={-1} data-slug={project.slug} data-pos={position} data-leaving={leaving === index || undefined} style={{ '--pos': position } as CSSProperties} onClick={event => pick(event, index)}>
            <span className="swap-bar"><i/><i/><i/><span>{hostname}</span></span>
            <span className="swap-shot"><img src={`/projects/${project.slug}-1080.webp`} srcSet={[640, 768, 900, 1080, 1280].map(width => `/projects/${project.slug}-${width}.webp ${width}w`).concat(`/projects/${project.slug}.webp 1440w`).join(', ')} sizes="(max-width: 1023px) min(74vw, 400px), min(37vw, 560px)" alt="" width={1440} height={900} loading="lazy" decoding="async" draggable={false} style={{ viewTransitionName: `project-${project.slug}` }}/></span>
            {project.mobileImage && <span className="swap-phone"><img src={`/projects/${project.slug}-mobile-390.webp`} alt="" width={390} height={844} loading="lazy" decoding="async" draggable={false}/></span>}
          </a>;
        })}
      </div>
      <div className="deck-details">
        {projects.map((project, index) => <div key={project.slug} className="deck-detail" data-active={index === active} inert={index !== active}>
          <p className="deck-summary">{project.summary}</p>
          <p className="deck-links">
            <a className="deck-case" href={`/${locale}/projects/${project.slug}/`}>{es ? 'Ver caso' : 'View case'}<span className="sr-only">: {project.name}</span></a>
            {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{es ? 'Sitio web' : 'Website'}<span className="sr-only">: {project.name}</span></a>}
            {project.affiliation && <span className="deck-affiliation">{es ? 'En' : 'At'} <a href={`https://xenova.com.ar/${locale}`} target="_blank" rel="noopener noreferrer">{project.affiliation}</a></span>}
          </p>
        </div>)}
      </div>
    </div>
  </div>;
}
