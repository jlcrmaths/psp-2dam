---
nombre: Importar clase por clase
---

## Qué es

Escribir un import por cada clase que se usa (import java.net.Socket;) en lugar de traer todo el paquete con asterisco (import java.net.*;).

## Para qué sirve

Que se vea qué clases usa el programa, no traer clases sin usar y evitar choques de nombres. Es la forma limpia que usaremos en clase.

## Ejemplo mínimo

```java
import java.net.ServerSocket;
import java.net.Socket;
```
