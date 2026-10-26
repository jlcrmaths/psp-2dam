---
nombre: List
---

## Qué es

Interfaz de Java que representa una lista de elementos. ArrayList es una clase concreta que la implementa y es la que se crea con new.

## Para qué sirve

Declarar una lista sin atarse a un tipo concreto: List<Thread> hilos = new ArrayList<>(); Se usan add() para añadir, get() para obtener por posición y un for-each para recorrerla.

## Ejemplo mínimo

```java
List<Thread> hilos = new ArrayList<>();
hilos.add(new Thread(new Cliente(lavanderia)));
```
