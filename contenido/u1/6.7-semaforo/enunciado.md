# Apartado 6.7 – Lectores y escritores con varios lectores a la vez

El ejercicio es un proyecto de NetBeans con el nombre que se indica. Las clases van en el paquete `discoteca`.

## Ejercicio 1: la discoteca (proyecto `Discoteca`)

Una discoteca guarda en un fichero de texto, `Discoteca.txt`, los nombres de los hilos que escriben en él. Hay 5 hilos lectores y 2 hilos escritores que comparten ese fichero. Los lectores se llaman "Lector0" a "Lector4" y los escritores, "Escritor0" y "Escritor1".

- Cada escritor escribe su nombre en una línea nueva del fichero y lo muestra por pantalla: `Escritor0 he escrito mi nombre en el fichero`.
- Cada lector cuenta cuántas líneas tiene el fichero en el momento de la lectura y lo muestra: `Lector0 he leído 1 líneas en el fichero`.
- Varios lectores pueden leer a la vez.
- Un escritor escribe siempre solo: mientras escribe no puede haber ningún lector ni otro escritor.
- Un hilo que no puede entrar muestra `no puedo leer. Esperando` o `no puedo escribir. Esperando` y espera hasta que pueda.
- Al entrar y al terminar de leer, el lector muestra cuántos lectores hay leyendo en ese momento.
- Cada ejecución empieza con el fichero vacío, y los siete hilos acaban.

### Pistas
La discoteca es lo que comparten los siete hilos, así que necesita su propia clase y todos deben recibir el mismo objeto. Es como el semáforo de la clase: hay que saber si hay lectores dentro y si hay escritores dentro. Piensa qué le molesta a un lector y qué le molesta a un escritor. Los hilos esperan con `wait()` y se avisan con `notifyAll()`, dentro de métodos `synchronized`. Además hay dos cuidados con el fichero: qué pasa si un lector lo abre antes de que exista, y qué pasa con lo que escribe un escritor si no se manda del buffer al fichero.

### Más ayuda
Crea una clase `Discoteca` con un `File`, que recibe su nombre por el constructor, y dos atributos `int`: los lectores y los escritores que hay dentro. Tiene cuatro métodos `synchronized`: leer, terminar de leer, escribir y terminar de escribir. Leer espera con un `while` solo mientras haya algún escritor; después suma uno a los lectores y devuelve un `BufferedReader` con el fichero abierto. Escribir espera mientras haya algún lector o algún escritor; después suma uno a los escritores y devuelve un `BufferedWriter` que añade al final del fichero. Los dos métodos de terminar restan uno y avisan con `notifyAll()`: el de leer solo cuando ya no quedan lectores. Los dos métodos de entrar pueden lanzar excepciones, así que se declaran con `throws`. El constructor deja el fichero vacío con un `FileWriter` que se cierra enseguida; así cada ejecución empieza desde cero y el fichero siempre existe. `Lector` y `Escritor` implementan `Runnable`, reciben la discoteca en el constructor y trabajan dentro de un `try`: el lector lee líneas con `readLine()` hasta que devuelve `null`, y el escritor usa `write()` y `newLine()`. El lector cierra el fichero con `close()` y el escritor vacía su buffer con `flush()`, antes de avisar de que terminan. `Principal` guarda los hilos en dos arrays de `Thread` y los arranca.

### Paso a paso
1. Crea el proyecto `Discoteca` y el paquete `discoteca`.
2. Crea la clase `Discoteca` con un atributo `File` privado y `final`, y dos atributos privados `int`: `lectores` y `escritores`, los dos a 0.
3. Escribe el constructor, que recibe el nombre del fichero y lo guarda en el `File`. Después crea el fichero vacío con un `FileWriter` y ciérralo. Declara `throws IOException`.
4. Escribe el método `leer`, `synchronized`, que devuelve un `BufferedReader` y declara `throws InterruptedException, FileNotFoundException`. Un `while` que, mientras `escritores` sea mayor que 0, muestre `no puedo leer. Esperando` con el nombre del hilo y llame a `wait()`.
5. Al salir del `while`, suma 1 a `lectores`, muestra el nombre del hilo con `entro a leer` y los lectores activos, y devuelve un `BufferedReader` sobre un `FileReader` del fichero.
6. Escribe `terminaLeer`, `synchronized`: resta 1 a `lectores`, muestra el nombre del hilo con `termino de leer` y los lectores activos, y si ya no quedan lectores llama a `notifyAll()`.
7. Escribe `escribir`, `synchronized`, que devuelve un `BufferedWriter` y declara `throws InterruptedException, IOException`. Un `while` que, mientras `lectores` sea mayor que 0 o `escritores` sea mayor que 0, muestre `no puedo escribir. Esperando` y llame a `wait()`.
8. Al salir del `while`, muestra `entro a escribir`, suma 1 a `escritores` y devuelve un `BufferedWriter` sobre un `FileWriter` del fichero con el segundo argumento a `true`, para añadir al final.
9. Escribe `terminaEscribir`, `synchronized`: muestra que ha terminado de escribir, resta 1 a `escritores` y llama a `notifyAll()`.
10. Crea `Lector` y `Escritor`, que implementan `Runnable` y guardan la `Discoteca` que reciben en el constructor.
11. En el `run()` de `Lector`, dentro de un `try`: pide el fichero con `leer`, cuenta las líneas con un `while` y `readLine()`, cierra el fichero, muestra cuántas líneas ha leído y llama a `terminaLeer`.
12. En el `run()` de `Escritor`, dentro de un `try`: pide el fichero con `escribir`, escribe el nombre del hilo con `write()`, añade el salto de línea con `newLine()`, vacía el buffer con `flush()`, muestra que ha escrito y llama a `terminaEscribir`.
13. En `Principal`, crea una sola `Discoteca` con el nombre `Discoteca.txt`, dos arrays de `Thread` (5 lectores y 2 escritores) y arranca los lectores con un `for` y los escritores con un `for-each`. `main` declara `throws IOException`.
14. Ejecuta varias veces. Comprueba que varios lectores leen a la vez, que ningún lector lee mientras escribe un escritor, y que al final el fichero tiene 2 líneas.
