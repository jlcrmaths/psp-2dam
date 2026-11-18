---
nombre: Salto de línea como fin de mensaje
---

## Qué es

Por la red los datos llegan seguidos, sin cortes. El salto de línea que añade println() marca dónde acaba cada mensaje, y readLine() lee justo hasta ahí.

## Para qué sirve

Separar los mensajes entre cliente y servidor: cada println() se recibe con un readLine(). Si falta el salto, readLine() no sabe dónde acaba y sigue esperando.

## Ejemplo mínimo

```java
// Servidor:
pw.println("Hola");
// Cliente:
String linea = br.readLine();   // "Hola"
```
