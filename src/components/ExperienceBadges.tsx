// Current roles as two staff badges hanging side by side: both jobs are active
// at once, and two badges say so without a timeline. Each badge is a tab; the
// selected one hangs lower and its role is described beside it. Badges sway a
// little and lean towards the pointer. Without JavaScript (no data-js on the
// root) both roles are listed in full.
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import type { Job, Locale } from '../data/content';
import { technologyIcons } from '../data/technologies';
import './ExperienceBadges.css';

interface Related { name: string; slug: string; }
interface Props { locale: Locale; jobs: Job[]; holder: string; related: Record<string, Related[]>; integrations: Record<string, string[]>; }

export default function ExperienceBadges({ locale, jobs, holder, related, integrations }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(jobs[0].id);
  const es = locale === 'es';

  useEffect(() => {
    const el = root.current!;
    el.dataset.hydrated = 'true';
    // Links elsewhere on the page point at a role (#experience-xenova): select it, then scroll.
    const follow = (scroll: boolean) => {
      const id = location.hash.replace('#experience-', '');
      if (!location.hash.startsWith('#experience-') || !jobs.some(job => job.id === id)) return;
      setActive(id);
      if (scroll) requestAnimationFrame(() => el.scrollIntoView({ block: 'center' }));
    };
    const onHash = () => follow(true);
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest?.('a[href^="#experience-"]');
      if (link) requestAnimationFrame(() => follow(true));
    };
    follow(false);
    window.addEventListener('hashchange', onHash);
    document.addEventListener('click', onClick);
    return () => { window.removeEventListener('hashchange', onHash); document.removeEventListener('click', onClick); };
  }, [jobs]);

  const lean = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--lean-x', ((event.clientX - box.left) / box.width * 2 - 1).toFixed(3));
    event.currentTarget.style.setProperty('--lean-y', ((event.clientY - box.top) / box.height * 2 - 1).toFixed(3));
  };
  const settle = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.removeProperty('--lean-x');
    event.currentTarget.style.removeProperty('--lean-y');
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const move = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const next = jobs[(index + move + jobs.length) % jobs.length];
    setActive(next.id);
    root.current?.querySelector<HTMLButtonElement>(`#company-${next.id}`)?.focus();
  };

  return <div className="badges page-shell" ref={root}>
    <div className="badge-rack" role="tablist" aria-label={es ? 'Roles actuales' : 'Current roles'}>
      {jobs.map((job, index) => <button
        key={job.id}
        type="button"
        role="tab"
        id={`company-${job.id}`}
        className="badge"
        data-company={job.id}
        aria-selected={job.id === active}
        aria-controls={`experience-${job.id}`}
        tabIndex={job.id === active ? 0 : -1}
        style={{ '--n': index } as CSSProperties}
        onClick={() => setActive(job.id)}
        onFocus={() => setActive(job.id)}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(job.id); }}
        onPointerMove={lean}
        onPointerLeave={settle}
        onKeyDown={event => onKeyDown(event, index)}
      >
        <span className="badge-swing">
        <span className="badge-strap" aria-hidden="true"/>
        <span className="badge-clip" aria-hidden="true"/>
        <span className="badge-card">
          <span className="badge-slot" aria-hidden="true"/>
          <span className={`badge-logo badge-logo-${job.id}`}>
            <span className="sr-only">{job.company}</span>
            {job.logo && <img src={job.logo.src} alt="" width={job.logo.width} height={job.logo.height} loading="lazy" decoding="async" draggable={false}/>}
          </span>
          <span className="badge-holder">{holder}</span>
          <span className="badge-role chapter-role">{job.role}</span>
          <span className="badge-foot"><span className="badge-status">{es ? 'Activo' : 'Active'}</span><span className="badge-period">{job.period}</span></span>
        </span>
        </span>
      </button>)}
    </div>
    <div className="badge-details">
      {jobs.map(job => <article key={job.id} className="experience-chapter" id={`experience-${job.id}`} role="tabpanel" aria-labelledby={`company-${job.id}`} data-company={job.id} data-active={job.id === active}>
        <p className="chapter-kicker">{job.company} · {job.role}</p>
        <h3 className="job-summary">{job.summary}</h3>
        <p className="job-description">{job.description}</p>
        <dl className="job-scope">{job.scope.map(area => <div key={area.title}><dt>{area.title}</dt><dd>{area.description}</dd></div>)}</dl>
        {related[job.id]?.length > 0 && <div className="chapter-related">
          <p>{es ? 'Proyectos de este rol' : 'Projects in this role'}</p>
          <ul>{related[job.id].map(project => <li key={project.slug}><a href={`/${locale}/projects/${project.slug}/`}>
            <img src={`/projects/${project.slug}-480.webp`} alt="" width={480} height={300} loading="lazy" decoding="async"/><span>{project.name}</span>
          </a></li>)}</ul>
        </div>}
        {integrations[job.id]?.length > 0 && <div className="chapter-related">
          <p>{es ? 'Sistemas integrados' : 'Integrated systems'}</p>
          <ul>{integrations[job.id].map(system => <li key={system} className="chapter-system">{system}</li>)}</ul>
        </div>}
        <div className="chapter-foot">
          <ul className="chapter-technologies" aria-label={es ? 'Tecnologías' : 'Technologies'}>{job.capabilities.map(skill => {
            const icon = technologyIcons[skill];
            return <li key={skill} className="tech-label">{icon && <img className={icon.mono ? 'tech-icon tech-icon-mono' : 'tech-icon'} src={`/technologies/${icon.slug}.svg`} width={24} height={24} alt="" loading="lazy" decoding="async"/>}<span>{skill}</span></li>;
          })}</ul>
          {job.url && <a className="chapter-company-link" href={job.url} target="_blank" rel="noopener noreferrer">{new URL(job.url).hostname.replace(/^www\./, '')}</a>}
        </div>
      </article>)}
    </div>
  </div>;
}
