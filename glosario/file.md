---
nombre: File
---

## Qué es

Clase que representa un fichero del disco por su nombre. No lo abre: solo dice cuál es.

## Para qué sirve

Pasar un fichero de un lado a otro sin abrirlo. Después se le pasa a FileReader o a FileWriter para leerlo o escribirlo.

## Ejemplo mínimo

```java
File fichero = new File("Discoteca.txt");
```
