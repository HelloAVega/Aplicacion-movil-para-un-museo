---
title: Troubleshooting
---

## La app no carga

1. Verifica que el servidor esté corriendo en el puerto correcto.
2. Ejecuta `GET /api/health` para comprobar el backend.
3. Revisa que el volumen Docker esté montado en `/app/data`.
4. Confirma que `data/museo.sqlite` exista.

## No se ven imágenes guardadas

1. Verifica que el usuario esté registrado.
2. Revisa que el frontend envíe `ownerId`, `artwork`, `description` y `dataUrl`.
3. Confirma que el archivo haya quedado persistido en SQLite.
