---
nombre: static final
---

## Qué es

Dos palabras clave juntas que crean una constante de la clase: `static` hace que pertenezca a la clase y no a cada objeto, y `final` hace que su valor no se pueda cambiar.

## Para qué sirve

Dar nombre a valores fijos para no escribir números sueltos. Por convención se escriben en mayúsculas: `LIBRE` se lee mejor que `0`.

## Ejemplo mínimo

```java
public static final int LIBRE = 0;
public static final int CON_ESCRITOR = 2;
```
