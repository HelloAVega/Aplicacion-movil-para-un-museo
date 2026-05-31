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
  tagline: 'Documentación del museo interactivo para crear, compartir y explorar obras.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://helloavega.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/Aplicacion-movil-para-un-museo/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'HelloAVega', // Usually your GitHub org/user name.
  projectName: 'Aplicacion-movil-para-un-museo', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo/tree/main/docs-site/',
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
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Museo Interactivo',
        logo: {
          alt: 'Museo Interactivo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Documentación',
          },
          {
            href: 'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo',
            label: 'GitHub',
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
              {
                label: 'Introducción',
                to: '/docs/intro',
              },
              {
                label: 'Puesta en marcha',
                to: '/docs/getting-started/requirements',
              },
            ],
          },
          {
            title: 'Guía técnica',
            items: [
              {
                label: 'Arquitectura',
                to: '/docs/dev-guide/architecture',
              },
              {
                label: 'API',
                to: '/docs/api/endpoints',
              },
            ],
          },
          {
            title: 'Proyecto',
            items: [
              {
                label: 'Repositorio',
                href: 'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo',
              },
              {
                label: 'Contribuir',
                to: '/docs/contributing',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Museo Interactivo.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
