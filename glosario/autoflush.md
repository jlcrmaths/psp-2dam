---
nombre: autoFlush (buffer y flush)
---

## Qué es

El PrintWriter guarda lo que escribes en una zona de espera, el buffer. Hacer flush es vaciarla y enviar todo. Con true como segundo dato del constructor, el autoFlush hace flush solo en cada println().

## Para qué sirve

Que lo que escribes llegue al otro programa en el momento. Sin él, el texto puede quedarse en el buffer y el otro se queda esperando.

## Ejemplo mínimo

```java
// Con autoFlush: cada println() sale al instante.
PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
pw.println("Hola");
```
