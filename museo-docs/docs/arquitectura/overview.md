---
id: overview
title: Vista General
sidebar_position: 1
description: Arquitectura general del Museo Interactivo.
---

# Arquitectura — Vista General

El proyecto sigue una arquitectura de **aplicación web monolítica** donde el frontend y el backend conviven en el mismo servidor Node.js.

## Diagrama de capas

```
┌─────────────────────────────────────────────┐
│                  Navegador                   │
│                                             │
│  index.html ──→ styles.css                  │
│       └──→ app.js  (4 pantallas SPA)        │
│               └──→ TF.js + Teachable Machine│
└────────────────────┬────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────┐
│              server.js (Express)             │
│                                             │
│  GET  /api/health                           │
│  GET  /api/bootstrap                        │
│  POST /api/users/register                   │
│  PUT  /api/users/:id                        │
│  GET  /api/images                           │
│  POST /api/images                           │
│  POST /api/images/:id/heart                 │
└────────────────────┬────────────────────────┘
                     │ sqlite3
┌────────────────────▼────────────────────────┐
│          data/museo.sqlite                   │
│                                             │
│  users · images · image_hearts · metadata   │
└─────────────────────────────────────────────┘
```

## Decisiones de diseño

### Frontend sin framework
El frontend usa **HTML, CSS y JavaScript puro**. No hay React, Vue ni Angular. Esto reduce la complejidad del proyecto y facilita el despliegue estático junto al servidor.

### SPA de cuatro pantallas
`app.js` maneja la navegación entre pantallas con CSS (`display: none / block`) sin cambiar la URL. Cada pantalla es un `<div id="screen-*">`.

### SQLite como base de datos
SQLite es ideal para este proyecto porque:
- No requiere un servidor de base de datos separado.
- Los datos viven en un único archivo fácil de respaldar.
- Es suficientemente rápido para el volumen esperado.

### Imágenes como `dataUrl`
Las imágenes se convierten a base64 (`dataUrl`) en el frontend y se guardan directamente en SQLite. Esto simplifica la arquitectura (no hay sistema de archivos de assets), aunque limita el tamaño a ~15 MB por imagen (configurado en Express).

### Modelo de IA en el navegador
El modelo de detección de poses corre **completamente en el navegador** usando TensorFlow.js. No hay llamadas al servidor para la inferencia.

---

Explora cada capa en detalle:

- [Frontend →](./frontend)
- [Backend →](./backend)
- [Base de datos →](./base-de-datos)
- [Modelo de IA →](./modelo-ia)
