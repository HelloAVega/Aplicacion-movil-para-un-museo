---
id: variables-de-entorno
title: Variables de Entorno
sidebar_position: 4
---

# Variables de entorno

El servidor acepta estas variables de entorno:

| Variable | Por defecto | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto en el que escucha Express |
| `NODE_ENV` | `development` | Entorno. En Docker se pone `production` |

## Uso local

```bash
PORT=8080 npm start
```

## En Docker Compose

```yaml title="docker-compose.yml"
environment:
  - NODE_ENV=production
  - PORT=3000
```

## En Azure

Configúralas desde **Azure Portal → App Service / Container App → Configuración → Variables de aplicación**.
