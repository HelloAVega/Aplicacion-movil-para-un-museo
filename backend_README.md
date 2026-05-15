Backend Django/DRF inicial

Instrucciones rápidas:

1. Crear y activar un entorno virtual
   python -m venv .venv
   .venv\Scripts\activate

2. Instalar dependencias
   pip install -r requirements.txt

3. Ir al directorio backend y ejecutar migraciones
   cd backend
   python manage.py makemigrations
   python manage.py migrate

4. Crear superusuario (opcional)
   python manage.py createsuperuser

5. Ejecutar servidor de desarrollo
   python manage.py runserver 8001

APIs principales (prefijo `/api/`):
- POST /api/auth/register/  -> registrar usuario
- POST /api/auth/token/     -> obtener token JWT (username/email + password)
- POST /api/auth/token/refresh/ -> refrescar token
- GET/PUT /api/users/me/     -> perfil del usuario autenticado
- CRUD /api/images/         -> gestión de imágenes (subida en `file`)

Media estático en desarrollo servirá desde `/media/`.
