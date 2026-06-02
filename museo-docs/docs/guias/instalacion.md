---
id: instalacion
title: Instalación Local
sidebar_position: 1
description: Cómo correr el Museo Interactivo en tu máquina.
---

# Instalación local

Sigue estos pasos para levantar el proyecto en tu máquina sin Docker.

## Requisitos previos

- **Node.js 20** o superior — [descargar](https://nodejs.org)
- **npm** (viene incluido con Node.js)
- **Git**

Verifica tu versión:

```bash
node --version   # v20.x.x o superior
npm --version
```

## Clonar el repositorio

```bash
git clone https://github.com/HelloAVega/Aplicacion-movil-para-un-museo.git
cd Aplicacion-movil-para-un-museo
```

## Instalar dependencias

```bash
npm install
```

Esto instalará:

| Paquete | Versión | Uso |
|---|---|---|
| `express` | ^4.19.2 | Servidor HTTP y rutas REST |
| `sqlite3` | ^5.1.7 | Base de datos embebida |

## Iniciar el servidor

```bash
npm start
```

Deberías ver:

```
Servidor del museo activo en http://localhost:3000
Base de datos SQLite: /ruta/al/proyecto/data/museo.sqlite
```

## Abrir la aplicación

```
http://localhost:3000
```

:::tip Primera ejecución
En el primer arranque, el servidor crea automáticamente la carpeta `data/` y el archivo `museo.sqlite`. También inserta tres imágenes de ejemplo para que la galería no aparezca vacía.
:::

## Variables de entorno

Puedes cambiar el puerto antes de iniciar:

```bash
PORT=8080 npm start
```

O creando un archivo `.env` (requiere el paquete `dotenv` si lo prefieres):

```env
PORT=3000
NODE_ENV=development
```

## Verificar que el backend funciona

```bash
curl http://localhost:3000/api/health
# { "ok": true, "date": "2026-..." }
```

## Estructura de datos generada

Después de iniciar, verás:

```
data/
└── museo.sqlite   ← base de datos con tablas: users, images, image_hearts, metadata
```

---

¿Prefieres usar contenedores? → [Despliegue con Docker](./docker)
