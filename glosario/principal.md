---
nombre: Principal
---

## Qué es

Nombre que usa el profesor para la clase que contiene el `main`.

## Para qué sirve

Reunir el código que crea y lanza los hilos. No es una palabra de Java: es una costumbre de nombre.

## Ejemplo mínimo

```java
public class Principal {
    public static void main(String[] args) {
        new Thread(new Gato(), "Gato").start();
    }
}
```
