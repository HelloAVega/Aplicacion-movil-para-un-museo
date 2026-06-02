/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏛️ Introducción',
    },
    {
      type: 'category',
      label: '🚀 Inicio Rápido',
      collapsed: false,
      items: [
        'guias/instalacion',
        'guias/docker',
        'guias/azure',
      ],
    },
    {
      type: 'category',
      label: '🏗️ Arquitectura',
      items: [
        'arquitectura/overview',
        'arquitectura/frontend',
        'arquitectura/backend',
        'arquitectura/base-de-datos',
        'arquitectura/modelo-ia',
      ],
    },
    {
      type: 'category',
      label: '📡 API REST',
      items: [
        'api/endpoints',
        'api/usuarios',
        'api/imagenes',
      ],
    },
    {
      type: 'category',
      label: '⚙️ Configuración',
      items: [
        'guias/variables-de-entorno',
        'guias/solucion-problemas',
      ],
    },
  ],
};

export default sidebars;
