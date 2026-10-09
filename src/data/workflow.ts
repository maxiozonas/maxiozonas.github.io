import type { Locale } from './content';

export const workflow: Record<Locale, { name: string; title: string; text: string; result: string }[]> = {
  es: [
    { name: 'Entender', title: 'Primero, la operación.', text: 'Escucho a quienes usan el sistema, relevo el trabajo cotidiano y ordeno las necesidades con el equipo. Antes de definir una solución, necesito entender el problema.', result: 'Contexto y prioridades compartidas' },
    { name: 'Diseñar', title: 'Una base que pueda crecer.', text: 'Defino los límites del sistema, los módulos y las integraciones. La arquitectura parte de la operación real y contempla cómo mantener y ampliar el producto.', result: 'Arquitectura y alcance de la solución' },
    { name: 'Construir', title: 'Conectar todas las piezas.', text: 'Desarrollo interfaces, APIs y aplicaciones web o móviles. Integro los sistemas existentes y valido el comportamiento de cada parte antes de unirlas.', result: 'Software integrado y probado' },
    { name: 'Entregar', title: 'Del código a producción.', text: 'Preparo los entornos, los despliegues y la puesta en marcha. Coordino las entregas con las áreas de negocio y acompaño a las personas que van a usar el software.', result: 'Una herramienta lista para la operación' },
    { name: 'Acompañar', title: 'El sistema sigue aprendiendo.', text: 'Observo lo que sucede en producción, atiendo el soporte y ajusto las prioridades con el equipo. Lo que aprendemos vuelve al producto y a su arquitectura.', result: 'Mejoras a partir del uso real' },
  ],
  en: [
    { name: 'Understand', title: 'The operation comes first.', text: 'I listen to the people using the system, study their day-to-day work and prioritise needs with the team. Understanding the problem comes before defining a solution.', result: 'Shared context and priorities' },
    { name: 'Design', title: 'A foundation that can grow.', text: 'I define system boundaries, modules and integrations. The architecture starts with the actual operation and considers how the product will be maintained and extended.', result: 'Architecture and a defined scope' },
    { name: 'Build', title: 'Connect all the pieces.', text: 'I build interfaces, APIs and web or mobile applications. I integrate existing systems and validate each part before bringing them together.', result: 'Integrated and tested software' },
    { name: 'Deliver', title: 'From code to production.', text: 'I prepare environments, deployments and rollout. I coordinate deliveries with business teams and support the people who will use the software.', result: 'A tool ready for the operation' },
    { name: 'Support', title: 'The system keeps learning.', text: 'I observe production, provide support and adjust priorities with the team. What we learn feeds back into the product and its architecture.', result: 'Improvements informed by actual use' },
  ],
};
