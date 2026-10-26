---
nombre: BufferedReader
---

## Qué es

Clase que lee un fichero de texto de forma cómoda, línea a línea, usando un FileReader por dentro.

## Para qué sirve

Recorrer un fichero con readLine(). Hay que cerrarlo con close() cuando se termina de usar.

## Ejemplo mínimo

```java
BufferedReader br = new BufferedReader(new FileReader(fichero));
```
