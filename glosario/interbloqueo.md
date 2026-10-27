---
nombre: interbloqueo
---

## Qué es

Concepto, no una instrucción: situación en la que dos o más hilos esperan cada uno algo que tiene otro, y ninguno puede avanzar. En inglés, deadlock.

## Para qué sirve

Explica por qué un programa se queda parado sin dar ningún error. Se produce cuando hay exclusión mutua, un hilo retiene un recurso mientras pide otro, nadie puede quitárselo y los hilos esperan en círculo. Se evita pidiendo los recursos siempre en el mismo orden.

## Ejemplo mínimo

```java
a.metodoA(b);   // el hilo 1 tiene A y pide B
b.metodoB(a);   // el hilo 2 tiene B y pide A
```
