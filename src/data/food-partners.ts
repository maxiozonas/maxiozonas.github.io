import type { Locale, Project } from './content';
import type { CaseStudy } from './case-studies';

// Scope reviewed in scripts/experience-content-sources.json. No public app URL or outcome metrics inferred.
const shared = {
  slug: 'food-partners',
  name: 'Food Partners Patagonia S.A.',
  image: '/companies/food-partners.png',
  stack: ['Laravel', 'React', 'TypeScript', 'MySQL'],
  affiliation: 'Xenova' as const,
  featured: true,
};

export const foodPartnersProjects: Record<Locale, Project> = {
  es: {
    ...shared,
    type: 'ERP para la industria pesquera',
    imageAlt: 'Logo de Food Partners Patagonia',
    summary: 'ERP para registrar producción, seguir lotes entre plantas y gestionar calidad, cámaras y personal.',
    description: 'Desarrollo y coordinación de un ERP para Food Partners Patagonia desde Xenova. Relevo requerimientos con las áreas de la empresa, organizo prioridades y participo en la arquitectura, el desarrollo, las pruebas, los despliegues y el soporte.',
    details: ['Producción y trazabilidad entre plantas.', 'Calidad, cámaras y exportación.', 'RR. HH., Mi Legajo y monitoreo con Centinela.'],
    overview: {
      heading: 'Áreas de la aplicación',
      areas: [
        { title: 'Producción y trazabilidad', description: 'Recepción de materia prima, registro de producción y seguimiento de lotes entre plantas.' },
        { title: 'Calidad y cámaras', description: 'Registros de calidad, gestión de cámaras y salida del producto para exportación.' },
        { title: 'Personal y monitoreo', description: 'RR. HH., acceso del personal a Mi Legajo y monitoreo de sistemas con Centinela.' },
      ],
    },
  },
  en: {
    ...shared,
    type: 'ERP for the fishing industry',
    imageAlt: 'Food Partners Patagonia logo',
    summary: 'ERP for recording production, tracking batches between plants and managing quality, cold storage and employees.',
    description: 'ERP development and project coordination for Food Partners Patagonia through Xenova. I gather requirements with company teams, organise priorities and work on architecture, development, testing, deployments and support.',
    details: ['Production and traceability across plants.', 'Quality, cold storage and exports.', 'HR, Mi Legajo and monitoring with Centinela.'],
    overview: {
      heading: 'Application areas',
      areas: [
        { title: 'Production and traceability', description: 'Raw-material intake, production records and batch tracking between plants.' },
        { title: 'Quality and cold storage', description: 'Quality records, cold-storage management and product dispatch for export.' },
        { title: 'Employees and monitoring', description: 'HR, employee access to Mi Legajo and system monitoring with Centinela.' },
      ],
    },
  },
};

export const foodPartnersStudies: Record<Locale, CaseStudy> = {
  es: {
    focus: 'Operación industrial y trazabilidad',
    deliverable: 'API compartida + aplicaciones por área',
    context: 'El sistema registra el trabajo de las plantas de Food Partners Patagonia: recepción de materia prima, producción, calidad, cámaras y salida del producto. También incluye aplicaciones para recursos humanos, el personal y el monitoreo de sistemas.',
    features: [
      { title: 'Producción y trazabilidad', text: 'Registro de materia prima y productos a lo largo de la producción, con seguimiento de lotes entre plantas.' },
      { title: 'Calidad y cámaras', text: 'Aplicaciones para registrar el trabajo de calidad y cámaras, y relacionarlo con producción y salida del producto.' },
      { title: 'RR. HH. y Mi Legajo', text: 'Aplicaciones separadas para el equipo de recursos humanos y para que el personal consulte su legajo.' },
      { title: 'Centinela', text: 'Monitoreo de los sistemas para acompañar el soporte y detectar problemas de operación.' },
    ],
    architecture: [
      { name: 'API y áreas de negocio', description: 'Backend Laravel organizado en áreas de Producción, Cámara, Calidad, RR. HH., Mi Legajo y Centinela.', technologies: ['Laravel', 'PHP', 'MySQL'] },
      { name: 'Aplicaciones por área', description: 'Frontends React y TypeScript para los equipos de la empresa, conectados mediante API REST.', technologies: ['React', 'TypeScript'] },
      { name: 'Desarrollo y operación', description: 'Relevamiento, prioridades, pruebas, despliegues y soporte coordinados con las áreas que usan las aplicaciones.', technologies: [] },
    ],
    decisions: [
      { title: 'Aplicaciones por área', text: 'Un backend organizado por áreas atiende a los frontends de producción, calidad, cámaras, RR. HH. y Mi Legajo. Cada equipo trabaja con sus propias pantallas.' },
      { title: 'Trazabilidad entre etapas', text: 'El diseño conecta producción, calidad y cámaras para registrar el recorrido del producto entre plantas y áreas de la operación.' },
      { title: 'Relevamiento con los usuarios', text: 'Coordino reuniones con los equipos de la empresa para definir requerimientos y prioridades, y acompaño las entregas con pruebas y soporte.' },
    ],
    result: 'Desarrollé las aplicaciones y coordiné el relevamiento con las áreas de la empresa. Me ocupé de la arquitectura, el desarrollo, las pruebas, los despliegues y el soporte.',
  },
  en: {
    focus: 'Industrial operations and traceability',
    deliverable: 'Shared API + area-specific applications',
    context: 'The system records work at Food Partners Patagonia plants: raw-material intake, production, quality, cold storage and product dispatch. It also includes applications for human resources, employees and system monitoring.',
    features: [
      { title: 'Production and traceability', text: 'Records of raw materials and products throughout production, with batch tracking between plants.' },
      { title: 'Quality and cold storage', text: 'Applications to record quality and cold-storage work and relate it to production and product dispatch.' },
      { title: 'HR and Mi Legajo', text: 'Separate applications for human resources staff and for employees to access their records.' },
      { title: 'Centinela', text: 'System monitoring to support maintenance and identify operational problems.' },
    ],
    architecture: [
      { name: 'API and business areas', description: 'Laravel backend organised into Production, Cold Storage, Quality, HR, Mi Legajo and Centinela areas.', technologies: ['Laravel', 'PHP', 'MySQL'] },
      { name: 'Area-specific applications', description: 'React and TypeScript frontends for company teams, connected through a REST API.', technologies: ['React', 'TypeScript'] },
      { name: 'Development and operations', description: 'Requirements, priorities, testing, deployments and support coordinated with the teams using the applications.', technologies: [] },
    ],
    decisions: [
      { title: 'Area-specific applications', text: 'An area-based backend serves the production, quality, cold-storage, HR and Mi Legajo frontends. Each team has its own screens.' },
      { title: 'Traceability across stages', text: 'The design connects production, quality and cold storage to record the product journey between plants and operational teams.' },
      { title: 'Requirements with users', text: 'I coordinate meetings with company teams to define requirements and priorities, supporting deliveries through testing and application support.' },
    ],
    result: 'I built the applications and coordinated requirements with the company teams. I handled architecture, development, testing, deployments and support.',
  },
};
