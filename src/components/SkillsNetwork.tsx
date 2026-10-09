import { useId, useState } from 'react';
import type { Locale } from '../data/content';
import { technologyIcons } from '../data/technologies';
import type { TechnologyUse } from '../data/technology-usage';
import AnimatedContent from './reactbits/AnimatedContent';
import { Connections, MapSurface, type Point, type Connection } from './maps/Connections';

interface Props { locale: Locale; groups: { title: string; items: string[] }[]; usage: Record<string, TechnologyUse[]>; }
const centers: Point[] = [{ x: 205, y: 185 }, { x: 600, y: 150 }, { x: 995, y: 185 }, { x: 995, y: 535 }, { x: 600, y: 550 }, { x: 205, y: 535 }];
const mobileCenters = [165, 335, 500, 645, 810, 960].map(y => ({ x: 57, y }));
const relationships = [['TypeScript', 'React'], ['TypeScript', 'Next.js'], ['PHP', 'Laravel'], ['Python', 'FastAPI'], ['Java', 'Spring Boot'], ['C#', '.NET'], ['React', 'React Native'], ['React Native', 'Expo'], ['.NET', 'PostgreSQL'], ['Laravel', 'MySQL'], ['Docker Compose', 'Linux'], ['Git', 'CI/CD']];

export default function SkillsNetwork({ locale, groups, usage }: Props) {
  const es = locale === 'es';
  const [selected, setSelected] = useState<string | null>(null);
  const detailId = useId();
  const categories = groups.map((group, index) => ({ ...group, title: index === 5 ? (es ? 'Herramientas' : 'Tools') : group.title, id: `category-${index}`, items: group.items.filter(name => name !== 'VPS') }));
  const technologies = categories.flatMap((group, groupIndex) => group.items.map((name, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / group.items.length;
    const center = centers[groupIndex];
    return { name, groupIndex, desktop: { x: center.x + Math.cos(angle) * 100, y: center.y + Math.sin(angle) * 100 }, mobile: { x: 157 + index % 3 * 67, y: mobileCenters[groupIndex].y - (group.items.length > 3 ? 32 : 0) + Math.floor(index / 3) * 64 } };
  }));
  const selectedTech = technologies.find(technology => technology.name === selected);
  const selectedCategory = categories.find(category => category.id === selected);
  const selectedGroup = selectedTech?.groupIndex ?? categories.findIndex(category => category.id === selected);
  const neighbours = new Set(relationships.flatMap(([from, to]) => from === selected ? [to] : to === selected ? [from] : []));
  const isLit = (name: string, groupIndex: number) => selected === name || neighbours.has(name) || (selectedCategory && selectedGroup === groupIndex);
  const uses = selectedTech ? usage[selectedTech.name] ?? [] : [];

  const renderGraph = (mobile: boolean) => {
    const width = mobile ? 360 : 1200, height = mobile ? 1050 : 700;
    const root = mobile ? { x: 57, y: 45 } : { x: 600, y: 345 };
    const categoryPositions = mobile ? mobileCenters : centers;
    const position = (point: Point) => ({ left: `${point.x / width * 100}%`, top: `${point.y / height * 100}%` });
    const links: Connection[] = categories.map((group, index) => ({ id: group.id, from: root, to: categoryPositions[index], active: selectedGroup === index, curve: mobile ? 0 : .1 }));
    technologies.forEach(technology => links.push({ id: technology.name, from: categoryPositions[technology.groupIndex], to: mobile ? technology.mobile : technology.desktop, active: Boolean(isLit(technology.name, technology.groupIndex)), curve: mobile ? .08 : .15 }));
    if (!mobile) relationships.forEach(([from, to]) => {
      const start = technologies.find(technology => technology.name === from), end = technologies.find(technology => technology.name === to);
      if (start && end) links.push({ id: `${from}-${to}`, from: start.desktop, to: end.desktop, active: selected === from || selected === to, curve: .08 });
    });
    return <div className={`network-graph network-graph-${mobile ? 'mobile' : 'desktop'}`} role="group" aria-label={es ? 'Red de tecnologías por categoría' : 'Technology network by category'}>
      <Connections links={links} width={width} height={height}/>
      <button className="network-root" type="button" style={position(root)} onClick={() => setSelected(null)} aria-label={es ? 'Mostrar toda la red' : 'Show the whole network'}>Full<br/>Stack</button>
      {categories.map((group, index) => <button type="button" key={group.id} className="network-category" style={position(categoryPositions[index])} aria-pressed={selected === group.id} aria-controls={detailId} data-lit={selectedGroup === index} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(group.id); }} onFocus={() => setSelected(group.id)} onClick={() => setSelected(group.id)}>{group.title}</button>)}
      {technologies.map(technology => {
        const icon = technologyIcons[technology.name];
        return <button type="button" key={technology.name} className="network-node" style={position(mobile ? technology.mobile : technology.desktop)} aria-label={technology.name} aria-controls={detailId} aria-pressed={selected === technology.name} data-lit={Boolean(isLit(technology.name, technology.groupIndex))} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(technology.name); }} onFocus={() => setSelected(technology.name)} onClick={() => setSelected(technology.name)}>
          <img src={`/technologies/${icon.slug}.svg`} className={icon.mono ? 'tech-icon-mono' : ''} width="36" height="36" alt="" loading="lazy"/><span className="network-node-name" aria-hidden="true">{technology.name}</span>
        </button>;
      })}
    </div>;
  };

  return <AnimatedContent className="skills-network">
    <MapSurface>{renderGraph(false)}{renderGraph(true)}</MapSurface>
    <div className="network-context" id={detailId}>
      <div><h3>{selectedTech?.name ?? selectedCategory?.title ?? (es ? 'Tecnologías que se conectan.' : 'Technologies working together.')}</h3><p>{selectedTech ? categories[selectedTech.groupIndex].title : selectedCategory ? selectedCategory.items.join(' · ') : (es ? 'Explorá un logo o una categoría para ver sus conexiones.' : 'Explore a logo or category to see its connections.')}</p></div>
      {uses.length > 0 && <div className="network-work"><span>{es ? 'Lo usé en' : 'Used in'}</span><div>{uses.map(work => <a href={work.href} key={work.href}>{work.name}</a>)}</div></div>}
    </div>
  </AnimatedContent>;
}
