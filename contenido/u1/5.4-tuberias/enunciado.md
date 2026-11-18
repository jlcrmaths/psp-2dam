# Apartado 5.4 – Tuberías entre procesos

Cada ejercicio es un proyecto de NetBeans con dos clases, `Programa1` y `Programa2`, cada una con su propio `main`. Las clases van en el paquete `tuberias`. Son dos programas distintos que se ejecutan a la vez, conectados de forma que lo que muestra el primero lo recibe el segundo.

## Ejercicio 1: sumar los pares (proyecto `SumaPares`)

`Programa1` genera 25 números aleatorios entre 0 y 100 y los muestra, uno por línea. `Programa2` recibe esos números y suma solo los que sean pares. Al final muestra el resultado de la suma.

Ejecútalos conectados varias veces. Comprueba una de las sumas a mano con los números que salen.

### Pistas
Son dos programas independientes: ninguno sabe nada del otro. El primero solo muestra números por pantalla y el segundo solo lee lo que le llega. La conexión no se hace en Java, se hace al ejecutarlos desde la terminal con el símbolo de tubería. Para leer lo que llega, el segundo programa usa la misma entrada que usaría para leer el teclado. Lo que llega es texto, no números. Para saber si un número es par piensa en el resto de dividirlo entre 2.

### Más ayuda
`Programa1` usa un `for` de 25 vueltas. En cada vuelta muestra con `println` un número de 0 a 100 sacado de `Math.random()`. `Programa2` crea un `BufferedReader` a partir de un `InputStreamReader` que lee `System.in`. Lee con `readLine()` dentro de un `while` que se repite hasta que `readLine()` devuelva `null`, que significa que el otro programa ya terminó. Como leer puede fallar, el `main` lleva `throws IOException`. Cada línea se convierte en número con `Integer.parseInt`. Si el resto de dividir entre 2 con el operador `%` es 0, el número es par y se suma a una variable. Al salir del `while` se muestra la suma. Para conectarlos, genera el `.jar` del proyecto (Limpiar y generar) y, en la terminal, escribe `java -cp` con el `.jar` y `tuberias.Programa1`, el símbolo `|` y lo mismo con `tuberias.Programa2`.

### Paso a paso
1. Crea el proyecto `SumaPares` y el paquete `tuberias`.
2. Crea la clase `Programa1` con su `main`.
3. Con un `for` de 25 vueltas, muestra con `System.out.println` un número entre 0 y 100 en cada vuelta: `(int) (Math.random() * 101)`.
4. Crea la clase `Programa2` con su `main`, y añádele `throws IOException`.
5. En `main`, crea un `InputStreamReader` con `System.in` y con él un `BufferedReader`.
6. Crea una variable `String linea` y una variable `int suma` que empiece en 0.
7. Escribe un `while` cuya condición lea la línea con `readLine()`, la guarde en `linea` y compare con `null`.
8. Dentro del `while`, convierte el texto en número con `Integer.parseInt`.
9. Si el número es par (`n % 2 == 0`), súmalo a `suma`.
10. Cuando termine el `while`, muestra la suma.
11. En NetBeans, limpia y genera el proyecto (Mayús + F11). Se crea un `.jar` en la carpeta `dist`.
12. Abre la terminal en la carpeta `dist` y ejecuta `java -cp SumaPares.jar tuberias.Programa1`, el símbolo `|` y `java -cp SumaPares.jar tuberias.Programa2`.

## Ejercicio 2: invertir y contar (proyecto `InvertirYContar`)

`Programa1` recibe una línea de texto y la muestra al revés. `Programa2` cuenta cuántos caracteres tiene la línea invertida y muestra ese número por pantalla.

Prueba con `Hola mundo`: el primer programa muestra `odnum aloH` y el segundo debe mostrar 10.

### Pistas
Esta vez el primer programa recibe la línea del teclado, y es el segundo el que recibe datos de la tubería. Dale la vuelta al texto con una clase de Java pensada para modificar textos; `String` no tiene ese método. Contar caracteres es medir el largo del texto. Fíjate en el espacio: también cuenta como carácter. Aquí llega una sola línea, así que no hace falta repetir.

### Más ayuda
`Programa1` lee una línea con `nextLine()` de un `Scanner` sobre `System.in`. Para invertirla, crea un `StringBuilder` con ese texto, llama a su método `reverse()` y convierte el resultado otra vez en `String` con `toString()`. Después lo muestra con `println`. `Programa2` lee una sola línea con un `BufferedReader` sobre `InputStreamReader` sobre `System.in`, igual que en el ejercicio 1, con `throws IOException` en el `main`. Muestra el valor del método `length()` de esa línea. Se ejecutan con `|`; el primer programa se queda esperando a que escribas la línea.

### Paso a paso
1. Crea el proyecto `InvertirYContar` y el paquete `tuberias`.
2. Crea la clase `Programa1`. En `main`, crea un `Scanner` con `System.in` y lee una línea con `nextLine()`.
3. Crea un `StringBuilder` con esa línea y llama a `reverse()`.
4. Convierte el resultado a `String` con `toString()`.
5. Muestra el texto invertido con `println`.
6. Crea la clase `Programa2` con `throws IOException` en el `main`.
7. Crea un `InputStreamReader` con `System.in` y con él un `BufferedReader`.
8. Lee una línea con `readLine()`.
9. Muestra su longitud con `length()`.
10. Genera el `.jar` y ejecuta `Programa1`, el símbolo `|` y `Programa2` con `java -cp`. Escribe una línea cuando el primero la pida.

## Ejercicio 3: par o impar (proyecto `ParImpar`)

`Programa1` genera 25 números aleatorios entre 0 y 100. `Programa2` recibe esos números y los muestra por pantalla indicando si cada uno es par o impar.

Por ejemplo:

```
27 - impar
13 - impar
72 - par
```

### Pistas
`Programa1` es el mismo del ejercicio 1. Todo el trabajo está en `Programa2`. Es parecido a la suma de pares, pero ahora cada número se muestra, no se suma. Necesitas una decisión con dos caminos. Java tiene una forma de escribir esa decisión dentro del propio `println`, con los signos de interrogación y dos puntos.

### Más ayuda
Copia `Programa1` del ejercicio 1. En `Programa2`, lee con `BufferedReader` hasta que `readLine()` devuelva `null`, como antes. Convierte cada línea con `Integer.parseInt`. Para decidir puedes usar un `if`/`else`, o el operador ternario: una condición, un signo `?`, el valor si es verdadera, dos puntos y el valor si es falsa. Si el resto de dividir entre 2 es 0, muestra el número, un guion y la palabra `par`; si no, `impar`.

### Paso a paso
1. Crea el proyecto `ParImpar` y el paquete `tuberias`.
2. Copia en él `Programa1` del ejercicio 1.
3. Crea la clase `Programa2` con `throws IOException` en el `main`.
4. Crea el `BufferedReader` sobre `InputStreamReader` sobre `System.in`.
5. Crea una variable `String linea`.
6. Escribe un `while` que lea con `readLine()`, guarde en `linea` y compare con `null`.
7. Dentro, convierte `linea` en número con `Integer.parseInt`.
8. Si `n % 2 == 0`, muestra `linea + " - par"`. Si no, `linea + " - impar"`. Puedes hacerlo con `if`/`else` o con el operador ternario dentro del `println`.
9. Genera el `.jar` y ejecuta `Programa1`, el símbolo `|` y `Programa2` con `java -cp`.

## Ejercicio 4: promedio de los mayores que 50 (proyecto `PromedioMayores50`)

`Programa1` genera 25 números aleatorios entre 0 y 100. `Programa2` recibe esos números y calcula el promedio de los que son mayores que 50. Muestra ese promedio.

Si ningún número es mayor que 50, el programa debe avisarlo en vez de mostrar un promedio.

### Pistas
`Programa1` es otra vez el mismo. En `Programa2` hace falta llevar dos cuentas a la vez: la suma de los números que valen y cuántos son. El promedio es una división, y dividir dos enteros en Java descarta los decimales. Piensa qué pasa si no entra ningún número en la cuenta.

### Más ayuda
Copia `Programa1` del ejercicio 1. En `Programa2`, usa dos variables `int`: `suma` y `cuantos`, las dos en 0. Lee las líneas como en los ejercicios anteriores. Si el número es mayor que 50, súmalo a `suma` y suma 1 a `cuantos`. Al terminar, si `cuantos` vale 0 muestra el aviso. Si no, calcula `(double) suma / cuantos`: el `(double)` delante convierte la suma en decimal antes de dividir y así no se pierden los decimales.

### Paso a paso
1. Crea el proyecto `PromedioMayores50` y el paquete `tuberias`.
2. Copia en él `Programa1` del ejercicio 1.
3. Crea la clase `Programa2` con `throws IOException` en el `main`.
4. Crea el `BufferedReader` sobre `InputStreamReader` sobre `System.in`.
5. Crea `String linea` y las variables `suma` y `cuantos`, las dos en 0.
6. Lee las líneas con un `while` hasta `null` y conviértelas con `Integer.parseInt`.
7. Si `n > 50`, haz `suma = suma + n` y `cuantos++`.
8. Al terminar el `while`, si `cuantos == 0`, muestra que ningún número es mayor que 50.
9. Si no, calcula `double promedio = (double) suma / cuantos`.
10. Muestra el promedio.
11. Genera el `.jar`, ejecuta las dos clases con `|` y comprueba el promedio a mano.
