---
nombre: notify()
---

## Qué es

Método que despierta a un hilo que está esperando con wait() sobre el mismo objeto.

## Para qué sirve

Avisar a otro hilo de que algo ha cambiado. Solo despierta a uno, y no se puede elegir cuál.

## Ejemplo mínimo

```java
hayCuadro = true;
notify();
```
