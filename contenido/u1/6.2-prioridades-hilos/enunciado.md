# Apartado 6.2 – Prioridades de los hilos

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `prioridades`.

## Ejercicio 1: quince hilos con tres prioridades (proyecto `PrioridadesHilos`)

Se crean quince hilos que hacen la misma tarea pesada: unir 20000 letras "A" en una cadena. Cinco hilos tienen la prioridad mínima, cinco la normal y cinco la máxima.

Al empezar se muestra `Hilos en marcha, espera...`. Cuando un hilo termina, muestra su nombre y su prioridad. Ejemplo: `Máximo 3 (prioridad 10) termina`.

Ejecuta el programa varias veces y mira si los hilos de prioridad máxima terminan antes que los demás.

### Pistas
Cada hilo ya tiene una prioridad, que es un número. Java te da tres valores ya preparados para la mínima, la normal y la máxima, y un método para cambiar la prioridad de un hilo antes de arrancarlo. Si no la cambias, el hilo hereda la del hilo que lo crea. Los quince hilos hacen lo mismo, así que basta una clase `Runnable`; lo que cambia es cómo se configura cada `Thread`.

### Más ayuda
Una sola clase `Tarea` que implementa `Runnable`. En `run()`, un `for` de 20000 vueltas que añade una "A" a una cadena y, en cada vuelta, llama a `Thread.yield()` para sugerir al planificador que deje pasar a otro hilo. Al terminar, muestra el nombre del hilo y su prioridad con `getPriority()`. En `Principal`, crea tres arrays de cinco `Thread`, uno por prioridad, con nombres como "Mínimo 1". Con `setPriority()` y las constantes `Thread.MIN_PRIORITY` y `Thread.MAX_PRIORITY` cambia la prioridad de los hilos mínimos y máximos; los normales no necesitan cambio. Arranca todos con `start()` en un último `for`.

### Paso a paso
1. Crea el proyecto `PrioridadesHilos` y el paquete `prioridades`.
2. Crea la clase `Tarea` y haz que implemente `Runnable`.
3. En `run()`, crea una variable `String` vacía.
4. Escribe un `for` de 20000 vueltas. En cada vuelta, añade una "A" a la cadena y llama a `Thread.yield()`.
5. Al terminar el `for`, muestra el nombre del hilo, su prioridad (con `getPriority()`) y la palabra "termina".
6. En `Principal`, crea tres arrays de cinco `Thread`: `minimos`, `normales` y `maximos`.
7. Con un `for` de 0 a 4, rellena los tres arrays con `new Thread(new Tarea(), "...")`, con nombres como "Mínimo 1", "Normal 1" y "Máximo 1".
8. En ese mismo `for`, llama a `setPriority(Thread.MIN_PRIORITY)` en los mínimos y a `setPriority(Thread.MAX_PRIORITY)` en los máximos.
9. Muestra `Hilos en marcha, espera...`.
10. Con otro `for`, arranca los quince hilos con `start()`.
11. Ejecuta el programa varias veces y observa si los de prioridad 10 terminan antes que los de prioridad 1.

## Preguntas

1. Ejecuta el ejercicio varias veces. ¿Terminan siempre antes los hilos de prioridad máxima?
2. ¿Qué crees que pasaría en un ordenador con un solo núcleo? ¿Y si quitas `Thread.yield()`?
3. ¿Se puede usar la prioridad para obligar a que un hilo termine antes que otro? ¿Qué usarías en su lugar?
