// Animated glyphs for "How I work": one geometric idea per stage, no text.
// 0 scattered points fall into order · 1 a plan is drawn · 2 blocks fill the
// plan · 3 the piece travels to its target · 4 a cycle keeps turning.
// Coordinates are viewBox units (240 x 150); motion lives in WorkScene.css.
import type { CSSProperties, ReactNode } from 'react';
import './WorkScene.css';

const v = (vars: Record<string, number>) => Object.fromEntries(Object.entries(vars).map(([key, value]) => [`--${key}`, value])) as CSSProperties;

// Where each point starts before it is sorted into the 5 x 3 grid.
const scatter = [[18, 96], [204, 20], [96, 132], [150, 60], [30, 22], [222, 118], [120, 14], [66, 70], [186, 92], [44, 128], [132, 104], [84, 34], [210, 62], [14, 58], [164, 134]];

export default function WorkScene({ step, active }: { step: number; active: boolean }) {
  let scene: ReactNode = null;

  if (step === 0) {
    scene = scatter.map(([sx, sy], index) => {
      const column = index % 5;
      const row = Math.floor(index / 5);
      return <circle key={index} r="8" className={row === 0 ? 'wg-point wg-fill-brand' : 'wg-point wg-fill'} style={v({ i: index, sx, sy, gx: 48 + column * 36, gy: 39 + row * 36 })}/>;
    });
  }

  if (step === 1) {
    scene = <>
      {[30, 75, 120].map(y => [30, 75, 120, 165, 210].map(x => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" className="wg-grid"/>))}
      <path d="M12 30H228M12 120H228M40 8V142M200 8V142M104 8V142" pathLength={1} className="wg-guide wg-draw" style={v({ i: 0 })}/>
      <rect x="40" y="30" width="160" height="90" rx="10" pathLength={1} className="wg-line wg-draw" style={v({ i: 4 })}/>
      <path d="M104 30V120M104 75H200" pathLength={1} className="wg-line wg-draw" style={v({ i: 10 })}/>
      {[[40, 30], [200, 30], [40, 120], [200, 120], [104, 75]].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r="5" className={index === 4 ? 'wg-pop wg-fill-brand' : 'wg-pop wg-node'} style={v({ i: 14 + index })}/>)}
    </>;
  }

  if (step === 2) {
    scene = <>
      <rect x="40" y="30" width="160" height="90" rx="10" className="wg-guide wg-dash"/>
      <rect x="44" y="34" width="56" height="82" rx="7" className="wg-block wg-fill" style={v({ i: 0, dx: -40, dy: 0 })}/>
      <rect x="108" y="34" width="88" height="37" rx="7" className="wg-block wg-fill" style={v({ i: 4, dx: 0, dy: -34 })}/>
      <rect x="108" y="79" width="88" height="37" rx="7" className="wg-block wg-fill-brand" style={v({ i: 8, dx: 40, dy: 0 })}/>
      <g className="wg-pop" style={v({ i: 15 })}>
        <circle cx="200" cy="30" r="13" className="wg-badge"/>
        <path d="M194 30.5l4 4 8-9" className="wg-tick"/>
      </g>
    </>;
  }

  if (step === 3) {
    scene = <>
      <path d="M38 118C90 118 120 96 186 44" pathLength={1} className="wg-guide wg-dash wg-draw" style={v({ i: 0 })}/>
      {[30, 20, 10].map((r, index) => <circle key={r} cx="186" cy="44" r={r} className={index === 2 ? 'wg-fill-brand wg-pop' : 'wg-line wg-pop'} style={v({ i: 2 + index * 2 })}/>)}
      <circle cx="186" cy="44" r="30" className="wg-line wg-ping"/>
      <rect x="-13" y="-13" width="26" height="26" rx="7" className="wg-fill wg-travel"/>
    </>;
  }

  if (step === 4) {
    scene = <>
      <circle cx="120" cy="75" r="52" pathLength={1} className="wg-line wg-draw" style={v({ i: 0 })}/>
      <circle cx="120" cy="75" r="52" className="wg-line wg-pulse"/>
      <path d="M52 75H96l8-22 12 44 10-30 6 8h56" pathLength={1} className="wg-beat wg-draw" style={v({ i: 5 })}/>
      <g className="wg-orbit"><circle cx="120" cy="23" r="9" className="wg-fill-brand wg-pop" style={v({ i: 3 })}/></g>
    </>;
  }

  return <svg className={`wg${active ? ' on' : ''}`} viewBox="0 0 240 150" focusable="false">{scene}</svg>;
}
