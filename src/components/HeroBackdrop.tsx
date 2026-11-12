import { lazy, Suspense, useEffect, useRef, useState } from 'react';
const Topography = lazy(() => import('./reactbits/Topography'));

// Contour-map terrain behind the hero name. While the hero is on screen the
// shared Light Rays layer steps back (see [data-hero-view] in global.css).
export default function HeroBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ light: boolean; color: string; compact: boolean } | null>(null);
  useEffect(() => {
    const compact = matchMedia('(max-width: 767px)');
    const update = () => setState({
      light: document.documentElement.dataset.theme !== 'dark',
      color: getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#4ade80',
      compact: compact.matches,
    });
    const theme = new MutationObserver(update);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    compact.addEventListener('change', update);
    const view = new IntersectionObserver(entries => {
      document.documentElement.toggleAttribute('data-hero-view', entries.some(entry => entry.isIntersecting));
    });
    view.observe(root.current!);
    update();
    return () => {
      theme.disconnect(); view.disconnect(); compact.removeEventListener('change', update);
      document.documentElement.removeAttribute('data-hero-view');
    };
  }, []);
  return <div ref={root} className="hero-backdrop" data-background="topography" aria-hidden="true">
    {state ? <Suspense fallback={null}><Topography
      color={state.color} lightMode={state.light}
      lineCount={16} lineWidth={1} glow={.2} fog={.55} depthOfField={.5}
      opacity={.55} speed={.12} morph={.15}
      mouseStrength={.35} trail={.2} parallax={.3} clickEffect="none"
      dpr={state.compact ? 1 : 1.5}
    /></Suspense> : null}
  </div>;
}
