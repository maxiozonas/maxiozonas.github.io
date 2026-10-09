import { content, type Locale } from './content';
import { caseStudies } from './case-studies';

export interface TechnologyUse { name: string; href: string; }

// Associate technologies only with the reviewed project/experience content.
export function getTechnologyUsage(locale: Locale): Record<string, TechnologyUse[]> {
  const usage: Record<string, TechnologyUse[]> = {};
  const add = (technology: string, work: TechnologyUse) => { (usage[technology] ??= []).push(work); };
  for (const project of content[locale].projects) {
    const technologies = new Set([...project.stack, ...caseStudies[locale][project.slug].architecture.flatMap(layer => layer.technologies)]);
    for (const technology of technologies) add(technology, { name: project.name, href: `/${locale}/projects/${project.slug}/` });
  }
  content[locale].jobs.forEach((job, index) => {
    const slug = index === 0 ? 'gili' : 'food-partners';
    const technologies = new Set(job.capabilities);
    if (technologies.has('Laravel')) technologies.add('PHP');
    if (technologies.has('Expo')) technologies.add('React Native');
    for (const technology of technologies) add(technology, { name: index === 0 ? 'Gili' : 'Food Partners', href: `#experience-${slug}` });
  });
  return usage;
}
