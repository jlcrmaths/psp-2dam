---
nombre: try / catch
---

## Qué es

Estructura que prueba un código y, si Java lanza un error de un tipo concreto, ejecuta otro bloque en lugar de parar el programa.

## Para qué sirve

Es obligatorio con wait(), que puede lanzar InterruptedException (aviso de que alguien interrumpió la espera). Si no hacemos nada con el aviso, el catch queda vacío.

## Ejemplo mínimo

```java
try {
    wait();
} catch (InterruptedException e) {
}
```
