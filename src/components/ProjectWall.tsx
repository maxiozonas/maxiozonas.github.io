// A drifting wall of project captures, adapted from React Bits GridMotion
// (tilted rows moving in alternate directions). Hovering a capture brakes the
// wall, straightens that card and enlarges it with its name and a link to the
// case page. The wall is a pointer enhancement: it is hidden from assistive
// technology and the keyboard, which use the project names underneath; hovering
// or focusing a name opens the matching card. CSS only shows the wall on wide
// screens with a fine pointer and motion enabled.
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import type { Locale, Project } from '@/data/content';
import './ProjectWall.css';

const ORDER = [0, 3, 1, 4];
const PACE = [1, .82, 1.14, .9];
const COPIES = 3;
const SPEED = 26;
const ANGLE = -11;
const GROW = 1.5;
const wrap = (value: number, total: number) => ((value % total) + total) % total;

export default function ProjectWall({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const rootRef = useRef<HTMLDivElement>(null);
  type Open = { key: string; x: number; y: number; slot: DOMRect } | null;
  const [open, setOpenState] = useState<Open>(null);
  // The ref is written together with the state: pointer events can arrive in the same frame.
  const openRef = useRef<Open>(null);
  const setOpen = (next: Open) => { openRef.current = next; setOpenState(next); };

  // Open a card and nudge it so the enlarged, straightened card stays inside the wall.
  const openTile = (tile: HTMLElement) => {
    const stage = rootRef.current!.getBoundingClientRect();
    const rect = tile.getBoundingClientRect();
    const width = tile.offsetWidth * GROW;
    const height = tile.offsetHeight * GROW;
    const caption = (tile.querySelector<HTMLElement>('.wall-caption')?.offsetHeight ?? 0) * GROW;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));
    const dx = clamp(cx, stage.left + 48 + width / 2, stage.right - 48 - width / 2) - cx;
    const dy = clamp(cy, stage.top + 64 + height / 2, stage.bottom - 64 - height / 2 - caption) - cy;
    // The plane is rotated, so a screen offset has to be turned back into its axes.
    const turn = -ANGLE * Math.PI / 180;
    setOpen({ key: tile.dataset.key!, x: dx * Math.cos(turn) - dy * Math.sin(turn), y: dx * Math.sin(turn) + dy * Math.cos(turn), slot: rect });
  };
  // The open card may have been nudged away from the pointer, so it stays open
  // while the pointer is over the card or over the place it came from.
  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const within = (box: DOMRect | undefined) => !!box && event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (openRef.current) {
      if (within(openRef.current.slot) || within(rootRef.current?.querySelector('.wall-tile[data-open]')?.getBoundingClientRect())) return;
      setOpen(null);
    }
    const tile = (event.target as HTMLElement).closest<HTMLElement>('.wall-tile');
    if (tile) openTile(tile);
  };
  const openTileRef = useRef(openTile);
  openTileRef.current = openTile;
  const closeRef = useRef(() => setOpen(null));
  closeRef.current = () => setOpen(null);
  const es = locale === 'es';

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.dataset.hydrated = 'true';
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.wall-row'));
    const offsets = rows.map((_, index) => index * 137);
    let period = 0;
    let pace = 1;
    let raf = 0;
    let last = performance.now();
    let visible = false;

    const measure = () => {
      const tile = root.querySelector<HTMLElement>('.wall-tile');
      if (!tile || !tile.offsetWidth) { period = 0; return; }
      period = (tile.offsetWidth + (parseFloat(getComputedStyle(rows[0]).columnGap) || 0)) * projects.length;
    };
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(.05, Math.max(.001, (now - last) / 1000));
      last = now;
      // Brake smoothly while a card is open, and pick the speed back up afterwards.
      pace += ((openRef.current ? 0 : 1) - pace) * (1 - Math.exp(-dt / .22));
      if (period) rows.forEach((row, index) => {
        offsets[index] += SPEED * PACE[index % PACE.length] * (index % 2 ? 1 : -1) * pace * dt;
        row.style.transform = `translate3d(${(wrap(offsets[index], period) - period).toFixed(2)}px, 0, 0)`;
      });
      if (visible) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const resize = new ResizeObserver(() => { measure(); start(); });
    resize.observe(root);
    const view = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting) && root.offsetWidth > 0; start(); });
    view.observe(root);
    measure();

    // A project name underneath opens the card of that project nearest to the centre.
    const section = root.closest('section');
    const slugOf = (target: EventTarget | null) => (target as HTMLElement | null)?.closest?.('.project-index-choice-link')?.closest<HTMLElement>('[data-project]')?.dataset.project;
    const openNearest = (event: Event) => {
      const slug = slugOf(event.target);
      if (!slug || !root.offsetWidth) return;
      const box = root.getBoundingClientRect();
      let best: HTMLElement | null = null;
      let distance = Infinity;
      root.querySelectorAll<HTMLElement>(`.wall-tile[data-slug="${slug}"]`).forEach(tile => {
        const rect = tile.getBoundingClientRect();
        const d = Math.hypot(rect.left + rect.width / 2 - box.left - box.width / 2, rect.top + rect.height / 2 - box.top - box.height / 2);
        if (d < distance) { distance = d; best = tile; }
      });
      if (best) openTileRef.current(best);
    };
    const close = (event: Event) => { if (slugOf(event.target)) closeRef.current(); };
    section?.addEventListener('pointerover', openNearest);
    section?.addEventListener('focusin', openNearest);
    section?.addEventListener('pointerout', close);
    section?.addEventListener('focusout', close);
    return () => {
      cancelAnimationFrame(raf); resize.disconnect(); view.disconnect();
      section?.removeEventListener('pointerover', openNearest);
      section?.removeEventListener('focusin', openNearest);
      section?.removeEventListener('pointerout', close);
      section?.removeEventListener('focusout', close);
    };
  }, [projects.length]);

  return <div ref={rootRef} className="wall" data-open={open ? 'true' : undefined} aria-hidden="true" onPointerMove={track} onPointerLeave={() => setOpen(null)} style={{ '--wall-angle': `${ANGLE}deg`, '--wall-grow': GROW } as CSSProperties}>
    <div className="wall-plane">
      {ORDER.map((shift, row) => <div className="wall-row" key={row}>
        {Array.from({ length: COPIES * projects.length }, (_, index) => {
          const project = projects[(index + shift) % projects.length];
          const key = `${row}-${index}`;
          const isOpen = open?.key === key;
          return <a
            key={key}
            className="wall-tile"
            href={`/${locale}/projects/${project.slug}/`}
            tabIndex={-1}
            data-key={key}
            data-slug={project.slug}
            data-open={isOpen ? 'true' : undefined}
            style={isOpen ? { '--wall-x': `${open.x.toFixed(1)}px`, '--wall-y': `${open.y.toFixed(1)}px` } as CSSProperties : undefined}
          >
            <span className="wall-shot" style={isOpen ? { viewTransitionName: `project-${project.slug}` } : undefined}>
              <img src={`/projects/${project.slug}-768.webp`} alt="" width={768} height={480} loading="lazy" decoding="async" draggable={false}/>
            </span>
            <span className="wall-caption">
              <strong>{project.name}</strong>
              <span>{project.type}</span>
              <span className="wall-cta">{es ? 'Ver caso' : 'View case'}</span>
            </span>
          </a>;
        })}
      </div>)}
    </div>
  </div>;
}
