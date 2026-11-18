---
nombre: getInputStream()
---

## Qué es

Método de la clase Process. Devuelve lo que el proceso lanzado escribe con println, para leerlo desde nuestro programa.

## Para qué sirve

Ser el extremo de la tubería: nuestro programa recibe la salida del proceso. Se envuelve con InputStreamReader y BufferedReader.

## Ejemplo mínimo

```java
BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
```
