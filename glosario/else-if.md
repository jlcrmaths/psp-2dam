---
nombre: else if
---

## Qué es

Una condición más que se prueba solo si la del `if` anterior no se cumplió. Se pueden encadenar varias, y un `else` final recoge todo lo demás.

## Para qué sirve

Elegir entre varios caminos: solo se ejecuta uno. Aquí, según el estado del semáforo, el lector entra directamente, espera o se une a los que ya leen.

## Ejemplo mínimo

```java
if (estado == LIBRE) {
    estado = CON_LECTORES;
} else if (estado == CON_ESCRITOR) {
    wait();
} else {
    // ya hay lectores: entra sin esperar
}
```
