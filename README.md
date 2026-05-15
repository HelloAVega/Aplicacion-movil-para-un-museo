# Backend Museo Interactivo - FastAPI

Backend robusto para la aplicación móvil del Museo Interactivo. Incluye autenticación JWT, gestión de usuarios, galería de imágenes y webhooks para integración con servicios de IA.

## Características

✅ **Autenticación JWT** - Login seguro con tokens JWT
✅ **Base de Datos SQLAlchemy** - ORM moderno con SQLite (escalable a PostgreSQL)
✅ **Validación Pydantic** - Esquemas de entrada/salida validados
✅ **Gestión de Usuarios** - Registro, login, perfil
✅ **Galería de Imágenes** - Upload, listado, filtros, paginación
✅ **Integración IA Ready** - Webhooks para procesamiento asincrónico
✅ **CORS Habilitado** - Para conectar con frontend
✅ **Documentación Automática** - Swagger UI en `/docs`

## Estructura del Proyecto

```
.
├── main.py              # Punto de entrada con todos los endpoints
├── config.py            # Configuración de la aplicación
├── database.py          # Conexión y sesiones SQLAlchemy
├── models.py            # Modelos SQLAlchemy (User, Image)
├── schemas.py           # Esquemas Pydantic para validación
├── auth.py              # Autenticación JWT y hashing de contraseñas
├── requirements.txt     # Dependencias Python
├── uploads/             # Directorio para almacenar imágenes
├── museo.db             # Base de datos SQLite (se crea automáticamente)
└── README.md            # Este archivo
```

## Instalación y Ejecución

### 1. Requisitos Previos
- Python 3.8 o superior
- pip (gestor de paquetes)

### 2. Instalar Dependencias
```bash
pip install -r requirements.txt
```

### 3. Ejecutar el Servidor
```bash
python main.py
```

O usando uvicorn directamente:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

La API estará disponible en: **http://localhost:8000**

### 4. Ver Documentación
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Base de Datos

### Esquema de Usuarios (User)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    course VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    avatar_color VARCHAR(7) DEFAULT "#2E7D6C",
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Esquema de Imágenes (Image)
```sql
CREATE TABLE images (
    id INTEGER PRIMARY KEY,
    filename VARCHAR(255) UNIQUE NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    artwork_name VARCHAR(255) NOT NULL,
    artwork_author VARCHAR(255) NOT NULL,
    description TEXT,
    ai_status VARCHAR(50) DEFAULT "pending",
    ai_metadata TEXT,
    ai_error VARCHAR(500),
    rating INTEGER DEFAULT 0,
    owner_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ai_processed_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

## Endpoints Principales

### Health Check
```
GET /health
```
Verifica que la API está funcionando.

### Autenticación

**Registrar usuario**
```
POST /auth/register
{
    "email": "usuario@ejemplo.com",
    "name": "Juan",
    "age": 25,
    "course": "Ingeniería",
    "password": "contraseña123"
}
```

**Login**
```
POST /auth/login
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña123"
}

Response:
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 1800
}
```

### Usuarios

**Obtener perfil actual (requiere token)**
```
GET /users/me
Authorization: Bearer {access_token}
```

**Obtener perfil de otro usuario**
```
GET /users/{user_id}
```

**Actualizar perfil (requiere token)**
```
PUT /users/me
Authorization: Bearer {access_token}
{
    "name": "Juan Updated",
    "age": 26,
    "course": "Ingeniería de Sistemas"
}
```

### Imágenes

**Subir imagen (requiere token)**
```
POST /images/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Form Data:
- file: <archivo de imagen>
- artwork_name: "La Noche Estrellada"
- artwork_author: "Van Gogh"
- description: "Una obra maestra del arte moderno"
```

**Obtener detalles de imagen**
```
GET /images/{image_id}
```

**Actualizar metadata de imagen (solo propietario)**
```
PUT /images/{image_id}
Authorization: Bearer {access_token}
{
    "artwork_name": "Nuevo nombre",
    "rating": 5,
    "description": "Nueva descripción"
}
```

**Eliminar imagen (solo propietario)**
```
DELETE /images/{image_id}
Authorization: Bearer {access_token}
```

### Galería

**Obtener galería con filtros y paginación**
```
GET /gallery?skip=0&limit=20&sort_by=created_at&order=desc
```

Parámetros opcionales:
- `skip`: Saltar N registros (default: 0)
- `limit`: Máximo de registros (default: 20, max: 100)
- `owner_id`: Filtrar por propietario
- `ai_status`: Filtrar por estado (pending, processing, completed, failed)
- `sort_by`: Ordenar por (created_at, rating, updated_at)
- `order`: Orden (asc, desc)

**Obtener galería de un usuario**
```
GET /gallery/user/{user_id}?skip=0&limit=20
```

### Integración con IA

**Obtener imágenes pendientes para procesar**
```
GET /ai/images/pending?limit=10
```
La IA puede consultar este endpoint para obtener imágenes que necesitan procesamiento.

**Actualizar resultado de procesamiento IA (Webhook)**
```
PATCH /ai/webhook/image/{image_id}
{
    "ai_status": "completed",
    "ai_metadata": "{\"objects\": [\"persona\", \"obra\"], \"confidence\": 0.95}",
    "ai_error": null
}
```

Estados válidos: `pending`, `processing`, `completed`, `failed`

### Estadísticas

**Obtener estadísticas generales**
```
GET /stats
```
Response:
```json
{
    "total_users": 42,
    "total_images": 156,
    "pending_ai_processing": 5,
    "completed_ai_processing": 151
}
```

## Cómo Integrar con IA

### Flujo de Procesamiento

1. **La IA consulta imágenes pendientes**:
   ```bash
   curl http://localhost:8000/ai/images/pending?limit=5
   ```

2. **La IA procesa las imágenes**:
   - Descarga la imagen desde `/uploads/{filename}`
   - Realiza análisis (detección de objetos, análisis artístico, etc.)
   - Prepara resultados en JSON

3. **La IA actualiza el resultado**:
   ```bash
   curl -X PATCH http://localhost:8000/ai/webhook/image/123 \
     -H "Content-Type: application/json" \
     -d '{
       "ai_status": "completed",
       "ai_metadata": "{\"analysis\": \"...results...\"}",
       "ai_error": null
     }'
   ```

4. **Frontend consulta el estado**:
   ```bash
   curl http://localhost:8000/images/123
   ```
   La imagen ahora tendrá `ai_status: "completed"` y `ai_metadata` con los resultados.

## Variables de Configuración

En `config.py` puedes ajustar:

```python
DATABASE_URL = "sqlite:///./museo.db"  # Cambiar a PostgreSQL: postgresql://user:pwd@localhost/db
SECRET_KEY = "tu-clave-secreta"        # CAMBIAR EN PRODUCCIÓN
ACCESS_TOKEN_EXPIRE_MINUTES = 30       # Duración del token
MAX_UPLOAD_SIZE = 10 * 1024 * 1024     # 10 MB
CORS_ORIGINS = ["*"]                   # Especificar origins en producción
```

## Ejemplo de Uso con cURL

```bash
# Registrar
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "name": "Test User",
    "age": 25,
    "password": "Pass1234!"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@ejemplo.com",
    "password": "Pass1234!"
  }'

# Subir imagen (con el token del login)
curl -X POST http://localhost:8000/images/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@imagen.jpg" \
  -F "artwork_name=Mi Obra" \
  -F "artwork_author=Yo Mismo" \
  -F "description=Mi primera obra"
```

## Seguridad

⚠️ **Importante para Producción**:
1. Cambiar `SECRET_KEY` en `config.py`
2. Usar `CORS_ORIGINS` específico (no "*")
3. Usar base de datos PostgreSQL en lugar de SQLite
4. Habilitar HTTPS
5. Implementar rate limiting
6. Usar variables de entorno para configuración sensible

## Troubleshooting

**Error: "ModuleNotFoundError"**
```bash
pip install -r requirements.txt
```

**Error: "Port 8000 already in use"**
```bash
uvicorn main:app --reload --port 8001
```

**Error: "database is locked"**
Si uses SQLite, cierra otras conexiones o usa PostgreSQL.

## API Reference Completa

Ver documentación interactiva en: **http://localhost:8000/docs** (Swagger UI)

## Licencia

Proyecto de la Universidad Simón Bolívar
