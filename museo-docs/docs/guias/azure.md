---
id: azure
title: Despliegue en Azure
sidebar_position: 3
description: Publicar el Museo Interactivo en Azure usando una máquina virtual Ubuntu.
---

# Despliegue en Azure

El Museo Interactivo se desplegó en una máquina virtual de Azure con Ubuntu Server 24.04.

## Máquina virtual utilizada

| Propiedad | Valor |
|---|---|
| Nombre del equipo | UbuntuServer |
| Sistema operativo | Linux (Ubuntu 24.04) |
| Arquitectura | x64 |
| Tamaño | Standard D2ads v7 (2 vCPU, 8 GiB RAM) |
| Dirección IP pública | 20.222.176.74 |
| Nombre DNS | server320.japaneast.cloudapp.azure.com |

![Propiedades](/img/propiedades.png)

## Configuración de red

Es necesario habilitar el puerto HTTPS (443) para que la aplicación sea accesible desde el navegador.

![Puertos](/img/puertos.png)

## Conexión SSH

Para interactuar con la máquina virtual usamos SSH:

```bash
ssh -i <private-key-file-path> azureuser@20.222.176.74
```

## Administración con Cockpit

Para una administración más sencilla instalamos Cockpit, una interfaz web para servidores.

### Instalación

```bash
sudo apt update
sudo apt install cockpit
sudo systemctl enable --now cockpit.socket
```

![Panel Cockpit](/img/panel.png)

Después de ingresar usuario y contraseña, se muestra la interfaz principal:

![Panel V2](/img/panelV2.png)

Desde Cockpit usamos el terminal integrado para ejecutar los comandos de despliegue:

![Panel V3](/img/panelV3.png)

## Pasos para el despliegue

### 1. Instalar dependencias

```bash
sudo apt update
sudo apt install docker docker-compose
```

### 2. Instalar Caddy como proxy inverso

```bash
sudo apt install caddy
```

### 3. Configurar el Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Agregar la siguiente configuración:

```
museo.aprojects.dev {
        reverse_proxy 127.0.0.1:3000
}
```

![Caddyfile](/img/caddyfile.png)

### 4. Configurar DNS

Agregar un registro DNS de tipo A apuntando a la IP del servidor:

| Tipo | Nombre | Valor |
|---|---|---|
| A | museo.aprojects.dev | 20.222.176.74 |

![DNS V1](/img/dnsV1.png)
![DNS V2](/img/dnsV2.png)

### 5. Ejecutar la aplicación

```bash
sudo docker compose up -d
```

## Acceso a la aplicación

Una vez completados los pasos anteriores, la aplicación está disponible en:

```
https://museo.aprojects.dev
```

## Verificar el despliegue

```bash
curl https://museo.aprojects.dev/api/health
# { "ok": true, "date": "..." }
```
