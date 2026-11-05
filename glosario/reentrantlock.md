---
nombre: ReentrantLock
---

## Qué es

Clase de Java (paquete java.util.concurrent.locks) que hace de cerrojo. Se coge y se suelta a mano con sus métodos, sin synchronized.

## Para qué sirve

Pedir un cerrojo con más control que synchronized: se puede pedir con tiempo máximo y rendirse si no llega. Es la base de la solución al interbloqueo con tiempo máximo.

## Ejemplo mínimo

```java
ReentrantLock cerrojo = new ReentrantLock();
```
