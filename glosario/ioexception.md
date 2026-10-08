---
nombre: IOException
---

## Qué es

Error que lanza Java cuando falla una operación con ficheros: no existe, no hay permiso, el disco está lleno...

## Para qué sirve

Java obliga a tenerlo en cuenta con try/catch cada vez que se usa un fichero.

## Ejemplo mínimo

```java
try {
    FileWriter fw = new FileWriter("datos.txt");
    fw.close();
} catch (IOException e) {
    System.out.println("No se puede abrir el fichero");
}
```
