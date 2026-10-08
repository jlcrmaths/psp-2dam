---
nombre: Thread.sleep()
---

## Qué es

Método que duerme el hilo actual durante los milisegundos que se le indican (1000 = 1 segundo).

## Para qué sirve

Simular que algo tarda: un lavado, una máquina que fabrica una pieza. Obliga a escribir try/catch con InterruptedException. Se usa fuera de synchronized para no bloquear a los demás hilos.

## Ejemplo mínimo

```java
try {
    Thread.sleep(2000);
} catch (InterruptedException e) {
}
```
