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
      context: 'Una agencia de turismo necesita actualizar experiencias, imágenes y tarifas sin depender de una edición del código. En Patagonia, una misma excursión puede tener precios distintos según la fecha y el tipo de pasajero. El trabajo conecta esa operación con un catálogo bilingüe y un planificador que prepara la consulta para el equipo comercial.',
      features: [
        { title: 'Catálogo bilingüe', text: 'Experiencias y categorías con traducciones, galerías, orden de aparición y publicación administrados desde el CMS. El sitio incluye contenido local de respaldo cuando la API no está disponible.' },
        { title: 'Tarifas por temporada', text: 'Períodos con fechas de inicio y fin y precios para adultos, menores y personas mayores. La API resuelve el precio para la fecha elegida y valida que las temporadas no se superpongan.' },
        { title: 'Planificador de viaje', text: 'Selección de experiencias, fechas y pasajeros para preparar un mensaje de WhatsApp con el contexto de la consulta. El equipo comercial continúa la conversación y confirma disponibilidad.' },
        { title: 'Administración y analítica', text: 'Dashboard con usuarios y roles, contenido institucional, gestión de imágenes y videos alojados en el VPS. La analítica propia registra visitas, contactos y consultas en ventanas de 7, 30 y 90 días.' },
      ],
      architecture: [
        { name: 'Experiencia pública', description: 'Next.js presenta el catálogo en español e inglés y consume las experiencias publicadas.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Administración', description: 'Aplicación independiente en React y Vite para editar contenidos, medios y tarifas.', technologies: ['React', 'TypeScript'] },
        { name: 'Dominio y persistencia', description: 'API Laravel con sesiones Sanctum, reglas de precios, políticas de acceso y almacenamiento de medios.', technologies: ['Laravel', 'PHP'] },
      ],
      decisions: [
        { title: 'Disponibilidad del catálogo', text: 'El sitio puede recurrir al contenido migrado local si la API no responde. Esto mantiene disponible la información pública y separa la lectura del catálogo de la edición administrativa.' },
        { title: 'Precios coherentes', text: 'Las modificaciones de temporadas usan transacciones y bloqueo sobre la experiencia. La validación evita períodos superpuestos y la consulta identifica fechas sin tarifa configurada.' },
        { title: 'Consultas medibles', text: 'Los eventos usan un identificador de sesión anónimo, sin almacenar la IP del visitante. Una consulta al planificador se registra como intención de contacto, sin contarla como venta confirmada.' },
      ],
      result: 'Un mismo contenido alimenta el sitio y la administración. La agencia puede mantener su catálogo y sus tarifas, mientras las consultas llegan a WhatsApp con la información del viaje. La confirmación y los pagos se gestionan con el equipo comercial.',
    },
    'quinta-pata': {
      focus: 'Afiliados, cobertura y autorizaciones',
      deliverable: 'Backoffice + portal + API modular',
      context: 'La gestión de una cobertura para mascotas combina datos del tutor, legajos de animales, planes y documentación. El proyecto transforma esa información, inicialmente organizada en planillas, en un sistema con módulos separados para afiliación, usuarios, planes y autorizaciones. La captura pública muestra la landing; el alcance administrativo es considerablemente mayor.',
      features: [
        { title: 'Tutores y mascotas', text: 'Altas, edición, estados, fotos y relaciones entre tutores y mascotas. El administrador permite consultar legajos, historial de plan y resúmenes sin mezclar los datos personales con las reglas de cobertura.' },
        { title: 'Importación verificable', text: 'La carga desde Excel tiene una instancia de previsualización y otra de confirmación. El procesamiento idempotente permite repetir la importación sin duplicar afiliados.' },
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
        { title: 'Documentos verificables', text: 'La credencial no es solo un archivo para imprimir: tiene un flujo de emisión, descarga y verificación. El QR conecta el documento con una consulta pública de su validez.' },
        { title: 'Sesiones y códigos', text: 'El acceso combina JWT con rotación de refresh tokens en cookies httpOnly. Los códigos de autorización se protegen con HMAC y tienen reglas de vigencia y expiración.' },
      ],
      result: 'Desarrollé una base operativa que conecta legajos, credenciales verificables, planes y autorizaciones. Los módulos de afiliados, usuarios, planes y tokenización reúnen la gestión de coberturas en un backend modular, con un backoffice propio y un portal separado para afiliados.',
    },
    'inspira-ingenieria': {
      focus: 'Proyectos, medios y consultas',
      deliverable: 'Sitio corporativo + administrador',
      context: 'Un estudio de ingeniería estructural necesita mostrar obras con mucho más contexto que una galería de fotos. El sitio organiza viviendas, naves industriales y proyectos funcionales, y permite al equipo incorporar nuevas obras con su desafío, solución, resultados y especificaciones técnicas.',
      features: [
        { title: 'Obras por categoría', text: 'Catálogo de viviendas, naves industriales y proyectos funcionales. Cada obra tiene una página propia con imágenes y contenido técnico, además de la información de servicios y del equipo.' },
        { title: 'Fichas de proyecto', text: 'El modelo registra arquitecto, ubicación, año, superficie, desafío, solución y resultado. Las especificaciones incluyen sistema constructivo, fundaciones, estructura y normativa.' },
        { title: 'Gestión de imágenes', text: 'Carga de portada y fotografías complementarias mediante Cloudinary. Los recursos se organizan por categoría y proyecto, junto con sus textos alternativos.' },
        { title: 'Consultas con contexto', text: 'Formulario con nombre, email, teléfono opcional, tipo de proyecto y mensaje. El endpoint valida los datos y envía la consulta por correo al estudio.' },
      ],
      architecture: [
        { name: 'Sitio y páginas de obra', description: 'Next.js con rutas por categoría y detalle individual de proyecto.', technologies: ['Next.js', 'TypeScript'] },
        { name: 'Contenido estructurado', description: 'API routes, servicios y Prisma para consultar y administrar los proyectos en PostgreSQL.', technologies: ['PostgreSQL', 'TypeScript'] },
        { name: 'Medios y contacto', description: 'Cloudinary para las galerías y Nodemailer para las consultas del sitio.', technologies: ['Next.js'] },
      ],
      decisions: [
        { title: 'Una ficha que cuenta la obra', text: 'Los campos de desafío, solución y resultado forman parte del modelo de datos. Esto permite presentar el criterio técnico del estudio y mantener una estructura consistente entre obras.' },
        { title: 'Administración separada', text: 'El dashboard permite crear y editar proyectos. El middleware y las rutas de autenticación delimitan el área administrativa respecto de la navegación pública.' },
        { title: 'Protección del formulario', text: 'El contacto incorpora un campo honeypot, validaciones y límite de solicitudes. El rate limit del repositorio usa memoria del proceso, una decisión sencilla para ese despliegue que depende de su instancia de servidor.' },
      ],
      result: 'Un sitio institucional con un catálogo técnico administrable: el estudio puede publicar nuevas obras y explicar sus decisiones, mientras los visitantes recorren proyectos por categoría y envían consultas con contexto.',
    },
    'madryn-buceo': {
      focus: 'Experiencias, cursos y puntos de buceo',
      deliverable: 'Sitio bilingüe de turismo y buceo',
      context: 'Quien busca una experiencia de buceo necesita entender dónde se realiza, qué certificación requiere y qué puede esperar de la actividad. El sitio de Madryn Buceo reúne excursiones, cursos PADI y puntos de inmersión en una navegación bilingüe con fotografías, mapas y fichas dedicadas.',
      features: [
        { title: 'Experiencias con detalle', text: 'Páginas individuales para excursiones y cursos con descripción, requisitos, qué esperar y galerías. Los contenidos se organizan para que una persona pueda comparar la actividad antes de consultar.' },
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
        { title: 'El mapa como parte de la elección', text: 'Los marcadores y las fichas comparten el punto seleccionado. La persona puede comparar inmersiones y consultar sus características sin perder el contexto geográfico.' },
        { title: 'Continuidad al navegar', text: 'El rediseño utiliza View Transitions para relacionar el catálogo con las páginas de detalle. Los componentes de movimiento acompañan ese recorrido y conservan una navegación ordinaria como base.' },
        { title: 'Contenido accesible en dos idiomas', text: 'Los mensajes traducidos cubren navegación, actividades y formularios. Las rutas también incluyen sitemap, robots, una página de error y contenido de privacidad y términos.' },
      ],
      result: 'Una experiencia que permite recorrer actividades, cursos y puntos de buceo desde el mismo sitio. El mapa y las fichas aportan información concreta antes del contacto. Este caso documenta el frontend del rediseño actual y su flujo de consultas.',
    },
  },
  en: {
    'catalejo-travel': {
      focus: 'Content, pricing and enquiries', deliverable: 'Public website + CMS + API',
      context: 'A travel agency needs to update experiences, photography and seasonal prices without editing code. In Patagonia, the same excursion can have different prices by date and passenger type. The project connects those operations to a bilingual catalogue and a planner that prepares an enquiry for the sales team.',
      features: [
        { title: 'Bilingual catalogue', text: 'Experiences and categories with translations, galleries, ordering and publication managed in the CMS. The public site includes local fallback content when the API is unavailable.' },
        { title: 'Seasonal pricing', text: 'Date ranges and adult, child and senior prices. The API resolves prices for the selected date and rejects overlapping seasons.' },
        { title: 'Trip planner', text: 'Experiences, dates and passengers are assembled into a WhatsApp message. The team continues the conversation and confirms availability.' },
        { title: 'Administration and analytics', text: 'Users, roles, institutional content and VPS-hosted images and videos. First-party analytics reports visits, contacts and enquiries over 7, 30 and 90 days.' },
      ],
      architecture: [
        { name: 'Public experience', description: 'Next.js presents published experiences in Spanish and English.', technologies: ['Next.js', 'React', 'TypeScript'] },
        { name: 'Administration', description: 'An independent React and Vite app manages content, media and seasonal prices.', technologies: ['React', 'TypeScript'] },
        { name: 'Domain and storage', description: 'Laravel API with Sanctum sessions, pricing rules, access policies and media storage.', technologies: ['Laravel', 'PHP'] },
      ],
      decisions: [
        { title: 'Catalogue availability', text: 'Migrated local content keeps the public information available if the API fails, separating catalogue reading from administrative editing.' },
        { title: 'Consistent prices', text: 'Seasonal changes use transactions and an experience-level lock. Validation prevents overlapping periods and identifies dates without a configured price.' },
        { title: 'Measurable enquiries', text: 'Events use an anonymous session identifier without storing visitor IP addresses. A planner enquiry is tracked as contact intent rather than a confirmed sale.' },
      ],
      result: 'One content source serves the website and administration. The agency can maintain its catalogue and pricing, and WhatsApp enquiries arrive with trip context. Confirmation and payment remain with the sales team.',
    },
    'quinta-pata': {
      focus: 'Memberships, coverage and authorisations', deliverable: 'Backoffice + portal + modular API',
      context: 'Pet healthcare coverage involves tutor records, animals, plans and documentation. The project turns spreadsheet-based information into a system with separate membership, user, plan and authorisation modules. The public screenshot shows the landing page; the administrative scope is much broader.',
      features: [
        { title: 'Tutors and pets', text: 'Creation, editing, status, photos and tutor-pet relationships. Administrative screens provide membership records, plan history and summaries.' },
        { title: 'Verifiable imports', text: 'Excel uploads have separate preview and confirmation stages. Idempotent processing allows an import to be repeated without duplicating memberships.' },
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
        { title: 'Verifiable documents', text: 'A credential has an issuance, download and verification flow. Its QR code connects the printed document to a public validity check.' },
        { title: 'Sessions and codes', text: 'Access uses JWT and rotating refresh tokens in httpOnly cookies. Authorisation codes are protected with HMAC and have validity and expiry rules.' },
      ],
      result: 'Built an operational foundation connecting records, verifiable credentials, plans and authorisations. Membership, user, plan and tokenisation modules bring coverage management together in a modular backend, with a staff backoffice and a separate member portal.',
    },
    'inspira-ingenieria': {
      focus: 'Projects, media and enquiries', deliverable: 'Corporate website + administration',
      context: 'A structural engineering studio needs to show more than a photo gallery. The website organises residential, industrial and functional projects, allowing the team to publish each project with its challenge, solution, results and technical specifications.',
      features: [
        { title: 'Projects by category', text: 'Residential, industrial and functional work, with individual project pages, images and technical content alongside services and team information.' },
        { title: 'Structured case studies', text: 'Architect, location, year, area, challenge, solution and result. Specifications cover the construction system, foundations, structure and standards.' },
        { title: 'Media management', text: 'Cover and gallery uploads through Cloudinary. Resources are organised by category and project and include alternative text.' },
        { title: 'Contextual enquiries', text: 'Name, email, optional phone, project type and message. The endpoint validates submissions and emails the studio.' },
      ],
      architecture: [
        { name: 'Website and project pages', description: 'Next.js routes by category and individual project.', technologies: ['Next.js', 'TypeScript'] },
        { name: 'Structured content', description: 'API routes, services and Prisma query and manage projects in PostgreSQL.', technologies: ['PostgreSQL', 'TypeScript'] },
        { name: 'Media and contact', description: 'Cloudinary handles galleries and Nodemailer delivers enquiries.', technologies: ['Next.js'] },
      ],
      decisions: [
        { title: 'Explaining each project', text: 'Challenge, solution and result are part of the data model, giving the studio a consistent way to communicate its technical approach.' },
        { title: 'Separate administration', text: 'A dashboard creates and edits projects. Middleware and authentication routes separate the administrative area from public navigation.' },
        { title: 'Form protection', text: 'The contact flow includes a honeypot, validation and request limits. The repository uses an in-memory rate limiter, whose behaviour depends on the server instance.' },
      ],
      result: 'A corporate website with an editable technical catalogue. The studio can publish projects and explain its decisions, while visitors browse categories and send enquiries with context.',
    },
    'madryn-buceo': {
      focus: 'Experiences, courses and dive sites', deliverable: 'Bilingual travel and diving website',
      context: 'Choosing a diving experience requires understanding the location, certification requirements and activity. Madryn Buceo brings excursions, PADI courses and dive sites into a bilingual website with photography, maps and dedicated detail pages.',
      features: [
        { title: 'Detailed experiences', text: 'Individual excursion and course pages include descriptions, requirements, what to expect and galleries, helping visitors compare activities before getting in touch.' },
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
        { title: 'A map that helps visitors choose', text: 'Markers and information panels share the selected site. Visitors can compare dives without losing their geographic context.' },
        { title: 'Navigation continuity', text: 'View Transitions connect catalogue images and detail pages. Motion components support that journey while keeping standard navigation as a base.' },
        { title: 'Bilingual content', text: 'Translations cover navigation, activities and forms. Routes also include a sitemap, robots, an error page and privacy and terms content.' },
      ],
      result: 'One site for exploring activities, courses and dive locations. Maps and detail pages provide concrete information before contact. This case documents the current redesign frontend and enquiry flow.',
    },
  },
};
