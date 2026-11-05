---
nombre: interbloqueo
---

## Qué es

Concepto, no una instrucción: situación en la que dos o más hilos esperan cada uno algo que tiene otro, y ninguno puede avanzar. En inglés, deadlock.

## Para qué sirve

Explica por qué un programa se queda parado sin dar ningún error. Se produce cuando hay exclusión mutua, un hilo retiene un recurso mientras pide otro, nadie puede quitárselo y los hilos esperan en círculo. Se evita rompiendo una de las cuatro condiciones: pidiendo los recursos siempre en el mismo orden, con un solo cerrojo, sin retener lo que se tiene o con un tiempo máximo de espera.

## Ejemplo mínimo

```java
new Trabajo(a, b);   // el hilo 1 tiene A y pide B
new Trabajo(b, a);   // el hilo 2 tiene B y pide A
```
