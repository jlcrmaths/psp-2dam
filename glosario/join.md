---
nombre: join()
---

## Qué es

Método de Thread que hace esperar al hilo que lo llama hasta que el otro hilo termine.

## Para qué sirve

Esperar a que acaben varios hilos antes de seguir, por ejemplo para mostrar un mensaje final. Obliga a manejar InterruptedException (main puede declarar throws InterruptedException).

## Ejemplo mínimo

```java
hilo.start();
hilo.join();
System.out.println("El hilo ha terminado");
```
