---
nombre: @Override
---

## Qué es

Etiqueta que avisa de que un método reemplaza al de la clase o interfaz original.

## Para qué sirve

Hace que el compilador avise si te equivocas al escribir el nombre del método (por ejemplo `Run` en vez de `run`).

## Ejemplo mínimo

```java
@Override
public void run() {
    System.out.println("Hola");
}
```
