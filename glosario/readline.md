---
nombre: readLine()
---

## Qué es

Método de la clase BufferedReader. Lee una línea del fichero y la devuelve como texto. Cuando ya no quedan líneas, devuelve null.

## Para qué sirve

Contar o procesar las líneas de un fichero con un while que se repite hasta que devuelve null.

## Ejemplo mínimo

```java
int lineas = 0;
while (br.readLine() != null) {
    lineas++;
}
```
