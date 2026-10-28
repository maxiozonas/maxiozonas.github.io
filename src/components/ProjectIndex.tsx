import { useEffect, useRef, type PointerEvent } from 'react';
import type { Locale, Project } from '@/data/content';
import { projectSrcset } from '@/lib/project-images';
import ProjectOverview from './ProjectOverview';

export default function ProjectIndex({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const es = locale === 'es';

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.hydrated = 'true';
    const desktop = window.matchMedia('(min-width: 768px)');
    const ensureSelection = () => {
      if (desktop.matches && !root.querySelector('details[open]')) {
        const first = root.querySelector('details');
        if (first) first.open = true;
      }
    };
    desktop.addEventListener('change', ensureSelection);
    ensureSelection();
    return () => desktop.removeEventListener('change', ensureSelection);
  }, []);

  const select = (link: HTMLElement) => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      const details = link.parentElement?.querySelector('details');
      if (details) details.open = true;
    }
  };
  const hover = (event: PointerEvent<HTMLElement>) => {
    // Do not remove a panel while someone is using its links with the keyboard.
    if (event.pointerType !== 'mouse' || rootRef.current?.querySelector('.project-index-panel:focus-within')) return;
    select(event.currentTarget);
  };

  return <div ref={rootRef} className="project-index" data-project-index>
    {projects.map((project, index) => {
      const href = `/${locale}/projects/${project.slug}/`;
      const label = `project-choice-${project.slug}`;
      return <div className="project-index-entry" data-project={project.slug} key={project.slug}>
        <a id={label} className="project-index-choice-link" href={href} onPointerEnter={hover} onFocus={event => select(event.currentTarget)}>
          <span className="project-index-name">{project.slug === 'food-partners' ? 'Food Partners' : project.name}</span>
          <span className="project-index-type">{project.type}</span>
        </a>
        <details className="project-index-item" name={`projects-${locale}`} open={index === 0}>
          <summary className="project-index-disclosure" aria-label={`${es ? 'Vista previa' : 'Preview'}: ${project.name}`}>
            <span className="project-index-preview-label">{es ? 'Vista previa' : 'Preview'}</span>
            <span className="project-index-hide-label">{es ? 'Ocultar' : 'Hide'}</span>
          </summary>
          <div className="project-index-panel" role="region" aria-labelledby={label}>
            <a className="project-index-visual" href={href} aria-label={`${es ? 'Ver caso' : 'View case'}: ${project.name}`}>
              {project.overview ? <ProjectOverview overview={project.overview} transitionName={`project-${project.slug}`}/> : <picture>
                <source srcSet={projectSrcset(project.slug)} sizes="(max-width: 767px) 90vw, (max-width: 1440px) 48vw, 675px" type="image/webp"/>
                <img src={project.image} alt={project.imageAlt} width={1440} height={900} loading="lazy" decoding="async" style={{ viewTransitionName: `project-${project.slug}` }}/>
              </picture>}
            </a>
            <div className="project-index-caption">
              <p className="project-index-full-name" style={{ viewTransitionName: `title-${project.slug}` }}>{project.name}</p>
              <p className="project-index-summary">{project.summary}</p>
            </div>
            <div className="project-index-links">
              <a className="project-index-case" href={href}>{es ? 'Ver caso' : 'View case'}</a>
              {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{es ? 'Sitio web' : 'Website'}</a>}
              {project.affiliation && <span className="project-index-affiliation">{es ? 'En' : 'At'} <a href={`https://xenova.com.ar/${locale}`} target="_blank" rel="noopener noreferrer">{project.affiliation}</a></span>}
            </div>
          </div>
        </details>
      </div>;
    })}
  </div>;
}
