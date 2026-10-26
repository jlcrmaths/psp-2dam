# Apartado 6.6 – Lectores y escritores

El ejercicio es un proyecto de NetBeans con el nombre que se indica. Las clases van en el paquete `leerescribir`.

## Ejercicio 1: lectores y escritores (proyecto `LeerYEscribir`)

Hay 5 hilos lectores y 2 hilos escritores que comparten un mismo fichero. Los lectores se llaman "Lector0" a "Lector4" y los escritores, "Escritor0" y "Escritor1".

- Cada hilo lee o escribe una sola vez, durante un tiempo al azar de 2 a 10 segundos.
- Mientras un hilo usa el fichero, ningún otro hilo puede usarlo, sea lector o escritor.
- Un hilo que no puede entrar muestra `Hilo: Hay alguien usando el fichero. Espero.` y espera hasta que pueda.
- Cuando un lector entra, muestra `Lector0: Leyendo fichero. Lectores: 1`. Cuando un escritor entra, muestra `Escritor0: Escribiendo fichero.`
- Cuando termina, muestra `Lector0: He terminado de leer. Lectores: 0` o `Escritor0: He terminado de escribir`.
- Todos los hilos acaban leyendo o escribiendo.

### Pistas
El fichero es lo que comparten los siete hilos, así que necesita su propia clase y todos deben recibir el mismo objeto. Para saber si hay alguien dentro, el fichero tiene que contar cuántos lectores y cuántos escritores lo están usando. Los hilos esperan con `wait()` y se avisan con `notifyAll()`, dentro de métodos `synchronized`. Piensa dónde debe estar el tiempo de lectura o escritura: ¿dentro o fuera de los métodos `synchronized`? Y piensa a quién tiene que avisar el hilo que termina.

### Más ayuda
Crea una clase `Fichero` con dos atributos `int`: los lectores y los escritores que están usando el fichero ahora mismo. Tiene cuatro métodos `synchronized`: leer, escribir, terminar de leer y terminar de escribir. Al leer o escribir, el hilo espera con un `while` mientras haya algún lector o algún escritor dentro; mientras espera muestra el mensaje de que hay alguien usando el fichero. Cuando puede continuar, suma uno a su contador y muestra que está leyendo o escribiendo. Los dos métodos de terminar restan uno, muestran que ha terminado y llaman a `notifyAll()`, porque hay hilos de los dos tipos esperando. `wait()` obliga a tratar `InterruptedException`: los métodos de esperar pueden declararlo con `throws` y dejar que lo recoja quien los llama. `Lector` y `Escritor` implementan `Runnable`, reciben el fichero en el constructor y siguen estos pasos, todos dentro de un `try`: pedir permiso al fichero, dormir con `Thread.sleep()` y `Random`, y avisar de que terminan. `Principal` guarda los hilos en dos arrays de `Thread` y los arranca.

### Paso a paso
1. Crea el proyecto `LeerYEscribir` y el paquete `leerescribir`.
2. Crea la clase `Fichero` con dos atributos privados `int`: `lectores` y `escritores`, los dos a 0.
3. Escribe el método `leerFichero`, `synchronized` y con `throws InterruptedException`. Un `while` que, mientras `lectores` sea mayor que 0 o `escritores` sea mayor que 0, muestre `Hay alguien usando el fichero. Espero.` con el nombre del hilo y llame a `wait()`.
4. Al salir del `while`, suma 1 a `lectores` y muestra el nombre del hilo con `Leyendo fichero.` y cuántos lectores hay.
5. Escribe `escribirFichero` del mismo modo, pero que sume 1 a `escritores` y muestre `Escribiendo fichero.`
6. Escribe el método `terminaLeer`, `synchronized`: resta 1 a `lectores`, muestra `He terminado de leer.` con el nombre del hilo y llama a `notifyAll()`.
7. Escribe `terminaEscribir` del mismo modo, restando 1 a `escritores`.
8. Crea las clases `Lector` y `Escritor`, que implementan `Runnable`. Cada una guarda el `Fichero` que recibe en el constructor y tiene un atributo `Random`.
9. En el `run()` de `Lector`, dentro de un `try` con `catch (InterruptedException ex)`: llama a `leerFichero`, duerme un tiempo al azar de 2 a 10 segundos con `Thread.sleep` y llama a `terminaLeer`.
10. En el `run()` de `Escritor` haz lo mismo con `escribirFichero` y `terminaEscribir`.
11. En `Principal`, crea un solo `Fichero`, un array de 5 `Thread` con `Lector` ("Lector0" a "Lector4") y otro de 2 con `Escritor` ("Escritor0" y "Escritor1"). Arranca los lectores con un `for` y los escritores con un `for-each`.
12. Ejecuta varias veces. Comprueba que nunca hay dos hilos usando el fichero a la vez y que los siete acaban.
