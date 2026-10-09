import { IconArrowDownRight, IconDownload } from '@tabler/icons-react';
import { buttonVariants } from '@/components/ui/button';
import Magnet from './reactbits/Magnet';
export default function HeroActions({ locale }: { locale: 'es' | 'en' }) {
  return <div className="hero-actions flex flex-wrap justify-center gap-3">
    <Magnet><a href="#projects" className={buttonVariants({ size: 'lg' })}>{locale === 'es' ? 'Ver proyectos' : 'View projects'}<IconArrowDownRight data-icon="inline-end" /></a></Magnet>
    <Magnet><a href={`/cv-maximo-ozonas-${locale}.pdf`} download className={buttonVariants({ size: 'lg', variant: 'secondary' })}>{locale === 'es' ? 'Descargar CV' : 'Download CV'}<IconDownload data-icon="inline-end" /></a></Magnet>
  </div>;
}
