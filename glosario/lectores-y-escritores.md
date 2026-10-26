---
nombre: lectores y escritores
---

## Qué es

Problema clásico de hilos: unos hilos solo leen un dato compartido y otros lo cambian. El programa tiene que evitar que se estorben.

## Para qué sirve

Es un concepto, no una instrucción. Se resuelve con un objeto compartido que cuenta cuántos lectores y cuántos escritores lo usan, y con wait() y notifyAll() para esperar y avisar. En la versión más simple solo entra un hilo cada vez. Una versión más fina deja entrar a varios lectores a la vez, pero a un escritor siempre solo.

## Ejemplo mínimo

```java
// Espera si hay alguien dentro, sea lector o escritor.
while (lectores > 0 || escritores > 0) {
    wait();
}
lectores++;
```
