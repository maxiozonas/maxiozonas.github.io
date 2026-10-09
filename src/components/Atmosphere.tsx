import { lazy, Suspense, useEffect, useState } from 'react';
import GhostFibers from './reactbits/GhostFibers';
const SplashCursor = lazy(() => import('./reactbits/SplashCursor'));
const backgroundColor = { r: 0, g: 0, b: 0 };
export default function Atmosphere({ locale }: { locale: 'es' | 'en' }) {
  const [dark, setDark] = useState(true);
  const [pointerEffect, setPointerEffect] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => { setDark(document.documentElement.dataset.theme === 'dark'); setPointerEffect(pointer.matches && !reduced.matches); };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    reduced.addEventListener('change', update); pointer.addEventListener('change', update); update();
    return () => { observer.disconnect(); reduced.removeEventListener('change', update); pointer.removeEventListener('change', update); };
  }, []);
  const es = locale === 'es';
  return <>
    <div className="site-atmosphere" data-background="ghost-fibers" aria-hidden="true"><GhostFibers lineColor={dark ? '#5f762e' : '#829348'} glowColor="#dcff71" lightMode={!dark} brightness={.65} glowIntensity={.25} layers={3} lineSharpness={28} rotation={-25} speed={.18} rotationSpeed={.08} blueBoost={1} grain={.018} fps={30} dpr={1} paused={paused}/></div>
    {pointerEffect && !paused ? <Suspense fallback={null}><SplashCursor RAINBOW_MODE={false} COLOR="#dcff71" BACK_COLOR={backgroundColor} SIM_RESOLUTION={96} DYE_RESOLUTION={768} PRESSURE_ITERATIONS={12} SPLAT_RADIUS={.2} SPLAT_FORCE={5000} DENSITY_DISSIPATION={3.5} SHADING={false}/></Suspense> : null}
    <button className="ambient-toggle" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? (es ? 'Reanudar efectos visuales' : 'Resume visual effects') : (es ? 'Pausar efectos visuales' : 'Pause visual effects')}>{paused ? (es ? 'Activar efectos' : 'Enable effects') : (es ? 'Pausar efectos' : 'Pause effects')}</button>
  </>;
}
