---
nombre: Cerrar la conexión
---

## Qué es

Llamar a close() en los canales (br y pw), en el Socket y, en el servidor, en el ServerSocket. Se cierra en orden inverso al que se abrió.

## Para qué sirve

Liberar el puerto y los recursos del ordenador, y avisar al otro programa: cuando un Socket se cierra, el readLine() del otro devuelve null.

## Ejemplo mínimo

```java
br.close();
pw.close();
s.close();
ss.close();
```
