import { lazy, Suspense, useEffect, useState } from 'react';
import GhostFibers from './reactbits/GhostFibers';
const SplashCursor = lazy(() => import('./reactbits/SplashCursor'));
const backgroundColor = { r: 0, g: 0, b: 0 };
export default function Atmosphere() {
  const [dark, setDark] = useState(false);
  const [pointerEffect, setPointerEffect] = useState(false);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => { setDark(document.documentElement.dataset.theme === 'dark'); setPointerEffect(pointer.matches && !reduced.matches); };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    reduced.addEventListener('change', update); pointer.addEventListener('change', update); update();
    return () => { observer.disconnect(); reduced.removeEventListener('change', update); pointer.removeEventListener('change', update); };
  }, []);
  return <>
    {dark ? <div className="site-atmosphere" data-background="ghost-fibers" aria-hidden="true"><GhostFibers lineColor="#5f762e" glowColor="#dcff71" lightMode={false} brightness={.65} glowIntensity={.25} layers={3} lineSharpness={28} rotation={-25} speed={.18} rotationSpeed={.08} blueBoost={1} grain={.018} fps={30} dpr={1} paused={false}/></div> : null}
    {pointerEffect && dark ? <Suspense fallback={null}><SplashCursor RAINBOW_MODE={false} COLOR="#dcff71" BACK_COLOR={backgroundColor} SIM_RESOLUTION={96} DYE_RESOLUTION={768} PRESSURE_ITERATIONS={12} SPLAT_RADIUS={.2} SPLAT_FORCE={5000} DENSITY_DISSIPATION={3.5} SHADING={false}/></Suspense> : null}
  </>;
}
