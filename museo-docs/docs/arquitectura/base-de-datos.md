---
id: base-de-datos
title: Base de Datos
sidebar_position: 4
---

# Base de Datos

El proyecto usa **SQLite3** con el archivo `data/museo.sqlite`.

## Esquema

### Tabla `users`

```sql
CREATE TABLE users (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  age        TEXT,
  course     TEXT,
  created_at TEXT NOT NULL
);
```

| Campo | Descripción |
|---|---|
| `id` | UUID generado con `randomUUID()` |
| `name` | Nombre del usuario |
| `age` | Edad (texto, opcional) |
| `course` | Curso escolar (opcional) |
| `created_at` | ISO 8601 |

### Tabla `images`

```sql
CREATE TABLE images (
  id          TEXT PRIMARY KEY,
  artwork     TEXT NOT NULL,
  author      TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT 'Lorem ipsum...',
  date        TEXT NOT NULL,
  owner_id    TEXT NOT NULL,
  owner_name  TEXT NOT NULL,
  data_url    TEXT,
  rating      INTEGER NOT NULL,
  created_at  TEXT NOT NULL,
  FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

| Campo | Descripción |
|---|---|
| `id` | UUID |
| `artwork` | Nombre de la obra |
| `author` | Nombre del autor (copiado del usuario al registrar) |
| `description` | Descripción de la obra |
| `date` | Fecha de creación (dd/mm/yyyy) |
| `owner_id` | FK a `users.id` |
| `owner_name` | Nombre del dueño (desnormalizado para lecturas rápidas) |
| `data_url` | Imagen en base64 (puede ser `NULL` en el seed) |
| `rating` | Contador de corazones (se incrementa/decrementa en sync con `image_hearts`) |

### Tabla `image_hearts`

```sql
CREATE TABLE image_hearts (
  image_id   TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (image_id, user_id),
  FOREIGN KEY(image_id) REFERENCES images(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Permite saber si un usuario específico ya dio corazón a una imagen, sin duplicados (PRIMARY KEY compuesta).

### Tabla `metadata`

```sql
CREATE TABLE metadata (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

Se usa para flags de migración:

| Clave | Valor | Significado |
|---|---|---|
| `seeded` | `'true'` | Los datos de ejemplo ya fueron insertados |
| `heart_ui_migrated` | `'true'` | Los conteos de corazones legacy ya fueron reseteados |

## Consulta principal de galería

La función `getImagesForUser(userId)` usa un LEFT JOIN para determinar si el usuario actual ya dio corazón a cada imagen:

```sql
SELECT
  i.*,
  CASE WHEN uh.user_id IS NULL THEN 0 ELSE 1 END AS viewer_has_heart
FROM images i
LEFT JOIN image_hearts uh
  ON uh.image_id = i.id
 AND uh.user_id = ?
ORDER BY i.created_at DESC
```

## Transacciones

Las operaciones que modifican múltiples tablas a la vez (como dar corazón, que actualiza tanto `image_hearts` como `images.rating`) usan `withTransaction()` para garantizar consistencia.
