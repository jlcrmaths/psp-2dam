---
nombre: start()
---

## Qué es

Método de `Thread` que pone en marcha el hilo.

## Para qué sirve

Crear el hilo de verdad y que Java llame a `run()`. Si llamas a `run()` directamente, no hay hilo nuevo.

## Ejemplo mínimo

```java
Thread h1 = new Thread(new Contador(), "Hilo 1");
h1.start();
```
