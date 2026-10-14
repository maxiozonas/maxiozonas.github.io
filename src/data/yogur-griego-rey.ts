import type { Locale, Project } from './content';
import type { CaseStudy } from './case-studies';

const shared = {
  slug: 'yogur-griego-rey',
  name: 'Yogur Griego Rey',
  url: 'https://yogurgriegorey.com.ar/',
  image: '/projects/yogur-griego-rey.png',
  mobileImage: '/projects/yogur-griego-rey-mobile.webp',
  affiliation: 'Xenova' as const,
  stack: ['Laravel', 'React', 'Next.js', 'MySQL'],
};

export const yogurProjects: Record<Locale, Project> = {
  es: {
    ...shared,
    type: 'Gestión comercial y producción',
    summary: 'Ventas, caja, reparto en consignación y producción, con catálogo y pedidos por WhatsApp.',
    imageAlt: 'Sitio público de Yogur Griego Rey con catálogo de productos y pedidos por WhatsApp',
    description: 'Sistema para una fábrica de yogur artesanal de Puerto Madryn. Incluye una aplicación de gestión para ventas, caja, entregas a comercios, producción, stock y finanzas, y una web pública con catálogo y carrito. El pedido se envía por WhatsApp para confirmar disponibilidad.',
    details: ['Ventas del local, cierre de caja y cuentas corrientes de comercios.', 'Reparto en consignación, recetas, producción e inventario.', 'Catálogo administrable y carrito que prepara el pedido por WhatsApp.'],
  },
  en: {
    ...shared,
    type: 'Sales and production management',
    summary: 'Sales, cash reconciliation, consignment deliveries and production, with a catalogue and WhatsApp orders.',
    imageAlt: 'Yogur Griego Rey public website with product catalogue and WhatsApp orders',
    description: 'A system for an artisanal yogurt producer in Puerto Madryn. It includes a management application for sales, cash, store deliveries, production, stock and finances, plus a public catalogue and cart. Orders are sent through WhatsApp to confirm availability.',
    details: ['Shop sales, cash reconciliation and store account balances.', 'Consignment deliveries, recipes, production and inventory.', 'Editable catalogue and a cart that prepares WhatsApp orders.'],
  },
};

export const yogurStudies: Record<Locale, CaseStudy> = {
  es: {
    focus: 'Ventas, reparto y producción',
    deliverable: 'Sistema de gestión + web pública + API',
    context: 'La fábrica llevaba ventas, caja, reparto y producción en una planilla. El sistema organiza esos registros por área y conecta las entregas a comercios con las cantidades vendidas, retiradas y cobradas.',
    features: [
      { title: 'Ventas y caja diaria', text: 'Registro de ventas del local, formas de pago, anulaciones y arqueos de caja, con apertura, cierre e historial.' },
      { title: 'Reparto en consignación', text: 'Entregas por comercio con cantidades, precios y costos guardados al registrar el reparto. La conciliación registra lo retirado y reaprovechado, y calcula lo vendido. Incluye cobros, cuentas corrientes y consulta de deudores.' },
      { title: 'Recetas, producción y stock', text: 'Recetas con cantidades de insumos por producto. Cada tanda registra productos elaborados, consumos de materia prima y costos al momento de producir. Los módulos de stock muestran insumos y productos.' },
      { title: 'Catálogo y pedidos', text: 'Productos publicados desde la gestión, búsqueda y filtros por categoría. El carrito conserva productos y cantidades entre páginas y prepara un mensaje de WhatsApp con el pedido.' },
      { title: 'Finanzas', text: 'Registro de proveedores, sueldos y costos fijos. Resúmenes mensuales de ingresos, costos y ganancias, con cierres y movimientos de socios.' },
    ],
    architecture: [
      { name: 'API y reglas del negocio', description: 'Laravel y MySQL para ventas, reparto, producción y finanzas. Sanctum y permisos por operación controlan el acceso.', technologies: ['Laravel', 'PHP', 'MySQL'] },
      { name: 'Aplicación de gestión', description: 'React y TypeScript con Vite, formularios por área y TanStack Query para consultar y actualizar los datos.', technologies: ['React', 'TypeScript'] },
      { name: 'Web pública', description: 'Next.js consulta el catálogo publicado por la API. El carrito comparte el pedido entre la portada y el catálogo y genera el enlace de WhatsApp.', technologies: ['Next.js', 'React', 'TypeScript'] },
    ],
    decisions: [
      { title: 'Precios y costos registrados', text: 'Las ventas y entregas conservan los valores del momento de la operación. Las tandas guardan los consumos y costos de producción para mantener su registro histórico.' },
      { title: 'Conciliación por entrega', text: 'Cada línea de reparto se concilia una sola vez. Las entregas con líneas ya conciliadas no se pueden editar ni eliminar, para preservar los cálculos de ventas y las cuentas de los comercios.' },
      { title: 'Pedido persistente', text: 'El carrito conserva una copia del producto al agregarlo. El pedido sigue disponible aunque después cambie el catálogo. El cliente confirma disponibilidad por WhatsApp.' },
    ],
    result: 'El proyecto reúne una web pública con catálogo y pedidos, y una aplicación interna para ventas, caja, reparto, producción, inventario y finanzas. La captura muestra el sitio público; las funciones internas se describen a partir del código del repositorio.',
  },
  en: {
    focus: 'Sales, deliveries and production',
    deliverable: 'Management application + public website + API',
    context: 'The producer tracked sales, cash, deliveries and production in a spreadsheet. The system separates these records by area and connects store deliveries with quantities sold, returned and paid.',
    features: [
      { title: 'Shop sales and daily cash', text: 'Shop sales, payment methods, voids and cash reconciliation, with opening, closing and history.' },
      { title: 'Consignment deliveries', text: 'Deliveries by store with quantities, prices and costs saved when recorded. Reconciliation records returned and reused quantities and calculates sales. Includes payments, account balances and debtor records.' },
      { title: 'Recipes, production and stock', text: 'Recipes define ingredient quantities per product. Each batch records products made, ingredient consumption and costs at production time. Stock modules cover ingredients and finished products.' },
      { title: 'Catalogue and orders', text: 'Products published from the management application, with search and category filters. The cart keeps products and quantities between pages and prepares a WhatsApp order message.' },
      { title: 'Finances', text: 'Suppliers, wages and fixed costs. Monthly income, cost and profit summaries, with closing records and partner movements.' },
    ],
    architecture: [
      { name: 'API and business rules', description: 'Laravel and MySQL for sales, deliveries, production and finances. Sanctum and operation-level permissions control access.', technologies: ['Laravel', 'PHP', 'MySQL'] },
      { name: 'Management application', description: 'React and TypeScript with Vite, area-specific forms and TanStack Query for reading and updating data.', technologies: ['React', 'TypeScript'] },
      { name: 'Public website', description: 'Next.js reads the published catalogue from the API. The cart shares orders between the homepage and catalogue and builds the WhatsApp link.', technologies: ['Next.js', 'React', 'TypeScript'] },
    ],
    decisions: [
      { title: 'Recorded prices and costs', text: 'Sales and deliveries retain their original values. Production batches save ingredient consumption and costs to preserve the historical record.' },
      { title: 'Delivery reconciliation', text: 'Each delivery line can be reconciled once. Deliveries with reconciled lines cannot be edited or deleted, preserving sales calculations and store account balances.' },
      { title: 'Persistent orders', text: 'The cart stores a product snapshot when it is added. The order stays available even if the catalogue later changes. Customers confirm availability through WhatsApp.' },
    ],
    result: 'The project combines a public catalogue and order flow with an internal application for sales, cash, deliveries, production, inventory and finances. The screenshot shows the public website; internal features are described from repository source.',
  },
};
