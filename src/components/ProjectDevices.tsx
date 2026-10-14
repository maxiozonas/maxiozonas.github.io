import type { Locale, Project } from '@/data/content';
import { projectSrcset } from '@/lib/project-images';
import { cn } from '@/lib/utils';

export default function ProjectDevices({ project, locale, variant = 'detail', wide = false, shared = false, priority = false }: {
  project: Project;
  locale: Locale;
  variant?: 'card' | 'detail';
  wide?: boolean;
  shared?: boolean;
  priority?: boolean;
}) {
  const es = locale === 'es';
  const hostname = project.url ? new URL(project.url).hostname.replace(/^www\./, '') : project.name;
  const desktopSizes = variant === 'detail' ? '(min-width: 1440px) 1000px, 80vw'
    : wide ? '(max-width: 767px) 68vw, (max-width: 1199px) 65vw, 700px'
    : '(max-width: 767px) 68vw, 470px';
  return <div className={cn('project-devices', variant === 'card' ? 'project-devices--card' : 'project-devices--detail')}>
    <figure className="project-desktop">
      <div className="project-browser">
        <div className="project-browser-bar" aria-hidden="true"><span className="browser-dots"><i/><i/><i/></span><span>{hostname}</span></div>
        <div className="project-screen">
          <picture>
            <source srcSet={projectSrcset(project.slug)} sizes={desktopSizes} type="image/webp"/>
            <img className="project-card-image project-device-image" src={project.image} alt={`${es ? 'Vista de escritorio' : 'Desktop view'}: ${project.imageAlt}`}
              width={1440} height={900} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
              style={shared ? { viewTransitionName: `project-${project.slug}` } : undefined}/>
          </picture>
        </div>
      </div>
      <figcaption className="device-caption">{es ? 'Escritorio' : 'Desktop'}</figcaption>
    </figure>
    {project.mobileImage && <figure className="project-phone">
      <div className="project-phone-frame">
        <span className="phone-camera" aria-hidden="true"/>
        <div className="project-screen">
          <picture>
            <source srcSet={`/projects/${project.slug}-mobile-390.webp 390w, ${project.mobileImage} 780w`} sizes={variant === 'card' ? (wide ? '175px' : '125px') : '(max-width: 767px) 240px, 230px'} type="image/webp"/>
            <img className="project-mobile-image project-device-image" src={project.mobileImage} alt={`${es ? 'Vista móvil' : 'Mobile view'}: ${project.name}`}
              width={390} height={844} loading={priority ? 'eager' : 'lazy'} decoding="async"/>
          </picture>
        </div>
      </div>
      <figcaption className="device-caption">{es ? 'Móvil' : 'Mobile'}</figcaption>
    </figure>}
  </div>;
}
