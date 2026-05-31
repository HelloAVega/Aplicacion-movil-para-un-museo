---
title: Docker
---

### Docker Compose

```bash
docker compose up --build
```

### Docker manual

```bash
docker build -t museo-interactivo .
docker run -p 3000:3000 -v museo_data:/app/data museo-interactivo
```

El volumen `museo_data` conserva la base de datos `data/museo.sqlite` entre reinicios.
