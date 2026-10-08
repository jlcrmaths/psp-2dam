---
nombre: notifyAll()
---

## Qué es

Como notify(), pero despierta a todos los hilos que esperan con wait() sobre el mismo objeto.

## Para qué sirve

Cuando hay más de dos hilos esperando, notify() puede despertar al equivocado. Con notifyAll() cada hilo se despierta, comprueba su condición y se vuelve a dormir si no puede seguir.

## Ejemplo mínimo

```java
hayCuadro = false;
notifyAll();
```
