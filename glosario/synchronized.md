---
nombre: synchronized
---

## Qué es

Palabra clave que se pone en un método para que solo un hilo a la vez pueda estar dentro de él.

## Para qué sirve

Evitar que dos hilos toquen a la vez el mismo objeto. Es imprescindible para usar wait() y notify().

## Ejemplo mínimo

```java
public synchronized void depositar(int numero) {
    // solo un hilo a la vez entra aquí
}
```
