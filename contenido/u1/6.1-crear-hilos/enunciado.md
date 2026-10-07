# Apartado 6.1 – Crear hilos en Java

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `crearhilos`.

## Ejercicio 1: tres hilos contadores (proyecto `CrearHilos`)

Crea tres hilos que cuentan del 1 al 10. En cada paso muestra por pantalla:

```
Hilo x: y
```

`x` es el número del hilo (1, 2 o 3). `y` es el número que está contando. Ejemplo: `Hilo 2: 7`.

### Pistas
Los tres hilos hacen exactamente lo mismo. Piensa cuántas clases necesitas de verdad, y cómo sabe cada hilo quién es. Trabaja con `Runnable`.

### Más ayuda
Necesitas una sola clase, `Contador`, que implementa `Runnable`. Dentro de su método `run()` va un bucle `for` que cuenta del 1 al 10. El número del hilo no se guarda en la clase: cada `Thread` recibe un nombre cuando se crea con `new Thread(new Contador(), "Hilo 1")`, y `Thread.currentThread().getName()` devuelve el nombre del hilo que está ejecutando el código. La clase `Principal` crea tres objetos `Thread` con tres nombres distintos ("Hilo 1", "Hilo 2" y "Hilo 3") y los lanza con `start()`.

### Paso a paso
1. Crea el proyecto `CrearHilos` y el paquete `crearhilos`.
2. Crea la clase `Contador` y haz que implemente `Runnable`.
3. Escribe el método `run()` con la etiqueta `@Override`.
4. Dentro de `run()`, escribe un bucle `for` que vaya del 1 al 10.
5. En cada vuelta, muestra con `System.out.println` el nombre del hilo, dos puntos y el número de la vuelta.
6. Crea la clase `Principal` con el método `main`.
7. En `main`, crea tres objetos `Thread`. A cada uno pásale un `Contador` nuevo y un nombre: "Hilo 1", "Hilo 2" y "Hilo 3".
8. Llama a `start()` en los tres hilos, después de haberlos creado.
9. Ejecuta el programa varias veces y compara las salidas.

## Ejercicio 2: Gato y Perro (proyecto `EjemploPerrosGatos`)

Crea dos hilos a la vez: uno para un gato, que muestra `Miau!`, y otro para un perro, que muestra `Guau!`.

### Pistas
Son dos clases muy pequeñas, una por animal, y cada una solo escribe una palabra. Las dos son `Runnable`. Lo importante es cómo se convierten en hilos.

### Más ayuda
`Gato` y `Perro` implementan `Runnable` y tienen su método `run()`: el de `Gato` muestra `Miau!` y el de `Perro` muestra `Guau!`, con `System.out.println`. Ninguna de las dos es un hilo por sí sola: en `Principal` se crea un objeto `Thread` con cada una, y se llama a `start()` en los dos.

### Paso a paso
1. Crea el proyecto `EjemploPerrosGatos` y el paquete `crearhilos`.
2. Crea la clase `Gato`, que implementa `Runnable`.
3. En su método `run()`, muestra `Miau!`.
4. Crea la clase `Perro` del mismo modo, pero que muestre `Guau!`.
5. Crea la clase `Principal` con `main`.
6. En `main`, crea un `Thread` con un `Gato` y otro `Thread` con un `Perro`.
7. Llama a `start()` en los dos hilos.
8. Ejecuta varias veces y fíjate en qué palabra sale primero.

## Ejercicio 3: cinco gatos y cinco perros (proyecto `CincoPerrosGatos`)

Amplía el ejercicio anterior para lanzar 5 hilos Gato y 5 hilos Perro. Crea 2 arrays de 5 y, con un `for` de 5 iteraciones, lanza uno de cada en cada vuelta (en la primera, un Gato y un Perro; en la siguiente, otro de cada, y así hasta 5).

Cada hilo muestra su nombre y su sonido. Ejemplo: `Gato 3: Miau!`.

### Pistas
En vez de crear diez hilos con diez variables sueltas, guárdalos en dos arrays y deja que el bucle haga el trabajo repetido. Piensa en cómo sacar el nombre de cada hilo.

### Más ayuda
Necesitas dos arrays de tipo `Thread` con tamaño 5, uno para gatos y otro para perros. Un bucle `for` de cinco vueltas crea en cada vuelta un hilo gato y un hilo perro, los guarda en la posición de esa vuelta y los arranca con `start()`. Las posiciones de un array empiezan en 0, pero los nombres deben empezar en 1. Para que cada hilo diga quién es, `Gato` y `Perro` muestran el nombre del hilo con `Thread.currentThread().getName()`, además de su sonido.

### Paso a paso
1. Crea el proyecto `CincoPerrosGatos` y el paquete `crearhilos`.
2. Crea las clases `Gato` y `Perro`, que implementan `Runnable`.
3. En el `run()` de cada una, muestra el nombre del hilo, dos puntos y el sonido (`Miau!` o `Guau!`).
4. En `Principal`, dentro de `main`, declara dos arrays de `Thread` de tamaño 5: uno para gatos y otro para perros.
5. Escribe un bucle `for` que vaya de la posición 0 a la 4.
6. En cada vuelta, crea un `Thread` con un `Gato` nuevo y guárdalo en el array de gatos. El nombre será "Gato" seguido del número de vuelta más uno.
7. En la misma vuelta, haz lo mismo con el `Perro` y el array de perros.
8. En la misma vuelta, llama a `start()` en los dos hilos nuevos.
9. Ejecuta varias veces y comprueba que el orden de la salida cambia.

## Ejercicio 4: operaciones con un array (proyecto `OperacionesArray`)

Tenemos un array de 10 enteros. Un hilo los suma, otro los resta y otro los multiplica.

### Pistas
El método `run()` no recibe nada de fuera. Piensa por dónde puede entrar el array en la clase antes de que el hilo empiece a trabajar: pásalo como argumento al constructor y guárdalo. Después puedes usar tres clases distintas o una sola con un `switch`.

### Más ayuda
El array entra por el constructor y se guarda en un atributo privado de la clase; `run()` lo recorre con un bucle `for`. Cada operación necesita su valor de partida: la suma empieza en 0, la multiplicación empieza en 1, y la resta parte del primer elemento y resta desde el segundo. Puedes hacer tres clases (`HiloSuma`, `HiloResta` y `HiloMultiplica`) o una sola que reciba también el nombre de la operación y use un `switch`.

### Paso a paso
1. Crea el proyecto `OperacionesArray` y el paquete `crearhilos`.
2. Crea la clase `HiloSuma` y haz que implemente `Runnable`.
3. Añade un atributo privado de tipo array de enteros.
4. Escribe un constructor que reciba el array y lo guarde en ese atributo con `this`.
5. En `run()`, crea una variable total que empiece en 0 y recorre el array con un `for` sumando cada elemento.
6. Al terminar, muestra el nombre del hilo y el resultado.
7. Crea `HiloResta` y `HiloMultiplica` igual. La resta empieza con el primer elemento y recorre desde el segundo; la multiplicación empieza en 1.
8. En `Principal`, crea el array de 10 enteros con los valores del 1 al 10.
9. Crea tres hilos, cada uno con su clase, pasándoles el mismo array y un nombre ("Hilo 1", "Hilo 2" y "Hilo 3").
10. Arranca los tres con `start()` y comprueba los resultados: suma 55, resta -53 y multiplicación 3628800.

## Preguntas

1. Ejecuta el ejercicio 1 varias veces. ¿Sale siempre igual? ¿Por qué?
2. Ejecuta el ejercicio 2 varias veces. ¿Sale siempre primero `Miau!`?
3. Ejecuta el ejercicio 3 varias veces. ¿Salen siempre alternados (Gato 1, Perro 1, Gato 2...), aunque se lancen así? ¿Por qué?
4. En el ejercicio 4, ¿importa que los tres hilos lean el mismo array a la vez? ¿Y si un hilo lo modificara?
