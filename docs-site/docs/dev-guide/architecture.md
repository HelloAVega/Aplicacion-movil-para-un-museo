---
title: Arquitectura
---

- **Frontend:** archivos estáticos servidos por Express y consumiendo la API REST.
- **Backend:** Node.js con Express y SQLite.
- **Persistencia:** `data/museo.sqlite` con tablas `users`, `images` e `image_hearts`.
- **Flujo principal:** registro → creación de obra → consulta de galería → corazones por usuario.
- **Imágenes:** se almacenan como `dataUrl` dentro de SQLite.
