---
nombre: getOutputStream()
---

## Qué es

Método de la clase Socket. Devuelve la salida del socket: el flujo por el que se envían bytes al otro programa.

## Para qué sirve

Es el punto de partida del canal para hablar. Se envuelve en un PrintWriter para escribir texto con println().

## Ejemplo mínimo

```java
PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
```
