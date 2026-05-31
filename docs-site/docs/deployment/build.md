---
title: Build de producción
---

La forma recomendada de build es con Docker:

```bash
docker build -t museo-interactivo .
```

Para ejecutar en producción:

```bash
docker run -p 3000:3000 -v museo_data:/app/data museo-interactivo
```

Asegura la variable `PORT=3000` si cambias el puerto por defecto.
