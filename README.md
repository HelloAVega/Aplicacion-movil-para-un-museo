# Museo Interactivo

Aplicación web para subir obras, guardarlas en una galería interactiva. El proyecto está pensado para ejecutarse en móvil y también funciona en escritorio con una vista adaptada.

## Tecnologías usadas

- **Frontend:** HTML, CSS y JavaScript puro.
- **Backend:** Node.js con Express.
- **Base de datos:** SQLite3.
- **Contenedores:** Docker.

## Arquitectura

La aplicación está dividida en dos partes:

- El frontend vive en `index.html`, `styles.css` y `app.js`.
- El backend vive en `server.js` y expone la API REST.

El flujo general es:

1. El usuario se registra con nombre, edad y curso.
2. La app guarda el usuario en SQLite.
3. El usuario sube una imagen, nombre de la obra y descripción.
4. La imagen se convierte en `dataUrl` y se guarda en la base de datos.
5. La galería consulta las imágenes y permite abrirlas ampliadas.
6. Cada usuario puede dar o quitar corazón a una imagen.

## Persistencia de datos

La base de datos real del proyecto es `data/museo.sqlite`.

- Las obras se guardan en la tabla `images`.
- El usuario dueño de la obra se guarda en `owner_id` y `owner_name`.
- La imagen se guarda como `data_url` dentro de SQLite.
- Los corazones se guardan de forma persistente por usuario en la tabla `image_hearts`.

Importante: el archivo `data/db.json` ya no se usa. El proyecto quedó migrado a SQLite.

## Funcionalidades

- Registro básico de usuario.
- Subida de imágenes desde cámara o archivo.
- Galería con:
  - imágenes del usuario,
  - imágenes de otros usuarios,
  - corazón persistente,
  - visor ampliado con detalles.
- Edición de nombre de usuario desde la cuenta.
- Modo claro y oscuro.

## Requisitos

- Node.js 20 o superior.
- npm.
- Docker y Docker Compose si se desea desplegar con contenedores.

## Estructura del proyecto

- `app.js`: lógica del frontend.
- `server.js`: API, base de datos y persistencia.
- `index.html`: interfaz principal.
- `styles.css`: estilos y diseño responsive.
- `Dockerfile`: imagen de producción.
- `docker-compose.yml`: despliegue con volumen persistente.
- `data/`: archivos persistentes de la aplicación.

## Ejecución local

```bash
npm install
npm start
```

Luego abre la app en:

```text
http://localhost:3000
```

## Ejecución con Docker

### Docker Compose

```bash
docker compose up --build
```

## Despliegue con Docker

El proyecto está preparado para desplegarse con la imagen de Docker porque:

- instala las dependencias necesarias,
- expone el puerto `3000`,
- guarda la base de datos en `/app/data`,
- conserva los datos usando un volumen.

En `docker-compose.yml` se usa este volumen:

```yaml
volumes:
  - museo_data:/app/data
```

Eso permite que la base de datos no se borre cuando el contenedor se reinicia.

## Despliegue en Azure

El Museo Interactivo fue desplegado en una máquina virtual de Azure con Ubuntu Server 24.04 utilizando Docker Compose y Caddy como proxy inverso.

### Infraestructura utilizada

| Propiedad         | Valor                                    |
| ----------------- | ---------------------------------------- |
| Sistema operativo | Ubuntu Server 24.04                      |
| Arquitectura      | x64                                      |
| Tamaño            | Standard D2ads v7 (2 vCPU, 8 GiB RAM)    |
| Nombre DNS        | `server320.japaneast.cloudapp.azure.com` |

### Requisitos de red

Es necesario habilitar el puerto **443 (HTTPS)** para permitir el acceso seguro a la aplicación desde Internet.

### Pasos generales de despliegue

1. Instalar Docker y Docker Compose en la máquina virtual.
2. Instalar Caddy para actuar como proxy inverso y gestionar automáticamente los certificados HTTPS.
3. Configurar el archivo `/etc/caddy/Caddyfile` para redirigir las solicitudes al puerto interno de la aplicación (`3000`).
4. Configurar un registro DNS de tipo **A** apuntando al servidor.
5. Ejecutar la aplicación mediante Docker Compose:

```bash
sudo docker compose up -d
```

### Configuración de Caddy

```caddy
museo.aprojects.dev {
    reverse_proxy 127.0.0.1:3000
}
```

### Verificación del despliegue

Una vez iniciado el servicio, se puede comprobar el estado de la aplicación con:

```bash
curl https://museo.aprojects.dev/api/health
# { "ok": true, "date": "..." }
```

### Acceso a la aplicación

La aplicación queda disponible en:

`https://museo.aprojects.dev`

### Más información

Para una guía completa de despliegue en Azure, configuración de DNS, Docker, Caddy y administración del servidor, consulte:

https://documentacion.aprojects.dev/guias/azure

## Variables de entorno

- `PORT`: puerto del servidor. Por defecto usa `3000`.
- `NODE_ENV`: entorno de ejecución. En Docker se define como `production`.

## API REST

### Salud

- `GET /api/health`  
  Verifica que el servidor esté activo.

### Inicialización

- `GET /api/bootstrap?userId=...`  
  Carga el usuario guardado y las imágenes visibles para ese usuario.

### Usuarios

- `POST /api/users/register`  
  Registra un usuario nuevo.

- `PUT /api/users/:id`  
  Actualiza el nombre del usuario.

### Imágenes

- `GET /api/images?userId=...`  
  Devuelve la galería de imágenes con el estado de corazones para el usuario actual.

- `POST /api/images`  
  Registra una nueva imagen con obra, descripción, fecha y `dataUrl`.

- `POST /api/images/:id/heart`  
  Agrega o quita el corazón de una imagen.

## Comportamiento del frontend

- `setupWelcome()` maneja el registro inicial.
- `setupUpload()` maneja la subida de imágenes.
- `renderGallery()` pinta la galería.
- `setupImageDetails()` abre el visor ampliado de cada imagen.
- `setupImageRatings()` maneja los corazones.

## Notas de implementación

- El autor de la obra se toma automáticamente del nombre del usuario registrado en la sesión local.
- La galería abre una vista ampliada con la imagen grande y sus datos.
- Los corazones funcionan por usuario y se guardan en la base de datos.
- La interfaz fue diseñada para móvil primero.

## Solución de problemas

Si la aplicación no carga correctamente:

1. Revisa que el servidor esté corriendo en el puerto correcto.
2. Ejecuta `GET /api/health` para comprobar el backend.
3. Verifica que el volumen Docker esté montado en `/app/data`.
4. Confirma que `museo.sqlite` exista dentro de `data/`.

Si no ves imágenes guardadas:

1. Verifica que el usuario esté registrado.
2. Revisa que el frontend envíe `ownerId`, `artwork`, `description` y `dataUrl`.
3. Confirma que el archivo haya quedado persistido en SQLite.

## Estado actual

El proyecto ya cuenta con:

- galería interactiva,
- visor ampliado,
- corazón persistente,
- persistencia en SQLite,
- despliegue preparado con Docker.
