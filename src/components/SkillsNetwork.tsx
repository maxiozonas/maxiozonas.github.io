import { useId, useMemo, useState } from 'react';
import type { Locale } from '../data/content';
import { technologyIcons } from '../data/technologies';
import type { TechnologyUse } from '../data/technology-usage';
import AnimatedContent from './reactbits/AnimatedContent';
import { brainRegions, portraitRegions, technologyRelationships as relationships, hemisphere, corticalFolds, connectionRoute } from '../data/brain-network';
import { Connections, MapSurface, type Point, type Connection } from './maps/Connections';

interface Props { locale: Locale; groups: { title: string; items: string[] }[]; usage: Record<string, TechnologyUse[]>; }

export default function SkillsNetwork({ locale, groups, usage }: Props) {
  const es = locale === 'es';
  const [selected, setSelected] = useState<string | null>(null);
  const detailId = useId();
  const categories = groups.map((group, index) => ({ ...group, title: index === 5 ? (es ? 'Herramientas' : 'Tools') : group.title, id: `category-${index}`, items: group.items.filter(name => name !== 'VPS') }));
  const technologies = useMemo(() => categories.flatMap((group, groupIndex) => group.items.map((name, index) => {
    return { name, groupIndex, desktop: brainRegions[groupIndex][index], mobile: portraitRegions[groupIndex][index] };
  })), [groups]);
  const routes = useMemo(() => [false, true].map(mobile => {
    const points = technologies.map(node => mobile ? node.mobile : node.desktop);
    return new Map(technologies.flatMap((node, i) => technologies.slice(i + 1).filter(other => node.groupIndex === other.groupIndex || relationships.some(([a, b]) => (a === node.name && b === other.name) || (b === node.name && a === other.name))).map(other => {
      const ordered = node.name < other.name ? [node, other] : [other, node];
      const from = mobile ? ordered[0].mobile : ordered[0].desktop, to = mobile ? ordered[1].mobile : ordered[1].desktop;
      return [[node.name, other.name].sort().join(':'), connectionRoute(from, to, points, mobile ? 48 : 42)] as const;
    })));
  }), [technologies]);
  const selectedTech = technologies.find(technology => technology.name === selected);
  const selectedCategory = categories.find(category => category.id === selected);
  const selectedGroup = selectedTech?.groupIndex ?? categories.findIndex(category => category.id === selected);
  const neighbours = new Set(relationships.flatMap(([from, to]) => from === selected ? [to] : to === selected ? [from] : []));
  const isLit = (name: string, groupIndex: number) => selected === name || neighbours.has(name) || (selectedCategory && selectedGroup === groupIndex);
  const uses = selectedTech ? usage[selectedTech.name] ?? [] : [];

  const renderGraph = (mobile: boolean) => {
    const width = mobile ? 600 : 1200, height = 820;
    const position = (point: Point) => ({ left: `${point.x / width * 100}%`, top: `${point.y / height * 100}%` });
    const at = (name: string) => { const node = technologies.find(technology => technology.name === name)!; return mobile ? node.mobile : node.desktop; };
    const links: Connection[] = [];
    const pairs = new Set<string>();
    const addLink = (from: string, to: string, active: boolean, family = false) => {
      const ordered = [from, to].sort();
      const id = ordered.join(':');
      if (pairs.has(id)) return;
      pairs.add(id);
      links.push({ id, from: at(ordered[0]), to: at(ordered[1]), active, family, ...routes[mobile ? 1 : 0].get(id), junction: true });
    };
    // Explicit ecosystem relationships take priority over category membership.
    relationships.forEach(([from, to]) => addLink(from, to, selected === from || selected === to || (Boolean(selectedCategory) && technologies.filter(node => node.name === from || node.name === to).every(node => node.groupIndex === selectedGroup))));
    // A minimal local tree groups each family without pretending those edges
    // are dependencies, or sending every connection through a shared hub.
    categories.forEach((category, groupIndex) => {
      const visited = new Set([category.items[0]]);
      while (visited.size < category.items.length) {
        let closest: { from: string; to: string; distance: number } | null = null;
        for (const from of visited) for (const to of category.items) {
          if (visited.has(to)) continue;
          const a = at(from), b = at(to), distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (!closest || distance < closest.distance) closest = { from, to, distance };
        }
        if (!closest) break;
        addLink(closest.from, closest.to, Boolean(selectedCategory) && selectedGroup === groupIndex, true);
        visited.add(closest.to);
      }
    });
    return <div className={`network-graph network-graph-${mobile ? 'mobile' : 'desktop'}`} role="group" aria-label={es ? 'Red de tecnologías por categoría' : 'Technology network by category'}>
      <div className="network-categories">
        <button type="button" className="network-category" aria-pressed={selected === null} aria-controls={detailId} onClick={() => setSelected(null)}>{es ? 'Toda la red' : 'Whole network'}</button>
        {categories.map(group => <button type="button" key={group.id} className="network-category" aria-pressed={selected === group.id} aria-controls={detailId} data-lit={selectedGroup === categories.indexOf(group)} onFocus={() => setSelected(group.id)} onClick={() => setSelected(group.id)}>{group.title}</button>)}
      </div>
      <div className="network-stage">
      <svg className="brain-anatomy" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <g transform={mobile ? 'scale(.5 1)' : undefined}>
          {[false, true].map(mirror => <g key={String(mirror)} transform={mirror ? 'translate(1200 0) scale(-1 1)' : undefined}>
            <path className="brain-hemisphere" d={hemisphere}/>
            {corticalFolds.map(path => <path className="brain-fold" d={path} key={path}/>)}
          </g>)}
          <path className="brain-stem" d="M570 680 C557 727 542 758 562 794 Q600 811 638 794 C658 758 643 727 630 680"/>
        </g>
      </svg>
      <Connections links={links} width={width} height={height}/>
      {technologies.map(technology => {
        const icon = technologyIcons[technology.name];
        return <button type="button" key={technology.name} className="network-node" style={position(mobile ? technology.mobile : technology.desktop)} aria-label={technology.name} aria-controls={detailId} aria-pressed={selected === technology.name} data-lit={Boolean(isLit(technology.name, technology.groupIndex))} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(technology.name); }} onFocus={() => setSelected(technology.name)} onClick={() => setSelected(technology.name)}>
          <img src={`/technologies/${icon.slug}.svg`} className={icon.mono ? 'tech-icon-mono' : ''} width="36" height="36" alt="" loading="lazy"/><span className="network-node-name" aria-hidden="true">{technology.name}</span>
        </button>;
      })}
      </div>
    </div>;
  };

  return <AnimatedContent className="skills-network">
    <MapSurface>{renderGraph(false)}{renderGraph(true)}</MapSurface>
    <div className="network-context" id={detailId}>
      <div><h3>{selectedTech?.name ?? selectedCategory?.title ?? (es ? 'Tecnologías que se conectan.' : 'Technologies working together.')}</h3><p>{selectedTech ? categories[selectedTech.groupIndex].title : selectedCategory ? selectedCategory.items.join(' · ') : (es ? 'Líneas continuas: tecnologías relacionadas. Líneas punteadas: una misma familia.' : 'Solid lines: related technologies. Dotted lines: the same family.')}</p></div>
      {uses.length > 0 && <div className="network-work"><span>{es ? 'Lo usé en' : 'Used in'}</span><div>{uses.map(work => <a href={work.href} key={work.href}>{work.name}</a>)}</div></div>}
    </div>
  </AnimatedContent>;
}
