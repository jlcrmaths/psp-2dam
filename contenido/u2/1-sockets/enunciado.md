# Apartado 1 – Comunicaciones en red: cliente y servidor

Cada ejercicio es un proyecto de NetBeans con dos clases, `Servidor` y `Cliente`, cada una con su propio `main`. Las clases van en el paquete que indique el ejercicio. Son dos programas distintos que se ejecutan a la vez: se arranca primero el servidor y después el cliente. Usa el puerto 12349.

## Ejercicio 1: pares e impares por la red (proyecto `ParImparSocket`)

El cliente genera 25 números aleatorios entre 0 y 100 y los envía al servidor. El servidor recibe cada número y le contesta si es par o impar. El cliente muestra por pantalla cada número con la respuesta del servidor, así:

27 – impar
13 – impar
72 – par

Ejecuta los dos programas varias veces y comprueba a mano que las respuestas son correctas. Al terminar el cliente, el servidor debe avisar de que el cliente se ha desconectado.

### Pistas
El servidor se queda esperando hasta que llega el cliente. Cuando ya están conectados, los dos necesitan un canal para escuchar y otro para hablar, y los dos se crean igual. Cada número es un mensaje: un mensaje es una línea. El cliente envía un número y espera la respuesta antes de enviar el siguiente. El servidor repite lo mismo muchas veces y debe saber cuándo parar: piensa qué devuelve la lectura cuando el otro programa ya ha terminado. Lo que llega por la red es texto, no un número.

### Más ayuda
En el servidor, `ServerSocket` en el puerto 12349 y `accept()` para esperar al cliente. Después crea un `BufferedReader` con un `InputStreamReader` sobre `getInputStream()` del socket, y un `PrintWriter` sobre `getOutputStream()` del socket con `true` como segundo dato (autoFlush). Lee con `readLine()` dentro de un `while` que se repite hasta que `readLine()` devuelva `null`. Convierte cada línea en número con `Integer.parseInt`. El resto de dividir entre 2 con el operador `%` dice si es par. Responde con `println()`. En el cliente, crea el `Socket` con `"localhost"` y el puerto, y los mismos dos canales. Un `for` de 25 vueltas: genera el número con `Math.random()`, envíalo con `println()`, lee la respuesta con `readLine()` y muestra el número y la respuesta.

### Paso a paso
1. Crea el proyecto `ParImparSocket` y el paquete `parimpar`.
2. Crea la clase `Servidor` con su `main` y declara `main` con `throws IOException`.
3. En `Servidor`, crea un `ServerSocket` en el puerto 12349, muestra «Esperando conexión...» y llama a `accept()` para obtener el `Socket`.
4. Crea `br` (un `BufferedReader`) y `pw` (un `PrintWriter` con autoFlush) a partir de ese socket.
5. Declara `String linea;` y haz un `while` que lea con `br.readLine()` y siga mientras el resultado no sea `null`.
6. Dentro del `while`, convierte `linea` en un `int` con `Integer.parseInt` y responde con `pw.println()` «par» o «impar».
7. Después del `while`, muestra «Cliente desconectado».
8. Crea la clase `Cliente` con su `main`, también con `throws IOException`.
9. En `Cliente`, crea el `Socket` con `"localhost"` y 12349, y los mismos `br` y `pw`.
10. Haz un `for` de 25 vueltas. En cada una, genera un número entre 0 y 100, envíalo con `pw.println()`, lee la respuesta con `br.readLine()` y muestra «número – respuesta».
11. Ejecuta primero `Servidor` y después `Cliente`. Comprueba la salida de los dos.
