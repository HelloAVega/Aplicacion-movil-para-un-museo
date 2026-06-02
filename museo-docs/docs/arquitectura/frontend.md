---
id: frontend
title: Frontend
sidebar_position: 2
---

# Frontend

El frontend es una **Single Page Application** (SPA) construida con HTML, CSS y JavaScript puro, sin frameworks.

## Archivos

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura de las 4 pantallas + carga de scripts |
| `styles.css` | Estilos globales, variables de tema, diseño responsive |
| `app.js` | Lógica de navegación, llamadas a la API, renderizado de galería |

## Pantallas

### 1. Bienvenida (`screen-welcome`)
Formulario de registro con campos `nombre`, `edad` y `curso`. Al hacer clic en **Entrar**, llama a `POST /api/users/register` y guarda el usuario en `localStorage`.

### 2. Subida (`screen-upload`)
- Zona de captura/carga de imagen (drag & drop o input file).
- Vista previa de la imagen antes de subir.
- Campos: nombre de la obra y descripción.
- Al confirmar, llama a `POST /api/images` con el `dataUrl` de la imagen.
- Modal de confirmación al subir correctamente.

### 3. Galería (`screen-gallery`)
- Renderiza las imágenes en dos secciones: **mis imágenes** e **imágenes de otros usuarios**.
- Cada tarjeta muestra miniatura, nombre, autor, fecha y corazones.
- Al hacer clic en una tarjeta, abre el modal de detalle ampliado.
- Los corazones llaman a `POST /api/images/:id/heart`.

### 4. Cuenta (`screen-account`)
- Muestra el nombre del usuario actual.
- Permite editar el nombre (llama a `PUT /api/users/:id`).
- Sección **About Us** con descripción del MAMB y la Universidad Simón Bolívar.

## Funciones principales de `app.js`

```javascript
setupWelcome()        // Registro inicial
setupUpload()         // Subida de imágenes
renderGallery()       // Pintar la galería completa
setupImageDetails()   // Visor ampliado de cada imagen
setupImageRatings()   // Corazones persistentes
```

## Temas: claro y oscuro

El modo se alterna con el botón de luna en el header. Se guarda en `localStorage` bajo la clave `theme`. Las variables CSS controlan todos los colores:

```css
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --accent: #2e7d5e;
  /* ... */
}

[data-theme='dark'] {
  --bg: #121212;
  --text: #f0f0f0;
}
```

## Navegación inferior

Las tres pantallas principales (subida, galería, cuenta) comparten una barra `<nav class="bottom-nav">` con botones que disparan la navegación entre pantallas.

## Modelo de IA en el frontend

Los scripts de TensorFlow.js y Teachable Machine se cargan desde CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js"></script>
```

Los archivos del modelo viven en `my-pose-model/` y se cargan desde la misma URL del servidor.
