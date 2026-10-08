# Apartado 6.4 – Problemas de sincronización

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

Una fábrica tiene tres máquinas automáticas que generan piezas y las ponen en una cinta transportadora. Una máquina empaquetadora las recoge de la cinta.

- La cinta admite como máximo 5 piezas. Si está llena, las máquinas esperan a que se libere espacio.
- Cada máquina genera una pieza cada 1 a 3 segundos (al azar) y la pone en la cinta si hay espacio.
- La empaquetadora retira una pieza cada 2 segundos. Si no hay ninguna, espera.
- Cada vez que se pone o se retira una pieza, se muestra el estado de la cinta.
- La fábrica termina cuando se han fabricado 50 piezas y no queda ninguna en la cinta. Entonces se muestra `Fábrica cerrada`.

### Pistas
La cinta es el objeto compartido y es un problema de productor y consumidor, como el del pintor. La diferencia es que hay varios productores y un tope de piezas fabricadas entre todos. Cuando hay más de dos hilos esperando, elige bien el método para avisar. Para el mensaje final, `main` tiene que esperar a que terminen los cuatro hilos.

### Más ayuda
La clase `Cinta` guarda cuántas piezas hay y cuántas se han fabricado en total. El método de poner espera mientras la cinta esté llena y falten piezas por fabricar; si ya se fabricaron las 50, devuelve `false` para que la máquina termine. El método de retirar espera mientras no haya piezas. Los dos avisan con `notifyAll()`. `Thread.sleep()` simula el tiempo de cada máquina, y `Random` da el número de segundos al azar; ambos se usan fuera de los métodos `synchronized`. La empaquetadora repite 50 veces su trabajo. En `Principal`, `join()` sobre los cuatro hilos hace esperar a `main` antes de mostrar el mensaje.

### Paso a paso
1. Crea el proyecto `FabricaPiezas` y el paquete `sincronizacion`.
2. Crea `Cinta` con dos atributos `int`: piezas que hay ahora y piezas fabricadas en total.
3. Escribe el método de poner, `synchronized`, que devuelve un `boolean`. Espera con un `while` mientras la cinta tenga 5 y falten piezas por fabricar.
4. Tras el `while`, si ya se fabricaron las 50, devuelve `false`. Si no, suma una pieza a la cinta y al total, muestra el estado, llama a `notifyAll()` y devuelve `true`.
5. Escribe el método de retirar, `synchronized`: espera mientras no haya piezas, resta una, muestra el estado y llama a `notifyAll()`.
6. Crea `Maquina`: en un bucle, duerme entre 1 y 3 segundos con `Thread.sleep` y pone una pieza. Repite mientras el método de poner devuelva `true`.
7. Crea `Empaquetador`: un `for` de 50 vueltas que duerme 2 segundos y retira una pieza.
8. En `Principal`, crea una `Cinta`, tres hilos con `Maquina` ("Máquina 1", "Máquina 2" y "Máquina 3") y un hilo con `Empaquetador`.
9. Arranca los cuatro hilos y haz `join()` a los cuatro. `main` tendrá que declarar `throws InterruptedException`.
10. Después de los `join()`, muestra `Fábrica cerrada`. Comprueba que salen 50 piezas puestas y 50 retiradas.

## Ejercicio 3: lavandería CleanFast (proyecto `Lavanderia`)

Una lavandería de autoservicio tiene 4 lavadoras. Los clientes llegan, esperan si no hay ninguna libre y lavan su ropa durante un tiempo al azar de entre 5 y 10 segundos. El lavado cuesta 3 euros. El cliente no paga ni cuenta como atendido hasta que consigue una lavadora.

El programa muestra un menú con tres opciones:

1. **Simular llegada de clientes:** pregunta cuántos llegan y lanza un hilo por cliente.
2. **Mostrar estado:** muestra los clientes atendidos, la ganancia total (atendidos por 3 €), las lavadoras disponibles y las que están en uso.
3. **Cerrar:** no se aceptan más clientes, se espera a que terminen todos los que estaban esperando o lavando y entonces acaba el programa.

### Pistas
Las lavadoras son lo que comparten los clientes. No hace falta una clase por lavadora: basta con saber cuántas están libres. El menú vive en `main` y los clientes en hilos. Piensa en cómo esperar al final a todos los hilos que lanzaste, sin saber de antemano cuántos serán.

### Más ayuda
La clase `Lavanderia` guarda cuántas lavadoras hay libres (empieza en 4) y cuántos clientes se han atendido. Un método `synchronized` para entrar espera mientras no haya ninguna libre; al conseguirla, resta una libre y suma un atendido. Otro para salir suma una libre y llama a `notifyAll()`. El cliente duerme con `Thread.sleep` entre las dos llamadas, fuera de los métodos `synchronized`. En `Principal`, `Scanner` lee la opción del menú, un `switch` elige qué hacer y un `ArrayList` de hilos guarda los clientes lanzados. Al cerrar, se recorre la lista haciendo `join()` a cada hilo.

### Paso a paso
1. Crea el proyecto `Lavanderia` y el paquete `sincronizacion`.
2. Crea `Lavanderia` con dos atributos `int`: lavadoras libres (4) y clientes atendidos (0).
3. Escribe el método de entrar, `synchronized`: si no hay libres, muestra que el cliente espera; espera con un `while`; al salir, resta una libre, suma un atendido y muestra que paga.
4. Escribe el método de salir, `synchronized`: suma una libre, muestra el mensaje y llama a `notifyAll()`.
5. Escribe el método que muestra el estado, también `synchronized`, con los cuatro datos del enunciado.
6. Crea `Cliente`, que implementa `Runnable`: entra, duerme entre 5 y 10 segundos y sale.
7. En `Principal`, crea una sola `Lavanderia`, un `Scanner` y un `ArrayList<Thread>`.
8. Escribe un bucle que muestre el menú, lea la opción y use un `switch`.
9. En la opción 1, pregunta cuántos clientes llegan y crea un `Thread` por cada uno, con nombre "Cliente" y su número. Guárdalos en la lista y arráncalos.
10. En la opción 2, muestra el estado. En la opción 3, sal del bucle.
11. Tras el bucle, haz `join()` a todos los hilos de la lista y muestra el estado final.

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
