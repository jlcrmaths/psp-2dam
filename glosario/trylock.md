---
nombre: tryLock(tiempo, unidad)
---

## Qué es

Método de ReentrantLock. Pide el cerrojo y espera como mucho el tiempo que se indica. Devuelve true si lo consigue y false si el tiempo se acaba. Puede lanzar InterruptedException.

## Para qué sirve

No quedarse esperando para siempre: si devuelve false, el hilo puede soltar lo que tiene y volver a intentarlo. Así se evita el interbloqueo.

## Ejemplo mínimo

```java
if (cerrojo.tryLock(1, TimeUnit.SECONDS)) {
    // lo ha conseguido
} else {
    // se rinde
}
```
