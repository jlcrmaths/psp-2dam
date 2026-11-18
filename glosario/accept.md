---
nombre: accept()
---

## Qué es

Método de la clase ServerSocket. Es bloqueante: detiene el programa hasta que un cliente se conecta, y entonces devuelve un Socket con ese cliente.

## Para qué sirve

Que el servidor espere a los clientes sin gastar nada mientras no llega ninguno. Al ser bloqueante, el servidor no puede hacer otra cosa mientras espera (más adelante lo resolveremos con hilos).

## Ejemplo mínimo

```java
ServerSocket ss = new ServerSocket(12349);
// El programa se para aquí hasta que llegue un cliente.
Socket s = ss.accept();
```
