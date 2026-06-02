---
id: intro
title: Introducción
sidebar_position: 1
description: Descripción general del Museo Interactivo, tecnologías y estructura del proyecto.
---

# Museo Interactivo

**Aplicación web** para que estudiantes y visitantes suban sus obras, las organicen en una galería visual y puedan explorar el arte de forma sencilla y atractiva. Está pensada para ejecutarse en móvil y también funciona en escritorio con una vista adaptada.

:::info Proyecto académico
Desarrollado por los programas de **Ingeniería de Sistemas**, **Ingeniería de Datos e IA** y **Maestría en IA** de la **Universidad Simón Bolívar**, en colaboración con el **Museo de Arte Moderno de Barranquilla (MAMB)**.
:::

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript puro |
| Backend | Node.js 20 + Express 4 |
| Base de datos | SQLite3 |
| IA / Pose | TensorFlow.js + Teachable Machine |
| Contenedores | Docker + Docker Compose |

## Flujo general

```
Usuario → Registro → Subida de imagen → Galería → Corazones
```

1. El usuario se registra con **nombre**, **edad** y **curso** (opcional).
2. La app crea un registro en SQLite con un UUID único.
3. El usuario captura o sube una imagen con nombre de obra y descripción.
4. La imagen se convierte a `dataUrl` y se persiste en la base de datos.
5. La galería consulta las imágenes y las muestra separadas por autor.
6. Cada usuario puede dar o quitar ❤️ a cualquier imagen.

## Estructura del repositorio

```
Aplicacion-movil-para-un-museo/
├── app.js              # Lógica del frontend
├── server.js           # API REST + SQLite
├── index.html          # Interfaz principal (4 pantallas)
├── styles.css          # Estilos responsive + dark mode
├── Dockerfile          # Imagen de producción
├── docker-compose.yml  # Orquestación con volumen persistente
├── package.json
├── data/
│   └── museo.sqlite    # Base de datos (generada en runtime)
└── my-pose-model/
    ├── model.json      # Arquitectura del modelo TF.js
    ├── weights.bin     # Pesos entrenados
    └── metadata.json   # Labels: De pie · Sentado · Acostado
```

## Pantallas de la aplicación

| Pantalla | ID | Descripción |
|---|---|---|
| Bienvenida | `screen-welcome` | Registro de usuario |
| Subida | `screen-upload` | Capturar o subir imagen |
| Galería | `screen-gallery` | Museo interactivo |
| Cuenta | `screen-account` | Perfil y About Us |

## Próximos pasos

- [Instalación local →](./guias/instalacion)
- [Despliegue con Docker →](./guias/docker)
- [API REST →](./api/endpoints)
