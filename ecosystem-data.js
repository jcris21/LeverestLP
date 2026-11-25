// Claude AI Ecosystem — datos de las 8 capacidades (independientes del componente visual)
window.AILA_ECOSYSTEM = {
  intro: {
    eyebrow: 'THE CLAUDE AI ECOSYSTEM',
    title: 'Una inteligencia. Múltiples capacidades.',
    lead: 'Claude no es un chat. Es un núcleo de inteligencia del que salen ocho capacidades conectadas entre sí. En el curso aprendes a usarlas juntas.'
  },
  stages: [
    { n: '01', t: 'CORE', d: 'El núcleo de inteligencia.' },
    { n: '02', t: 'EXPANSION', d: 'Ocho capacidades se despliegan.' },
    { n: '03', t: 'DEEP DIVE', d: 'Abre cualquiera para ver cómo se usa.' }
  ],
  items: [
    {
      id: 'chat', n: '01', side: 'l', icon: 'message-square',
      name: 'Claude Chat',
      tag: 'Tu punto de partida para pensar, investigar y escribir.',
      what: 'La conversación es la interfaz. Describes el trabajo con contexto y Claude razona contigo en lugar de devolverte un bloque de texto genérico.',
      useFor: ['Investigar y resumir fuentes largas.', 'Escribir correos, guiones y propuestas.', 'Reescribir y afinar tono y formato.'],
      example: 'Pegas tres informes de proveedores y pides una comparativa con criterios propios y una recomendación justificada.',
      tip: 'Sé específico con tono, formato y audiencia. Un prompt con contexto vale más que diez repreguntas.',
      module: 'm04', moduleLabel: 'MÓDULO 04', moduleName: 'Introducción a Claude AI y Claude Chat',
      lessons: ['Cómo hablarle a Claude', 'Estructura de un buen prompt', 'Investigación y síntesis']
    },
    {
      id: 'projects', n: '02', side: 'l', icon: 'folder-kanban',
      name: 'Proyectos y Memoria',
      tag: 'Tu contexto deja de perderse entre conversaciones.',
      what: 'Un proyecto guarda archivos, instrucciones y prompts en un espacio persistente. Claude arranca cada sesión sabiendo quién eres y cómo trabajas.',
      useFor: ['Gestionar trabajo en curso sin repetir contexto.', 'Guardar instrucciones de marca o de equipo.', 'Separar clientes, áreas o productos.'],
      example: 'Un proyecto por cliente con su tono de voz, su histórico y sus plantillas. Entras y sigues donde lo dejaste.',
      tip: 'Crea proyectos separados por objetivo, no por herramienta. El contexto mezclado degrada las respuestas.',
      module: 'm06', moduleLabel: 'MÓDULO 06', moduleName: 'Proyectos y memoria persistente',
      lessons: ['Crear tu primer proyecto', 'Instrucciones persistentes', 'Gestión de conocimiento']
    },
    {
      id: 'artifacts', n: '03', side: 'l', icon: 'app-window',
      name: 'Artefactos',
      tag: 'Del texto a una herramienta que puedes usar.',
      what: 'Claude produce entregables reales —aplicaciones, calculadoras, paneles, documentos— que se ejecutan y se iteran delante de ti.',
      useFor: ['Crear planificadores y calculadoras.', 'Diseñar paneles y prototipos.', 'Publicar herramientas internas sin programar.'],
      example: 'Describes un simulador de precios para tu servicio y en minutos tienes una app funcionando que puedes compartir.',
      tip: 'Itera sobre el artefacto en lugar de empezar de cero. Cada ajuste conserva lo que ya funcionaba.',
      module: 'm05', moduleLabel: 'MÓDULO 05', moduleName: 'Artefactos: crea aplicaciones con Claude',
      lessons: ['Tu primer artefacto', 'Iteración y refinamiento', 'Compartir y publicar']
    },
    {
      id: 'cowork', n: '04', side: 'l', icon: 'users',
      name: 'Claude Cowork',
      tag: 'Delega trabajo real sobre tus archivos.',
      what: 'Claude trabaja directamente con tus documentos y carpetas, como un compañero de equipo que ejecuta tareas completas y no solo responde.',
      useFor: ['Resumir y comparar documentos extensos.', 'Ordenar datos desordenados.', 'Extraer decisiones y próximos pasos.'],
      example: 'Le pasas la carpeta de un proyecto y te devuelve el estado real, los bloqueos y un plan de la semana.',
      tip: 'Sube archivos completos en lugar de copiar y pegar fragmentos. El contexto completo cambia el resultado.',
      module: 'm07', moduleLabel: 'MÓDULO 07', moduleName: 'Claude Cowork: delega trabajo',
      lessons: ['Delegar tareas complejas', 'Organizar proyectos y archivos', 'Instrucciones persistentes']
    },
    {
      id: 'mcp', n: '05', side: 'r', icon: 'plug',
      name: 'Conectores MCP',
      tag: 'Claude trabaja dentro de tus herramientas.',
      what: 'MCP conecta Claude a tus sistemas —correo, archivos, bases de datos, gestores de tareas— con permisos explícitos.',
      useFor: ['Gmail y Google Drive.', 'Slack y Notion.', 'Automatizar flujos entre herramientas.'],
      example: 'Claude lee la reunión en tu Drive, crea las tareas en Notion y redacta el seguimiento en Gmail.',
      tip: 'Conecta las herramientas una vez y ahorras horas después. Empieza por donde más tiempo pierdes.',
      module: 'm08', moduleLabel: 'MÓDULO 08', moduleName: 'Conectores MCP: conecta tus herramientas',
      lessons: ['Qué es MCP', 'Conectar tus primeras herramientas', 'Permisos y seguridad']
    },
    {
      id: 'skills', n: '06', side: 'r', icon: 'lightbulb',
      name: 'Habilidades',
      tag: 'Tus mejores prompts se convierten en capacidades reutilizables.',
      what: 'Una habilidad empaqueta instrucciones, criterios y ejemplos para que Claude ejecute un proceso igual de bien cada vez.',
      useFor: ['Estandarizar entregables del equipo.', 'Repetir procesos sin reescribir el prompt.', 'Compartir tu criterio con otros.'],
      example: 'Conviertes tu método de auditoría de contenido en una habilidad y cualquiera del equipo la ejecuta igual.',
      tip: 'Cuando repitas un prompt por tercera vez, conviértelo en habilidad.',
      module: 'm07', moduleLabel: 'MÓDULO 07', moduleName: 'Claude Cowork: delega trabajo',
      lessons: ['Crear instrucciones persistentes', 'De prompt a habilidad', 'Reutilización en equipo']
    },
    {
      id: 'computer', n: '07', side: 'r', icon: 'monitor',
      name: 'Uso del ordenador',
      tag: 'Claude ejecuta tareas en el entorno, no solo las describe.',
      what: 'Claude opera herramientas conectadas y ejecuta pasos encadenados hasta completar el trabajo, mostrando lo que hace.',
      useFor: ['Procesar lotes de archivos.', 'Completar flujos de varios pasos.', 'Preparar entregables listos para enviar.'],
      example: 'Le pides cerrar el mes: toma los datos, genera el informe y deja el borrador listo para revisión.',
      tip: 'Define el criterio de "terminado" antes de delegar. Sin él, la ejecución se queda a medias.',
      module: 'm07', moduleLabel: 'MÓDULO 07', moduleName: 'Claude Cowork: delega trabajo',
      lessons: ['Ejecución de tareas', 'Supervisión y control', 'Herramientas conectadas']
    },
    {
      id: 'scheduled', n: '08', side: 'r', icon: 'calendar-clock',
      name: 'Tareas programadas',
      tag: 'Trabajo que ocurre sin que tú lo lances.',
      what: 'Programas tareas recurrentes y artefactos dinámicos que se actualizan solos con datos nuevos.',
      useFor: ['Informes semanales automáticos.', 'Resúmenes diarios de tu bandeja.', 'Paneles que se refrescan con datos nuevos.'],
      example: 'Cada lunes a las 8:00 recibes el resumen del negocio con los números de la semana y las alertas.',
      tip: 'Programa primero lo que ya haces manualmente cada semana. Ahí está el apalancamiento inmediato.',
      module: 'm07', moduleLabel: 'MÓDULO 07', moduleName: 'Claude Cowork: delega trabajo',
      lessons: ['Programar tareas', 'Artefactos dinámicos', 'Diseñar tu rutina delegada']
    }
  ]
};
