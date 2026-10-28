import { lazy, Suspense, useEffect, useState } from 'react';
const LightRays = lazy(() => import('./reactbits/LightRays'));
const palettes = {
  light: '#014fff',
  dark: '#bedc83',
};
export default function Atmosphere() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
    const update = () => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
      setInteractive(pointer.matches && !reduced.matches);
    };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    reduced.addEventListener('change', update); pointer.addEventListener('change', update); update();
    return () => { observer.disconnect(); reduced.removeEventListener('change', update); pointer.removeEventListener('change', update); };
  }, []);
  return <div className="site-atmosphere" data-background="light-rays" aria-hidden="true">
    {interactive ? <Suspense fallback={null}><LightRays
      raysColor={palettes[theme]} lightMode={theme === 'light'}
      raysOrigin="top-right" tilt={28} lightSpread={.55} rayLength={1.4}
      rayDensity={1.4} raySharpness={.55} raysSpeed={.3}
      intensity={1.15} glow={.35} haze={.15} atmosphere={0}
      fadeDistance={1.8} mouseInfluence={.35} cursorShadow
      clickPulse={false} pulsating={false} intro={false}
      maxDevicePixelRatio={1} fps={30}
    /></Suspense> : null}
  </div>;
}
