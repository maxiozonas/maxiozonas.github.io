import { buttonVariants } from '@/components/ui/button';
import Magnet from './reactbits/Magnet';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import { profile } from '@/data/content';
export default function HeroActions({ locale }: { locale: 'es' | 'en' }) {
  return <><div className="hero-actions flex flex-wrap gap-3">
    <Magnet><a href="#projects" className={buttonVariants({ size: 'lg' })}>{locale === 'es' ? 'Ver proyectos' : 'View projects'}</a></Magnet>
    <a href={`/cv-maximo-ozonas-${locale}.pdf`} download className={buttonVariants({ size: 'lg', variant: 'secondary' })}>{locale === 'es' ? 'Descargar CV' : 'Download CV'}</a>
  </div><div className="hero-socials" aria-label={locale === 'es' ? 'Perfiles profesionales' : 'Professional profiles'}>
    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-button"><IconBrandGithub size={19} aria-hidden="true"/>GitHub</a>
    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-button"><IconBrandLinkedin size={19} aria-hidden="true"/>LinkedIn</a>
  </div></>;
}
