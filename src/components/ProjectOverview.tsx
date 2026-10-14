import type { ProjectOverviewContent } from '@/data/content';

export default function ProjectOverview({ overview, transitionName }: {
  overview: ProjectOverviewContent;
  transitionName?: string;
}) {
  return <div className="project-overview" style={transitionName ? { viewTransitionName: transitionName } : undefined}>
    <p className="project-overview-heading">{overview.heading}</p>
    <dl className="project-overview-areas">
      {overview.areas.map(area => <div key={area.title}><dt>{area.title}</dt><dd>{area.description}</dd></div>)}
    </dl>
  </div>;
}
