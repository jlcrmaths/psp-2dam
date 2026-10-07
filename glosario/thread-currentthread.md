---
nombre: Thread.currentThread()
---

## Qué es

Método que devuelve el hilo que está ejecutando ese código en este momento.

## Para qué sirve

Preguntar «¿qué hilo soy?». Se usa dentro de `run()`, junto con `getName()`.

## Ejemplo mínimo

```java
Thread actual = Thread.currentThread();
System.out.println(actual.getName());
```
