---
nombre: throws
---

## Qué es

Palabra que se pone en la cabecera de un método para avisar de que puede lanzar un error de cierto tipo y dejarlo pasar.

## Para qué sirve

Evitar escribir un try/catch en cada llamada a join() o sleep(): el método declara el error y quien lo llame se ocupa.

## Ejemplo mínimo

```java
public static void main(String[] args) throws InterruptedException {
    hilo.join();
}
```
