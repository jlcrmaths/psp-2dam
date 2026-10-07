---
nombre: constructor
---

## Qué es

Método especial que se ejecuta al hacer `new`. Se llama igual que la clase y no lleva `void`.

## Para qué sirve

Dar a un objeto sus datos iniciales. Así un hilo recibe el array con el que va a trabajar, porque `run()` no tiene parámetros.

## Ejemplo mínimo

```java
public HiloSuma(int[] numeros) {
    this.numeros = numeros;
}
```
