---
nombre: for (Thread t : lista)
---

## Qué es

Forma corta del for para recorrer todos los elementos de una lista o array, uno en cada vuelta.

## Para qué sirve

No hace falta contar posiciones: t es el elemento actual. Se lee «para cada hilo t de la lista».

## Ejemplo mínimo

```java
for (Thread t : clientes) {
    t.join();
}
```
