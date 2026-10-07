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

## Ejercicio 3: cinco gatos y cinco perros (proyecto `CincoPerrosGatos`)

Amplía el ejercicio 2 para lanzar 5 hilos `Gato` y 5 hilos `Perro`.

- Crea dos arrays de 5 hilos (`Thread[]`): uno para los gatos y otro para los perros.
- Con un `for` de 5 iteraciones, crea y lanza un gato y un perro en cada vuelta (en la primera, un `Gato` y un `Perro`; en la siguiente, otro de cada, y así hasta 5).
- Cada hilo muestra su nombre y su sonido. Ejemplo: `Gato 3: Miau!`.

## Ejercicio 4: operaciones con un array (proyecto `OperacionesArray`)

Tenemos un array de 10 enteros. Un hilo los suma, otro los resta y otro los multiplica.

Pista: pasa el array al constructor de cada clase y guárdalo en un atributo. Después puedes usar tres clases distintas (`HiloSuma`, `HiloResta`, `HiloMultiplica`) o una sola clase con un `switch`.

## Preguntas

1. Ejecuta el ejercicio 1 varias veces. ¿Sale siempre igual? ¿Por qué?
2. Ejecuta el ejercicio 2 varias veces. ¿Sale siempre primero `Miau!`?
3. Ejecuta el ejercicio 3 varias veces. ¿Salen siempre alternados (Gato 1, Perro 1, Gato 2...), aunque se lancen así? ¿Por qué?
4. En el ejercicio 4, ¿importa que los tres hilos lean el mismo array a la vez? ¿Y si un hilo lo modificara?
