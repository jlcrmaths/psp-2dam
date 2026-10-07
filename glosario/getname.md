---
nombre: getName()
---

## Qué es

Método de `Thread` que devuelve el nombre del hilo.

## Para qué sirve

Saber qué hilo está ejecutando un código, por ejemplo para mostrarlo en pantalla.

## Ejemplo mínimo

```java
Thread h = new Thread(new Contador(), "Hilo 1");
System.out.println(h.getName());   // Hilo 1
```
