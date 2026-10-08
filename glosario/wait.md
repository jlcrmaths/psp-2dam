---
nombre: wait()
---

## Qué es

Método que duerme al hilo que lo llama y suelta el objeto para que otro hilo pueda entrar.

## Para qué sirve

Esperar a que otro hilo avise de que ya se puede continuar. Solo se usa dentro de un método synchronized y obliga a escribir try/catch.

## Ejemplo mínimo

```java
while (hayCuadro) {
    try {
        wait();
    } catch (InterruptedException e) {
    }
}
```
