---
nombre: random() de Math
---

## Qué es

Método de la clase `Math` que devuelve un número decimal al azar, mayor o igual que 0 y menor que 1.

## Para qué sirve

Conseguir tiempos o valores distintos en cada ejecución. Hay que multiplicar antes de pasar a `int`: `(int) (Math.random() * 500)` da de 0 a 499, pero `(int) (Math.random()) * 500` da siempre 0.

## Ejemplo mínimo

```java
Thread.sleep((int) (Math.random() * 500));
```
