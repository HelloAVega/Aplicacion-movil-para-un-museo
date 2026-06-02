---
id: endpoints
title: Endpoints — Vista General
sidebar_position: 1
description: Resumen de todos los endpoints disponibles en la API REST del Museo Interactivo.
---

# API REST — Vista General

Todos los endpoints usan JSON. El servidor escucha en `http://localhost:3000` por defecto.

## Resumen

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servidor |
| `GET` | `/api/bootstrap` | Datos iniciales (usuario + imágenes) |
| `POST` | `/api/users/register` | Registrar usuario |
| `PUT` | `/api/users/:id` | Actualizar nombre del usuario |
| `GET` | `/api/images` | Listar imágenes con estado de corazones |
| `POST` | `/api/images` | Registrar nueva imagen |
| `POST` | `/api/images/:id/heart` | Dar / quitar corazón |

## Cabeceras requeridas

```http
Content-Type: application/json
```

## Formato de respuesta de errores

```json
{
  "error": "Descripción del error en español."
}
```

Los códigos HTTP usados son: `200`, `201`, `400`, `404`, `500`.

---

### `GET /api/health`

Verifica que el servidor esté activo.

**Respuesta exitosa (`200`)**

```json
{
  "ok": true,
  "date": "2026-05-29T10:00:00.000Z"
}
```

---

### `GET /api/bootstrap?userId=<id>`

Carga el usuario guardado y las imágenes de la galería en una sola petición. Es el primer endpoint que llama el frontend al iniciar.

**Parámetros de query**

| Parámetro | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `userId` | string | No | UUID del usuario activo |

**Respuesta exitosa (`200`)**

```json
{
  "user": {
    "id": "uuid",
    "name": "María",
    "age": "20",
    "course": "Ingeniería de Sistemas",
    "createdAt": "2026-05-29T10:00:00.000Z"
  },
  "images": [ /* array de objetos Image */ ]
}
```

Si `userId` no existe o no se envía, `user` es `null`.

---

Ver los endpoints de usuarios e imágenes en detalle:

- [Usuarios →](./usuarios)
- [Imágenes →](./imagenes)
