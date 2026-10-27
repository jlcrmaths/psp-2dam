---
nombre: getState()
---

## Qué es

Método de la clase Thread. Devuelve el estado en que está un hilo: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING o TERMINATED.

## Para qué sirve

Comprobar qué hace un hilo. Un hilo que espera el cerrojo de un objeto synchronized está en BLOCKED; uno dormido con sleep(), en TIMED_WAITING; uno que espera un wait() o un join(), en WAITING.

## Ejemplo mínimo

```java
Thread h = new Thread(new Tarea(), "Hilo 1");
System.out.println(h.getState());   // NEW
```
