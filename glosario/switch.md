---
nombre: switch
---

## Qué es

Instrucción que mira un valor y salta al `case` que coincide.

## Para qué sirve

Elegir entre varias opciones sin escribir muchos `if`. Cada `case` termina con `break`.

## Ejemplo mínimo

```java
switch (operacion) {
    case "suma":
        System.out.println("sumo");
        break;
    case "resta":
        System.out.println("resto");
        break;
}
```
