import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { IconMenu2, IconMoon, IconSun } from '@tabler/icons-react';
import { Button } from './ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import type { Locale } from '@/data/content';
interface Props { locale: Locale; detail?: boolean; alternatePath: string; projects: { name: string; slug: string; type: string }[]; }
export default function PortfolioNav({ locale, detail = false, alternatePath, projects }: Props) {
  const es = locale === 'es';
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const home = detail ? `/${locale}/` : '';
  // Circular fill choreography adapted from React Bits Pill Nav. shadcn owns
  // keyboard navigation, popup behavior and the mobile focus trap.
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cleanups = Array.from(navRef.current!.querySelectorAll<HTMLElement>('[data-pill]')).map(link => {
        const animation = gsap.fromTo(link.querySelector('.pill-circle'), { scale: 0 }, { scale: 1, duration: .45, ease: 'power3.out', paused: true });
        const enter = () => animation.play(); const leave = () => animation.reverse();
        link.addEventListener('mouseenter', enter); link.addEventListener('mouseleave', leave); link.addEventListener('focus', enter); link.addEventListener('blur', leave);
        return () => { link.removeEventListener('mouseenter', enter); link.removeEventListener('mouseleave', leave); link.removeEventListener('focus', enter); link.removeEventListener('blur', leave); animation.kill(); };
      });
      return () => cleanups.forEach(fn => fn());
    });
    return () => media.revert();
  }, []);
  const toggleTheme = () => {
    const root = document.documentElement;
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch {}
  };
  const pill = (label: string) => <><span className="pill-circle" aria-hidden="true"/><span className="relative">{label}</span></>;
  return <div ref={navRef} className="nav-shell mx-auto flex items-center justify-between gap-3 rounded-full bg-card/95 p-2 shadow-lg shadow-background/30 backdrop-blur-xl">
    <a href={`/${locale}/`} className="brand-capsule flex items-center gap-3 pr-2" aria-label={`mo. Máximo Ozonas Full Stack Developer, ${es ? 'inicio' : 'home'}`}><span className="brand-monogram flex size-11 items-center justify-center rounded-full bg-primary text-lg font-bold tracking-tighter text-primary-foreground"><img src="/brand/mo-monogram.png" alt="" width="34" height="18"/></span><span className="brand-name text-sm font-bold"><span className="brand-full">Máximo Ozonas</span><span className="brand-short">Máximo</span><span className="brand-role block text-xs font-normal text-muted-foreground">Full Stack Developer</span></span></a>
    <div className="hidden md:block"><NavigationMenu aria-label={es ? 'Navegación principal' : 'Main navigation'}><NavigationMenuList>
      <NavigationMenuItem><NavigationMenuLink className="nav-pill" href={`${home}#experience`} data-pill>{pill(es ? 'Experiencia' : 'Experience')}</NavigationMenuLink></NavigationMenuItem>
      <NavigationMenuItem><NavigationMenuTrigger className="nav-pill" data-pill>{pill(es ? 'Proyectos' : 'Projects')}</NavigationMenuTrigger><NavigationMenuContent>
        <ul className="grid w-[480px] grid-cols-2 gap-2 p-3">
          {projects.map(project => <li key={project.slug}><NavigationMenuLink href={`/${locale}/projects/${project.slug}/`} className="work-menu-link"><img src={`/projects/${project.slug}-480.webp`} alt="" width={120} height={90} className="aspect-video w-full rounded-lg object-cover"/><span className="font-bold">{project.name}</span><span className="text-xs text-muted-foreground">{project.type}</span></NavigationMenuLink></li>)}
          <li className="col-span-2"><NavigationMenuLink href={`${home}#projects`}>{es ? 'Todos los proyectos' : 'All projects'}</NavigationMenuLink></li>
        </ul>
      </NavigationMenuContent></NavigationMenuItem>
      <NavigationMenuItem><NavigationMenuLink className="nav-pill" href={`${home}#contact`} data-pill>{pill(es ? 'Contacto' : 'Contact')}</NavigationMenuLink></NavigationMenuItem>
    </NavigationMenuList></NavigationMenu></div>
    <div className="flex shrink-0 items-center gap-1">
      <div className="language-switch" data-locale={locale} role="group" aria-label={es ? 'Idioma' : 'Language'}>
        <span className="language-switch-thumb" aria-hidden="true"/>
        {(['es', 'en'] as const).map(language => language === locale
          ? <span key={language} className="language-current" aria-current="true" lang={language}>{language.toUpperCase()}</span>
          : <a key={language} href={alternatePath} className="language-toggle" aria-label={es ? 'Switch to English' : 'Cambiar a español'} hrefLang={language} lang={language} onClick={() => { try { localStorage.setItem('lang', language); } catch {} }}>{language.toUpperCase()}</a>)}
      </div>
      <Button variant="ghost" size="icon" id="theme-toggle" aria-label={es ? 'Cambiar tema' : 'Toggle theme'} onClick={toggleTheme}><IconSun className="theme-sun" aria-hidden="true"/><IconMoon className="theme-moon" aria-hidden="true"/></Button>
      <div className="md:hidden"><Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="secondary" size="icon" aria-label={es ? 'Abrir menú' : 'Open menu'}/> }><IconMenu2 aria-hidden="true"/></SheetTrigger>
        <SheetContent className="portfolio-sheet" closeLabel={es ? 'Cerrar menú' : 'Close menu'}><SheetHeader className="px-7 pt-16"><SheetTitle>{es ? 'Explorá el portfolio' : 'Explore the portfolio'}</SheetTitle><SheetDescription>Máximo Ozonas · Full Stack Developer</SheetDescription></SheetHeader>
          <nav aria-label={es ? 'Navegación móvil' : 'Mobile navigation'} className="mobile-nav flex flex-col gap-3 px-7 py-8">{[{ id: 'experience', label: es ? 'Experiencia' : 'Experience' }, { id: 'projects', label: es ? 'Proyectos' : 'Projects' }, { id: 'contact', label: es ? 'Contacto' : 'Contact' }].map(item => <a key={item.id} href={`${home}#${item.id}`} onClick={() => setOpen(false)} className="flex min-h-14 items-center justify-between text-2xl font-bold tracking-tight">{item.label}</a>)}</nav>
          <a className="mx-7 mt-auto mb-8 flex min-h-11 items-center text-sm text-muted-foreground" href={`/${locale}/#contact`} onClick={() => setOpen(false)}>maxiozonas10@gmail.com</a>
        </SheetContent>
      </Sheet></div>
    </div>
  </div>;
}
