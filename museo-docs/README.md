# Documentación — Museo Interactivo

Documentación del proyecto construida con [Docusaurus 3](https://docusaurus.io/).

## Inicio rápido

```bash
npm install
npm start
```

Abre http://localhost:3000 (o el puerto que indique la terminal; Docusaurus elige 3001 si 3000 está ocupado).

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
│   ├── css/custom.css                  ← Tema del museo (verde Caribe)
│   ├── pages/index.js                  ← Homepage
│   └── components/HomepageFeatures/
├── static/img/logo.svg
├── docusaurus.config.js
├── sidebars.js
└── package.json
```

## Build para producción

```bash
npm run build
# La carpeta build/ contiene el sitio estático listo para desplegar
```

## Despliegue en GitHub Pages

```bash
GIT_USER=HelloAVega npm run deploy
```

Esto publica en la rama `gh-pages` del repositorio.
