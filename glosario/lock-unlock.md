---
nombre: lock() y unlock()
---

## Qué es

Métodos de ReentrantLock. lock() pide el cerrojo y espera hasta tenerlo. unlock() lo suelta.

## Para qué sirve

Proteger un trozo de código como con synchronized, pero a mano. Hay que llamar siempre a unlock() por cada lock(): si se olvida, el cerrojo se queda cogido para siempre.

## Ejemplo mínimo

```java
cerrojo.lock();
// trabaja con el recurso
cerrojo.unlock();
```
