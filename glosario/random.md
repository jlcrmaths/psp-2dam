---
nombre: Random
---

## Qué es

Clase de Java que genera números al azar.

## Para qué sirve

Variar los tiempos o los valores en cada ejecución. nextInt(3) da 0, 1 o 2.

## Ejemplo mínimo

```java
Random azar = new Random();
int segundos = 1 + azar.nextInt(3); // 1, 2 o 3
```
