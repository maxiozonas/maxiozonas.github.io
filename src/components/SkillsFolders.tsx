import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '../data/content';
import { technologyIcons } from '../data/technologies';
import type { TechnologyUse } from '../data/technology-usage';
import FolderFloat from './reactbits/FolderFloat';

interface Props { locale: Locale; groups: { title: string; items: string[] }[]; usage: Record<string, TechnologyUse[]>; }

const palettes = [
  { front: '#9fbee8', back: '#698ebc' },
  { front: '#beb0e1', back: '#8e7bba' },
  { front: '#ebb5a5', back: '#c48676' },
  { front: '#aad0bd', back: '#75a68e' },
  { front: '#e4cc97', back: '#bba06b' },
  { front: '#b9c4ce', back: '#8496a6' },
];
const subtitles = {
  es: ['Programación', 'Frameworks y APIs', 'Desarrollo móvil', 'SQL', 'Servidores y despliegues', 'Asistentes de código'],
  en: ['Programming', 'Frameworks and APIs', 'Mobile development', 'SQL', 'Servers and deployments', 'Coding assistants'],
};

function TechnologyMark({ name }: { name: string }) {
  const icon = technologyIcons[name];
  return <img src={`/technologies/${icon.slug}.svg`} className={icon.mono ? 'tech-icon-mono' : ''} width="32" height="32" alt="" loading="lazy"/>;
}

export default function SkillsFolders({ locale, groups, usage }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const groupName = useId();
  const [selected, setSelected] = useState<{ group: number; name: string } | null>(null);
  const es = locale === 'es';
  useEffect(() => { root.current!.dataset.hydrated = 'true'; }, []);

  return <div className="skills-folders" ref={root}>
    <div className="skills-folder-grid">
      {groups.map((group, index) => {
        // VPS is a hosting model; Linux already represents that environment.
        const technologies = group.items.filter(name => name !== 'VPS');
        const title = index === 3 ? (es ? 'Bases de datos' : 'Databases') : index === 5 ? (es ? 'Herramientas e IA' : 'Tools and AI') : group.title;
        const current = selected?.group === index ? selected.name : undefined;
        const works = current ? usage[current] ?? [] : [];
        return <FolderFloat
          key={group.title}
          label={title}
          sublabel={subtitles[locale][index]}
          groupName={groupName}
          frontColor={palettes[index].front}
          backColor={palettes[index].back}
          items={technologies.map(name => ({ id: name, label: name, content: <TechnologyMark name={name}/> }))}
          preview={technologies.slice(0, 2).map(name => <span key={name}><TechnologyMark name={name}/></span>)}
          selected={current}
          onSelect={name => setSelected({ group: index, name })}
          onClose={() => setSelected(previous => previous?.group === index ? null : previous)}
          detail={current ? <div className="folder-technology-info">
            <h3>{current}</h3>
            {works.length > 0 ? <><p>{es ? 'Lo usé en' : 'Used in'}</p><div className="folder-projects">{works.map(work => <a key={work.href} href={work.href}>{work.name}</a>)}</div></> : <p>{es ? 'Sin proyectos publicados en este portfolio.' : 'No projects listed in this portfolio.'}</p>}
          </div> : undefined}
        />;
      })}
    </div>
  </div>;
}
