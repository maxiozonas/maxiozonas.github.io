import type { Point } from '../components/maps/Connections';

// Position the families in cortical regions rather than around category hubs.
export const brainRegions: Point[][] = [
  [{ x: 435, y: 150 }, { x: 305, y: 125 }, { x: 270, y: 270 }, { x: 420, y: 290 }, { x: 170, y: 250 }, { x: 530, y: 310 }],
  [{ x: 690, y: 150 }, { x: 820, y: 120 }, { x: 740, y: 280 }, { x: 915, y: 255 }, { x: 1030, y: 250 }, { x: 930, y: 380 }],
  [{ x: 680, y: 435 }, { x: 830, y: 465 }, { x: 1020, y: 445 }],
  [{ x: 740, y: 640 }, { x: 920, y: 650 }],
  [{ x: 200, y: 550 }, { x: 350, y: 540 }, { x: 505, y: 560 }, { x: 400, y: 665 }, { x: 275, y: 665 }],
  [{ x: 175, y: 400 }, { x: 325, y: 410 }, { x: 480, y: 440 }],
];

// A denser front view keeps both hemispheres visible on narrow screens.
export const portraitRegions: Point[][] = [
  [{ x: 110, y: 100 }, { x: 240, y: 100 }, { x: 110, y: 200 }, { x: 240, y: 200 }, { x: 100, y: 300 }, { x: 235, y: 300 }],
  [{ x: 360, y: 100 }, { x: 490, y: 100 }, { x: 360, y: 200 }, { x: 490, y: 200 }, { x: 365, y: 300 }, { x: 500, y: 300 }],
  [{ x: 365, y: 400 }, { x: 500, y: 400 }, { x: 495, y: 500 }],
  [{ x: 470, y: 600 }, { x: 400, y: 690 }],
  [{ x: 235, y: 500 }, { x: 110, y: 600 }, { x: 235, y: 600 }, { x: 135, y: 690 }, { x: 235, y: 690 }],
  [{ x: 100, y: 400 }, { x: 235, y: 400 }, { x: 105, y: 500 }],
];

export const technologyRelationships = [
  ['TypeScript', 'React'], ['TypeScript', 'Next.js'], ['PHP', 'Laravel'], ['Python', 'FastAPI'],
  ['Java', 'Spring Boot'], ['C#', '.NET'], ['React', 'Next.js'], ['React', 'React Native'],
  ['React Native', 'Expo'], ['.NET', 'PostgreSQL'], ['Laravel', 'MySQL'],
  ['Docker Compose', 'Linux'], ['Git', 'CI/CD'],
];

export const hemisphere = 'M588 92 C549 42 491 42 453 77 C406 40 344 50 318 108 C261 83 215 118 204 171 C149 176 121 228 145 281 C97 299 82 360 115 404 C83 446 106 505 148 531 C126 584 164 643 218 654 C232 708 296 733 348 706 C396 754 459 736 482 690 C536 715 580 675 581 630 C563 592 604 559 578 509 C601 472 562 438 587 396 C563 350 605 308 581 266 C601 224 562 185 585 141 C579 124 594 110 588 92 Z';
export const corticalFolds = [
  'M318 108 C345 130 350 162 320 178 C280 190 278 223 294 247',
  'M453 77 C430 109 456 153 488 167 C517 182 490 216 466 225',
  'M145 281 C191 277 210 304 193 338 C172 374 205 390 240 370',
  'M115 404 C153 411 152 454 188 465 C219 477 239 447 268 470',
  'M218 654 C243 622 217 603 249 574 C277 555 304 580 327 557',
  'M348 706 C345 667 384 650 415 668 C446 679 463 647 457 621',
  'M520 362 C489 337 451 367 455 394 C460 424 418 443 401 418',
];

// A route must not pass through a third logo and imply a false relationship.
export function connectionRoute(from: Point, to: Point, nodes: Point[], clearance: number): { curve?: number; controls?: [Point, Point] } {
  const dx = to.x - from.x, dy = to.y - from.y;
  const obstruction = (first: Point, second: Point) => {
    let score = 0;
    for (const node of nodes) {
      if (node === from || node === to) continue;
      let distance = Infinity;
      for (let step = 1; step < 60; step++) {
        const t = step / 60, u = 1 - t;
        const x = u ** 3 * from.x + 3 * u * u * t * first.x + 3 * u * t * t * second.x + t ** 3 * to.x;
        const y = u ** 3 * from.y + 3 * u * u * t * first.y + 3 * u * t * t * second.y + t ** 3 * to.y;
        distance = Math.min(distance, Math.hypot(node.x - x, node.y - y));
      }
      score += Math.max(0, clearance - distance) ** 2;
    }
    return score;
  };
  let best: { curve?: number; controls?: [Point, Point] } = { curve: .035 }, bestScore = Infinity;
  for (const bend of [.035, -.035, .12, -.12, .22, -.22, .32, -.32, .42, -.42, .55, -.55, .7, -.7]) {
    const control = { x: (from.x + to.x) / 2 - dy * bend, y: (from.y + to.y) / 2 + dx * bend };
    const first = { x: from.x + (control.x - from.x) * 2 / 3, y: from.y + (control.y - from.y) * 2 / 3 };
    const second = { x: to.x + (control.x - to.x) * 2 / 3, y: to.y + (control.y - to.y) * 2 / 3 };
    const blocked = obstruction(first, second), score = blocked * 100 + Math.abs(bend);
    if (score < bestScore) { bestScore = score; best = { curve: bend }; }
    if (blocked === 0) return best;
  }
  // Independent tangents allow a gentle S around obstacles near either end.
  for (const start of [.12, -.12, .22, -.22, .32, -.32, .42, -.42]) {
    for (const end of [-start, .12, -.12, .22, -.22, .32, -.32, .42, -.42]) {
      const first = { x: from.x + dx / 3 - dy * start, y: from.y + dy / 3 + dx * start };
      const second = { x: to.x - dx / 3 - dy * end, y: to.y - dy / 3 + dx * end };
      const blocked = obstruction(first, second), score = blocked * 100 + Math.abs(start) + Math.abs(end);
      if (score < bestScore) { bestScore = score; best = { controls: [first, second] }; }
      if (blocked === 0) return best;
    }
  }
  return best;
}
