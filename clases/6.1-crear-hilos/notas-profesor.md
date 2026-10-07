# Notas del profesor – 6.1 Crear hilos

Código en cuatro proyectos, con el estilo del profesor (sin comentarios en el código):
- `CrearHilos/src/crearhilos/`: `Contador.java`, `Principal.java`
- `EjemploPerrosGatos/src/crearhilos/`: `Gato.java`, `Perro.java`, `Principal.java`
- `CincoPerrosGatos/src/crearhilos/`: `Gato.java`, `Perro.java`, `Principal.java`
- `OperacionesArray/src/crearhilos/`: `HiloSuma.java`, `HiloResta.java`, `HiloMultiplica.java`, `Principal.java`

## Cómo está construido
- **Un archivo por clase**, todo en el paquete `crearhilos`.
- **`Runnable`:** `Contador`, `Gato` y `Perro` solo implementan `run()`. No son hilos por sí solas. El hilo es el objeto `Thread` de `Principal`.
- **`new Thread(new Contador(), "Hilo 1")`:** el segundo argumento es el nombre del hilo.
- **`Thread.currentThread().getName()`:** `Contador` no sabe qué hilo es. Le pregunta a Java quién la está ejecutando. Por eso las tres copias usan la misma clase y dan `Hilo 1`, `Hilo 2` y `Hilo 3`.
- **`start()`:** va después de crear los tres hilos. Crea el hilo y llama a `run()`.
- **Sin `join()`.** Cada ejercicio es un proyecto aparte, así que las salidas no se mezclan.

## Ejercicio 3: cinco gatos y cinco perros
- **Dos arrays `Thread[]` de 5.** Se guarda el hilo, no el `Runnable`. Es el `Thread` quien tiene `start()`.
- **Un solo `for` crea y lanza.** En cada vuelta se crean `gatos[i]` y `perros[i]` con `new Thread(new Gato(), "Gato " + (i + 1))` y se arrancan. `i` va de 0 a 4 y el nombre usa `i + 1` para que salga `Gato 1`... `Gato 5`.
- **`Gato` y `Perro` ahora muestran el nombre del hilo** (`Thread.currentThread().getName() + ": Miau!"`). Con 10 hilos, sin el nombre no se distingue cuál habla. Son clases nuevas, en su proyecto: `EjemploPerrosGatos` no cambia.
- **Idea a transmitir:** se lanzan en orden (`Gato 1`, `Perro 1`, `Gato 2`...) pero la salida sale mezclada. Lanzar en orden no garantiza terminar en orden.
- **Variante:** guardar el `Thread` en un array permite luego recorrerlo para hacer `join()` (se verá más adelante).

## Ejercicio 4: operaciones con un array
- **El array se pasa al constructor** y se guarda en un atributo `private int[] numeros`. `this.numeros = numeros` distingue el atributo del parámetro, que se llaman igual.
- **Tres clases, un trabajo cada una:** `HiloSuma` (empieza en 0), `HiloMultiplica` (empieza en 1) y `HiloResta` (empieza en `numeros[0]` y resta desde la posición 1). El valor inicial es el error más común: si la resta empieza en 0, sale mal.
- **Con `{1, 2, ..., 10}` el resultado es fijo:** suma 55, resta -53, multiplicación 3628800. Sirve para que el alumno compruebe su solución. Cabe en un `int`.
- **Los tres hilos leen el mismo array.** No hay problema porque nadie lo modifica. Es el motivo de que no haga falta sincronizar. Si un hilo escribiera en él, sí habría problema (se verá en sincronización).
- **Variante de la pista, un `switch`:** una sola clase `HiloOperaciones` con un segundo parámetro `String` (`"suma"`, `"resta"`, `"multiplicacion"`) y un `switch` en `run()`. Funciona, pero junta tres trabajos en una clase. Con tres clases, cada una es corta y se lee mejor. Tras la pista, aceptar las dos.
- **`Principal` no usa `join()`:** cada hilo imprime su resultado y el orden de las tres líneas varía. En la solución de referencia que se recibió se usa `join()` para separar dos pruebas (un solo hilo y varios). Aquí no hace falta.

## Puntos a explicar
- Un hilo es un objeto `Thread`. El código del hilo está en `run()`.
- Dos formas de crear hilos: extender `Thread` o implementar `Runnable`. Aquí se usa `Runnable`. Es la más general: sirve aunque la clase ya herede de otra.
- Siempre existe un hilo `main`. Es el último en terminar el programa.
- El orden de la salida **no es fijo**. Ejecutar el ejercicio 1 varias veces y comparar. Es la primera idea de concurrencia.

## Errores típicos de los alumnos
1. **`run()` en vez de `start()`.** Todo corre en `main`, en orden, sin concurrencia. El nombre que sale es `main`, no `Hilo 1`. Es la pista para detectarlo.
2. **`start()` dos veces** sobre el mismo hilo: `IllegalThreadStateException`.
3. **`new Thread(new Contador())` sin nombre.** Java pone `Thread-0`, `Thread-1`... y la salida no es `Hilo x: y`.
4. **Pasar la clase `Runnable` a `start()`.** Solo `Thread` tiene `start()`. Hay que envolver el `Contador` en un `Thread`.
5. **Escribir mal `run`** (`Run`, `run(int x)`). No sobrescribe el método. `@Override` hace que el compilador avise.
6. **Esperar una salida ordenada** (`Hilo 1` entero, luego `Hilo 2`...). Se mezclan y varían entre ejecuciones. A veces un hilo termina sus 10 pasos antes de que arranque otro. No es un fallo.
7. **Un solo bucle en `main`** para "simular" los hilos. No son hilos.
8. **Pensar que `Miau!` sale siempre primero** por lanzarse antes. El orden de ejecución lo decide el sistema.
9. **Mezclar las clases `Principal`.** Están en proyectos distintos. Abrir el proyecto correcto antes de ejecutar.
10. **Ejercicio 3: crear los 10 hilos con el mismo nombre** o sin nombre. Salen `Thread-0`... y no se sabe quién es quién.
11. **Ejercicio 3: `for` de 0 a 5 (`i <= 5`).** Crea 6 hilos y `gatos[5]` da `ArrayIndexOutOfBoundsException`.
12. **Ejercicio 3: llamar a `start()` en un segundo `for` olvidando `perros`,** o arrancar solo los gatos.
13. **Ejercicio 4: empezar la resta en 0** o restar `numeros[0]` otra vez. Resultado incorrecto.
14. **Ejercicio 4: empezar la multiplicación en 0.** Sale siempre 0.
15. **Ejercicio 4: no guardar el array en un atributo** y no poder usarlo en `run()`: `run()` no recibe parámetros. Los datos tienen que entrar por el constructor.
16. **Ejercicio 4, versión `switch`: cambiar el `switch` por `if (operacion == "suma")`.** Comparar `String` con `==` falla. Usar `equals`, o dejar el `switch`.

## Pregunta de cierre
Ejecutar 5 veces el ejercicio 3. ¿Cambia el orden? ¿Por qué? (Respuesta: lo decide el planificador del sistema. Con 10 hilos se nota más que con 2, pero ninguna ejecución tiene por qué repetirse.)
