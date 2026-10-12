---
nombre: getPriority()
---

## Qué es

Método de `Thread` que devuelve la prioridad de un hilo, un número del 1 al 10.

## Para qué sirve

Saber con qué prioridad se está ejecutando un hilo, por ejemplo para mostrarla en pantalla.

## Ejemplo mínimo

```java
System.out.println(Thread.currentThread().getPriority());
```
