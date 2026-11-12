// Five working stages as an editorial list: every row shows the stage name in
// large type and opens on hover, click, focus or the arrow keys to show its
// text, outcome and an animated glyph (WorkScene). The row interaction borrows
// from React Bits FlowingMenu. The list is also the server-rendered layout, so
// nothing jumps on hydration; without JavaScript (no data-js on the root) every
// row is open.
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Locale } from '../data/content';
import { workflow } from '../data/workflow';
import WorkScene from './WorkScene';

export default function WorkSteps({ locale }: { locale: Locale }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const es = locale === 'es';
  const steps = workflow[locale];

  useEffect(() => { root.current!.dataset.hydrated = 'true'; }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const move = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!move) return;
    event.preventDefault();
    const next = Math.min(steps.length - 1, Math.max(0, index + move));
    setActive(next);
    root.current?.querySelectorAll<HTMLButtonElement>('.work-panel-tab')[next]?.focus();
  };

  return <div className="work-steps" ref={root}>
    <ol className="work-panels" aria-label={es ? 'Etapas de mi proceso de trabajo' : 'Stages of my working process'}>
      {steps.map((step, index) => {
        const open = index === active;
        return <li key={step.name} className="work-panel" data-active={open} onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(index); }}>
          <h3 className="work-panel-head">
            <button type="button" className="work-panel-tab" aria-expanded={open} aria-controls={`work-panel-${index}`} onClick={() => setActive(index)} onFocus={() => setActive(index)} onKeyDown={event => onKeyDown(event, index)}>
              <span className="work-panel-name">{step.name}</span>
              <span className="work-panel-title">{step.title}</span>
              <span className="work-panel-icon" aria-hidden="true"/>
            </button>
          </h3>
          <div className="work-panel-body" id={`work-panel-${index}`}>
            <div className="work-panel-inner">
              <div className="work-panel-copy">
                <p className="work-panel-text">{step.text}</p>
                <p className="work-panel-result"><span>{es ? 'Resultado' : 'Outcome'}</span>{step.result}</p>
              </div>
              <div className="work-panel-visual" aria-hidden="true"><WorkScene step={index} active={open}/></div>
            </div>
          </div>
        </li>;
      })}
    </ol>
  </div>;
}
