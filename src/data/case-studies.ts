import type { Locale } from './content';
interface Feature { title: string; text: string; }
interface Layer { name: string; description: string; technologies: string[]; }
export interface CaseStudy {
  focus: string;
  deliverable: string;
  context: string;
  features: Feature[];
  architecture: Layer[];
  decisions: Feature[];
  result: string;
}
export const caseStudies: Record<Locale, Record<string, CaseStudy>> = {
  es: {
    'catalejo-travel': {
      focus: 'Contenido, tarifas y consultas',
      deliverable: 'Sitio público + CMS + API',
      context: 'Desarrollé el sitio y el administrador de Catalejo Travel para que la agencia pudiera editar excursiones, imágenes y tarifas. Los precios varían según la temporada y el tipo de pasajero. El catálogo está en español e inglés y el planificador envía la consulta al equipo comercial por WhatsApp.',
      features: [
        { title: 'Catálogo bilingüe', text: 'Experiencias y categorías con traducciones, galerías, orden de aparición y publicación administrados desde el CMS. El sitio incluye contenido local de respaldo cuando la API no está disponible.' },
        { title: 'Tarifas por temporada', text: 'Períodos con fechas de inicio y fin y precios para adultos, menores y personas mayores. La API resuelve el precio para la fecha elegida y valida que las temporadas no se superpongan.' },
        { title: 'Planificador de viaje', text: 'Selección de experiencias, fechas y pasajeros para preparar un mensaje de WhatsApp con el contexto de la consulta. El equipo comercial continúa la conversación y confirma disponibilidad.' },
        { title: 'Administración y analítica', text: 'Dashboard con usuarios y roles, contenido institucional, gestión de imágenes y videos alojados en el VPS. La analítica propia registra visitas, contactos y consultas en ventanas de 7, 30 y 90 días.' },
      ],
      architecture: [
        { name: 'Sitio público', description: 'Next.js presenta el catálogo en español e inglés y consume las experiencias publicadas.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Administración', description: 'Aplicación independiente en React y Vite para editar contenidos, medios y tarifas.', technologies: ['React', 'TypeScript'] },
        { name: 'Dominio y persistencia', description: 'API Laravel con sesiones Sanctum, reglas de precios, políticas de acceso y almacenamiento de medios.', technologies: ['Laravel', 'PHP'] },
      ],
      decisions: [
        { title: 'Disponibilidad del catálogo', text: 'El sitio puede recurrir al contenido migrado local si la API no responde. Esto mantiene disponible la información pública y separa la lectura del catálogo de la edición administrativa.' },
        { title: 'Validación de temporadas', text: 'Las modificaciones de temporadas usan transacciones y bloqueo sobre la experiencia. La validación evita períodos superpuestos y la consulta identifica fechas sin tarifa configurada.' },
        { title: 'Registro de consultas', text: 'Los eventos usan un identificador de sesión anónimo, sin almacenar la IP del visitante. Una consulta al planificador se registra como intención de contacto, sin contarla como venta confirmada.' },
      ],
      result: 'La agencia puede actualizar el catálogo y las tarifas desde el administrador. Las consultas llegan a WhatsApp con las excursiones, fechas y pasajeros elegidos. El equipo comercial confirma la disponibilidad y gestiona los pagos.',
    },
    'quinta-pata': {
      focus: 'Afiliados, cobertura y autorizaciones',
      deliverable: 'Backoffice + portal + API modular',
      context: 'Quinta Pata gestionaba afiliados y mascotas en planillas. Desarrollé un sistema para administrar esos legajos, los planes de cobertura y las autorizaciones, con un portal para afiliados y un administrador para el personal. La captura corresponde al sitio público.',
      features: [
        { title: 'Tutores y mascotas', text: 'Altas, edición, estados, fotos y relaciones entre tutores y mascotas. El administrador permite consultar legajos, historial de plan y resúmenes sin mezclar los datos personales con las reglas de cobertura.' },
        { title: 'Importación desde Excel', text: 'La carga desde Excel tiene una instancia de previsualización y otra de confirmación. El procesamiento idempotente permite repetir la importación sin duplicar afiliados.' },
        { title: 'Credenciales y portal', text: 'Emisión de PDF, enlace de descarga, envío por correo y QR con verificación pública. El portal incorpora activación y acceso de afiliados, separado del backoffice del personal.' },
        { title: 'Planes y autorizaciones', text: 'Catálogo de prácticas, matriz de cobertura, topes, descuentos y precios programados. El módulo de tokenización incluye códigos OTP, validación, expiración y trazabilidad de autorizaciones.' },
      ],
      architecture: [
        { name: 'Web y portal', description: 'Next.js para la landing, la verificación pública y el acceso de afiliados y proveedores.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Backoffice', description: 'React y Vite con pantallas para afiliados, importación, planes, usuarios y tokens.', technologies: ['React', 'TypeScript'] },
        { name: 'Módulos de negocio', description: 'Monolito modular .NET con Vertical Slice Architecture, MediatR, EF Core y PostgreSQL.', technologies: ['.NET', 'PostgreSQL', 'C#'] },
      ],
      decisions: [
        { title: 'Límites por módulo', text: 'Afiliados, Usuarios, Planes y Tokenización tienen sus propias funcionalidades y persistencia. La estructura permite incorporar nuevas áreas sin convertir todo el dominio en un único servicio de gestión.' },
        { title: 'Verificación por QR', text: 'Las credenciales se emiten en PDF y se pueden descargar o enviar por correo. El QR permite consultar su validez desde el sitio público.' },
        { title: 'Sesiones y códigos', text: 'El acceso combina JWT con rotación de refresh tokens en cookies httpOnly. Los códigos de autorización se protegen con HMAC y tienen reglas de vigencia y expiración.' },
      ],
      result: 'El personal puede administrar afiliados, mascotas, planes y autorizaciones desde el backoffice. Los afiliados tienen un portal separado y credenciales en PDF con verificación por QR. Ambos usan un backend modular en .NET.',
    },
    'inspira-ingenieria': {
      focus: 'Proyectos, medios y consultas',
      deliverable: 'Sitio corporativo + administrador',
      context: 'Desarrollé el sitio de Inspira Ingeniería y un administrador para publicar obras. El catálogo organiza viviendas, naves industriales y proyectos funcionales. Cada ficha incluye fotografías, especificaciones técnicas y una descripción del trabajo realizado.',
      features: [
        { title: 'Obras por categoría', text: 'Catálogo de viviendas, naves industriales y proyectos funcionales. Cada obra tiene una página propia con imágenes y contenido técnico, además de la información de servicios y del equipo.' },
        { title: 'Fichas de proyecto', text: 'El modelo registra arquitecto, ubicación, año, superficie, desafío, solución y resultado. Las especificaciones incluyen sistema constructivo, fundaciones, estructura y normativa.' },
        { title: 'Gestión de imágenes', text: 'Carga de portada y fotografías complementarias mediante Cloudinary. Los recursos se organizan por categoría y proyecto, junto con sus textos alternativos.' },
        { title: 'Formulario de contacto', text: 'Formulario con nombre, email, teléfono opcional, tipo de proyecto y mensaje. El endpoint valida los datos y envía la consulta por correo al estudio.' },
      ],
      architecture: [
        { name: 'Sitio y páginas de obra', description: 'Next.js con rutas por categoría y detalle individual de proyecto.', technologies: ['Next.js', 'TypeScript'] },
        { name: 'Contenido estructurado', description: 'API routes, servicios y Prisma para consultar y administrar los proyectos en PostgreSQL.', technologies: ['PostgreSQL', 'TypeScript'] },
        { name: 'Medios y contacto', description: 'Cloudinary para las galerías y Nodemailer para las consultas del sitio.', technologies: ['Next.js'] },
      ],
      decisions: [
        { title: 'Datos de cada obra', text: 'Los campos de desafío, solución y resultado forman parte del modelo de datos. El estudio puede editarlos junto con las especificaciones y las fotografías.' },
        { title: 'Administración separada', text: 'El dashboard permite crear y editar proyectos. El middleware y las rutas de autenticación delimitan el área administrativa respecto de la navegación pública.' },
        { title: 'Protección del formulario', text: 'El contacto incorpora un campo honeypot, validaciones y límite de solicitudes. El rate limit del repositorio usa memoria del proceso, una decisión sencilla para ese despliegue que depende de su instancia de servidor.' },
      ],
      result: 'El estudio puede publicar y editar obras desde el administrador. Los visitantes consultan las fichas por categoría y envían consultas por correo desde el formulario.',
    },
    'madryn-buceo': {
      focus: 'Experiencias, cursos y puntos de buceo',
      deliverable: 'Sitio bilingüe de turismo y buceo',
      context: 'Desarrollé el rediseño de Madryn Buceo en español e inglés, con excursiones, cursos PADI y puntos de inmersión. Cada actividad tiene una ficha con fotografías y requisitos. El mapa permite consultar la ubicación y las características de los puntos de buceo.',
      features: [
        { title: 'Fichas de excursiones', text: 'Páginas individuales para excursiones y cursos con descripción, requisitos y galerías. Permiten comparar las actividades antes de consultar.' },
        { title: 'Mapa de inmersiones', text: 'Mapa Leaflet del Golfo Nuevo con puntos seleccionables, filtros, recuadro de información y acceso a la ficha. Los puntos incluyen profundidad, tiempo y certificación requerida.' },
        { title: 'Catálogo de cursos', text: 'Listado y filtros para cursos PADI, páginas por curso y contenido específico para buceadores certificados. La selección permite explorar formación y experiencias con distintos requisitos.' },
        { title: 'Español, inglés y contacto', text: 'React Intl organiza los mensajes en ambos idiomas. El formulario valida datos con Zod y envía la consulta mediante una server action y Nodemailer; también hay acceso directo a WhatsApp.' },
      ],
      architecture: [
        { name: 'Rutas y contenido', description: 'Next.js App Router con páginas de excursiones, cursos, equipo y contacto.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Exploración interactiva', description: 'Leaflet para el mapa de inmersiones, filtros y fichas; React Intl para los textos bilingües.', technologies: ['React', 'TypeScript'] },
        { name: 'Diseño y consultas', description: 'Tailwind CSS, animaciones de interfaz y server actions para el formulario de contacto.', technologies: ['Next.js'] },
      ],
      decisions: [
        { title: 'Selección de puntos de buceo', text: 'Los marcadores y las fichas comparten el punto seleccionado. Al elegir una inmersión en el mapa, se muestran sus características.' },
        { title: 'Transiciones entre páginas', text: 'El rediseño utiliza View Transitions entre las imágenes del catálogo y las páginas de detalle. Los enlaces también funcionan sin estas animaciones.' },
        { title: 'Traducciones y páginas del sitio', text: 'Los mensajes traducidos cubren navegación, actividades y formularios. Las rutas también incluyen sitemap, robots, una página de error y contenido de privacidad y términos.' },
      ],
      result: 'El rediseño reúne excursiones, cursos y puntos de buceo con fichas y mapas. Las consultas se envían por formulario o WhatsApp. El trabajo presentado corresponde al frontend del rediseño y al envío de consultas.',
    },
  },
  en: {
    'catalejo-travel': {
      focus: 'Content, pricing and enquiries', deliverable: 'Public website + CMS + API',
      context: 'I built the Catalejo Travel website and admin app so the agency could edit excursions, images and prices. Pricing varies by season and passenger type. The catalogue is available in Spanish and English, and the planner sends enquiries to the sales team through WhatsApp.',
      features: [
        { title: 'Bilingual catalogue', text: 'Experiences and categories with translations, galleries, ordering and publication managed in the CMS. The public site includes local fallback content when the API is unavailable.' },
        { title: 'Seasonal pricing', text: 'Date ranges and adult, child and senior prices. The API resolves prices for the selected date and rejects overlapping seasons.' },
        { title: 'Trip planner', text: 'Experiences, dates and passengers are assembled into a WhatsApp message. The team continues the conversation and confirms availability.' },
        { title: 'Administration and analytics', text: 'Users, roles, institutional content and VPS-hosted images and videos. First-party analytics reports visits, contacts and enquiries over 7, 30 and 90 days.' },
      ],
      architecture: [
        { name: 'Public website', description: 'Next.js presents published experiences in Spanish and English.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Administration', description: 'An independent React and Vite app manages content, media and seasonal prices.', technologies: ['React', 'TypeScript'] },
        { name: 'Domain and storage', description: 'Laravel API with Sanctum sessions, pricing rules, access policies and media storage.', technologies: ['Laravel', 'PHP'] },
      ],
      decisions: [
        { title: 'Catalogue availability', text: 'Migrated local content keeps the public information available if the API fails, separating catalogue reading from administrative editing.' },
        { title: 'Season validation', text: 'Seasonal changes use transactions and an experience-level lock. Validation prevents overlapping periods and identifies dates without a configured price.' },
        { title: 'Enquiry tracking', text: 'Events use an anonymous session identifier without storing visitor IP addresses. A planner enquiry is tracked as contact intent rather than a confirmed sale.' },
      ],
      result: 'The agency can update the catalogue and pricing from the admin app. WhatsApp enquiries include the selected excursions, dates and passengers. The sales team confirms availability and handles payments.',
    },
    'quinta-pata': {
      focus: 'Memberships, coverage and authorisations', deliverable: 'Backoffice + portal + modular API',
      context: 'Quinta Pata managed members and pets in spreadsheets. I built a system for those records, coverage plans and authorisations, with a member portal and a staff backoffice. The screenshot shows the public website.',
      features: [
        { title: 'Tutors and pets', text: 'Creation, editing, status, photos and tutor-pet relationships. Administrative screens provide membership records, plan history and summaries.' },
        { title: 'Excel imports', text: 'Excel uploads have separate preview and confirmation stages. Idempotent processing allows an import to be repeated without duplicating memberships.' },
        { title: 'Credentials and portal', text: 'PDF generation, download links, email delivery and QR verification. Member activation and access run separately from the staff backoffice.' },
        { title: 'Plans and authorisations', text: 'A procedure catalogue, coverage matrix, limits, discounts and scheduled pricing. Tokenisation includes OTP codes, validation, expiry and authorisation traceability.' },
      ],
      architecture: [
        { name: 'Website and portal', description: 'Next.js serves the landing page, public verification and member and provider access.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Backoffice', description: 'React and Vite screens for memberships, imports, plans, users and tokens.', technologies: ['React', 'TypeScript'] },
        { name: 'Business modules', description: 'A modular .NET monolith with Vertical Slice Architecture, MediatR, EF Core and PostgreSQL.', technologies: ['.NET', 'PostgreSQL', 'C#'] },
      ],
      decisions: [
        { title: 'Module boundaries', text: 'Memberships, Users, Plans and Tokenisation have their own features and persistence. New areas can be added without placing the entire domain in one management service.' },
        { title: 'QR verification', text: 'Credentials are issued as PDFs and can be downloaded or emailed. The QR code opens a validity check on the public website.' },
        { title: 'Sessions and codes', text: 'Access uses JWT and rotating refresh tokens in httpOnly cookies. Authorisation codes are protected with HMAC and have validity and expiry rules.' },
      ],
      result: 'Staff can manage members, pets, plans and authorisations from the backoffice. Members have a separate portal and PDF credentials with QR verification. Both applications use a modular .NET backend.',
    },
    'inspira-ingenieria': {
      focus: 'Projects, media and enquiries', deliverable: 'Corporate website + administration',
      context: 'I built the Inspira Ingeniería website and an admin app for publishing construction projects. The catalogue groups residential, industrial and functional projects. Each page includes photographs, technical specifications and a description of the work.',
      features: [
        { title: 'Projects by category', text: 'Residential, industrial and functional work, with individual project pages, images and technical content alongside services and team information.' },
        { title: 'Structured case studies', text: 'Architect, location, year, area, challenge, solution and result. Specifications cover the construction system, foundations, structure and standards.' },
        { title: 'Media management', text: 'Cover and gallery uploads through Cloudinary. Resources are organised by category and project and include alternative text.' },
        { title: 'Contact form', text: 'Name, email, optional phone, project type and message. The endpoint validates submissions and emails the studio.' },
      ],
      architecture: [
        { name: 'Website and project pages', description: 'Next.js routes by category and individual project.', technologies: ['Next.js', 'TypeScript'] },
        { name: 'Structured content', description: 'API routes, services and Prisma query and manage projects in PostgreSQL.', technologies: ['PostgreSQL', 'TypeScript'] },
        { name: 'Media and contact', description: 'Cloudinary handles galleries and Nodemailer delivers enquiries.', technologies: ['Next.js'] },
      ],
      decisions: [
        { title: 'Project data', text: 'Challenge, solution and result are part of the data model. The studio can edit them alongside specifications and photographs.' },
        { title: 'Separate administration', text: 'A dashboard creates and edits projects. Middleware and authentication routes separate the administrative area from public navigation.' },
        { title: 'Form protection', text: 'The contact flow includes a honeypot, validation and request limits. The repository uses an in-memory rate limiter, whose behaviour depends on the server instance.' },
      ],
      result: 'The studio can publish and edit projects from the admin app. Visitors browse project pages by category and send email enquiries through the contact form.',
    },
    'madryn-buceo': {
      focus: 'Experiences, courses and dive sites', deliverable: 'Bilingual travel and diving website',
      context: 'I built the Madryn Buceo redesign in Spanish and English, with excursions, PADI courses and dive sites. Each activity has a page with photographs and requirements. The map shows the location and characteristics of each dive site.',
      features: [
        { title: 'Excursion pages', text: 'Individual excursion and course pages include descriptions, requirements and galleries. Visitors can compare activities before getting in touch.' },
        { title: 'Dive site map', text: 'A Leaflet map of Golfo Nuevo with selectable points, filters, an information panel and detail views. Sites include depth, time and required certification.' },
        { title: 'Course catalogue', text: 'PADI course listings, filters and course pages, alongside content for certified divers. Visitors can explore training and activities with different requirements.' },
        { title: 'Languages and contact', text: 'React Intl organises Spanish and English messages. Zod validates the enquiry form, a server action delivers email through Nodemailer, and WhatsApp provides direct contact.' },
      ],
      architecture: [
        { name: 'Routes and content', description: 'Next.js App Router pages for excursions, courses, the team and contact.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Interactive exploration', description: 'Leaflet maps, filters and detail views with React Intl translations.', technologies: ['React', 'TypeScript'] },
        { name: 'Design and enquiries', description: 'Tailwind CSS, interface motion and server actions for the contact form.', technologies: ['Next.js'] },
      ],
      decisions: [
        { title: 'Dive site selection', text: 'Markers and information panels share the selected site. Selecting a dive site on the map displays its characteristics.' },
        { title: 'Page transitions', text: 'View Transitions connect catalogue images and detail pages. The links also work without these animations.' },
        { title: 'Translations and site pages', text: 'Translations cover navigation, activities and forms. Routes also include a sitemap, robots, an error page and privacy and terms content.' },
      ],
      result: 'The redesign includes excursions, courses and dive sites with detail pages and maps. Enquiries are sent through the form or WhatsApp. The work presented covers the redesign frontend and enquiry submission.',
    },
  },
};
