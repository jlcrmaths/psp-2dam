---
nombre: ProcessBuilder
---

## Qué es

Clase que prepara un comando del sistema, igual que el que escribirías en la terminal. Cada trozo del comando va en un texto aparte. Su método start() lo ejecuta.

## Para qué sirve

Lanzar otro programa desde Java como un proceso nuevo.

## Ejemplo mínimo

```java
ProcessBuilder pb = new ProcessBuilder("java", "-cp", ruta, "tuberias.Programa1");
Process p = pb.start();
```
