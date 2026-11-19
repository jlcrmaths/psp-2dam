# Apartado 1 – Comunicaciones en red: cliente y servidor

Cada ejercicio es un proyecto de NetBeans con dos clases, `Servidor` y `Cliente`, cada una con su propio `main`. Las clases van en el paquete que indique el ejercicio. Son dos programas distintos que se ejecutan a la vez: se arranca primero el servidor y después el cliente. Usa el puerto 12349.

## Ejercicio 1: ¿dónde está mi saludo? (proyecto `Flush`)

El proyecto `Flush` ya está hecho: el servidor envía «Hola, cliente» y el cliente lo muestra. Tu trabajo es estropearlo y arreglarlo para ver qué hace el flush.

1. Ejecuta primero `Servidor` y después `Cliente`. Anota qué sale en cada consola.
2. En `Servidor`, quita el `true` de `new PrintWriter(s.getOutputStream(), true)`. Ejecuta de nuevo los dos programas. ¿Qué muestra ahora el cliente?
3. Añade `Thread.sleep(30000);` al final del `main` del servidor, para que siga vivo 30 segundos. Cambia `throws IOException` por `throws Exception`. Ejecuta de nuevo. ¿Qué hace ahora el cliente?
4. Arréglalo de dos formas, probando cada una por separado:
   - a) Vuelve a poner el `true`.
   - b) Sin el `true`, añade `pw.flush();` justo después del `println`.
5. Responde con tus palabras: ¿por qué el saludo no salía? ¿Qué hace el flush?

### Pistas
Fíjate en qué cambia entre el paso 2 y el 3: en uno el servidor termina enseguida y en el otro sigue vivo. El texto de un `println` sin autoFlush no se envía solo. Piensa dónde se queda esperando.

### Más ayuda
El `PrintWriter` guarda el texto en un buffer. El segundo dato `true` de `new PrintWriter(salida, true)` es el autoFlush: envía el texto en cada `println()`. Sin él, el texto solo sale con `pw.flush()`. `Thread.sleep(30000)` para el programa 30 segundos y exige `throws Exception` en el `main`. Si el servidor termina, Java cierra el socket y el buffer sin enviar se pierde: el cliente lee `null`.

### Paso a paso
1. Abre el proyecto `Flush` y ejecuta `Servidor` y después `Cliente`. Comprueba que sale «El servidor dice: Hola, cliente».
2. En `Servidor`, quita el `, true` de la línea del `PrintWriter`. Ejecuta de nuevo los dos. Anota qué muestra el cliente.
3. Vuelve a poner el `true`. Ejecuta y comprueba que todo funciona otra vez.
4. Quita otra vez el `true`. Cambia `throws IOException` por `throws Exception` en el `main` del servidor.
5. Añade `Thread.sleep(30000);` como última línea del `main`. Ejecuta los dos y mira cuánto tarda el cliente en mostrar algo.
6. Añade `pw.flush();` justo después de `pw.println("Hola, cliente");`. Ejecuta de nuevo: el cliente debe recibir el saludo al momento.
7. Escribe con tus palabras por qué el saludo no salía y qué hace el flush.

## Ejercicio 2: pares e impares por la red (proyecto `ParImparSocket`)

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
