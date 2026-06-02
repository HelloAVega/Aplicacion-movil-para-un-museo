---
id: modelo-ia
title: Modelo de IA (Detección de Poses)
sidebar_position: 5
---

# Modelo de IA — Detección de Poses

El proyecto incluye un modelo de detección de postura corporal entrenado con **Teachable Machine** de Google y exportado para **TensorFlow.js**.

## Archivos del modelo

```
my-pose-model/
├── model.json      # Arquitectura de la red neuronal
├── weights.bin     # Pesos entrenados (~5.6 MB)
└── metadata.json   # Labels y configuración
```

## Clases detectadas

| Etiqueta | Descripción |
|---|---|
| `De pie` | Usuario de pie frente a la cámara |
| `Sentado` | Usuario sentado |
| `Acostado` | Usuario acostado |

## Arquitectura del modelo

Según `model.json`, el modelo es una red **Sequential** con:

1. **Dense (100 unidades, ReLU)** — capa de entrada con 14 739 features (salida de PoseNet)
2. **Dropout (0.5)** — regularización para evitar sobreajuste
3. **Dense (3 unidades, Softmax)** — capa de salida con una probabilidad por clase

```json
{
  "layers": [
    { "class_name": "Dense",   "units": 100, "activation": "relu",    "input_shape": [14739] },
    { "class_name": "Dropout", "rate": 0.5 },
    { "class_name": "Dense",   "units": 3,   "activation": "softmax" }
  ]
}
```

## Base del modelo: PoseNet

El modelo no trabaja con píxeles directamente. Usa **PoseNet** como extractor de features:

| Parámetro | Valor |
|---|---|
| Arquitectura | MobileNetV1 |
| Output stride | 16 |
| Input resolution | 257 px |
| Multiplier | 0.75 |

PoseNet detecta los keypoints del cuerpo (hombros, codos, rodillas, etc.) y genera un vector de 14 739 features que alimenta el clasificador.

## Carga en el navegador

```javascript
const modelURL = '/my-pose-model/model.json';
const metadataURL = '/my-pose-model/metadata.json';

const model = await tmPose.load(modelURL, metadataURL);
```

## Información de entrenamiento

Extraída de `metadata.json`:

```json
{
  "tfjsVersion": "1.7.4",
  "tmVersion": "0.8.6",
  "modelName": "my-pose-model",
  "timeStamp": "2026-05-16T01:56:03.384Z",
  "labels": ["De pie", "Sentado", "Acostado"]
}
```

:::note Requisito de cámara
El navegador requiere **HTTPS** o `localhost` para acceder a la cámara. En producción, asegúrate de que tu dominio tenga certificado SSL.
:::
