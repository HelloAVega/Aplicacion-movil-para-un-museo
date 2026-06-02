---
id: docker
title: Docker y Docker Compose
sidebar_position: 2
description: Desplegar el Museo Interactivo con contenedores Docker.
---

# Docker y Docker Compose

El proyecto incluye un `Dockerfile` y un `docker-compose.yml` listos para producción.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine
- Docker Compose v2 (viene incluido en Docker Desktop)

## Levantar con Docker Compose

```bash
docker compose up --build
```

Esto hace todo en un solo comando:

1. Construye la imagen desde el `Dockerfile`
2. Inicia el contenedor en el puerto `3000`
3. Monta el volumen `museo_data` para persistir la base de datos

Abre la app en: **http://localhost:3000**

## Configuración del `docker-compose.yml`

```yaml title="docker-compose.yml"
services:
  museo:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - museo_data:/app/data

volumes:
  museo_data:
```

:::important Persistencia
El volumen `museo_data` se monta en `/app/data` dentro del contenedor. Eso significa que la base de datos **no se borra** aunque el contenedor se reinicie o se reconstruya la imagen.
:::

## Comandos útiles

```bash
# Construir sin iniciar
docker compose build

# Iniciar en background
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Detener y eliminar contenedores (los datos persisten)
docker compose down

# Detener Y eliminar el volumen (borra la base de datos)
docker compose down -v
```

## Ejecutar la imagen directamente

```bash
# Construir la imagen
docker build -t museo-interactivo .

# Correrla con volumen persistente
docker run -p 3000:3000 \
  -v museo_data:/app/data \
  -e NODE_ENV=production \
  museo-interactivo
```

## Variables de entorno disponibles

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto del servidor Express |
| `NODE_ENV` | `production` | Entorno de ejecución |

## Verificar el contenedor

```bash
# Estado del contenedor
docker compose ps

# Salud del servidor
curl http://localhost:3000/api/health
```

---

¿Quieres publicarlo en la nube? → [Despliegue en Azure](./azure)
