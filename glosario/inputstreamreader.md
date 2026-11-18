---
nombre: InputStreamReader
---

## Qué es

Clase que convierte lo que llega por una entrada (por ejemplo System.in) en letras.

## Para qué sirve

Se usa dentro de un BufferedReader para poder leer línea a línea con readLine(), también lo que llega por una tubería.

## Ejemplo mínimo

```java
BufferedReader bf = new BufferedReader(new InputStreamReader(System.in));
```
