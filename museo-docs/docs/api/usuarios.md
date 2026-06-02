---
id: usuarios
title: Usuarios
sidebar_position: 2
---

# API — Usuarios

## `POST /api/users/register`

Registra un usuario nuevo y devuelve su perfil con el UUID asignado.

**Body**

```json
{
  "name": "María García",
  "age": "20",
  "course": "Ingeniería de Sistemas"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `name` | string | ✅ | Nombre del usuario |
| `age` | string | ✅ | Edad |
| `course` | string | No | Curso escolar o carrera |

**Respuesta exitosa (`201`)**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "María García",
    "age": "20",
    "course": "Ingeniería de Sistemas",
    "createdAt": "2026-05-29T10:00:00.000Z"
  }
}
```

**Errores**

| Código | Motivo |
|---|---|
| `400` | Falta `name` o `age` |
| `500` | Error al guardar en la base de datos |

---

## `PUT /api/users/:id`

Actualiza el nombre del usuario y sincroniza `owner_name` en todas sus imágenes.

**Parámetros de ruta**

| Parámetro | Descripción |
|---|---|
| `:id` | UUID del usuario |

**Body**

```json
{
  "name": "María G. López"
}
```

**Respuesta exitosa (`200`)**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "María G. López",
    "age": "20",
    "course": "Ingeniería de Sistemas",
    "createdAt": "2026-05-29T10:00:00.000Z"
  }
}
```

:::note Sincronización
Este endpoint usa una transacción para actualizar tanto `users.name` como `images.owner_name` de forma atómica.
:::

**Errores**

| Código | Motivo |
|---|---|
| `400` | ID vacío o nombre vacío |
| `404` | Usuario no encontrado |
| `500` | Error en la transacción |
