# Apartado 6.4 – Comunicación entre hilos

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `comunicarhilos`.

## Ejercicio 1: un pintor y un vendedor (proyecto `PintorVendedor`)

Hay un pintor y un vendedor de cuadros. Los dos comparten un almacén donde cabe 1 cuadro (los cuadros que caben llegan al almacén por el constructor).

- El pintor debe esperar si el almacén está lleno para dejar un cuadro.
- El vendedor debe esperar si el almacén está vacío para poder vender.
- El programa termina cuando se han vendido 10 cuadros.

Cada vez que el pintor deja un cuadro o el vendedor lo vende, se muestra por pantalla con los cuadros que hay en el almacén. Ejemplo: `Pintor: deja el cuadro 3. En el almacén: 1` y `Vendedor: vende el cuadro 3. En el almacén: 0`.

### Pistas
El almacén es algo que comparten los dos hilos, así que necesita su propia clase y los dos hilos deben recibir el mismo objeto. Para saber si está lleno o vacío hace falta contar los cuadros, como la cocina contaba los cuchillos libres. Cuando un hilo no puede continuar, tiene que dormirse hasta que el otro le avise. Eso lo hacen `wait()` y `notify()`, dentro de métodos `synchronized`.

### Más ayuda
Crea una clase `Almacen` con dos atributos `int`: `numCuadros`, los cuadros que hay, y `numMaxCuadros`, los que caben, que llega por el constructor. Tiene dos métodos `synchronized`: uno para depositar y otro para vender. Cada método usa un bucle `while` que llama a `wait()` mientras no pueda continuar: el pintor, mientras el almacén esté lleno; el vendedor, mientras esté vacío. Cuando puede continuar, suma o resta un cuadro, muestra el mensaje y llama a `notify()` para despertar al otro hilo. `wait()` obliga a escribir un `try` con `catch (InterruptedException e)`. `Pintor` y `Vendedor` implementan `Runnable`, reciben el almacén en el constructor y repiten 10 veces su método. `Principal` crea un solo `Almacen` de capacidad 1 y se lo pasa a los dos.

### Paso a paso
1. Crea el proyecto `PintorVendedor` y el paquete `comunicarhilos`.
2. Crea la clase `Almacen` con dos atributos privados `int`: `numCuadros`, que empiece en 0, y `numMaxCuadros`. Escribe un constructor que reciba `numMaxCuadros`.
3. Escribe el método `depositar`, marcado como `synchronized`, que recibe el número del cuadro.
4. Dentro, escribe un `while` que, mientras `numCuadros` sea igual a `numMaxCuadros`, llame a `wait()` (dentro de un `try` con `catch (InterruptedException e)`).
5. Al salir del `while`, suma 1 a `numCuadros`, muestra el nombre del hilo, el cuadro que deja y cuántos hay en el almacén, y llama a `notify()`.
6. Escribe el método `vender` del mismo modo, pero al revés: espera mientras `numCuadros` sea 0, resta 1 a `numCuadros`, muestra el mensaje y llama a `notify()`.
7. Crea las clases `Pintor` y `Vendedor`, que implementan `Runnable`. Cada una guarda el `Almacen` que recibe en el constructor.
8. En el `run()` de cada una, escribe un `for` de 1 a 10 que llame a `depositar` o a `vender` con el número de la vuelta.
9. En `Principal`, crea un solo `Almacen` de capacidad 1 y dos hilos con los nombres "Pintor" y "Vendedor", pasándoles ese mismo almacén.
10. Arranca los dos hilos con `start()` y comprueba que nunca hay más de 1 cuadro en el almacén ni menos de 0, y que se dejan y se venden los 10.

## Ejercicio 2: un pintor y dos vendedores (proyecto `PintorDosVendedores`)

Ahora hay un pintor y dos vendedores de cuadros. Los tres comparten un almacén donde cabe 1 cuadro.

- El pintor debe esperar si el almacén está lleno para dejar un cuadro.
- Los vendedores deben esperar si el almacén está vacío para poder vender.
- El programa termina cuando se han pintado 10 cuadros y se han vendido todos.

Cada cuadro lo vende un solo vendedor. Ejemplo: `Vendedor 2: vende un cuadro. En el almacén: 1`.

### Pistas
Ahora hay tres hilos esperando sobre el mismo almacén, y `notify()` solo despierta a uno cualquiera, que puede ser el equivocado. Además, los vendedores no saben cuántos cuadros les tocan, así que el almacén debe contar los cuadros pintados y vendidos para saber cuándo ya no hay más.

### Más ayuda
Cambia `notify()` por `notifyAll()`, que despierta a todos los hilos que esperan; cada uno vuelve a comprobar su condición y los que no pueden seguir se duermen otra vez. Añade al almacén dos atributos `int`: los cuadros pintados y los cuadros vendidos, con un método `synchronized` que devuelva los vendidos. El método de vender espera mientras no haya cuadros y todavía falten cuadros por pintar. Al salir del `while`, si hay cuadros vende uno; si no, es que ya se han pintado los 10 y no va a haber más, y el vendedor se despide. El vendedor repite su trabajo mientras se hayan vendido menos de 10 cuadros.

### Paso a paso
1. Crea el proyecto `PintorDosVendedores` y el paquete `comunicarhilos`, y copia las clases del ejercicio anterior.
2. En `Almacen`, añade dos atributos `int`, `numCuadrosPintados` y `numCuadrosVendidos`, que empiecen en 0.
3. En `depositar`, suma 1 a `numCuadrosPintados` y cambia `notify()` por `notifyAll()`.
4. En `vender`, el `while` espera mientras `numCuadros` sea 0 y `numCuadrosPintados` sea menor que 10.
5. Después del `while`, si `numCuadros` es mayor que 0: resta 1 a `numCuadros`, suma 1 a `numCuadrosVendidos`, muestra el mensaje y llama a `notifyAll()`.
6. Si no hay cuadros es que el pintor ya ha terminado: muestra un mensaje de que el vendedor se va.
7. Escribe un método `synchronized` que devuelva `numCuadrosVendidos`.
8. En `Vendedor`, sustituye el `for` por un `while` que repita mientras los cuadros vendidos sean menos de 10.
9. En `Principal`, crea un almacén, un pintor y dos vendedores con los nombres "Vendedor 1" y "Vendedor 2", y arranca los tres.
10. Ejecuta varias veces: el programa debe terminar siempre y se venden exactamente 10 cuadros entre los dos vendedores.

## Preguntas

1. Quita el `wait()` del vendedor del ejercicio 1. ¿Qué pasa? ¿Por qué hace falta?
2. ¿Por qué se usa `while` y no `if` alrededor de `wait()`?
3. En el ejercicio 2, ¿se reparten los cuadros por igual entre los dos vendedores? ¿Y siempre igual en cada ejecución?
4. ¿Qué pasaría en el ejercicio 2 si el `while` de `vender` no mirara `numCuadrosPintados`?
5. ¿Cambia algo si en el almacén caben 3 cuadros? ¿Y 10? Pruébalo cambiando el número en `Principal`.
