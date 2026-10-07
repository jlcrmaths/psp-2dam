---
nombre: Runnable
---

## Qué es

Interfaz (un contrato) para clases que quieren ejecutarse en un hilo. Obliga a escribir `run()`.

## Para qué sirve

Definir qué hace un hilo sin heredar de `Thread`. Sirve aunque la clase ya herede de otra.

## Ejemplo mínimo

```java
public class Gato implements Runnable {
    @Override
    public void run() {
        System.out.println("Miau!");
    }
}
```
