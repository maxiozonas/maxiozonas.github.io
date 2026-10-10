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
  scope: { title: string; description: string }[];
  capabilities: string[];
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
      "Affiliation tools for tutors and pets, including an idempotent spreadsheet import and verified membership credentials with PDF and QR codes. The public screenshot shows the landing page.",
    details: [
      "Built affiliation records for tutors and pets, with an idempotent Excel import.",
      "Generated PDF membership credentials with QR-based verification.",
      "The modular .NET/EF Core/PostgreSQL backend and React/Vite/TypeScript admin are separate from the Next.js public landing page, shown in the public screenshot.",
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
    summary: "Diving experiences, PADI courses and an interactive dive site map.",
    name: "Madryn Buceo",
    url: "https://madrynbuceo.xenova.com.ar/",
    image: "/projects/madryn-buceo.png",
    imageAlt: "Madryn Buceo website presenting underwater experiences in Patagonia",
    type: "Diving and tourism",
    description:
      "A bilingual website for a diving operator, with excursions, PADI courses, an interactive dive site map and contact enquiries.",
    details: [
      "Built the public corporate website with Next.js, React and Tailwind CSS.",
      "Connected a Leaflet dive site map with filters, selected locations and detailed activity information.",
      "Built bilingual content with React Intl and a validated enquiry flow using server actions.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Leaflet"],
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
      "Herramientas de afiliación para tutores y mascotas, con importación idempotente desde planillas y credenciales verificables en PDF y QR. La captura pública corresponde a la landing.",
    details: [
      "Desarrollé legajos de afiliación para tutores y mascotas, con importación idempotente desde Excel.",
      "Generé credenciales de afiliación en PDF con verificación mediante QR.",
      "El backend modular en .NET/EF Core/PostgreSQL y el administrador en React/Vite/TypeScript son independientes de la landing Next.js, que aparece en la captura pública.",
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
    summary: "Experiencias de buceo, cursos PADI y un mapa interactivo de inmersiones.",
    name: "Madryn Buceo",
    url: "https://madrynbuceo.xenova.com.ar/",
    image: "/projects/madryn-buceo.png",
    imageAlt: "Sitio de Madryn Buceo que presenta experiencias submarinas en la Patagonia",
    type: "Buceo y turismo",
    description:
      "Sitio bilingüe para un operador de buceo, con excursiones, cursos PADI, mapa interactivo de puntos de inmersión y consultas de contacto.",
    details: [
      "Desarrollé el sitio corporativo con Next.js, React y Tailwind CSS.",
      "Conecté un mapa Leaflet con filtros, puntos de inmersión y fichas de actividades.",
      "Participé del flujo de planificación, desarrollo y entrega con Scrum.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Leaflet"],
  },
];

export const content: Record<Locale, PortfolioContent> = {
  en: {
    eyebrow: "Full Stack Developer · Software Development & Project Management",
    heroRole: "Full Stack Developer",
    intro: "I build web and mobile applications and integrate them with the systems each team uses.",
    carouselLabel: "Project preview",
    carouselPrevious: "Previous project",
    carouselNext: "Next project",
    experienceTitle: "Work experience",
    experienceIntro:
      "I work on internal applications, system integrations and production support at Gili and Food Partners Patagonia.",
    experienceLink: "View projects",
    projectsTitle: "Projects",
    projectsIntro: "Four client projects spanning travel, engineering, pet health and diving.",
    contactTitle: ["Get in touch"],
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
        "company": "Gili",
        "role": "Development Lead",
        "period": "Oct 2025 - Present",
        "summary": "Web and mobile applications for sales and logistics.",
        "description": "Led application development at Gili, integrated existing systems and coordinated technical deliveries with the teams using the software.",
        "capabilities": [
          "Laravel",
          "React",
          "Next.js",
          "Expo",
          "Python",
          "FastAPI"
        ],
        "scope": [
          {
            "title": "Sales, logistics and ecommerce",
            "description": "Built solutions for commercial operations, logistics, ecommerce and internal support. Integrated Flexxus and Magento to connect business information with the tools used by each team."
          },
          {
            "title": "Development and delivery",
            "description": "Worked from discovery and architecture through testing, deployments and server operations. Coordinated priorities and external vendors with business teams."
          }
        ]
      },
      {
        "company": "Food Partners Patagonia S.A.",
        "role": "Full Stack Developer · Xenova",
        "period": "Sep 2025 - Present",
        "summary": "ERP and internal applications for the fishing industry.",
        "description": "Built a modular API and applications for production, staff and hardware management at Food Partners Patagonia.",
        "capabilities": [
          "Laravel",
          "React",
          "TypeScript",
          "MySQL",
          "API REST",
          "PWA"
        ],
        "scope": [
          {
            "title": "Production and traceability",
            "description": "Connected production, quality, cold storage and exports, from raw-material intake to finished-product dispatch. The system keeps traceability records across plants."
          },
          {
            "title": "HR and monitoring",
            "description": "Built HR platforms, Mi Legajo for employees and Centinela for system monitoring, with a shared architecture across applications."
          }
        ]
      }
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
    intro: "Desarrollo aplicaciones web y móviles, y las integro con los sistemas que usa cada equipo.",
    carouselLabel: "Vista previa de proyectos",
    carouselPrevious: "Proyecto anterior",
    carouselNext: "Proyecto siguiente",
    experienceTitle: "Experiencia laboral",
    experienceIntro:
      "Trabajo en aplicaciones internas, integraciones y soporte en producción para Gili y Food Partners Patagonia.",
    experienceLink: "Ver proyectos",
    projectsTitle: "Proyectos",
    projectsIntro: "Cuatro trabajos para turismo, ingeniería, salud animal y buceo.",
    contactTitle: ["Escribime"],
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
        "company": "Gili",
        "role": "Líder de Desarrollo",
        "period": "Oct 2025 - Actualidad",
        "summary": "Aplicaciones web y móviles para ventas y logística.",
        "description": "Lideré el desarrollo de aplicaciones en Gili, integré sistemas existentes y coordiné las entregas con los equipos que usan el software.",
        "capabilities": [
          "Laravel",
          "React",
          "Next.js",
          "Expo",
          "Python",
          "FastAPI"
        ],
        "scope": [
          {
            "title": "Ventas, logística y ecommerce",
            "description": "Construí soluciones para atención comercial, logística, ecommerce y soporte interno. Integré Flexxus y Magento para conectar la información del negocio con las herramientas de cada equipo."
          },
          {
            "title": "Desarrollo y gestión",
            "description": "Trabajé desde el relevamiento y la arquitectura hasta las pruebas, los despliegues y la operación de servidores. Coordiné prioridades y proveedores externos con las áreas de negocio."
          }
        ]
      },
      {
        "company": "Food Partners Patagonia S.A.",
        "role": "Full Stack Developer · Xenova",
        "period": "Sep 2025 - Actualidad",
        "summary": "ERP y aplicaciones internas para la industria pesquera.",
        "description": "Desarrollé una API modular y aplicaciones para producción, gestión de personal y hardware en Food Partners Patagonia.",
        "capabilities": [
          "Laravel",
          "React",
          "TypeScript",
          "MySQL",
          "API REST",
          "PWA"
        ],
        "scope": [
          {
            "title": "Producción y trazabilidad",
            "description": "Conecté producción, calidad, cámaras y exportación, desde la recepción de materia prima hasta la salida del producto. El sistema registra la trazabilidad entre plantas."
          },
          {
            "title": "RR. HH. y monitoreo",
            "description": "Desarrollé plataformas de RR. HH., Mi Legajo para el personal y Centinela para el monitoreo de sistemas, con una arquitectura compartida entre las aplicaciones."
          }
        ]
      }
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
