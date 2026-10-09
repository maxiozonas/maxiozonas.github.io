import { useId, useState } from 'react';
import type { Locale } from '../data/content';
import { workflow } from '../data/workflow';
import AnimatedContent from './reactbits/AnimatedContent';
import { MapSurface } from './maps/Connections';

const point = (radius: number, degrees: number) => {
  const angle = degrees * Math.PI / 180;
  return { x: 250 + radius * Math.cos(angle), y: 250 + radius * Math.sin(angle) };
};
const sector = (angle: number) => {
  const a = point(234, angle - 33.5), b = point(234, angle + 33.5);
  const c = point(143, angle + 33.5), d = point(143, angle - 33.5);
  return `M ${a.x} ${a.y} A 234 234 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A 143 143 0 0 0 ${d.x} ${d.y} Z`;
};

export default function WorkMap({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const steps = workflow[locale];
  const detailId = useId();
  const active = steps[selected];

  return <AnimatedContent className="work-map">
    <MapSurface className="work-wheel">
      <svg viewBox="0 0 500 500" className="work-wheel-sectors" aria-hidden="true">
        {steps.map((step, index) => <path key={step.name} d={sector(-90 + index * 72)} data-active={selected === index} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(index); }} onClick={() => setSelected(index)}/>)}
      </svg>
      <div className="work-wheel-center"><span>{locale === 'es' ? 'El punto de partida' : 'The starting point'}</span><p>{locale === 'es' ? <>Un problema<br/><strong>real.</strong></> : <>A real<br/><strong>problem.</strong></>}</p></div>
      <div role="group" aria-label={locale === 'es' ? 'Explorar mi proceso de trabajo' : 'Explore my working process'}>
        {steps.map((step, index) => {
          const location = point(190, -90 + index * 72);
          return <button type="button" className="work-wheel-step" key={step.name} style={{ left: `${location.x / 5}%`, top: `${location.y / 5}%` }} aria-pressed={selected === index} aria-controls={detailId} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelected(index); }} onFocus={() => setSelected(index)} onClick={() => setSelected(index)}>{step.name}</button>;
        })}
      </div>
    </MapSurface>
    <div className="work-map-detail" id={detailId}><h3>{active.title}</h3><p>{active.text}</p><span>{active.result}</span></div>
  </AnimatedContent>;
}
