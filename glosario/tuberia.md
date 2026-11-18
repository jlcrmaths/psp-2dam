---
nombre: Tubería (pipe)
---

## Qué es

Conexión entre dos programas: la salida del primero se convierte en la entrada del segundo. En la terminal se escribe con el símbolo |.

## Para qué sirve

Que un programa use los datos que produce otro sin ficheros de por medio. Cada programa es un proceso distinto y solo comparten texto.

## Ejemplo mínimo

```java
// En la terminal (no es código Java):
// java -jar GenerarNumeros.jar | java -jar SumarPares.jar
```
