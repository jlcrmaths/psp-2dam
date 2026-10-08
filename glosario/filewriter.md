---
nombre: FileWriter / Files
---

## Qué es

FileWriter es la clase de Java que escribe texto en un fichero. Files.readAllLines lee un fichero entero y devuelve una lista con una entrada por línea.

## Para qué sirve

Guardar y leer datos en ficheros de texto. FileWriter(ruta, true) añade al final en vez de borrar. Siempre hay que cerrar el fichero con close() y manejar IOException.

## Ejemplo mínimo

```java
FileWriter fw = new FileWriter("datos.txt", true);
fw.write("hola\n");
fw.close();
int lineas = Files.readAllLines(Path.of("datos.txt")).size();
```
