---
title: Endpoints
---

## Salud

### `GET /api/health`

Respuesta rápida para verificar que el servidor está activo.

## Inicialización

### `GET /api/bootstrap?userId=...`

Devuelve el usuario y las imágenes visibles para ese usuario.

## Usuarios

### `POST /api/users/register`

Crea un usuario.

Body:

```json
{
  "name": "Nombre",
  "age": "12",
  "course": "6B"
}
```

### `PUT /api/users/:id`

Actualiza el nombre del usuario.

Body:

```json
{
  "name": "Nuevo nombre"
}
```

## Imágenes

### `GET /api/images?userId=...`

Lista la galería con el estado de corazones para el usuario actual.

### `POST /api/images`

Registra una obra nueva.

Body:

```json
{
  "ownerId": "uuid",
  "artwork": "Nombre de la obra",
  "description": "Descripción",
  "date": "2024-05-10",
  "dataUrl": "data:image/png;base64,..."
}
```

### `POST /api/images/:id/heart`

Agrega o quita corazón para el usuario actual.

Body:

```json
{
  "userId": "uuid"
}
```
