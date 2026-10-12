---
nombre: setPriority()
---

## Qué es

Método de `Thread` que cambia la prioridad de un hilo. La prioridad es un número del 1 al 10.

## Para qué sirve

Pedir al planificador que dé más (o menos) tiempo de ejecución a un hilo. Se llama antes de `start()`. Es una sugerencia: el sistema operativo decide y el orden no queda garantizado.

## Ejemplo mínimo

```java
Thread h1 = new Thread(new Tarea(), "Hilo 1");
h1.setPriority(Thread.MAX_PRIORITY);
h1.start();
```
