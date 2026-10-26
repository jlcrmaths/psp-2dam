---
nombre: BufferedWriter
---

## Qué es

Clase que escribe en un fichero de texto de forma cómoda, usando un FileWriter por dentro. Guarda el texto en memoria y lo manda al disco al cerrarlo.

## Para qué sirve

Escribir líneas en un fichero con write() y newLine(). Si no se vacía con flush() o no se cierra con close(), el texto puede no llegar al disco.

## Ejemplo mínimo

```java
BufferedWriter bw = new BufferedWriter(new FileWriter(fichero, true));
```
