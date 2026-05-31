// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Museo Interactivo',
  tagline: 'Documentación del proyecto — Universidad Simón Bolívar',
  favicon: 'img/favicon.ico',

  url: 'https://HelloAVega.github.io',
  baseUrl: '/Aplicacion-movil-para-un-museo/',

  organizationName: 'HelloAVega',
  projectName: 'Aplicacion-movil-para-un-museo',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

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
          editUrl: 'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo/edit/main/',
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
      image: 'img/social-card.png',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Museo Interactivo',
        logo: {
          alt: 'Museo Interactivo Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentación',
          },
          {
            href: 'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://museo.aprojects.dev',
            label: 'Ver App',
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
              { label: 'Introducción', to: '/docs/intro' },
              { label: 'Arquitectura', to: '/docs/arquitectura/overview' },
              { label: 'API REST', to: '/docs/api/endpoints' },
            ],
          },
          {
            title: 'Proyecto',
            items: [
              { label: 'GitHub', href: 'https://github.com/HelloAVega/Aplicacion-movil-para-un-museo' },
              { label: 'Demo en vivo', href: 'https://museo.aprojects.dev' },
            ],
          },
          {
            title: 'Universidad Simón Bolívar',
            items: [
              { label: 'Ingeniería de Sistemas', href: '#' },
              { label: 'Ingeniería de Datos e IA', href: '#' },
              { label: 'Maestría en IA', href: '#' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Universidad Simón Bolívar — Museo Interactivo. Construido con Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'yaml', 'json', 'docker'],
      },
      announcementBar: {
        id: 'live_demo',
        content: '🎨 El Museo Interactivo ya está en vivo — <a href="https://museo.aprojects.dev" target="_blank">visita la app</a>',
        backgroundColor: '#2e7d5e',
        textColor: '#ffffff',
        isCloseable: true,
      },
    }),
};

export default config;
