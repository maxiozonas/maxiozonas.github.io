import type { Locale } from './content';

export const workflow: Record<Locale, { name: string; title: string; text: string; result: string }[]> = {
  es: [
    { name: 'Entender', title: 'Relevamiento', text: 'Hablo con quienes van a usar el sistema y reviso cómo trabajan. Con el equipo, defino qué hace falta resolver primero.', result: 'Requerimientos y prioridades' },
    { name: 'Diseñar', title: 'Arquitectura', text: 'Defino los módulos, los datos y las integraciones. Reviso qué sistemas ya existen y cómo vamos a mantener la aplicación.', result: 'Diseño técnico y alcance' },
    { name: 'Construir', title: 'Desarrollo y pruebas', text: 'Desarrollo las interfaces, las APIs y las aplicaciones. Pruebo su funcionamiento y las integraciones con otros sistemas.', result: 'Aplicación probada' },
    { name: 'Entregar', title: 'Puesta en producción', text: 'Configuro los entornos y los despliegues. Coordino la puesta en marcha con el equipo y explico cómo usar la aplicación.', result: 'Aplicación en producción' },
    { name: 'Acompañar', title: 'Soporte y mantenimiento', text: 'Monitoreo los sistemas, resuelvo errores y atiendo consultas. Con el equipo, priorizo los cambios que surgen del uso diario.', result: 'Correcciones y mejoras' },
  ],
  en: [
    { name: 'Understand', title: 'Requirements', text: 'I talk to the people who will use the system and review how they work. With the team, I decide what needs to be addressed first.', result: 'Requirements and priorities' },
    { name: 'Design', title: 'Architecture', text: 'I define modules, data and integrations. I review existing systems and plan how we will maintain the application.', result: 'Technical design and scope' },
    { name: 'Build', title: 'Development and testing', text: 'I build interfaces, APIs and applications. I test their behaviour and integrations with other systems.', result: 'Tested application' },
    { name: 'Deliver', title: 'Deployment', text: 'I configure environments and deployments. I coordinate the rollout with the team and explain how to use the application.', result: 'Application in production' },
    { name: 'Support', title: 'Support and maintenance', text: 'I monitor systems, fix errors and answer questions. With the team, I prioritise changes that come up during everyday use.', result: 'Fixes and improvements' },
  ],
};
