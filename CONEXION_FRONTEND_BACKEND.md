# Guía: Conectar Frontend con Backend

Esta guía explica cómo conectar la aplicación web del Museo Interactivo con el backend FastAPI.

## URLs Base

- **Frontend**: `http://localhost:8000` (servir `index.html`)
- **Backend**: `http://localhost:8000/api` o `http://localhost:8001` (depende de puerto)

Se recomienda usar **Puerto 8001 para el backend** para evitar conflictos.

## Cambiar Puerto del Backend

En `main.py`, cambiar:
```python
if __name__ == "__main__":
    uvicorn.run(..., port=8001)  # Cambiar aquí
```

O en terminal:
```bash
uvicorn main:app --reload --port 8001
```

## Modificar `app.js` para Conectar al Backend

En el archivo `app.js`, actualizar las URLs de las llamadas API:

```javascript
const API_BASE_URL = "http://localhost:8001";  // Cambiar a puerto correcto

// ──────────────────────────────────────
// AUTENTICACIÓN
// ──────────────────────────────────────

async function registerUser(name, age, course, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, age, course, password })
        });
        
        if (!response.ok) throw new Error("Error en registro");
        const data = await response.json();
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("user_name", data.name);
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) throw new Error("Credenciales inválidas");
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type", data.token_type);
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// ──────────────────────────────────────
// SUBIR IMAGEN
// ──────────────────────────────────────

async function uploadImage(file, artworkName, artworkAuthor, description) {
    try {
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("artwork_name", artworkName);
        formData.append("artwork_author", artworkAuthor);
        formData.append("description", description || "");
        
        const response = await fetch(`${API_BASE_URL}/images/upload`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) throw new Error("Error al subir imagen");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// ──────────────────────────────────────
// OBTENER GALERÍA
// ──────────────────────────────────────

async function fetchGallery(skip = 0, limit = 20) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/gallery?skip=${skip}&limit=${limit}&sort_by=created_at&order=desc`
        );
        
        if (!response.ok) throw new Error("Error al obtener galería");
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

// ──────────────────────────────────────
// OBTENER PERFIL
// ──────────────────────────────────────

async function fetchUserProfile() {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error("Error al obtener perfil");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
```

## Ejemplo de Flujo Completo

### 1. Registro
```javascript
// Usuario llena formulario de bienvenida
const name = "Juan";
const age = 25;
const course = "Ingeniería";
const email = "juan@ejemplo.com";
const password = "Pass1234!";

await registerUser(name, age, course, email, password);
// Luego hacer login
await loginUser(email, password);
```

### 2. Subir Imagen
```javascript
// Usuario selecciona imagen y llena datos
const fileInput = document.getElementById("file-input");
const file = fileInput.files[0];
const artworkName = "Mi primera obra";
const artworkAuthor = "Yo Mismo";
const description = "Una descripción hermosa";

const imageData = await uploadImage(file, artworkName, artworkAuthor, description);
console.log("Imagen subida:", imageData);
// La imagen tiene ai_status: "pending" - lista para IA
```

### 3. Mostrar Galería
```javascript
// Obtener imágenes
const images = await fetchGallery(0, 20);

images.forEach(image => {
    console.log(image.artwork_name);
    console.log(image.url);  // URL de la imagen
    console.log(image.ai_status);  // Estado: pending, processing, completed
    console.log(image.ai_metadata);  // Resultados de IA (si aplica)
});
```

## CORS y Política de Acceso

**Important**: El backend tiene CORS habilitado para "*" (todos los orígenes).

Para producción, cambiar en `config.py`:
```python
CORS_ORIGINS = [
    "http://localhost:3000",
    "https://tudominio.com",
    "https://app.tudominio.com"
]
```

## Manejo de Errores

```javascript
async function safeAPICall(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Error desconocido");
        }
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error.message);
        // Mostrar error al usuario
        alert(error.message);
        throw error;
    }
}
```

## Testing de Endpoints

### Verificar que el backend está corriendo
```bash
curl http://localhost:8001/health
# Response: {"status":"ok","version":"1.0.0"}
```

### Ver documentación Swagger
- Abre en navegador: `http://localhost:8001/docs`

## Variables Almacenadas en LocalStorage

```javascript
localStorage.setItem("user_id", userId);           // ID del usuario
localStorage.setItem("user_name", userName);       // Nombre del usuario
localStorage.setItem("access_token", token);       // Token JWT
localStorage.setItem("token_type", "bearer");      // Tipo de token
localStorage.setItem("avatar_color", color);       // Color del avatar
```

## Estructura de Respuestas

### Imagen Subida
```json
{
    "id": 1,
    "filename": "abc123.jpg",
    "original_name": "mi_foto.jpg",
    "artwork_name": "Mi obra",
    "artwork_author": "Yo",
    "description": "Descripción",
    "rating": 0,
    "ai_status": "pending",
    "ai_metadata": null,
    "ai_error": null,
    "owner_id": 1,
    "created_at": "2024-05-15T10:30:00",
    "updated_at": "2024-05-15T10:30:00",
    "ai_processed_at": null,
    "url": "/uploads/abc123.jpg"
}
```

### Galería
```json
{
    "total": 42,
    "skip": 0,
    "limit": 20,
    "items": [
        { ... imagen 1 ... },
        { ... imagen 2 ... },
        ...
    ]
}
```

## Integración con IA

Cuando se suba una imagen, tendrá `ai_status: "pending"`. 

El servicio de IA puede:
1. Consultar `GET /ai/images/pending` para obtener imágenes a procesar
2. Procesar la imagen
3. Actualizar con `PATCH /ai/webhook/image/{id}`:
```json
{
    "ai_status": "completed",
    "ai_metadata": "{\"analysis\": \"...detalles...\"}"
}
```

Entonces el frontend puede mostrar los resultados al consultar la imagen.

## Próximos Pasos

1. ✅ Backend listo en puerto 8001
2. ⬜ Actualizar `app.js` con las funciones de API
3. ⬜ Cambiar pantallas para llamar a APIs reales
4. ⬜ Conectar con servicio de IA
5. ⬜ Deploy en servidor

¡Listo para conectar!
