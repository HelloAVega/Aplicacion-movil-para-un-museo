---
id: azure
title: Despliegue en Azure
sidebar_position: 3
description: Publicar el Museo Interactivo en Azure usando contenedores Docker.
---

# Despliegue en Azure

La forma más directa de publicar el proyecto en Azure es mediante una imagen de contenedor.

## Opción recomendada: Azure Container Apps

### 1. Construir la imagen localmente

```bash
docker build -t museo-interactivo .
```

### 2. Crear un Azure Container Registry (ACR)

```bash
az acr create \
  --resource-group mi-grupo \
  --name museoregistry \
  --sku Basic
```

### 3. Subir la imagen al registro

```bash
az acr login --name museoregistry

docker tag museo-interactivo museoregistry.azurecr.io/museo-interactivo:latest
docker push museoregistry.azurecr.io/museo-interactivo:latest
```

### 4. Crear la Container App

```bash
az containerapp create \
  --name museo-interactivo \
  --resource-group mi-grupo \
  --environment mi-environment \
  --image museoregistry.azurecr.io/museo-interactivo:latest \
  --target-port 3000 \
  --ingress external \
  --env-vars PORT=3000 NODE_ENV=production
```

## Opción alternativa: Azure App Service

1. Ve a **Azure Portal → App Service → Crear**.
2. Selecciona **Publicar: Contenedor Docker**.
3. En la pestaña **Docker**, elige **Registro privado** y apunta a tu ACR.
4. En **Configuración → Variables de entorno**, agrega:
   - `PORT` = `3000`
   - `NODE_ENV` = `production`

## Almacenamiento persistente

:::warning Base de datos en contenedor
Los contenedores en Azure son efímeros. Para que la base de datos `museo.sqlite` sobreviva reinicios, monta un **Azure Files** share en `/app/data`.
:::

```bash
az storage share create \
  --account-name muestorageaccount \
  --name museo-data

az containerapp storage set \
  --name museo-interactivo \
  --resource-group mi-grupo \
  --storage-name museo-files \
  --azure-file-account-name muestorageaccount \
  --azure-file-account-key <key> \
  --azure-file-share-name museo-data \
  --access-mode ReadWrite \
  --mount-path /app/data
```

## Variables de entorno requeridas

| Variable | Valor | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto que Azure debe exponer |
| `NODE_ENV` | `production` | Modo de producción |

:::tip Puerto
Azure App Service inyecta automáticamente `WEBSITES_PORT`. Si usas App Service en lugar de Container Apps, asegúrate de que el puerto interno sea `3000`.
:::

## Verificar el despliegue

Una vez publicado, visita:

```
https://<tu-app>.azurecontainerapps.io/api/health
# { "ok": true, "date": "..." }
```
