---
id: solucion-problemas
title: Solución de Problemas
sidebar_position: 5
---

# Solución de problemas

## La aplicación no carga

1. Verifica que el servidor esté corriendo en el puerto correcto.
2. Llama a `GET /api/health`:

```bash
curl http://localhost:3000/api/health
# Esperado: { "ok": true, "date": "..." }
```

3. Verifica que el volumen Docker esté montado en `/app/data`.
4. Confirma que `museo.sqlite` exista dentro de `data/`.

## No veo imágenes guardadas

1. Verifica que el usuario esté registrado (`POST /api/users/register` devuelve `201`).
2. Revisa que el frontend envíe `ownerId`, `artwork`, `description` y `dataUrl`.
3. Confirma que `POST /api/images` devuelva `201`.

## Error `SQLITE_CANTOPEN`

El directorio `data/` no existe o el proceso no tiene permisos de escritura.

```bash
mkdir -p data
chmod 755 data
```

En Docker, verifica que el volumen esté montado:

```bash
docker compose exec museo ls /app/data
# Debe mostrar: museo.sqlite
```

## Error de puerto en uso

```bash
# Mac / Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

## Imágenes no aparecen en la galería

El modelo de seed se ejecuta solo una vez (`metadata.seeded = 'true'`). Si quieres reinsertar las imágenes de ejemplo:

```bash
# Abre SQLite y borra el flag de seed
sqlite3 data/museo.sqlite "DELETE FROM metadata WHERE key='seeded';"
# Reinicia el servidor
npm start
```

## Los corazones se resetearon

Esto ocurrió una sola vez al migrar de `rating` numérico a la tabla `image_hearts`. El flag `heart_ui_migrated` lo controla. No debería repetirse.

## Modelo de pose no detecta posturas

- Asegúrate de que los archivos `my-pose-model/model.json`, `weights.bin` y `metadata.json` estén presentes.
- Necesitas conexión HTTPS o `localhost` para acceder a la cámara (restricción del navegador).
- Verifica que `@tensorflow/tfjs` y `@teachablemachine/pose` estén cargando en la consola del navegador.
