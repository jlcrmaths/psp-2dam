---
nombre: condición de carrera
---

## Qué es

Error que ocurre cuando varios hilos leen y cambian el mismo dato a la vez y el resultado depende de quién llega antes.

## Para qué sirve

Es un concepto, no una instrucción. Explica por qué `cuenta++` desde varios hilos puede perder sumas: cada hilo lee el valor, calcula y lo guarda, y otro hilo puede haber guardado entre medias. Se evita con `synchronized`.

## Ejemplo mínimo

```java
int temp = cuenta;
// otro hilo puede cambiar cuenta aquí
cuenta = temp + 1;
```
