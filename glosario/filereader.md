---
nombre: FileReader
---

## Qué es

Clase que abre un fichero de texto para leerlo. Lanza FileNotFoundException si el fichero no existe.

## Para qué sirve

Se envuelve en un BufferedReader para poder leer línea a línea.

## Ejemplo mínimo

```java
BufferedReader br = new BufferedReader(new FileReader(fichero));
```
