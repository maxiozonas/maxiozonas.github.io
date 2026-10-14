import { useEffect, useState, type ComponentType } from 'react';
import type { DotGridProps } from './DotGrid';

export default function HeroArtwork() {
  const [Field, setField] = useState<ComponentType<DotGridProps> | null>(null);
  const [color, setColor] = useState('');
  const [baseColor, setBaseColor] = useState('');

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const desktop = window.matchMedia('(min-width: 768px) and (hover: hover)');
    let disposed = false;
    const update = () => {
      const theme = getComputedStyle(document.documentElement);
      setColor(theme.getPropertyValue('--brand').trim());
      setBaseColor(theme.getPropertyValue('--hero-grid').trim());
      if (!motion.matches || !desktop.matches) {
        setField(null);
        return;
      }
      void import('./DotGrid').then(module => {
        if (!disposed && motion.matches && desktop.matches) setField(() => module.default);
      });
    };
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    motion.addEventListener('change', update);
    desktop.addEventListener('change', update);
    update();
    return () => {
      disposed = true;
      observer.disconnect();
      motion.removeEventListener('change', update);
      desktop.removeEventListener('change', update);
    };
  }, []);

  return <div className="hero-artwork" aria-hidden="true">
    <div className="hero-artwork-fallback"/>
    {Field && color && baseColor && <Field className="hero-dot-field" baseColor={baseColor} activeColor={color}
      dotSize={2} gap={26} proximity={180} strength={.6} bounce={.4} tension={.2}
      returnDuration={.9} swell={1.4} stretch={.2} glow={.3} fade={.25}
      clickShock={false} intro={true} dpr={1.5} />}
  </div>;
}
