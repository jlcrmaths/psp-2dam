---
nombre: inanición
---

## Qué es

Concepto, no una instrucción: situación en la que un hilo espera su turno mucho tiempo, o para siempre, porque otros hilos pasan siempre por delante. En inglés, starvation. No hay bloqueo: el programa sigue funcionando, pero ese hilo no avanza.

## Para qué sirve

Explica por qué, con varios lectores que entran y salen sin parar, un escritor puede quedarse esperando: siempre hay algún lector dentro. Se evita dando prioridad al que espera: el semáforo cuenta los escritores que esperan y, mientras haya alguno, no deja entrar lectores nuevos.

## Ejemplo mínimo

```java
while (estado == CON_ESCRITOR || escritoresEsperando > 0) {
    wait();
}
```
