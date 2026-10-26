---
nombre: close()
---

## Qué es

Método que cierra un fichero abierto con FileReader, FileWriter, BufferedReader o BufferedWriter.

## Para qué sirve

Soltar el fichero cuando se termina de usar. En un BufferedWriter, close() también vacía el buffer, igual que flush().

## Ejemplo mínimo

```java
bw.write("hola");
bw.close();
```
