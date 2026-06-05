// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Museo Interactivo',
  tagline: 'Galería digital para estudiantes y visitantes del MAMB',
  favicon: 'img/logo-app.png',

  future: {
    v4: true,
  },

  url: 'https://helloavega.github.io',
  baseUrl: '/docs',

  organizationName: 'HelloAVega',
  projectName: 'my-website',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Museo Interactivo',
        logo: {
          alt: 'Museo Interactivo',
          src: 'img/logo-app.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentación',
          },
          {
            href: 'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo',
            label: 'Repositorio',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentación',
            items: [
              {label: 'Introducción', to: '/intro'},
              {label: 'Instalación', to: '/guias/instalacion'},
              {label: 'API REST', to: '/api/endpoints'},
            ],
          },
          {
            title: 'Arquitectura',
            items: [
              {label: 'Vista general', to: '/arquitectura/overview'},
              {label: 'Frontend', to: '/arquitectura/frontend'},
              {label: 'Base de datos', to: '/arquitectura/base-de-datos'},
            ],
          },
          {
            title: 'Proyecto',
            items: [
              {
                label: 'Universidad Simón Bolívar',
                href: 'https://www.unisimon.edu.co',
              },
              {
                label: 'Código fuente',
                href: 'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Museo Interactivo — USB & MAMB. Documentación con Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
