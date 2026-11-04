---
nombre: wait(milisegundos)
---

## Qué es

Versión de wait() con un tiempo máximo: el hilo se duerme y suelta el objeto, pero se despierta solo cuando pasan esos milisegundos, aunque nadie le avise.

## Para qué sirve

Esperar «un rato o hasta que me avisen, lo que pase antes». El hilo también se despierta antes si otro hilo llama a notify() o notifyAll().

## Ejemplo mínimo

```java
// se queda como mucho 15 segundos
wait(15000);
```
