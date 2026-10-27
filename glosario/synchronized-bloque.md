---
nombre: synchronized (objeto)
---

## Qué es

Forma de usar synchronized no en un método entero, sino en un bloque: el hilo coge el cerrojo del objeto que se escribe entre paréntesis solo mientras dura el bloque.

## Para qué sirve

Proteger solo una parte del código, o coger el cerrojo de otro objeto distinto de this. Se pueden anidar para pedir dos cerrojos, siempre en el mismo orden para evitar un interbloqueo.

## Ejemplo mínimo

```java
synchronized (primero) {
    synchronized (segundo) {
        // trabaja con los dos
    }
}
```
