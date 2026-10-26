# Apartado 6.5 – Problemas de sincronización

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `sincronizacion`. Los ejercicios van de menos a más difícil.

## Ejercicio 1: lectores y escritores (proyecto `LectoresEscritores`)

Hay 10 hilos escritores y 10 hilos lectores.

- Cada escritor escribe su nombre en una línea nueva de un fichero de texto.
- Cada lector lee cuántas líneas tiene el fichero en el momento de la lectura y lo muestra por pantalla.

Ejemplo de salida: `Lector 4 lee: el fichero tiene 6 líneas`.

### Pistas
El fichero es lo que comparten los 20 hilos, así que debe estar en su propia clase y todos deben usar el mismo objeto. Piensa qué podría salir mal si un lector leyera mientras un escritor está escribiendo. Aquí basta con `synchronized`.

### Más ayuda
Crea una clase `Fichero` que guarde la ruta del fichero y tenga dos métodos `synchronized`: uno que añade una línea al final y otro que cuenta las líneas. Para escribir sirve `FileWriter` con el segundo argumento a `true`, que añade en vez de borrar. Para contar sirve `Files.readAllLines`, que devuelve una lista con una entrada por línea. Los dos obligan a escribir un `try` con `catch (IOException e)`. `Escritor` y `Lector` implementan `Runnable`, reciben el `Fichero` en el constructor y llaman a su método. En `Principal`, un `for` crea y arranca un escritor y un lector en cada vuelta.

### Paso a paso
1. Crea el proyecto `LectoresEscritores` y el paquete `sincronizacion`.
2. Crea la clase `Fichero` con un atributo privado `String` para la ruta.
3. En el constructor, guarda la ruta y crea el fichero vacío con un `FileWriter`, para que cada ejecución empiece desde cero.
4. Escribe el método `escribir`, `synchronized`, que añade el nombre del hilo y un salto de línea al final del fichero y cierra el fichero.
5. Escribe el método `contarLineas`, `synchronized`, que lee todas las líneas y muestra cuántas hay.
6. Crea `Escritor` y `Lector`, que implementan `Runnable` y reciben el `Fichero` en el constructor.
7. En el `run()` de cada una, llama al método correspondiente pasando `Thread.currentThread().getName()`.
8. En `Principal`, crea un solo `Fichero` y un `for` de 1 a 10 que cree y arranque un `Escritor` y un `Lector` con nombres como "Escritor 3" y "Lector 3".
9. Ejecuta varias veces y comprueba que cada lector ve entre 0 y 10 líneas y que al final el fichero tiene 10.

## Ejercicio 2: fábrica de piezas (proyecto `FabricaPiezas`)

Una fábrica tiene tres máquinas creadoras que generan piezas y las ponen en una cinta transportadora. Una máquina empaquetadora las recoge de la cinta. Las máquinas se llaman "Creadora0", "Creadora1", "Creadora2" y "Empaquetadora0".

- La cinta admite como máximo 5 piezas. Si está llena, las creadoras esperan a que se libere espacio.
- Cada creadora tarda de 2 a 3 segundos (al azar) en crear una pieza y la pone en la cinta.
- La empaquetadora retira una pieza cada segundo. Si no hay ninguna, espera.
- Cada vez que se crea o se empaqueta una pieza, se muestra cuántas hay en la cinta.
- Entre todas las creadoras se crean 50 piezas, ni una más. Las máquinas no saben de antemano cuántas piezas habrá: lo sabe la cinta.
- La fábrica termina cuando se han creado y empaquetado las 50 piezas y la cinta queda vacía. Entonces se muestra `Fábrica cerrada`.

### Pistas
La cinta transportadora es el objeto compartido y es un problema de productor y consumidor, como el del pintor. La diferencia es que hay varios productores y un tope de piezas entre todos. Las máquinas no saben cuándo parar: se lo tiene que decir la cinta. Piensa qué puede devolver un método de la cinta para que la máquina sepa si debe seguir o parar, y quién tiene que guardar esa información. Piensa también cuándo debe acabar la empaquetadora: no basta con que la cinta esté vacía. Para el mensaje final, `main` tiene que esperar a que terminen todos los hilos.

### Más ayuda
La clase `CintaTransportadora` guarda cuántas piezas hay en la cinta, cuántas se han creado y cuántas se han empaquetado, y dos banderas `boolean`: una dice si se debe seguir fabricando y otra si se debe seguir empaquetando. Las dos empiezan en `true`. La capacidad y el total de piezas son constantes de la clase. Tiene dos métodos `synchronized` que devuelven `boolean` y declaran `throws InterruptedException`. El de crear espera mientras la cinta esté llena. Después, si ya se crearon todas las piezas, apaga la bandera de fabricar; si no, crea una pieza y la pone en la cinta. Avisa con `notifyAll()` y devuelve la bandera. El de empaquetar espera mientras la cinta esté vacía y se siga fabricando. Después, si la cinta está vacía y ya no se fabrica, apaga la bandera de empaquetar; si no, retira una pieza y avisa. Devuelve su bandera. `MaquinaCreadora` y `MaquinaEmpaquetadora` implementan `Runnable` y reciben la cinta en el constructor. Cada una repite su método de la cinta con un `while` mientras devuelva `true`, y duerme con `Thread.sleep()` fuera de los métodos de la cinta. La creadora usa `Random` para el tiempo al azar. `Principal` guarda los hilos en dos arrays de `Thread`, los arranca con un for-each y hace `join()` a todos antes del mensaje final.

### Paso a paso
1. Crea el proyecto `FabricaPiezas` y el paquete `sincronizacion`.
2. Crea `CintaTransportadora` con dos constantes `static final`, la capacidad (5) y el total de piezas (50), y tres atributos `int`: las piezas en la cinta, las creadas y las empaquetadas, todos a 0.
3. Añade dos atributos `boolean` privados: una bandera para seguir fabricando y otra para seguir empaquetando, las dos a `true`.
4. Escribe el método de crear, `synchronized`, que devuelve un `boolean` y declara `throws InterruptedException`. Un `while` que, mientras las piezas de la cinta sean igual a la capacidad, muestre que la cinta está llena y llame a `wait()`.
5. Tras el `while`, un `if`: si las piezas creadas ya llegan al total, pon la bandera de fabricar a `false`. Si no, suma 1 a las piezas de la cinta y a las creadas, y muestra cuántas piezas hay en la cinta.
6. Llama a `notifyAll()` y devuelve la bandera de fabricar.
7. Escribe el método de empaquetar, `synchronized`, que devuelve un `boolean`. Un `while` que, mientras la cinta esté vacía y se siga fabricando, muestre que la cinta está vacía y llame a `wait()`.
8. Tras el `while`, un `if`: si la cinta está vacía y ya no se fabrica, pon la bandera de empaquetar a `false`. Si no, resta 1 a las piezas de la cinta, suma 1 a las empaquetadas, muestra cuántas hay en la cinta y llama a `notifyAll()`.
9. Devuelve la bandera de empaquetar.
10. Crea `MaquinaCreadora`, que implementa `Runnable` y guarda la cinta que recibe en el constructor. En `run()`, dentro de un `try`: un `while` que repita mientras el método de crear devuelva `true`, y dentro duerme un tiempo al azar de 2 a 3 segundos con `Thread.sleep` y un `Random`.
11. Crea `MaquinaEmpaquetadora` del mismo modo: un `while` que repita mientras el método de empaquetar devuelva `true`, y dentro duerme 1 segundo.
12. En `Principal`, crea una `CintaTransportadora`, dos arrays de `Thread` (3 creadoras y 1 empaquetadora) y crea los hilos con los nombres "Creadora0"… y "Empaquetadora0". `main` tendrá que declarar `throws InterruptedException`.
13. Arranca todos los hilos con un for-each. Después haz `join()` a todos, también con un for-each.
14. Después de los `join()`, muestra `Fábrica cerrada`. Comprueba que se crean 50 piezas, que se empaquetan 50 y que ninguna máquina se queda esperando al final.

## Ejercicio 3: lavandería CleanFast (proyecto `Lavanderia`)

Una lavandería de autoservicio, CleanFast, tiene 4 lavadoras. Los clientes llegan, esperan si no hay ninguna libre y lavan su ropa durante un tiempo al azar de 10 a 20 segundos. El lavado cuesta 3 euros. El cliente no paga ni cuenta como atendido hasta que consigue una lavadora.

Al empezar, el programa da la bienvenida y muestra un menú con tres opciones. Después lee la opción que escribe el usuario y la repite hasta que elija cerrar:

1. **Llegada de clientes:** pregunta cuántos clientes llegan a la vez y lanza un hilo por cada uno. Pueden llegar clientes varias veces durante la misma ejecución, y los nombres ("Cliente 1", "Cliente 2"…) no se repiten.
2. **Estado:** muestra los clientes totales atendidos, el dinero ganado, las lavadoras disponibles y las lavadoras alquiladas (en uso).
3. **Cerrar:** muestra que cierra la tienda, espera a que terminen todos los clientes que estaban esperando o lavando y acaba el programa.

Si el usuario escribe otro número, el programa muestra `Selección no válida.`

Cada cliente muestra un mensaje cuando espera porque no hay lavadoras, cuando coge una y cuando termina de lavar, con las lavadoras que quedan disponibles.

### Pistas
Las lavadoras son lo que comparten los clientes. No hace falta una clase por lavadora: basta con saber cuántas están libres. Piensa qué datos tiene que guardar la lavandería para poder mostrar el estado: lo que necesita para mostrar el dinero ganado, los clientes atendidos y las lavadoras en uso. El menú vive en `main` y los clientes en hilos. Dos preguntas: cómo dar a cada cliente un nombre que no se repita aunque lleguen en varias tandas, y cómo esperar al final a todos los hilos que lanzaste sin saber de antemano cuántos serán. Piensa también cuándo debe contarse un cliente como atendido.

### Más ayuda
La clase `Lavanderia` guarda el número total de lavadoras y el precio como constantes, y tres contadores: las lavadoras disponibles (empiezan en el total), los clientes atendidos y el dinero ganado. Tiene tres métodos `synchronized`. El de poner la lavadora declara `throws InterruptedException` y espera con un `while` mientras no haya ninguna disponible, mostrando que el cliente espera; al conseguirla, resta una disponible, suma el precio al dinero, suma un atendido y lo muestra. El de quitar la lavadora suma una disponible, lo muestra y avisa con `notify()`, porque todos los que esperan esperan lo mismo. El de mostrar la información escribe el estado con los cuatro datos. `Cliente` implementa `Runnable`, recibe la lavandería en el constructor y trabaja dentro de un `try`: pone la lavadora, duerme un tiempo al azar con `Thread.sleep()` y `Random`, fuera de los métodos de la lavandería, y la quita. En `Principal`, un `Scanner` lee la opción, un `do while` repite el menú hasta que se elige cerrar, un `switch` decide qué hacer y una lista de hilos guarda los clientes lanzados. Un contador de clientes llegados sirve a la vez para el nombre de cada cliente y para saber qué hilo arrancar. Al cerrar, se recorre la lista haciendo `join()` a cada hilo.

### Paso a paso
1. Crea el proyecto `Lavanderia` y el paquete `sincronizacion`.
2. Crea `Lavanderia` con dos constantes `final`: las lavadoras (4) y el precio (3). Añade tres atributos `int`: lavadoras disponibles (las mismas que el total), clientes atendidos (0) y dinero ganado (0).
3. Escribe el método de poner la lavadora, `synchronized`, con `throws InterruptedException`. Un `while` que, mientras no haya lavadoras disponibles, muestre el nombre del hilo con `esperando` y llame a `wait()`.
4. Al salir del `while`, resta una lavadora disponible, suma el precio al dinero, suma un cliente atendido y muestra que el cliente pone una lavadora y cuántas quedan.
5. Escribe el método de quitar la lavadora, `synchronized`: suma una lavadora disponible, muestra que el cliente terminó de lavar y llama a `notify()`.
6. Escribe el método que muestra la información, `synchronized`, con los clientes atendidos, el dinero ganado, las lavadoras disponibles y las alquiladas (el total menos las disponibles).
7. Crea `Cliente`, que implementa `Runnable`. Guarda la lavandería que recibe en el constructor y tiene un `Random`.
8. En el `run()` de `Cliente`, dentro de un `try`: pone la lavadora, duerme de 10 a 20 segundos con `Thread.sleep` y quita la lavadora.
9. En `Principal`, crea una sola `Lavanderia`, un `Scanner`, una lista de hilos y un contador de clientes a 0. `main` declara `throws Exception`.
10. Muestra el mensaje de bienvenida con las tres opciones y abre un `do while` que lea la opción con `nextInt()` y use un `switch`. El bucle se repite mientras la opción no sea 3.
11. En la opción 1, pregunta cuántos clientes llegan y calcula el total acumulado (el contador más los que llegan ahora). Un `for` crea cada `Thread` con el nombre "Cliente" y su número, lo guarda en la lista, lo arranca y suma 1 al contador.
12. En la opción 2, muestra la información. En la opción 3, muestra que cierras la tienda y haz `join()` a todos los hilos de la lista con un for-each. En `default`, muestra `Selección no válida.`
13. Ejecuta con pocos clientes y muchos, y comprueba que nunca hay más de 4 lavando, que los nombres no se repiten y que al cerrar el programa espera a todos.

## Ejercicio 4: panadería self-service (proyecto `Panaderia`)

Se simula una panadería donde los clientes toman las barras de pan directamente del mostrador.

- Al abrir hay 20 barras en el mostrador.
- **El panadero** revisa cada segundo si hay menos de 10 barras. Si es así, hornea un lote de 20, lo que tarda 20 segundos. Mientras hornea, los clientes pueden seguir comprando.
- **Los clientes** llegan en grupos y cada uno pide entre 1 y 10 barras. Si no hay suficientes, espera a que el panadero hornee más. El orden en que se atiende a los clientes no importa.
- **El precio:** la primera barra cuesta 1 € y cada una de las demás 0,75 €. Por ejemplo, 3 barras cuestan 2,50 €.
- **Menú:** 1) registrar un grupo de clientes, preguntando cuántos son y cuántas barras quiere cada uno; 2) ver el estado del mostrador (barras disponibles, dinero recaudado y barras horneadas en total, contando las 20 iniciales); 3) cerrar la panadería.
- **Al cerrar:** el panadero se lleva las barras que queden, hornea un último lote de 20 para el día siguiente y se muestra un resumen con el total de barras vendidas y el dinero recaudado.

El programa muestra mensajes de cada acción: clientes esperando o llevándose barras, y el panadero horneando.

### Pistas
El mostrador es el objeto compartido por el panadero y los clientes. Hornear tarda 20 segundos: piensa dónde poner esa espera para que los clientes no queden bloqueados. Al cerrar, hay clientes que quizá siguen esperando pan, y esos necesitan que el panadero siga trabajando.

### Más ayuda
La clase `Mostrador` guarda las barras, las horneadas, las vendidas, el dinero (un `double`) y si se está cerrando. Su método de comprar espera mientras no haya barras suficientes. El panadero es un `Runnable` con un bucle que duerme un segundo y comprueba si hacen falta barras; el horneado (`Thread.sleep` de 20 segundos) va fuera de los métodos `synchronized` y después repone el mostrador con `notifyAll()`. Cada cliente es un hilo que recibe cuántas barras quiere. Primero pregunta lo que quiere cada cliente y luego lanza los hilos. Al cerrar, primero se espera con `join()` a los clientes, después se avisa al panadero y se espera a que termine.

### Paso a paso
1. Crea el proyecto `Panaderia` y el paquete `sincronizacion`.
2. Crea `Mostrador` con los atributos: barras (20), horneadas (20), vendidas (0), dinero (0) y si se está cerrando (`false`).
3. Escribe `comprar`, `synchronized`: si no hay barras suficientes, muestra que el cliente espera. Espera con un `while`. Después resta las barras, suma a vendidas, calcula el precio y lo suma al dinero, y muestra la compra.
4. Escribe un método que diga si quedan menos de 10 barras y otro, `reponer`, que sume barras y horneadas, muestre el mensaje y llame a `notifyAll()`.
5. Escribe los métodos para vaciar el mostrador, para marcar que se cierra y para saber si se está cerrando.
6. Escribe los métodos que muestran el estado y el resumen final.
7. Crea `Panadero`: mientras no se esté cerrando, duerme un segundo y, si hacen falta barras, hornea. Hornear es mostrar un mensaje, dormir 20 segundos y reponer 20 barras.
8. Al terminar ese bucle, el panadero vacía el mostrador y hornea un último lote.
9. Crea `Cliente`, con un atributo para las barras que quiere. Su `run()` llama a `comprar`.
10. En `Principal`, arranca el hilo del panadero y muestra el menú con un `switch`. En la opción 1, pregunta el número de clientes y las barras de cada uno (vuelve a preguntar si no está entre 1 y 10) y lanza los hilos.
11. En la opción 3, haz `join()` a todos los clientes, marca que se cierra, haz `join()` al panadero y muestra el resumen.

## Ejercicio 5: sala de partida de stream (proyecto `SalaStream`)

Una sala de stream de un juego tiene jugadores y espectadores, todos hilos.

- **Jugadores:** solo puede haber uno en la sala a la vez. Si hay un jugador con una partida en marcha, los demás esperan en cola a que termine.
- **Espectadores:** entran todos los que quieran, pero solo si hay una partida iniciada. Si no la hay, esperan. Pueden llegar cuando la partida ya está empezada.
- **Al terminar la partida,** el jugador sale y la sala se cierra: los espectadores salen automáticamente. Entonces puede entrar el siguiente jugador de la cola y los espectadores nuevos. Los espectadores de la partida anterior no se quedan para la siguiente: si quieren verla, deben entrar de nuevo.
- Se muestra por pantalla cada entrada, salida e inicio de partida.

### Pistas
La sala es el objeto compartido. Jugadores y espectadores esperan cosas distintas: los jugadores esperan a que la sala esté libre, y los espectadores esperan a que haya una partida. Un espectador solo debe quedarse hasta que acabe la partida que vio, aunque ya haya empezado otra. Piensa cómo puede saber un espectador a qué partida pertenece.

### Más ayuda
La clase `Sala` guarda si hay partida en marcha (`boolean`), el número de la partida actual y cuántos espectadores hay dentro. El jugador espera mientras haya una partida; al entrar, la marca y avisa con `notifyAll()`. Al terminar, la desmarca y vuelve a avisar. El espectador espera mientras no haya partida; al entrar, apunta el número de la partida que va a ver. Después espera mientras esa misma partida siga en marcha. Cuando termina la última partida, `Principal` cierra la sala para que los espectadores que siguen esperando se vayan. Los jugadores juegan entre 3 y 5 segundos con `Thread.sleep`, y los espectadores llegan en un momento al azar.

### Paso a paso
1. Crea el proyecto `SalaStream` y el paquete `sincronizacion`.
2. Crea `Sala` con los atributos: partida en marcha (`boolean`), número de partida (`int`), espectadores (`int`) y sala cerrada (`boolean`).
3. Escribe el método con el que el jugador empieza: si hay partida, muestra que espera en la cola; espera con un `while`; después marca la partida, suma 1 al número, muestra el mensaje y llama a `notifyAll()`.
4. Escribe el método con el que el jugador termina: desmarca la partida, muestra el mensaje y llama a `notifyAll()`.
5. Escribe el método con el que el espectador entra: espera mientras no haya partida y la sala no esté cerrada. Si sigue sin haber partida, devuelve 0. Si no, suma un espectador y devuelve el número de la partida.
6. Escribe el método con el que el espectador espera a que termine su partida: espera mientras haya partida y siga siendo el mismo número. Después resta un espectador y muestra que sale.
7. Escribe el método que cierra la sala y despierta a todos.
8. Crea `Jugador`, que empieza una partida, duerme entre 3 y 5 segundos y la termina.
9. Crea `Espectador`, que duerme un tiempo al azar, entra y, si ha entrado a una partida, espera a que acabe. Si no, muestra que se va.
10. En `Principal`, crea la sala, 3 jugadores y 8 espectadores y arráncalos.
11. Haz `join()` a los jugadores, cierra la sala y haz `join()` a los espectadores. Muestra `Sala cerrada`.

## Preguntas

1. Ejercicio 1: ¿qué podría pasar si `contarLineas` no fuera `synchronized`?
2. Ejercicio 2: ¿qué pasa si en la cinta se usa `notify()` en vez de `notifyAll()`?
3. Ejercicio 3: ¿en qué momento exacto se cuenta a un cliente como atendido? ¿Por qué ahí?
4. Ejercicio 4: ¿por qué el panadero hornea fuera de un método `synchronized`?
5. Ejercicio 5: ¿qué pasa si el espectador no apunta el número de partida y solo mira si hay una en marcha?
