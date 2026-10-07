---
nombre: new Thread(objeto, "nombre")
---

## Qué es

Forma de crear un hilo: se le da un objeto `Runnable` y un nombre.

## Para qué sirve

Crear un hilo a partir de una clase con `run()` y ponerle un nombre fácil de reconocer.

## Ejemplo mínimo

```java
Thread h1 = new Thread(new Contador(), "Hilo 1");
h1.start();
```
