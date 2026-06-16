export type Locale = "en" | "es";
export const LOCALES: Locale[] = ["en", "es"];
export const DEFAULT_LOCALE: Locale = "en";

export const GITHUB_USER = "maxiozonas";

export interface Job {
  hash: string;
  company: string;
  role: string;
  period: string;
  head: boolean;
  industry?: string;
  bullets: string[];
}

export interface Project {
  dir: string;
  kind: string;
  period: string;
  stack: string[];
  bullets: string[];
}

export interface SkillGroup {
  key: string;
  items: string[];
}

export interface EduItem {
  period: string;
  title: string;
  place: string;
}

export interface LocaleContent {
  ui: Record<string, string>;
  about: string;
  jobs: Job[];
  projects: Project[];
  education: EduItem[];
  languages: { label: string; value: string }[];
}

const name = "Máximo Ozonas";
const role_en = "Development Lead · Full Stack Developer";
const role_es = "Líder de Desarrollo · Full Stack Developer";

export const profile = {
  name,
  location: "Bahía Blanca, Buenos Aires, Argentina",
  email: "maxiozonas10@gmail.com",
  phone: "(+54) 9 291 419 4663",
  linkedin: "linkedin.com/in/maximoozonas",
  linkedinUrl: "https://www.linkedin.com/in/maximoozonas/",
  github: "github.com/maxiozonas",
  githubUrl: "https://github.com/maxiozonas",
  roleEn: role_en,
  roleEs: role_es,
};

export const skills: SkillGroup[] = [
  { key: "languages", items: ["typescript", "php", "java", "javascript", "python", "c++", "sql"] },
  { key: "frontend", items: ["react", "next.js", "flutter", "tailwindcss", "vite", "html", "css"] },
  { key: "backend", items: ["laravel", "node.js", "spring-boot", "RESTful"] },
  { key: "data", items: ["postgresql", "mysql"] },
  { key: "devops", items: ["docker", "compose", "ci/cd", "aws", "git", "linux"] },
  { key: "practices", items: ["hexagonal arch", "testing", "scrum"] },
  { key: "agents", items: ["claude-code", "opencode", "codex"] },
];

export const content: Record<Locale, LocaleContent> = {
  en: {
    ui: {
      welcome: "Welcome to maxiozonas — Development Lead · Full Stack Developer",
      whoami: "whoami",
      readWhoami: "Read(~/.maxiozonas/about.md)",
      experience: "git log --oneline --decorate",
      experienceTool: "Bash(git log experience)",
      projects: "ls ~/projects/freelance",
      skills: "cat stack.toml",
      skillsTool: "Read(stack.toml)",
      github: "github --activity --year",
      githubTool: "GET /users/maxiozonas/contributions",
      education: "cat education.log",
      languages: "locale",
      connect: "/connect",
      now: "now",
      head: "HEAD",
      contribLast: "contributions in",
      totalCommits: "total",
      bestDay: "best day",
      currentStreak: "current streak",
      busiest: "busiest day",
      loadingGithub: "fetching contribution graph…",
      githubError: "could not reach the GitHub API — open the profile directly",
      loadingWeather: "contacting wttr.in…",
      weatherError: "could not reach wttr.in — try again later",
      cvLine: "opening CV (English · PDF) in a new tab ↗",
      less: "less",
      more: "more",
      sessionEnd: "session ended · thanks for visiting",
      navAbout: "about",
      navExp: "experience",
      navProjects: "projects",
      navSkills: "stack",
      navGithub: "github",
      navContact: "connect",
      themeToggle: "toggle light / dark theme",
      langToggle: "switch language",
      openProfile: "open github profile",
      days: "days",
      termGreeting: "Hi! 👋 This is an interactive terminal.",
      termIntro: "Click any button below or type a command — no command-line knowledge needed.",
      termHelpTitle: "available commands — click one:",
      termPlaceholder: "type here (e.g. help) and press Enter, or click a button ↑",
      termRunHelp: "run help",
      navEducation: "education",
      navLanguages: "languages",
      printedHint: "↑ click another command, or type one below",
    },
    about:
      "Development Lead & Full Stack Developer with experience building software end to end: requirements gathering, architecture design, development, deployment and production rollout with DevOps practices. I led the creation of a company's IT area and built a comprehensive ERP for an industrial company. Resourceful and autonomous, focused on generating real impact on business operations.",
    jobs: [
      {
        hash: "a3f9c21",
        company: "Giliycia SRL — IT Area",
        role: "Development Lead",
        period: "Oct 2025 → now",
        head: true,
        bullets: [
          "Lead software development for the newly created IT Area — defining technical standards, architecture and systems roadmap priorities",
          "End-to-end ownership of the software lifecycle: requirements → design → implementation → production rollout with DevOps (CI/CD, Docker, automated deployments)",
          "Development & maintenance of web platforms and internal systems that support critical business operations",
          "Technical coordination with external providers (incidents, tickets, integrations) and cross-functional work to turn operational needs into technical solutions",
        ],
      },
      {
        hash: "7b2e0d8",
        company: "Food Partners Patagonia S.A.",
        role: "Software Developer",
        period: "Sep 2025 → now",
        head: false,
        industry: "industry: seafood / fishing",
        bullets: [
          "Designed & built an integral ERP with full traceability of the production process: production · quality · materials · operational reports",
          "RESTful API with Laravel 11 and hexagonal architecture",
          "JWT auth + role-based access control with Spatie Permission",
          "Complex relational PostgreSQL model with UUIDs and full traceability",
          "React 18 + TypeScript + Vite SPA, integrated via Axios · Docker Compose deploys",
          "API technical documentation and cross-team integration guides",
        ],
      },
    ],
    projects: [
      {
        dir: "inspira-ingenieria/",
        kind: "corporate website",
        period: "Aug–Sep 2025",
        stack: ["Next.js", "TypeScript", "Prisma", "Cloudinary"],
        bullets: [
          "Modern, scalable corporate site for an engineering company",
          "App Router + asset management with Cloudinary",
          "Secure admin panel for project management with Prisma and API Routes",
          "SEO, accessibility & performance via lazy loading and dynamic metadata",
          "Form hardening: rate limiting + anti-bot honeypot",
        ],
      },
      {
        dir: "madryn-buceo/",
        kind: "website + booking system",
        period: "2025",
        stack: ["Next.js", "React", "TailwindCSS", "Spring Boot"],
        bullets: [
          "Corporate website built with Next.js, React and TailwindCSS",
          "Management & booking system with a Spring Boot backend",
          "Delivered with Agile (Scrum), from planning to handover",
        ],
      },
    ],
    education: [
      {
        period: "2021 – 2024",
        title: "University Technician in Programming",
        place: "Universidad Tecnológica Nacional (UTN)",
      },
      {
        period: "2006 – 2017",
        title: "High School in Economics",
        place: "Colegio Claret · Bahía Blanca",
      },
    ],
    languages: [
      { label: "spanish", value: "Native" },
      { label: "english", value: "Intermediate (B1)" },
    ],
  },

  es: {
    ui: {
      welcome: "Bienvenido a maxiozonas — Líder de Desarrollo · Full Stack Developer",
      whoami: "whoami",
      readWhoami: "Read(~/.maxiozonas/sobre-mi.md)",
      experience: "git log --oneline --decorate",
      experienceTool: "Bash(git log experiencia)",
      projects: "ls ~/proyectos/freelance",
      skills: "cat stack.toml",
      skillsTool: "Read(stack.toml)",
      github: "github --actividad --año",
      githubTool: "GET /users/maxiozonas/contributions",
      education: "cat educacion.log",
      languages: "locale",
      connect: "/conectar",
      now: "hoy",
      head: "HEAD",
      contribLast: "contribuciones en",
      totalCommits: "total",
      bestDay: "mejor día",
      currentStreak: "racha actual",
      busiest: "día más activo",
      loadingGithub: "cargando el grafo de contribuciones…",
      githubError: "no se pudo conectar con la API de GitHub — abrí el perfil directamente",
      loadingWeather: "consultando wttr.in…",
      weatherError: "no se pudo conectar con wttr.in — probá más tarde",
      cvLine: "abriendo CV (inglés · PDF) en una pestaña nueva ↗",
      less: "menos",
      more: "más",
      sessionEnd: "sesión finalizada · gracias por tu visita",
      navAbout: "sobre mí",
      navExp: "experiencia",
      navProjects: "proyectos",
      navSkills: "stack",
      navGithub: "github",
      navContact: "conectar",
      themeToggle: "alternar tema claro / oscuro",
      langToggle: "cambiar idioma",
      openProfile: "abrir perfil de github",
      days: "días",
      termGreeting: "¡Hola! 👋 Esto es una terminal interactiva.",
      termIntro: "Tocá cualquier botón de abajo o escribí un comando — no hace falta saber usar la consola.",
      termHelpTitle: "comandos disponibles — tocá uno:",
      termPlaceholder: "escribí acá (ej: help) y apretá Enter, o tocá un botón ↑",
      termRunHelp: "ver ayuda",
      navEducation: "educación",
      navLanguages: "idiomas",
      printedHint: "↑ tocá otro comando, o escribí uno abajo",
    },
    about:
      "Líder de Desarrollo y Desarrollador Full Stack con experiencia construyendo software de punta a punta: relevamiento de requerimientos, diseño de arquitectura, desarrollo, despliegue y salida a producción con prácticas DevOps. Lideré la creación del área de IT de una empresa operativa y desarrollé un ERP integral para una empresa industrial. Perfil resolutivo y autónomo, enfocado en generar impacto real en las operaciones del negocio.",
    jobs: [
      {
        hash: "a3f9c21",
        company: "Giliycia SRL — Área de IT",
        role: "Líder de Desarrollo",
        period: "Oct 2025 → hoy",
        head: true,
        bullets: [
          "Lidero el desarrollo de software del Área de IT, recién creada — definiendo estándares técnicos, arquitectura y prioridades del roadmap de sistemas",
          "Responsable de punta a punta del ciclo de vida: relevamiento → diseño → implementación → salida a producción con prácticas DevOps (CI/CD, Docker, despliegues automatizados)",
          "Desarrollo y mantenimiento de plataformas web y sistemas internos que sostienen operaciones críticas del negocio",
          "Coordinación técnica con proveedores externos (incidencias, tickets, integraciones) y trabajo transversal para traducir necesidades operativas en soluciones técnicas",
        ],
      },
      {
        hash: "7b2e0d8",
        company: "Food Partners Patagonia S.A.",
        role: "Desarrollador de Software",
        period: "Sep 2025 → hoy",
        head: false,
        industry: "industria: pesquera / marítima",
        bullets: [
          "Diseñé y construí un ERP integral con trazabilidad completa del proceso productivo: producción · calidad · materiales · reportes operativos",
          "API RESTful con Laravel 11 y arquitectura hexagonal",
          "Autenticación JWT + control de acceso basado en roles con Spatie Permission",
          "Modelo relacional complejo en PostgreSQL con UUIDs y trazabilidad completa",
          "SPA con React 18 + TypeScript + Vite, integrada vía Axios · despliegues con Docker Compose",
          "Documentación técnica de APIs y guías de integración entre equipos",
        ],
      },
    ],
    projects: [
      {
        dir: "inspira-ingenieria/",
        kind: "sitio web corporativo",
        period: "Ago–Sep 2025",
        stack: ["Next.js", "TypeScript", "Prisma", "Cloudinary"],
        bullets: [
          "Sitio corporativo moderno y escalable para una empresa de ingeniería",
          "App Router + gestión de assets con Cloudinary",
          "Panel seguro para gestión de proyectos con Prisma y API Routes",
          "SEO, accesibilidad y rendimiento con lazy loading y metadatos dinámicos",
          "Seguridad en formularios: rate limiting + honeypot anti-bots",
        ],
      },
      {
        dir: "madryn-buceo/",
        kind: "sitio web + sistema de reservas",
        period: "2025",
        stack: ["Next.js", "React", "TailwindCSS", "Spring Boot"],
        bullets: [
          "Sitio web corporativo con Next.js, React y TailwindCSS",
          "Sistema de gestión y reservas con backend en Spring Boot",
          "Entregado con metodologías ágiles (Scrum), de la planificación a la entrega",
        ],
      },
    ],
    education: [
      {
        period: "2021 – 2024",
        title: "Técnico Universitario en Programación",
        place: "Universidad Tecnológica Nacional (UTN)",
      },
      {
        period: "2006 – 2017",
        title: "Bachillerato en Ciencias Económicas",
        place: "Colegio Claret · Bahía Blanca",
      },
    ],
    languages: [
      { label: "español", value: "Nativo" },
      { label: "inglés", value: "Intermedio (B1)" },
    ],
  },
};

export const skillLabels: Record<Locale, Record<string, string>> = {
  en: {
    languages: "lang",
    frontend: "front",
    backend: "back",
    data: "data",
    devops: "devops",
    practices: "practices",
    agents: "agents",
  },
  es: {
    languages: "leng",
    frontend: "front",
    backend: "back",
    data: "datos",
    devops: "devops",
    practices: "prácticas",
    agents: "agentes",
  },
};
