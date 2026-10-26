---
nombre: semáforo
---

## Qué es

Concepto, no una instrucción de Java: un objeto compartido que guarda en qué estado están unos datos y decide quién puede entrar en cada momento.

## Para qué sirve

Coordinar hilos con papeles distintos. En lectores y escritores, el semáforo guarda un estado (libre, con lectores o con escritor) y un contador de lectores; hace esperar con `wait()` a quien no puede entrar y avisa con `notify()` cuando el estado vuelve a estar libre.

## Ejemplo mínimo

```java
if (estado == LIBRE) {
    estado = CON_LECTORES;
}
tLectores++;
```
