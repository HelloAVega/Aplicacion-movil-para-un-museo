---
title: Hosting y publicación
---

## Aplicación

Si vas a publicar el proyecto en un servicio como Azure, la ruta más directa es usar una imagen de contenedor:

1. Construye la imagen Docker.
2. Sube la imagen a un registro (Azure Container Registry u otro).
3. Crea una App Service o Container App apuntando a esa imagen.
4. Define `PORT=3000`.
5. Conserva el volumen persistente en `/app/data`.

## Documentación (Docusaurus)

Para publicar el sitio de documentación:

- Ajusta `url` y `baseUrl` en `docs-site/docusaurus.config.js` según el dominio final.
- Ejecuta el build en `docs-site`:

  ```bash
  npm run build
  ```

- Para GitHub Pages puedes usar `npm run deploy` (o un workflow de Actions). En Netlify/Vercel, configura el directorio `docs-site` y el comando de build.
