---
nombre: Thread.yield()
---

## Qué es

Método que sugiere al planificador de Java que el hilo actual deja pasar a otro hilo.

## Para qué sirve

Dar a los demás hilos la oportunidad de ejecutarse. Es solo una sugerencia: Java puede ignorarla y el hilo seguir. No lo uses para controlar el orden.

## Ejemplo mínimo

```java
for (int i = 0; i < 20000; i++) {
    Thread.yield();
}
```
