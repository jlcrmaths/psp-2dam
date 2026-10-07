# Apartado 6.1 – Crear hilos en Java

Trabaja con `Runnable`. Cada ejercicio es un proyecto de NetBeans distinto. Las clases van en el paquete `crearhilos`.

## Ejercicio 1: tres hilos contadores (proyecto `CrearHilos`)

Crea tres hilos que cuentan del 1 al 10. En cada paso muestra por pantalla:

```
Hilo x: y
```

`x` es el número del hilo (1, 2 o 3). `y` es el número que está contando. Ejemplo: `Hilo 2: 7`.

Clases:
- `Contador`: implementa `Runnable`. Su método `run()` cuenta del 1 al 10. Muestra el nombre del hilo con `Thread.currentThread().getName()`.
- `Principal`: crea los tres hilos con `new Thread(new Contador(), "Hilo 1")` (y "Hilo 2", "Hilo 3") y los lanza con `start()`.

## Ejercicio 2: Gato y Perro (proyecto `EjemploPerrosGatos`)

Clases:
- `Gato`: implementa `Runnable`. Su método `run()` muestra `Miau!`.
- `Perro`: implementa `Runnable`. Su método `run()` muestra `Guau!`.
- `Principal`: crea un hilo con un `Gato` y otro con un `Perro`, y los lanza con `start()`.

## Preguntas

1. Ejecuta el ejercicio 1 varias veces. ¿Sale siempre igual? ¿Por qué?
2. Ejecuta el ejercicio 2 varias veces. ¿Sale siempre primero `Miau!`?
