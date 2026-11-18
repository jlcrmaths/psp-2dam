---
nombre: Process
---

## Qué es

Clase que representa un proceso en marcha, visto desde el programa que lo lanzó.

## Para qué sirve

Comunicarse con el proceso: leer lo que escribe (getInputStream()), enviarle datos (getOutputStream()) o esperar a que termine (waitFor()).

## Ejemplo mínimo

```java
Process p = pb.start();
```
