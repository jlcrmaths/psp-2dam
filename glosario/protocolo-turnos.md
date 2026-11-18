---
nombre: Protocolo de turnos
---

## Qué es

El guion acordado entre cliente y servidor: quién habla primero, qué manda cada uno y en qué orden. Cada println() de uno debe encontrar un readLine() en el otro.

## Para qué sirve

Evitar que los dos se queden esperando a la vez. Como readLine() es bloqueante, si los dos empiezan leyendo, nadie habla nunca y el programa se queda parado sin dar error.

## Ejemplo mínimo

```java
// Cliente: habla primero, luego escucha.
pw.println("Hola");
linea = br.readLine();
// Servidor: escucha primero, luego habla.
linea = br.readLine();
pw.println("Hola, cliente");
```
