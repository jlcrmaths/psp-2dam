---
nombre: while con readLine()
---

## Qué es

Condición de bucle que lee una línea, la guarda en una variable y la compara con null, todo a la vez.

## Para qué sirve

Recorrer todo lo que llega por una entrada o un fichero sin repetir el readLine() antes y dentro del bucle.

## Ejemplo mínimo

```java
String linea;
while ((linea = entrada.readLine()) != null) {
    System.out.println(linea);
}
```
