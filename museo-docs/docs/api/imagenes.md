---
id: imagenes
title: Imágenes
sidebar_position: 3
---

# API — Imágenes

## Objeto `Image`

Todos los endpoints que devuelven imágenes usan este formato:

```json
{
  "id": "uuid",
  "artwork": "Amanecer en el Caribe",
  "author": "María García",
  "description": "Una obra que captura la luz del Caribe colombiano.",
  "date": "29/05/2026",
  "ownerId": "uuid-del-usuario",
  "ownerName": "María García",
  "dataUrl": "data:image/jpeg;base64,...",
  "heartsCount": 3,
  "viewerHasHeart": false
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | UUID de la imagen |
| `artwork` | string | Nombre de la obra |
| `author` | string | Nombre del autor |
| `description` | string | Descripción de la obra |
| `date` | string | Fecha (dd/mm/yyyy) |
| `ownerId` | string | UUID del dueño |
| `ownerName` | string | Nombre del dueño |
| `dataUrl` | string \| null | Imagen en base64 |
| `heartsCount` | number | Total de corazones |
| `viewerHasHeart` | boolean | ¿El usuario actual ya dio corazón? |

---

## `GET /api/images?userId=<id>`

Devuelve todas las imágenes de la galería con el estado de corazones para el usuario activo.

**Parámetros de query**

| Parámetro | Obligatorio | Descripción |
|---|---|---|
| `userId` | No | UUID del usuario activo (para calcular `viewerHasHeart`) |

**Respuesta exitosa (`200`)**

```json
{
  "images": [ /* array de objetos Image, ordenados por fecha desc */ ]
}
```

---

## `POST /api/images`

Registra una nueva imagen en la galería.

**Body**

```json
{
  "ownerId": "uuid-del-usuario",
  "artwork": "Amanecer en el Caribe",
  "description": "Una obra que captura la luz del Caribe.",
  "date": "29/05/2026",
  "dataUrl": "data:image/jpeg;base64,..."
}
```

| Campo | Obligatorio | Descripción |
|---|---|---|
| `ownerId` | ✅ | UUID del usuario dueño |
| `artwork` | ✅ | Nombre de la obra |
| `description` | ✅ | Descripción de la obra |
| `date` | No | Fecha (si no se envía, usa la fecha actual) |
| `dataUrl` | No | Imagen en base64 (máx. ~15 MB) |

**Respuesta exitosa (`201`)**

```json
{
  "image": { /* objeto Image */ }
}
```

**Errores**

| Código | Motivo |
|---|---|
| `400` | Falta `ownerId`, `artwork` o `description` |
| `404` | Usuario no encontrado |
| `500` | Error al guardar |

---

## `POST /api/images/:id/heart`

Alterna el corazón de una imagen para el usuario. Si ya tiene corazón, lo quita. Si no tiene, lo agrega.

**Parámetros de ruta**

| Parámetro | Descripción |
|---|---|
| `:id` | UUID de la imagen |

**Body**

```json
{
  "userId": "uuid-del-usuario"
}
```

**Respuesta exitosa (`200`)**

Devuelve la imagen actualizada con los nuevos conteos:

```json
{
  "image": {
    "id": "...",
    "heartsCount": 4,
    "viewerHasHeart": true,
    /* ... resto de campos ... */
  }
}
```

:::info Transacción atómica

La operación modifica tanto `image_hearts` como `images.rating` dentro de una única transacción para garantizar consistencia.
:::

**Errores**

| Código | Motivo |
|---|---|
| `400` | ID de imagen o usuario vacío |
| `404` | Imagen no encontrada |
| `500` | Error en la transacción |
