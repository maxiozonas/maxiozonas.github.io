export type Locale = "en" | "es";

export const profile = {
  name: "Máximo Ozonas",
  role: {
    en: "Full Stack Developer · Software Development & Project Management",
    es: "Full Stack Developer · Desarrollo de Software y Gestión de Proyectos",
  },
  email: "maxiozonas10@gmail.com",
  github: "https://github.com/maxiozonas",
  linkedin: "https://linkedin.com/in/maximoozonas",
};

export interface Job {
  company: string;
  role: string;
  period: string;
  summary: string;
  description: string;
  outcomes: string[];
  capabilities: string[];
  flow?: string[];
}

export interface Project {
  slug: string;
  summary: string;
  name: string;
  url: string;
  image: string;
  imageAlt: string;
  type: string;
  description: string;
  details: string[];
  stack: string[];
}

export interface PortfolioContent {
  eyebrow: string;
  heroRole: string;
  intro: string;
  carouselLabel: string;
  carouselPrevious: string;
  carouselNext: string;
  experienceTitle: string;
  experienceIntro: string;
  experienceLink: string;
  projectsTitle: string;
  projectsIntro: string;
  contactTitle: string[];
  contactIntro: string;
  nav: {
    experience: string;
    projects: string;
    contact: string;
    language: string;
    theme: string;
  };
  actions: {
    experience: string;
    download: string;
    visit: string;
    details: string;
    email: string;
    github: string;
    linkedin: string;
    downloadLabel: string;
  };
  labels: {
    ongoing: string;
    featuredExperience: string;
    selectedWork: string;
    technologies: string;
    skills: string;
    education: string;
    languages: string;
    native: string;
    intermediate: string;
    degree: string;
    location: string;
  };
  jobs: Job[];
  projects: Project[];
  skills: { title: string; items: string[] }[];
  degree: string;
  languages: { name: string; level: string }[];
}

const projectsEn: Project[] = [
  {
    slug: "catalejo-travel",
    summary: "Patagonia experiences, seasonal pricing and a custom CMS.",
    name: "Catalejo Travel",
    url: "https://www.catalejotravel.com/es/",
    image: "/projects/catalejo-travel.png",
    imageAlt: "Catalejo Travel public website for excursions and experiences in Patagonia",
    type: "Travel and experiences",
    description:
      "A travel website and content platform for excursions, seasonal pricing and experience enquiries. The trip planner starts a conversation with the team rather than taking payment online.",
    details: [
      "Built a Next.js and React TypeScript public site with a catalogue of excursions and experiences.",
      "Connected seasonal date-based pricing and content to a React/Vite CMS backed by a Laravel API.",
      "Added WhatsApp enquiries and anonymous analytics; the planner is an enquiry flow, not a paid booking checkout.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Laravel"],
  },
  {
    slug: "quinta-pata",
    summary: "Pet healthcare affiliations and verifiable digital credentials.",
    name: "Quinta Pata",
    url: "https://5tapata.com.ar/",
    image: "/projects/quinta-pata.png",
    imageAlt: "Quinta Pata public landing page for pet healthcare affiliations",
    type: "Pet healthcare affiliations",
    description:
      "Affiliation tools for tutors and pets, including an idempotent spreadsheet import and verified membership credentials with PDF and QR codes. The public landing page currently says Próximamente.",
    details: [
      "Built affiliation records for tutors and pets, with an idempotent Excel import.",
      "Generated PDF membership credentials with QR-based verification.",
      "The modular .NET/EF Core/PostgreSQL backend and React/Vite/TypeScript admin are separate from the Next.js public landing page, which currently says Próximamente.",
    ],
    stack: [".NET", "Entity Framework Core", "PostgreSQL", "Next.js", "React"],
  },
  {
    slug: "inspira-ingenieria",
    summary: "Engineering projects with a secure content administration area.",
    name: "Inspira Ingeniería",
    url: "https://www.ingenieriainspira.com/",
    image: "/projects/inspira-ingenieria.png",
    imageAlt: "Inspira Ingeniería corporate website presenting structural engineering projects",
    type: "Corporate website",
    description:
      "A corporate site and protected project administration area for an engineering company, with attention to performance, accessible structure, search metadata and form security.",
    details: [
      "Built the Next.js and TypeScript corporate site and a protected project administration area using Prisma API routes.",
      "Integrated Cloudinary for media, with search metadata and attention to accessibility and performance.",
      "Hardened public forms with rate limits and a honeypot.",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "Cloudinary"],
  },
  {
    slug: "madryn-buceo",
    summary: "A diving website connected to reservation management.",
    name: "Madryn Buceo",
    url: "https://madrynbuceo.xenova.com.ar/",
    image: "/projects/madryn-buceo.png",
    imageAlt: "Madryn Buceo website presenting underwater experiences in Patagonia",
    type: "Diving and tourism",
    description:
      "A corporate website for a diving operator, paired with a reservation and management system backed by Spring Boot and delivered through a Scrum workflow.",
    details: [
      "Built the public corporate website with Next.js, React and Tailwind CSS.",
      "Developed a reservation and management system backed by Spring Boot.",
      "Worked through planning, implementation and handoff in a Scrum workflow.",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Spring Boot"],
  },
];

const projectsEs: Project[] = [
  {
    slug: "catalejo-travel",
    summary: "Experiencias en Patagonia, tarifas por temporada y un CMS propio.",
    name: "Catalejo Travel",
    url: "https://www.catalejotravel.com/es/",
    image: "/projects/catalejo-travel.png",
    imageAlt: "Sitio público de Catalejo Travel para excursiones y experiencias en la Patagonia",
    type: "Turismo y experiencias",
    description:
      "Sitio de turismo y plataforma de contenidos para excursiones, precios de temporada y consultas por experiencias. El planificador inicia una conversación con el equipo, no procesa pagos en línea.",
    details: [
      "Desarrollé un sitio público con Next.js y React/TypeScript con un catálogo de excursiones y experiencias.",
      "Conecté precios por fecha de temporada y contenidos con un CMS en React/Vite respaldado por una API Laravel.",
      "Sumé consultas por WhatsApp y analítica anónima; el planificador inicia una consulta, no confirma una reserva paga.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Laravel"],
  },
  {
    slug: "quinta-pata",
    summary: "Afiliaciones de salud animal y credenciales digitales verificables.",
    name: "Quinta Pata",
    url: "https://5tapata.com.ar/",
    image: "/projects/quinta-pata.png",
    imageAlt: "Página pública de Quinta Pata para afiliaciones de salud animal",
    type: "Afiliaciones de salud animal",
    description:
      "Herramientas de afiliación para tutores y mascotas, con importación idempotente desde planillas y credenciales verificables en PDF y QR. La página pública actualmente indica Próximamente.",
    details: [
      "Desarrollé legajos de afiliación para tutores y mascotas, con importación idempotente desde Excel.",
      "Generé credenciales de afiliación en PDF con verificación mediante QR.",
      "El backend modular en .NET/EF Core/PostgreSQL y el administrador en React/Vite/TypeScript son independientes de la landing Next.js, que actualmente indica Próximamente.",
    ],
    stack: [".NET", "Entity Framework Core", "PostgreSQL", "Next.js", "React"],
  },
  {
    slug: "inspira-ingenieria",
    summary: "Proyectos de ingeniería con administración segura de contenidos.",
    name: "Inspira Ingeniería",
    url: "https://www.ingenieriainspira.com/",
    image: "/projects/inspira-ingenieria.png",
    imageAlt: "Sitio corporativo de Inspira Ingeniería que presenta proyectos de estructuras seguras",
    type: "Sitio corporativo",
    description:
      "Sitio corporativo y área protegida de administración de proyectos para una empresa de ingeniería, con foco en rendimiento, estructura accesible, metadatos para buscadores y seguridad de formularios.",
    details: [
      "Desarrollé el sitio corporativo en Next.js y TypeScript y el área protegida de proyectos con API Routes y Prisma.",
      "Integré Cloudinary para recursos multimedia, metadatos para buscadores y mejoras de accesibilidad y rendimiento.",
      "Fortalecí los formularios públicos con límites de frecuencia y un campo trampa para bots.",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "Cloudinary"],
  },
  {
    slug: "madryn-buceo",
    summary: "Un sitio de buceo conectado con la gestión de reservas.",
    name: "Madryn Buceo",
    url: "https://madrynbuceo.xenova.com.ar/",
    image: "/projects/madryn-buceo.png",
    imageAlt: "Sitio de Madryn Buceo que presenta experiencias submarinas en la Patagonia",
    type: "Buceo y turismo",
    description:
      "Sitio corporativo para un operador de buceo, junto con un sistema de reservas y gestión respaldado por Spring Boot y desarrollado con un flujo de trabajo Scrum.",
    details: [
      "Desarrollé el sitio corporativo con Next.js, React y Tailwind CSS.",
      "Implementé un sistema de reservas y gestión respaldado por Spring Boot.",
      "Participé del flujo de planificación, desarrollo y entrega con Scrum.",
    ],
    stack: ["Next.js", "React", "Tailwind CSS", "Spring Boot"],
  },
];

export const content: Record<Locale, PortfolioContent> = {
  en: {
    eyebrow: "Full Stack Developer · Software Development & Project Management",
    heroRole: "Full Stack Developer",
    intro: "I build web and mobile software end to end, from the first requirement through production.",
    carouselLabel: "Project preview",
    carouselPrevious: "Previous project",
    carouselNext: "Next project",
    experienceTitle: "Software for operations.",
    experienceIntro:
      "I turn operational needs into dependable software, from discovery and architecture through delivery and production support.",
    experienceLink: "View projects",
    projectsTitle: "Selected projects.",
    projectsIntro: "Four client projects spanning travel, engineering, pet health and diving.",
    contactTitle: ["Let's talk about", "what your team needs."],
    contactIntro: "Web and mobile software, system integrations and production operations.",
    nav: {
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
      language: "Language",
      theme: "Change color theme",
    },
    actions: {
      experience: "View experience",
      download: "Download CV",
      visit: "Visit website",
      details: "View project",
      email: "Email me",
      github: "GitHub",
      linkedin: "LinkedIn",
      downloadLabel: "Download CV in",
    },
    labels: {
      ongoing: "Ongoing",
      featuredExperience: "Featured experience",
      selectedWork: "Selected work",
      technologies: "Technologies",
      skills: "Capabilities",
      education: "Education",
      languages: "Languages",
      native: "Native",
      intermediate: "Intermediate (B1)",
      degree: "University Technical Degree in Programming",
      location: "Based in Bahía Blanca, Argentina",
    },
    jobs: [
      {
        company: "Gili",
        role: "Development Lead",
        period: "Oct 2025 - Present",
        summary: "Internal software, integrations and project delivery.",
        description:
          "Lead software and project work across internal operations. I align requirements and priorities with business users, shape the roadmap and architecture, and coordinate external vendors through development, testing, deployment and ongoing server operations.",
        outcomes: [
          "Order picking, logistics and freight settlement tools.",
          "A showroom queue with tickets, kiosk, tablet, QR codes and signage; it supports walk-in order without scheduled appointments.",
          "A B2B portal, ticketing workflows and catalogue automation.",
          "Integrations with Flexxus and Magento, plus production maintenance and support.",
        ],
        capabilities: ["Laravel", "React", "Expo", "Python", "FastAPI"],
      },
      {
        company: "Food Partners Patagonia S.A.",
        role: "Full Stack Developer · Xenova",
        period: "Sep 2025 - Present",
        summary: "Production, traceability and people operations in one ERP.",
        description:
          "Ongoing development of an integral ERP for an Argentine red shrimp processor. The work connects operational areas from vessel discharge and port intake through production, cold storage and export preparation, alongside quality reporting and people operations.",
        flow: [
          "Vessel discharge and port intake",
          "Raw shrimp weighing and washing",
          "Freezing lines and production records",
          "Palletization, labels and cold-room lots",
          "Stock transfers, orders and container exports",
        ],
        outcomes: [
          "Production and quality controls, a cold-storage map, inventory, lot and pallet traceability, inter-plant transfers and foreign-trade documentation.",
          "Laravel REST API and independent React/TypeScript applications by business area, with authentication, granular permissions, per-plant database selection and real-time error monitoring.",
          "People operations cover employee records, attendance and hours, leave requests, supervisor-to-HR approvals, PDF payslips, internal communication and disciplinary workflows.",
          "Employee self-service is an installable PWA. Module rollout is ongoing, so not every area is described as live.",
        ],
        capabilities: ["Laravel", "React", "TypeScript", "API REST", "PWA"],
      },
    ],
    projects: projectsEn,
    skills: [
      { title: "Languages", items: ["TypeScript", "JavaScript", "PHP", "Python", "Java", "C#"] },
      { title: "Web and backend", items: ["React", "Next.js", "Laravel", ".NET", "Spring Boot", "FastAPI"] },
      { title: "Mobile", items: ["React Native", "Expo", "Flutter"] },
      { title: "Data", items: ["PostgreSQL", "MySQL"] },
      { title: "Infrastructure", items: ["Linux", "VPS", "Docker Compose", "CI/CD", "Git", "AWS"] },
      { title: "Development tools", items: ["Claude Code", "Codex", "OpenCode"] },
    ],
    degree: "University Technical Degree in Programming · UTN · 2021-2024",
    languages: [
      { name: "Spanish", level: "Native" },
      { name: "English", level: "Intermediate (B1)" },
    ],
  },
  es: {
    eyebrow: "Full Stack Developer · Desarrollo de Software y Gestión de Proyectos",
    heroRole: "Full Stack Developer",
    intro: "Desarrollo software web y móvil de punta a punta, desde el primer requerimiento hasta producción.",
    carouselLabel: "Vista previa de proyectos",
    carouselPrevious: "Proyecto anterior",
    carouselNext: "Proyecto siguiente",
    experienceTitle: "Software para operaciones.",
    experienceIntro:
      "Transformo necesidades operativas en software confiable, desde el relevamiento y la arquitectura hasta la entrega y el soporte en producción.",
    experienceLink: "Ver proyectos",
    projectsTitle: "Proyectos seleccionados.",
    projectsIntro: "Cuatro trabajos para turismo, ingeniería, salud animal y buceo.",
    contactTitle: ["Hablemos de lo que", "necesita tu equipo."],
    contactIntro: "Software web y móvil, integraciones entre sistemas y operación en producción.",
    nav: {
      experience: "Experiencia",
      projects: "Proyectos",
      contact: "Contacto",
      language: "Idioma",
      theme: "Cambiar tema de color",
    },
    actions: {
      experience: "Ver experiencia",
      download: "Descargar CV",
      visit: "Visitar sitio",
      details: "Ver proyecto",
      email: "Escribirme",
      github: "GitHub",
      linkedin: "LinkedIn",
      downloadLabel: "Descargar CV en",
    },
    labels: {
      ongoing: "En desarrollo",
      featuredExperience: "Experiencia destacada",
      selectedWork: "Trabajo seleccionado",
      technologies: "Tecnologías",
      skills: "Competencias",
      education: "Formación",
      languages: "Idiomas",
      native: "Nativo",
      intermediate: "Intermedio (B1)",
      degree: "Técnico Universitario en Programación",
      location: "En Bahía Blanca, Argentina",
    },
    jobs: [
      {
        company: "Gili",
        role: "Líder de Desarrollo",
        period: "Oct 2025 - Actualidad",
        summary: "Software interno, integraciones y gestión de proyectos.",
        description:
          "Lidero el trabajo de software y proyectos para las operaciones internas. Alineo requerimientos y prioridades con las áreas de negocio, defino el roadmap y la arquitectura, y coordino proveedores externos durante el desarrollo, las pruebas, el despliegue y la operación de servidores.",
        outcomes: [
          "Flujos internos de picking y logística, incluida la liquidación de fletes.",
          "Una fila virtual para el showroom con tickets, tótem, tablet, QR y cartelería; admite atención espontánea, sin turnos programados.",
          "Portal B2B, flujos de tickets y automatización del catálogo.",
          "Integraciones con Flexxus y Magento, además de mantenimiento y soporte en producción.",
        ],
        capabilities: ["Laravel", "React", "Expo", "Python", "FastAPI"],
      },
      {
        company: "Food Partners Patagonia S.A.",
        role: "Full Stack Developer · Xenova",
        period: "Sep 2025 - Actualidad",
        summary: "Producción, trazabilidad y gestión de personas en un ERP.",
        description:
          "Desarrollo en curso de un ERP integral para una procesadora argentina de langostino. El sistema conecta áreas operativas desde la descarga de buques y la recepción en puerto hasta la producción, la cámara de frío y la preparación de exportaciones, junto con reportes de calidad y gestión de personas.",
        flow: [
          "Descarga de buques y recepción en puerto",
          "Pesaje y lavado de langostino crudo",
          "Líneas de congelado y registros de producción",
          "Paletizado, etiquetado y lotes en cámara",
          "Transferencias, pedidos y exportaciones en contenedores",
        ],
        outcomes: [
          "Controles de producción y calidad, mapa de cámaras frigoríficas, stock, trazabilidad de lotes y pallets, transferencias entre plantas y documentación de comercio exterior.",
          "API REST en Laravel y aplicaciones React/TypeScript por sector, con autenticación, permisos granulares, selección de base por planta y monitoreo de errores en tiempo real.",
          "Gestión de personas: legajos, fichadas, horas, licencias, vacaciones, aprobaciones de supervisores y RR. HH., recibos PDF, comunicaciones y flujos disciplinarios.",
          "El autoservicio del personal es una PWA instalable. El despliegue de módulos sigue en curso y no se presenta cada área como ya operativa.",
        ],
        capabilities: ["Laravel", "React", "TypeScript", "API REST", "PWA"],
      },
    ],
    projects: projectsEs,
    skills: [
      { title: "Lenguajes", items: ["TypeScript", "JavaScript", "PHP", "Python", "Java", "C#"] },
      { title: "Web y backend", items: ["React", "Next.js", "Laravel", ".NET", "Spring Boot", "FastAPI"] },
      { title: "Móvil", items: ["React Native", "Expo", "Flutter"] },
      { title: "Datos", items: ["PostgreSQL", "MySQL"] },
      { title: "Infraestructura", items: ["Linux", "VPS", "Docker Compose", "CI/CD", "Git", "AWS"] },
      { title: "Herramientas de desarrollo", items: ["Claude Code", "Codex", "OpenCode"] },
    ],
    degree: "Técnico Universitario en Programación · UTN · 2021-2024",
    languages: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "Intermedio (B1)" },
    ],
  },
};
