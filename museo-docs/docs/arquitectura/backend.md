---
id: backend
title: Backend
sidebar_position: 3
---

# Backend

El backend es un servidor **Node.js + Express** que expone una API REST y sirve los archivos estáticos del frontend.

## Archivo principal: `server.js`

### Inicialización

```javascript
async function initDb() {
  ensureDataDirectory();          // Crea data/ si no existe
  db = await openDatabase(DB_FILE);
  await run('PRAGMA foreign_keys = ON');
  // Crea tablas, migraciones, seed de datos de ejemplo
}
```

El servidor no arranca hasta que `initDb()` resuelve correctamente.

### Helpers de base de datos

El archivo envuelve `sqlite3` en Promises para uso con `async/await`:

| Función | Descripción |
|---|---|
| `run(sql, params)` | Ejecuta INSERT, UPDATE, DELETE |
| `get(sql, params)` | Devuelve una fila o `null` |
| `all(sql, params)` | Devuelve todas las filas |
| `withTransaction(fn)` | Ejecuta `fn` dentro de BEGIN/COMMIT, hace ROLLBACK si hay error |

### Middleware

```javascript
app.use(express.json({ limit: '15mb' }));  // Para recibir dataUrls de imágenes
app.use(express.static(__dirname));         // Sirve index.html, styles.css, app.js
```

### Sanitización de imágenes

Antes de enviar datos al cliente, `sanitizeImage()` normaliza los campos:

```javascript
function sanitizeImage(image) {
  return {
    id: image.id,
    artwork: image.artwork,
    author: image.author,
    description: image.description || 'Lorem ipsum...',
    date: image.date,
    ownerId: image.owner_id,
    ownerName: image.owner_name,
    dataUrl: image.data_url || null,
    heartsCount: normalizeRating(image.rating),
    viewerHasHeart: Boolean(Number(image.viewer_has_heart)),
  };
}
```

### Migraciones automáticas

Al iniciar, el servidor ejecuta estas funciones de migración:

- `ensureImageDescriptionColumn()` — agrega la columna `description` si no existe (retrocompatibilidad).
- `ensureImageHeartsTable()` — crea la tabla `image_hearts` si no existe.
- `resetLegacyHeartCountsIfNeeded()` — resetea conteos de corazones legacy (se ejecuta una sola vez).

### Seed de datos

`seedDataIfNeeded()` inserta 2 usuarios y 3 imágenes de ejemplo la primera vez que se ejecuta. Usa el flag `metadata.seeded = 'true'` para no repetirlo.
