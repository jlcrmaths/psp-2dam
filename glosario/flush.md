---
nombre: flush()
---

## Qué es

Método de la clase BufferedWriter. Vacía el buffer: manda al fichero todo el texto que se había guardado en memoria.

## Para qué sirve

Un BufferedWriter no escribe en el fichero cada vez que se llama a write(): guarda el texto en memoria y lo manda de golpe. Sin flush() (o sin close()), el texto puede no llegar nunca al fichero.

## Ejemplo mínimo

```java
bw.write("Escritor0");
bw.newLine();
bw.flush();
```
