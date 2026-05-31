// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Introducción',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Puesta en marcha',
      items: [
        'getting-started/requirements',
        'getting-started/installation',
        'getting-started/run-local',
        'getting-started/docker',
      ],
    },
    {
      type: 'category',
      label: 'Guía de usuario',
      items: [
        'user-guide/overview',
        'user-guide/subir-obras',
        'user-guide/galeria',
        'user-guide/detalle-obra',
      ],
    },
    {
      type: 'category',
      label: 'Guía técnica',
      items: [
        'dev-guide/project-structure',
        'dev-guide/architecture',
        'dev-guide/styling',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: ['api/endpoints'],
    },
    {
      type: 'category',
      label: 'Despliegue',
      items: ['deployment/build', 'deployment/hosting'],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: ['troubleshooting'],
    },
    {
      type: 'category',
      label: 'Contribución',
      items: ['contributing'],
    },
  ],
};

export default sidebars;
