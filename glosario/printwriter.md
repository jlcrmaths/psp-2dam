---
nombre: PrintWriter
---

## Qué es

Clase que escribe texto con print() y println(), igual que System.out, pero hacia otro destino (aquí, el socket).

## Para qué sirve

Es el canal para hablar: lo que se escribe con println() llega al otro programa. Con el segundo parámetro true (autoFlush) cada línea se envía en el momento.

## Ejemplo mínimo

```java
PrintWriter pw = new PrintWriter(s.getOutputStream(), true);
pw.println("Hola");
```
