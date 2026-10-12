---
nombre: MIN_PRIORITY, NORM_PRIORITY y MAX_PRIORITY
---

## Qué es

Tres constantes de la clase `Thread` con las prioridades de referencia: `MIN_PRIORITY` vale 1, `NORM_PRIORITY` vale 5 y `MAX_PRIORITY` vale 10.

## Para qué sirve

Dar nombre a los números de las prioridades, para no escribir 1, 5 o 10 a mano. Un hilo nuevo hereda la prioridad del hilo que lo crea; `main` tiene `NORM_PRIORITY`.

## Ejemplo mínimo

```java
h1.setPriority(Thread.MIN_PRIORITY);
```
