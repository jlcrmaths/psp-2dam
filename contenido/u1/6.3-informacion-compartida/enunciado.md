# Apartado 6.3 – Información compartida entre hilos

Cada ejercicio es un proyecto de NetBeans distinto, con el nombre que se indica. Las clases van en el paquete `jardines`.

## Ejercicio 1: el problema de los jardines (proyecto `ProblemaJardines`)

Un jardín tiene al principio 100 personas. Entran 10 personas y salen otras 10, todas a la vez, cada una como un hilo distinto. Al final tendría que haber otra vez 100 personas.

El programa espera a que acaben los 20 hilos y muestra `Personas en el jardín: ` seguido de la cuenta final.

Ejecuta el programa varias veces y comprueba si siempre sale 100.

### Pistas
El jardín es algo que comparten los 20 hilos, así que necesita su propia clase y todos los hilos reciben el mismo objeto. Hacen falta dos tipos de hilo: uno que suma 1 y otro que resta 1. Para que `main` muestre el resultado cuando todos han terminado, tiene que esperar a cada hilo. Fíjate en que sumar 1 a una variable no es un solo paso para el ordenador.

### Más ayuda
Crea una clase `RecursoJardin` con un atributo `int` que empiece en 100 y dos métodos: `incrementaCuenta` y `decrementaCuenta`. Cada método guarda el valor actual en una variable temporal, duerme 100 milisegundos con `Thread.sleep()` y guarda el valor cambiado. El `sleep` obliga a escribir un `try` con `catch (InterruptedException e)`. Las clases `EntraJardin` y `SaleJardin` implementan `Runnable`, reciben el jardín en el constructor y llaman a su método en `run()`. En `Principal`, crea un solo jardín y un `ArrayList<Thread>`. Con un `for` de 10 vueltas, añade en cada una un hilo que entra y otro que sale. Arranca todos con `start()` en un segundo bucle y espera a todos con `join()` en un tercero. Añade `throws InterruptedException` a `main`.

### Paso a paso
1. Crea el proyecto `ProblemaJardines` y el paquete `jardines`.
2. Crea la clase `RecursoJardin` con un atributo privado `int` llamado `cuenta`, que empiece en 100 en el constructor.
3. Añade un método `getCuenta` que devuelva la cuenta.
4. Escribe `incrementaCuenta`. Guarda `cuenta` en una variable `temp`.
5. Llama a `Thread.sleep(100)`, dentro de un `try` con `catch (InterruptedException e)`.
6. Guarda en `cuenta` el valor de `temp` más 1.
7. Escribe `decrementaCuenta` igual, pero guardando `temp` menos 1.
8. Crea la clase `EntraJardin`, que implementa `Runnable`, guarda el jardín en un atributo recibido por el constructor y llama a `incrementaCuenta()` en `run()`.
9. Crea la clase `SaleJardin` igual, pero llamando a `decrementaCuenta()`.
10. En `Principal`, crea un solo `RecursoJardin` y un `ArrayList<Thread>`.
11. Con un `for` de 1 a 10, añade a la lista un hilo con `EntraJardin` ("Entra1"...) y otro con `SaleJardin` ("Sale1"...).
12. Con un `for` de tipo «para cada hilo de la lista», arranca todos con `start()`.
13. Con otro igual, llama a `join()` en cada hilo. Añade `throws InterruptedException` a `main`.
14. Muestra `Personas en el jardín: ` y la cuenta. Ejecútalo varias veces.

## Ejercicio 2: los jardines sincronizados (proyecto `JardinesSincronizado`)

Es el mismo programa del ejercicio 1: 100 personas, 10 entran y 10 salen a la vez. Pero ahora el resultado tiene que ser siempre el correcto.

Al final se muestra `Personas en el jardín: 100`, en todas las ejecuciones.

### Pistas
No hay que cambiar los hilos ni `Principal`. El problema está dentro del jardín: dos hilos están a la vez en el mismo método. Java tiene una palabra clave que deja entrar a un solo hilo cada vez en un método; los demás esperan fuera. Piensa en qué métodos tienes que ponérsela.

### Más ayuda
Copia el proyecto del ejercicio 1 y cambia solo `RecursoJardin`. Añade la palabra `synchronized` a la declaración de `incrementaCuenta` y también a la de `decrementaCuenta`. Con una sola no basta: un hilo que entra y otro que sale también se pisarían entre ellos, porque tocan la misma variable. Con los dos métodos `synchronized`, el jardín actúa como una puerta de una sola persona: mientras un hilo está dentro de cualquiera de los dos, los otros 19 esperan.

### Paso a paso
1. Crea el proyecto `JardinesSincronizado` y el paquete `jardines`.
2. Copia en él las cuatro clases del ejercicio 1: `RecursoJardin`, `EntraJardin`, `SaleJardin` y `Principal`.
3. En `RecursoJardin`, añade `synchronized` entre `public` y `void` en `incrementaCuenta`.
4. Haz lo mismo en `decrementaCuenta`.
5. Ejecuta el programa varias veces y comprueba que siempre sale 100.
6. Fíjate en el tiempo: ahora tarda unos dos segundos, porque los 20 hilos pasan uno detrás de otro, con 100 milisegundos cada uno.

## Preguntas

1. Ejecuta el ejercicio varias veces. ¿Siempre sale 100? ¿Qué valores salen?
2. Quita el `sleep` y ejecuta otra vez. ¿Sale 100 casi siempre? ¿Significa eso que el programa es correcto?
3. Dos hilos leen la cuenta a la vez (100) y los dos guardan 101. ¿Cuántas personas han entrado? ¿Cuántas cuenta el programa?
4. ¿Cómo evitarías que dos hilos estén a la vez dentro de `incrementaCuenta`? (Lo haces en el ejercicio 2.)
5. En el ejercicio 2, ¿por qué hay que poner `synchronized` también en `decrementaCuenta`?
6. ¿Por qué ahora el programa tarda más? ¿Qué se ha perdido a cambio de que el resultado sea correcto?
