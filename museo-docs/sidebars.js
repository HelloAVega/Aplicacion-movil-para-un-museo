// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Guías',
      link: {type: 'generated-index', title: 'Guías'},
      items: [
        'guias/instalacion',
        'guias/docker',
        'guias/azure',
        'guias/variables-de-entorno',
        'guias/solucion-problemas',
      ],
    },
    {
      type: 'category',
      label: 'Arquitectura',
      link: {type: 'generated-index', title: 'Arquitectura'},
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
      label: 'API',
      link: {type: 'generated-index', title: 'API REST'},
      items: ['api/endpoints', 'api/usuarios', 'api/imagenes'],
    },
  ],
};

export default sidebars;
