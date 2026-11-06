import type { ProjectOverviewContent } from '@/data/content';

// An application window for projects without a public capture: the real areas
// of the app, each with a small illustrative readout. Everything is CSS so the
// panel stays light and free of SVG.
const bars = [34, 52, 44, 70, 58, 38, 46, 62];

function Readout({ index }: { index: number }) {
  if (index % 3 === 0) return <span className="fw-trace" aria-hidden="true"><i /><i /><i /></span>;
  if (index % 3 === 1) return <span className="fw-temp" aria-hidden="true"><b>−18°C</b><span className="fw-bars">{bars.map((height, bar) => <i key={bar} className={bar === 5 ? 'fw-bar-hot' : ''} style={{ '--h': `${height}%` } as React.CSSProperties} />)}</span></span>;
  return <span className="fw-team" aria-hidden="true"><i /><i /><i /><em /></span>;
}

export default function ProjectOverviewWindow({ overview, title, transitionName }: {
  overview: ProjectOverviewContent;
  title: string;
  transitionName?: string;
}) {
  return <div className="project-overview food-window" style={transitionName ? { viewTransitionName: transitionName } : undefined}>
    <div className="project-browser-bar" aria-hidden="true"><span className="browser-dots"><i /><i /><i /></span><span>{title}</span></div>
    <div className="food-window-body">
      <p className="food-window-heading">{overview.heading}</p>
      <ul className="food-rows">
        {overview.areas.map((area, index) => <li key={area.title} className="food-row">
          <Readout index={index} />
          <div><p className="food-title">{area.title}</p><p className="food-desc">{area.description}</p></div>
        </li>)}
      </ul>
    </div>
  </div>;
}
