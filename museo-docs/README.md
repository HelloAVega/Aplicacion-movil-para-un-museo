# Documentación — Museo Interactivo

Documentación del proyecto construida con [Docusaurus](https://docusaurus.io/).

## Inicio rápido

```bash
npm install
npm start
```

## Estructura

```
museo-docs/
├── docs/
│   ├── intro.md                        ← Introducción
│   ├── guias/
│   │   ├── instalacion.md
│   │   ├── docker.md
│   │   ├── azure.md
│   │   ├── variables-de-entorno.md
│   │   └── solucion-problemas.md
│   ├── arquitectura/
│   │   ├── overview.md
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   ├── base-de-datos.md
│   │   └── modelo-ia.md
│   └── api/
│       ├── endpoints.md
│       ├── usuarios.md
│       └── imagenes.md
├── src/
│   ├── css/custom.css                  ← Tema del museo 
│   ├── pages/index.js                  ← Homepage
│   └── components/HomepageFeatures/
├── static/img/logo.svg
├── docusaurus.config.js
├── sidebars.js
└── package.json
```
