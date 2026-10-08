# Apartado 6.3 – Comunicación entre hilos

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `comunicarhilos`.

## Ejercicio 1: un pintor y un vendedor (proyecto `PintorVendedor`)

Hay un pintor y un vendedor de cuadros. Los dos comparten un almacén donde solo entra un cuadro.

- El pintor debe esperar a que el almacén esté vacío para dejar un cuadro.
- El vendedor debe esperar a que haya un cuadro en el almacén para poder venderlo.
- El programa termina cuando se han vendido 10 cuadros.

Cada vez que el pintor deja un cuadro o el vendedor lo vende, se muestra por pantalla. Ejemplo: `Pintor: deja el cuadro 3` y `Vendedor: vende el cuadro 3`.

### Pistas
El almacén es algo que comparten los dos hilos, así que necesita su propia clase y los dos hilos deben recibir el mismo objeto. Cuando un hilo no puede continuar, tiene que dormirse hasta que el otro le avise. Eso lo hacen `wait()` y `notify()`, dentro de métodos `synchronized`.

### Más ayuda
Crea una clase `Almacen` con un atributo `boolean` que diga si hay un cuadro. Tiene dos métodos `synchronized`: uno para depositar y otro para vender. Cada método usa un bucle `while` que llama a `wait()` mientras no pueda continuar: el pintor, mientras haya cuadro; el vendedor, mientras no lo haya. Cuando puede continuar, cambia el atributo, muestra el mensaje y llama a `notify()` para despertar al otro hilo. `wait()` obliga a escribir un `try` con `catch (InterruptedException e)`. `Pintor` y `Vendedor` implementan `Runnable`, reciben el almacén en el constructor y repiten 10 veces su método. `Principal` crea un solo `Almacen` y se lo pasa a los dos.

### Paso a paso
1. Crea el proyecto `PintorVendedor` y el paquete `comunicarhilos`.
2. Crea la clase `Almacen` con un atributo privado `boolean` llamado `hayCuadro`, que empiece en `false`.
3. Escribe el método `depositar`, marcado como `synchronized`, que recibe el número del cuadro.
4. Dentro, escribe un `while` que, mientras `hayCuadro` sea `true`, llame a `wait()` (dentro de un `try` con `catch (InterruptedException e)`).
5. Al salir del `while`, pon `hayCuadro` a `true`, muestra el nombre del hilo y el cuadro que deja, y llama a `notify()`.
6. Escribe el método `vender` del mismo modo, pero al revés: espera mientras no haya cuadro, pone `hayCuadro` a `false`, muestra el mensaje y llama a `notify()`.
7. Crea las clases `Pintor` y `Vendedor`, que implementan `Runnable`. Cada una guarda el `Almacen` que recibe en el constructor.
8. En el `run()` de cada una, escribe un `for` de 1 a 10 que llame a `depositar` o a `vender` con el número de la vuelta.
9. En `Principal`, crea un solo `Almacen` y dos hilos con los nombres "Pintor" y "Vendedor", pasándoles ese mismo almacén.
10. Arranca los dos hilos con `start()` y comprueba que los cuadros se dejan y se venden de uno en uno, del 1 al 10.

## Ejercicio 2: un pintor y dos vendedores (proyecto `PintorDosVendedores`)

Ahora hay un pintor y dos vendedores de cuadros. Los tres comparten un almacén donde solo entra un cuadro.

- El pintor debe esperar a que el almacén esté vacío para dejar un cuadro.
- Los vendedores deben esperar a que haya un cuadro en el almacén para poder venderlo.
- El programa termina cuando se han pintado 10 cuadros y se han vendido todos.

Cada cuadro lo vende un solo vendedor. Ejemplo: `Vendedor 2: vende el cuadro 5`.

### Pistas
Ahora hay tres hilos esperando sobre el mismo almacén, y `notify()` solo despierta a uno cualquiera, que puede ser el equivocado. Además, los vendedores no saben cuántos cuadros les tocan, así que el almacén debe poder decirles que ya no hay más.

### Más ayuda
Cambia `notify()` por `notifyAll()`, que despierta a todos los hilos que esperan; cada uno vuelve a comprobar su condición y los que no pueden seguir se duermen otra vez. Añade al almacén un atributo `boolean` `terminado` y un método `terminar()` que lo pone a `true` y avisa a todos. El método de vender devuelve un `boolean`: `true` si ha vendido un cuadro y `false` si el almacén está vacío y el pintor ya terminó. El vendedor repite su trabajo mientras ese método devuelva `true`. El pintor llama a `terminar()` al acabar sus 10 cuadros.

### Paso a paso
1. Crea el proyecto `PintorDosVendedores` y el paquete `comunicarhilos`, y copia las clases del ejercicio anterior.
2. En `Almacen`, añade un atributo `int` con el número del cuadro que hay dentro y otro `boolean` llamado `terminado`, que empiece en `false`.
3. En `depositar`, guarda también el número del cuadro y cambia `notify()` por `notifyAll()`.
4. Cambia `vender` para que devuelva un `boolean` y no reciba nada. Su `while` espera mientras no haya cuadro y tampoco haya terminado.
5. Después del `while`, si no hay cuadro es que el pintor ha terminado: devuelve `false`.
6. Si hay cuadro, pon `hayCuadro` a `false`, muestra el mensaje con el número guardado, llama a `notifyAll()` y devuelve `true`.
7. Escribe el método `terminar()`, `synchronized`: pone `terminado` a `true` y llama a `notifyAll()`.
8. En `Pintor`, llama a `terminar()` después del `for`.
9. En `Vendedor`, sustituye el `for` por un `while` que repita mientras el método de vender devuelva `true`.
10. En `Principal`, crea un almacén, un pintor y dos vendedores con los nombres "Vendedor 1" y "Vendedor 2", y arranca los tres.
11. Ejecuta varias veces: el programa debe terminar siempre y los cuadros del 1 al 10 se venden una sola vez cada uno.

## Preguntas

1. Quita el `wait()` del vendedor del ejercicio 1. ¿Qué pasa? ¿Por qué hace falta?
2. ¿Por qué se usa `while` y no `if` alrededor de `wait()`?
3. En el ejercicio 2, ¿se reparten los cuadros por igual entre los dos vendedores? ¿Y siempre igual en cada ejecución?
4. ¿Qué pasaría en el ejercicio 2 si el pintor no llamara a `terminar()`?
