---
nombre: import static
---

## Qué es

Línea que va arriba del fichero, tras `package`, y permite usar un método estático de otra clase sin escribir el nombre de la clase delante.

## Para qué sirve

Con `import static java.lang.Thread.sleep;` se escribe `sleep(3000);` en vez de `Thread.sleep(3000);`. NetBeans la escribe con la bombilla.

## Ejemplo mínimo

```java
import static java.lang.Thread.sleep;

sleep(3000);
```
