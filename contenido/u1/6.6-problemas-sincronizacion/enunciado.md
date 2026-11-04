# Apartado 6.6 – Problemas de sincronización

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `sincronizacion`, salvo en los ejercicios 4, 5 y 6, que llevan el de su proyecto. Los ejercicios van de menos a más difícil.

## Ejercicio 1: fábrica de piezas (proyecto `FabricaPiezas`)

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

## Ejercicio 2: lavandería CleanFast (proyecto `Lavanderia`)

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

## Ejercicio 3: panadería self-service (proyecto `Panaderia`)

Se simula una panadería donde los clientes toman las barras de pan directamente del mostrador.

- Al abrir hay 20 barras en el mostrador.
- **El panadero** revisa cada segundo si hay menos de 10 barras. Si es así, hornea un lote de 20, lo que tarda 20 segundos. Mientras hornea, los clientes pueden seguir comprando.
- **Los clientes** llegan en grupos y cada uno pide entre 1 y 10 barras. Si no hay suficientes, espera a que el panadero hornee más. El orden en que se atiende a los clientes no importa.
- **El precio:** la primera barra cuesta 1 € y cada una de las demás 0,75 €. Por ejemplo, 3 barras cuestan 2,50 €.
- **Menú:** 1) registrar un grupo de clientes, preguntando cuántos son y cuántas barras quiere cada uno; 2) ver el estado del mostrador (barras disponibles, dinero recaudado y barras horneadas en total, contando las 20 iniciales); 3) cerrar la panadería.
- **Al cerrar:** el panadero se lleva las barras que queden, hornea un último lote de 20 para el día siguiente y se muestra un resumen con el total de barras vendidas y el dinero recaudado.

El programa muestra mensajes de cada acción: clientes esperando o llevándose barras, y el panadero horneando.

### Pistas
La panadería es el objeto compartido por el panadero y los clientes. Hornear tarda 20 segundos: piensa dónde poner esa espera para que los clientes no queden bloqueados. Al cerrar, hay clientes que quizá siguen esperando pan, y esos necesitan que el panadero siga trabajando.

### Más ayuda
La clase `Panaderia` guarda las barras disponibles, las vendidas, las horneadas en total, el dinero (un `double`) y si está abierta. Su método de atender al cliente espera mientras no haya barras suficientes. El panadero es un `Runnable` con un bucle que duerme un segundo y comprueba si hacen falta barras; el horneado (`Thread.sleep` de 20 segundos) va fuera de los métodos `synchronized` y después repone las barras con `notifyAll()`. Cada cliente es un hilo que recibe cuántas barras quiere. Primero pregunta lo que quiere cada cliente y luego lanza los hilos. Al cerrar, primero se espera con `join()` a los clientes, después se cierra la panadería para avisar al panadero y se espera a que termine.

### Paso a paso
1. Crea el proyecto `Panaderia` y el paquete `sincronizacion`.
2. Crea `Panaderia` con los atributos: barras disponibles (20), barras vendidas (0), barras horneadas en total (20), dinero ganado (0) y si está abierta (`true`).
3. Escribe `atenderCliente`, `synchronized` y con `throws InterruptedException`. Un `while` que, mientras no haya barras suficientes, muestre que el cliente espera y llame a `wait()`. Después calcula el precio, lo suma al dinero, resta las barras, suma a vendidas y muestra la compra.
4. Escribe un método que diga si quedan menos de 10 barras y otro, `reponer`, que sume barras disponibles y horneadas, muestre el mensaje y llame a `notifyAll()`.
5. Escribe los métodos para llevarse las barras que quedan, para cerrar la panadería y para saber si está abierta.
6. Escribe los métodos que muestran la información del mostrador y el mensaje de cierre con el resumen.
7. Crea `Panadero`: mientras la panadería esté abierta, duerme un segundo y, si hacen falta barras, hornea. Hornear es mostrar un mensaje, dormir 20 segundos y reponer 20 barras.
8. Al terminar ese bucle, el panadero se lleva las barras que quedan y hornea un último lote.
9. Crea `Cliente`, con un atributo para las barras que quiere. Su `run()` llama a `atenderCliente`.
10. En `Principal`, arranca el hilo del panadero y muestra el menú con un `do while` y un `switch`. En la opción 1, pregunta el número de clientes y las barras de cada uno (vuelve a preguntar si no está entre 1 y 10) y lanza los hilos.
11. En la opción 3, haz `join()` a todos los clientes, cierra la panadería, haz `join()` al panadero y muestra el resumen.

## Ejercicio 4: sala de partida de stream (proyecto `Streamer`)

Paquete `streamer`.

Una sala de stream de un juego tiene jugadores y espectadores, todos hilos. Se manejan desde un menú que se repite hasta elegir salir:

1. Nuevo jugador. 2. Más espectadores (pregunta cuántos). 3. Estado de la sala. 4. Salir.

Los jugadores se llaman "Jugador1", "Jugador2"… y los espectadores "Espectador1", "Espectador2"…, sin repetir nombres aunque se creen en varias tandas.

- **Jugadores:** solo puede haber uno en directo. Un jugador no puede entrar si ya hay un jugador en directo ni mientras queden espectadores dentro: espera su turno. Juega un tiempo al azar de 1 a 60 segundos y sale.
- **Espectadores:** entran todos los que quieran, pero solo si hay un jugador en directo. Si no lo hay, esperan (cada 15 segundos lo recuerdan por pantalla). Dentro se quedan un tiempo al azar de 1 a 50 segundos o hasta que el jugador termine, lo que ocurra antes. Después descansan un tiempo al azar de 1 a 50 segundos y vuelven a intentarlo. En cada vuelta tienen 1 posibilidad entre 10 de irse para siempre.
- Cuando el jugador sale, los espectadores salen también. Hasta que no sale el último, no puede entrar otro jugador.
- La opción 3 muestra qué jugador está en directo (o que no hay nadie) y cuántos espectadores hay. Cada entrada y salida se muestra por pantalla.
- Por ahora la opción 4 no hace nada más: el programa no termina.

### Pistas
La sala es el objeto compartido. Jugadores y espectadores esperan cosas distintas: los jugadores, a que no haya nadie dentro; los espectadores, a que haya un jugador en directo. Un espectador que está dentro no ocupa la sala mientras espera: piensa qué método de espera deja la sala libre y cuál acaba solo con el tiempo. Piensa también quién tiene que avisar cuando sale el último espectador.

### Más ayuda
La clase `Sala` guarda cuántos espectadores hay, si hay un jugador en directo (`boolean`) y el nombre del jugador en directo. El jugador espera con `wait()` mientras haya alguien en directo o algún espectador dentro; al entrar, marca que está en directo. Al salir, lo desmarca y avisa a todos con `notifyAll()`. El espectador espera mientras no haya jugador en directo, con `wait()` de un tiempo máximo (15 segundos) para ir mostrando que sigue esperando. Al entrar suma un espectador y se queda con `wait()` del tiempo que le toca: el aviso del jugador al salir lo despierta antes. Al salir resta uno y, si era el último, avisa a todos. `Jugador` y `Espectador` implementan `Runnable` y reciben la sala. El jugador entra, duerme con `Thread.sleep()` el tiempo de la partida y sale. El espectador repite un `while` mientras un número al azar de 1 a 10 no sea 5. `Principal` muestra el menú con un `do while`, un `switch` y un `Scanner`, y cuenta jugadores y espectadores para los nombres.

### Paso a paso
1. Crea el proyecto `Streamer` y el paquete `streamer`.
2. Crea `Sala` con tres atributos: espectadores (`int`, a 0), si hay un jugador en directo (`boolean`, a `false`) y el nombre del jugador en directo (`String`, vacío).
3. Escribe `EntraJugador`, `synchronized`, con el tiempo de la partida como parámetro y `throws InterruptedException`. Un `while` que, mientras haya un jugador en directo o espectadores dentro, muestre que le toca esperar y llame a `wait()`. Después muestra cuántos segundos juega, marca que hay alguien en directo y guarda su nombre.
4. Escribe `SaleJugador`, `synchronized`: borra el nombre, marca que no hay nadie en directo, muestra que abandona la sala y llama a `notifyAll()`.
5. Escribe `EntraEspectador`, `synchronized`, con el tiempo que se queda como parámetro. Un `while` que, mientras no haya nadie en directo, muestre que la sala está vacía y llame a `wait(15000)`. Después suma un espectador, muestra que entra y espera `wait(tiempo)`.
6. Escribe `SaleEspectador`, `synchronized`: resta un espectador y, si no queda ninguno, llama a `notifyAll()`. Muestra que sale.
7. Escribe `getInfoSala`, que devuelve un texto con el jugador en directo y los espectadores.
8. Crea `Jugador`: calcula un tiempo al azar de 1 a 60 segundos, entra, duerme ese tiempo con `Thread.sleep` y sale.
9. Crea `Espectador` con dos métodos privados: uno que da un tiempo al azar de 1 a 50 segundos y otro que da un número de 1 a 10. Su `run()` repite, mientras ese número no sea 5: entrar, salir y dormir un tiempo al azar. Al terminar, muestra que se va.
10. En `Principal`, crea una sola `Sala`. Muestra el menú y, con un `do while` y un `switch`, crea un hilo por cada jugador o espectador nuevo y muestra el estado con `getInfoSala`.
11. Prueba con un jugador y varios espectadores. Comprueba que los espectadores no entran sin jugador y que un segundo jugador espera a que salgan todos.

## Ejercicio 5: cerrar la sala (proyecto `Streamer2`)

Paquete `streamer2`.

Copia el ejercicio anterior en un proyecto nuevo. Ahora la opción 4 del menú cierra la sala y muestra `Sala cerrada. Vayan saliendo de forma ordenada.`

- Los jugadores que estaban esperando en la cola no juegan y terminan.
- Los espectadores dejan de volver una vez cerrada la sala.
- Una vez cerrada la sala no entra ningún jugador nuevo.

Después de cerrar, ¿terminan todos los hilos? Pruébalo con espectadores que están esperando a un jugador que ya no vendrá.

### Pistas
Hace falta un dato nuevo en la sala: si está cerrada. Tiene que poder leerse desde fuera y cambiarse con un método. Piensa qué pasa con los hilos que están dormidos con `wait()` cuando se cierra: ¿quién los despierta? Y piensa qué tiene que devolver el método del jugador para que sepa si ha podido jugar.

### Más ayuda
`Sala` guarda una bandera `boolean` de sala cerrada, con un método `synchronized` para leerla y otro para cerrarla. El de cerrar la marca, muestra el mensaje y llama a `notifyAll()`. El método con el que el jugador entra pasa a devolver un `boolean`: solo marca la partida si la sala no está cerrada y devuelve si el jugador está en directo. `Jugador` solo duerme y sale si ha entrado. `Espectador` añade a la condición de su `while` que la sala no esté cerrada. En `Principal`, la opción 4 cierra la sala.

### Paso a paso
1. Crea el proyecto `Streamer2` y el paquete `streamer2` con las clases del ejercicio 4.
2. En `Sala`, añade un atributo `boolean` para la sala cerrada, a `false`.
3. Cambia `EntraJugador` para que devuelva un `boolean`: tras el `while`, si la sala no está cerrada, muestra que juega, marca que hay alguien en directo y guarda el nombre. Devuelve si hay alguien en directo.
4. Añade un método `synchronized` que devuelve si la sala está cerrada y otro que la cierra: la marca, muestra `Sala cerrada. Vayan saliendo de forma ordenada.` y llama a `notifyAll()`.
5. En `Jugador`, duerme y sale solo si `EntraJugador` devolvió `true`.
6. En `Espectador`, el `while` repite también mientras la sala no esté cerrada.
7. En `Principal`, la opción 4 cierra la sala.
8. Prueba: crea un jugador, varios espectadores y un segundo jugador, y cierra la sala. Espera un rato y comprueba si el programa termina.

## Ejercicio 6: esperar con sleep y una cerradura propia (proyecto `Streamer3`)

Paquete `streamer3`.

Copia el ejercicio anterior en un proyecto nuevo. El comportamiento es el mismo, con tres cambios:

- El espectador entra, se queda su tiempo, sale y descansa dentro de **un solo método** de la sala.
- El tiempo que el espectador está dentro se espera con `Thread.sleep()`, no con `wait()`. Por tanto, **el espectador ya no sale cuando termina el jugador, sino cuando acaba su tiempo**.
- La sala sincroniza sobre un objeto propio, no sobre la sala entera.

Además, la sala cerrada no debe dejar a nadie esperando para siempre, tampoco los espectadores que esperaban a un jugador.

### Pistas
`Thread.sleep()` no suelta nada: si el espectador durmiera dentro de un bloque `synchronized`, nadie más podría usar la sala. Así que el espectador tiene que entrar en un bloque, salir de él para dormir y volver a entrar para salir. Para sincronizar sobre otro objeto, `synchronized` también se puede escribir como un bloque con un objeto entre paréntesis, y entonces `wait()` y `notifyAll()` se llaman sobre ese objeto. Ojo: **todos** los métodos de la sala deben usar el mismo objeto.

### Más ayuda
`Sala` crea un atributo `Object lock` y todos sus métodos, incluidos los de leer y cerrar la sala, usan `synchronized (lock)` con `lock.wait()` y `lock.notifyAll()`. El método del espectador tiene tres partes: un bloque `synchronized` para esperar al jugador y entrar; un `Thread.sleep()` fuera de los bloques con el tiempo que se queda; y otro bloque `synchronized` para salir (y avisar si es el último). Después duerme otra vez para descansar. Si la sala se cierra mientras espera un jugador y no hay partida, el espectador sale del método sin entrar.

### Paso a paso
1. Crea el proyecto `Streamer3` y el paquete `streamer3` con las clases del ejercicio anterior.
2. En `Sala`, añade `private final Object lock = new Object();`.
3. Cambia `EntraJugador`, `SaleJugador`, el método que lee si la sala está cerrada y el que la cierra: quita `synchronized` del método y ponlo como un bloque `synchronized (lock)` con todo el código dentro. `wait()` y `notifyAll()` pasan a `lock.wait()` y `lock.notifyAll()`.
4. Quita los métodos `EntraEspectador` y `SaleEspectador` y crea `EntraSaleEspectador(int tiempo)` con `throws InterruptedException`.
5. Primer bloque `synchronized (lock)`: un `while` que, mientras no haya nadie en directo y la sala no esté cerrada, muestre que la sala está vacía y llame a `lock.wait(15000)`. Después, si no hay nadie en directo, el método termina con `return`. Si lo hay, suma un espectador y muestra que entra.
6. Fuera del bloque, `Thread.sleep(tiempo)`.
7. Segundo bloque `synchronized (lock)`: resta un espectador, si no queda ninguno llama a `lock.notifyAll()` y muestra que sale.
8. Al final, otro `Thread.sleep(tiempo)` para el descanso.
9. En `Espectador`, el `while` llama ahora a `EntraSaleEspectador` en vez de a los dos métodos antiguos y del `sleep`.
10. Prueba: abre la sala, crea jugadores y espectadores y cierra. Comprueba que el programa termina. Comprueba también que, cuando acaba la partida, los espectadores se quedan hasta que acaba su tiempo y el siguiente jugador espera a que salgan.

## Preguntas

1. Ejercicio 1: ¿qué pasa si en la cinta se usa `notify()` en vez de `notifyAll()`?
2. Ejercicio 2: ¿en qué momento exacto se cuenta a un cliente como atendido? ¿Por qué ahí?
3. Ejercicio 3: ¿por qué el panadero hornea fuera de un método `synchronized`?
4. Ejercicio 4: ¿por qué un jugador espera también mientras queden espectadores dentro, aunque ya no haya nadie en directo? ¿Quién lo despierta cuando sale el último?
5. Ejercicio 5: tras cerrar la sala, ¿qué le pasa a un espectador que espera a un jugador que ya no vendrá? ¿Termina el programa?
6. Ejercicio 6: ¿qué pasa si `cerrarSala()` sigue siendo `synchronized` sobre la sala, pero los demás métodos usan `synchronized (lock)`? ¿A quién despierta su `notifyAll()`?
