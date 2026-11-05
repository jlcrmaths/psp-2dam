---
nombre: Object
---

## Qué es

La clase más sencilla de Java: todas las demás clases descienden de ella. Con new Object() se crea un objeto vacío, sin datos ni métodos propios.

## Para qué sirve

Servir de cerrojo. Como todo objeto tiene su propio cerrojo, un Object vacío que comparten varios hilos permite que todos se esperen con synchronized (candado) sin que importe qué otros objetos usen.

## Ejemplo mínimo

```java
Object candado = new Object();

synchronized (candado) {
    // solo un hilo a la vez entra aquí
}
```
